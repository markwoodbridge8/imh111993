/* eslint-disable max-lines */
import WalletConnect from "@walletconnect/client";

import DaffiWalletConnectError from "./util/DaffiWalletConnectError";
import {
  openDaffiWalletConnectModal,
  openDaffiWalletRedirectModal,
  removeModalWrapperFromDOM,
  DAFFI_WALLET_CONNECT_MODAL_ID,
  DAFFI_WALLET_REDIRECT_MODAL_ID,
  openDaffiWalletSignTxnToast,
  DAFFI_WALLET_SIGN_TXN_TOAST_ID,
  openDaffiWalletSignTxnModal,
  closeDaffiWalletSignTxnModal,
  DAFFI_WALLET_IFRAME_ID,
  DAFFI_WALLET_MODAL_CLASS,
  DaffiWalletModalConfig,
  DAFFI_WALLET_SIGN_TXN_MODAL_ID,
  setupDaffiWalletConnectModalCloseListener
} from "./modal/daffiWalletConnectModalUtils";
import {
  getWalletDetailsFromStorage,
  resetWalletDetailsFromStorage,
  saveWalletDetailsToStorage,
  getWalletConnectObjectFromStorage,
  getWalletPlatformFromStorage
} from "./util/storage/storageUtils";
import {getDaffiConnectConfig} from "./util/api/daffiWalletConnectApi";
import {DaffiWalletTransaction, SignerTransaction} from "./util/model/daffiWalletModels";
import {
  base64ToUint8Array,
  composeTransaction,
  formatJsonRpcRequest
} from "./util/transaction/transactionUtils";
import {detectBrowser, isMobile} from "./util/device/deviceUtils";
import {AlgorandChainIDs} from "./util/daffiWalletTypes";
import {generateEmbeddedWalletURL} from "./util/daffiWalletUtils";
import appTellerManager, {DaffiTeller} from "./util/network/teller/appTellerManager";
import {getDaffiWebWalletURL} from "./util/daffiWalletConstants";
import {
  getMetaInfo,
  waitForTabOpening,
  WAIT_FOR_TAB_MAX_TRY_COUNT,
  WAIT_FOR_TAB_TRY_INTERVAL
} from "./util/dom/domUtils";

interface DaffiWalletConnectOptions {
  bridge?: string;
  shouldShowSignTxnToast?: boolean;
  chainId?: AlgorandChainIDs;
}

function generateDaffiWalletConnectModalActions({
  isWebWalletAvailable,
  shouldDisplayNewBadge,
  shouldUseSound
}: DaffiWalletModalConfig) {
  return {
    open: openDaffiWalletConnectModal({
      isWebWalletAvailable,
      shouldDisplayNewBadge,
      shouldUseSound
    }),
    close: () => removeModalWrapperFromDOM(DAFFI_WALLET_CONNECT_MODAL_ID)
  };
}

class DaffiWalletConnect {
  bridge: string;
  connector: WalletConnect | null;
  shouldShowSignTxnToast: boolean;
  chainId?: number;

  constructor(options?: DaffiWalletConnectOptions) {
    this.bridge = options?.bridge || "";

    this.connector = null;
    this.shouldShowSignTxnToast =
      typeof options?.shouldShowSignTxnToast === "undefined"
        ? true
        : options.shouldShowSignTxnToast;

    this.chainId = options?.chainId;
  }

  get platform() {
    return getWalletPlatformFromStorage();
  }

  get isConnected() {
    if (this.platform === "mobile") {
      return !!this.connector;
    } else if (this.platform === "web") {
      return !!getWalletDetailsFromStorage()?.accounts.length;
    }

    return false;
  }

  private connectWithWebWallet(
    resolve: (accounts: string[]) => void,
    reject: (reason?: any) => void,
    webWalletURL: string,
    chainId: number | undefined
  ) {
    const browser = detectBrowser();
    const webWalletURLs = getDaffiWebWalletURL(webWalletURL);
    const daffiWalletIframe = document.createElement("iframe");

    function onWebWalletConnect(daffiWalletIframeWrapper: Element) {
      if (browser === "Chrome") {
        daffiWalletIframe.setAttribute("id", DAFFI_WALLET_IFRAME_ID);
        daffiWalletIframe.setAttribute(
          "src",
          generateEmbeddedWalletURL(webWalletURLs.CONNECT)
        );

        daffiWalletIframeWrapper.appendChild(daffiWalletIframe);

        if (daffiWalletIframe.contentWindow) {
          let count = 0;

          const checkIframeIsInitialized = setInterval(() => {
            count += 1;

            if (count === WAIT_FOR_TAB_MAX_TRY_COUNT) {
              clearInterval(checkIframeIsInitialized);

              return;
            }

            appTellerManager.sendMessage({
              message: {
                type: "IFRAME_INITIALIZED"
              },

              origin: webWalletURLs.CONNECT,
              targetWindow: daffiWalletIframe.contentWindow!
            });
          }, WAIT_FOR_TAB_TRY_INTERVAL);

          appTellerManager.setupListener({
            onReceiveMessage: (event: MessageEvent<TellerMessage<DaffiTeller>>) => {
              if (event.data.message.type === "IFRAME_INITIALIZED_RECEIVED") {
                clearInterval(checkIframeIsInitialized);
                appTellerManager.sendMessage({
                  message: {
                    type: "CONNECT",
                    data: {
                      ...getMetaInfo(),
                      chainId
                    }
                  },

                  origin: webWalletURLs.CONNECT,
                  targetWindow: daffiWalletIframe.contentWindow!
                });
              } else if (resolve && event.data.message.type === "CONNECT_CALLBACK") {
                const accounts = event.data.message.data.addresses;

                saveWalletDetailsToStorage(accounts, "daffi-wallet-web");

                resolve(accounts);

                onClose();

                document.getElementById(DAFFI_WALLET_IFRAME_ID)?.remove();
              } else if (event.data.message.type === "CONNECT_NETWORK_MISMATCH") {
                reject(
                  new DaffiWalletConnectError(
                    {
                      type: "CONNECT_NETWORK_MISMATCH",
                      detail: event.data.message.error
                    },
                    event.data.message.error ||
                      `Your wallet is connected to a different network to this dApp. Update your wallet to the correct network (MainNet or TestNet) to continue.`
                  )
                );

                onClose();

                document.getElementById(DAFFI_WALLET_IFRAME_ID)?.remove();
              } else if (
                ["CREATE_PASSCODE_EMBEDDED", "SELECT_ACCOUNT_EMBEDDED"].includes(
                  event.data.message.type
                )
              ) {
                if (event.data.message.type === "CREATE_PASSCODE_EMBEDDED") {
                  waitForTabOpening(webWalletURLs.CONNECT).then((newDaffiWalletTab) => {
                    if (newDaffiWalletTab) {
                      appTellerManager.sendMessage({
                        message: {
                          type: "CONNECT",
                          data: {
                            ...getMetaInfo(),
                            chainId
                          }
                        },

                        origin: webWalletURLs.CONNECT,
                        targetWindow: newDaffiWalletTab
                      });
                    }

                    const checkTabIsAliveInterval = setInterval(() => {
                      if (newDaffiWalletTab?.closed === true) {
                        reject(
                          new DaffiWalletConnectError(
                            {
                              type: "CONNECT_CANCELLED"
                            },
                            "Connect is cancelled by user"
                          )
                        );

                        onClose();
                        clearInterval(checkTabIsAliveInterval);
                      }

                      // eslint-disable-next-line no-magic-numbers
                    }, 2000);

                    appTellerManager.setupListener({
                      onReceiveMessage: (
                        newTabEvent: MessageEvent<TellerMessage<DaffiTeller>>
                      ) => {
                        if (
                          resolve &&
                          newTabEvent.data.message.type === "CONNECT_CALLBACK"
                        ) {
                          const accounts = newTabEvent.data.message.data.addresses;

                          saveWalletDetailsToStorage(accounts, "daffi-wallet-web");

                          resolve(accounts);

                          onClose();

                          newDaffiWalletTab?.close();
                        }
                      }
                    });
                  });
                } else if (event.data.message.type === "SELECT_ACCOUNT_EMBEDDED") {
                  const daffiWalletConnectModalWrapper = document.getElementById(
                    DAFFI_WALLET_CONNECT_MODAL_ID
                  );

                  const daffiWalletConnectModal = daffiWalletConnectModalWrapper
                    ?.querySelector("daffi-wallet-connect-modal")
                    ?.shadowRoot?.querySelector(`.${DAFFI_WALLET_MODAL_CLASS}`);

                  const daffiWalletConnectModalDesktopMode = daffiWalletConnectModal
                    ?.querySelector("daffi-wallet-modal-desktop-mode")
                    ?.shadowRoot?.querySelector(
                      ".daffi-wallet-connect-modal-desktop-mode"
                    );

                  if (daffiWalletConnectModal && daffiWalletConnectModalDesktopMode) {
                    daffiWalletConnectModal.classList.add(
                      `${DAFFI_WALLET_MODAL_CLASS}--select-account`
                    );
                    daffiWalletConnectModal.classList.remove(
                      `${DAFFI_WALLET_MODAL_CLASS}--create-passcode`
                    );
                    daffiWalletConnectModalDesktopMode.classList.add(
                      `daffi-wallet-connect-modal-desktop-mode--select-account`
                    );
                    daffiWalletConnectModalDesktopMode.classList.remove(
                      `daffi-wallet-connect-modal-desktop-mode--create-passcode`
                    );
                  }

                  appTellerManager.sendMessage({
                    message: {
                      type: "SELECT_ACCOUNT_EMBEDDED_CALLBACK"
                    },
                    origin: webWalletURLs.CONNECT,
                    targetWindow: daffiWalletIframe.contentWindow!
                  });
                }
              }
            }
          });
        }
      } else {
        waitForTabOpening(webWalletURLs.CONNECT)
          .then((newDaffiWalletTab) => {
            if (newDaffiWalletTab) {
              appTellerManager.sendMessage({
                message: {
                  type: "CONNECT",
                  data: {
                    ...getMetaInfo(),
                    chainId
                  }
                },

                origin: webWalletURLs.CONNECT,
                targetWindow: newDaffiWalletTab
              });
            }

            const checkTabIsAliveInterval = setInterval(() => {
              if (newDaffiWalletTab?.closed === true) {
                reject(
                  new DaffiWalletConnectError(
                    {
                      type: "CONNECT_CANCELLED"
                    },
                    "Connect is cancelled by user"
                  )
                );

                clearInterval(checkTabIsAliveInterval);
                onClose();
              }

              // eslint-disable-next-line no-magic-numbers
            }, 2000);

            appTellerManager.setupListener({
              onReceiveMessage: (event: MessageEvent<TellerMessage<DaffiTeller>>) => {
                if (resolve && event.data.message.type === "CONNECT_CALLBACK") {
                  const accounts = event.data.message.data.addresses;

                  saveWalletDetailsToStorage(accounts, "daffi-wallet-web");

                  resolve(accounts);

                  onClose();

                  newDaffiWalletTab?.close();
                } else if (event.data.message.type === "CONNECT_NETWORK_MISMATCH") {
                  reject(
                    new DaffiWalletConnectError(
                      {
                        type: "CONNECT_NETWORK_MISMATCH",
                        detail: event.data.message.error
                      },
                      event.data.message.error ||
                        `Your wallet is connected to a different network to this dApp. Update your wallet to the correct network (MainNet or TestNet) to continue.`
                    )
                  );

                  onClose();

                  newDaffiWalletTab?.close();
                }
              }
            });
          })
          .catch((error) => {
            onClose();
            reject(error);
          });
      }
    }

    function onClose() {
      removeModalWrapperFromDOM(DAFFI_WALLET_CONNECT_MODAL_ID);
    }

    return {
      onWebWalletConnect
    };
  }

  connect() {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        // check if already connected and kill session first before creating a new one.
        // This is to kill the last session and make sure user start from scratch whenever `.connect()` method is called.
        if (this.connector?.connected) {
          try {
            await this.connector.killSession();
          } catch (_error) {
            // No need to handle
          }
        }

        const {
          isWebWalletAvailable,
          bridgeURL,
          webWalletURL,
          shouldDisplayNewBadge,
          shouldUseSound
        } = await getDaffiConnectConfig();

        const {onWebWalletConnect} = this.connectWithWebWallet(
          resolve,
          reject,
          webWalletURL,
          this.chainId
        );

        if (isWebWalletAvailable) {
          // @ts-ignore ts-2339
          window.onWebWalletConnect = onWebWalletConnect;
        }

        // Create Connector instance
        this.connector = new WalletConnect({
          bridge: this.bridge || bridgeURL || "https://bridge.walletconnect.org",
          qrcodeModal: generateDaffiWalletConnectModalActions({
            isWebWalletAvailable,
            shouldDisplayNewBadge,
            shouldUseSound
          })
        });

        await this.connector.createSession({
          // eslint-disable-next-line no-magic-numbers
          chainId: this.chainId || 4160
        });

        setupDaffiWalletConnectModalCloseListener(() =>
          reject(
            new DaffiWalletConnectError(
              {
                type: "CONNECT_MODAL_CLOSED"
              },
              "Connect modal is closed by user"
            )
          )
        );

        this.connector.on("connect", (error, _payload) => {
          if (error) {
            reject(error);
          }

          resolve(this.connector?.accounts || []);

          saveWalletDetailsToStorage(this.connector?.accounts || []);
        });
      } catch (error: any) {
        console.log(error);

        reject(
          new DaffiWalletConnectError(
            {
              type: "SESSION_CONNECT",
              detail: error
            },
            error.message || `There was an error while connecting to Daffi Wallet`
          )
        );
      }
    });
  }

  reconnectSession() {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        const walletDetails = getWalletDetailsFromStorage();

        // ================================================= //
        // Daffi Wallet Web flow
        if (walletDetails?.type === "daffi-wallet-web") {
          const {isWebWalletAvailable} = await getDaffiConnectConfig();

          if (isWebWalletAvailable) {
            resolve(walletDetails.accounts || []);
          } else {
            reject(
              new DaffiWalletConnectError(
                {
                  type: "SESSION_RECONNECT",
                  detail: "Daffi Web is not available"
                },
                "Daffi Web is not available"
              )
            );
          }
        }
        // ================================================= //

        // ================================================= //
        // Daffi Mobile Wallet flow
        if (this.connector) {
          resolve(this.connector.accounts || []);
        }

        this.bridge = getWalletConnectObjectFromStorage()?.bridge || "";

        if (this.bridge) {
          this.connector = new WalletConnect({
            bridge: this.bridge
          });

          resolve(this.connector?.accounts || []);
        }
        // ================================================= //

        // If there is no wallet details in storage, resolve the promise with empty array
        if (!this.isConnected) {
          resolve([]);
        }
      } catch (error: any) {
        // If the bridge is not active, then disconnect
        await this.disconnect();

        reject(
          new DaffiWalletConnectError(
            {
              type: "SESSION_RECONNECT",
              detail: error
            },
            error.message || `There was an error while reconnecting to Daffi Wallet`
          )
        );
      }
    });
  }

  async disconnect() {
    let killPromise: Promise<void> | undefined;

    if (this.isConnected && this.platform === "mobile") {
      killPromise = this.connector?.killSession();

      killPromise?.then(() => {
        this.connector = null;
      });
    }

    await resetWalletDetailsFromStorage();
  }

  private async signTransactionWithMobile(
    signTxnRequestParams: DaffiWalletTransaction[]
  ) {
    const formattedSignTxnRequest = formatJsonRpcRequest("algo_signTxn", [
      signTxnRequestParams
    ]);

    try {
      try {
        const {silent} = await getDaffiConnectConfig();

        const response = await this.connector!.sendCustomRequest(
          formattedSignTxnRequest,
          {
            forcePushNotification: !silent
          }
        );

        // We send the full txn group to the mobile wallet.
        // Therefore, we first filter out txns that were not signed by the wallet.
        // These are received as `null`.
        const nonNullResponse = response.filter(Boolean) as (string | number[])[];

        return typeof nonNullResponse[0] === "string"
          ? (nonNullResponse as string[]).map(base64ToUint8Array)
          : (nonNullResponse as number[][]).map((item) => Uint8Array.from(item));
      } catch (error) {
        return await Promise.reject(
          new DaffiWalletConnectError(
            {
              type: "SIGN_TRANSACTIONS",
              detail: error
            },
            error.message || "Failed to sign transaction"
          )
        );
      }
    } finally {
      removeModalWrapperFromDOM(DAFFI_WALLET_REDIRECT_MODAL_ID);
      removeModalWrapperFromDOM(DAFFI_WALLET_SIGN_TXN_TOAST_ID);
    }
  }

  private signTransactionWithWeb(
    signTxnRequestParams: DaffiWalletTransaction[],
    webWalletURL: string
  ) {
    return new Promise<Uint8Array[]>((resolve, reject) => {
      const webWalletURLs = getDaffiWebWalletURL(webWalletURL);
      const browser = detectBrowser();

      if (browser === "Chrome") {
        openDaffiWalletSignTxnModal()
          .then((modal) => {
            const daffiWalletSignTxnModalIFrameWrapper = modal;

            const daffiWalletIframe = document.createElement("iframe");
            const daffiWalletIframeSrc = generateEmbeddedWalletURL(
              webWalletURLs.TRANSACTION_SIGN
            );
            const daffiWalletIframeAllow = `hid ${daffiWalletIframeSrc}; bluetooth ${daffiWalletIframeSrc}`;

            daffiWalletIframe.setAttribute("id", DAFFI_WALLET_IFRAME_ID);
            daffiWalletIframe.setAttribute("src", daffiWalletIframeSrc);
            daffiWalletIframe.setAttribute("allow", daffiWalletIframeAllow);

            daffiWalletSignTxnModalIFrameWrapper?.appendChild(daffiWalletIframe);

            const daffiWalletSignTxnModalHeader = document
              .getElementById(DAFFI_WALLET_SIGN_TXN_MODAL_ID)
              ?.querySelector("daffi-wallet-sign-txn-modal")
              ?.shadowRoot?.querySelector(`daffi-wallet-modal-header`);

            const daffiWalletSignTxnModalCloseButton =
              daffiWalletSignTxnModalHeader?.shadowRoot?.getElementById(
                "daffi-wallet-modal-header-close-button"
              );

            if (daffiWalletSignTxnModalCloseButton) {
              daffiWalletSignTxnModalCloseButton.addEventListener("click", () => {
                reject(
                  new DaffiWalletConnectError(
                    {
                      type: "SIGN_TXN_CANCELLED"
                    },
                    "Transaction signing is cancelled by user."
                  )
                );

                removeModalWrapperFromDOM(DAFFI_WALLET_SIGN_TXN_MODAL_ID);
              });
            }

            if (daffiWalletIframe.contentWindow) {
              let count = 0;

              const checkIframeIsInitialized = setInterval(() => {
                count += 1;

                if (count === WAIT_FOR_TAB_MAX_TRY_COUNT) {
                  clearInterval(checkIframeIsInitialized);

                  return;
                }

                appTellerManager.sendMessage({
                  message: {
                    type: "IFRAME_INITIALIZED"
                  },

                  origin: webWalletURLs.CONNECT,
                  targetWindow: daffiWalletIframe.contentWindow!
                });
              }, WAIT_FOR_TAB_TRY_INTERVAL);

              appTellerManager.setupListener({
                onReceiveMessage: (event: MessageEvent<TellerMessage<DaffiTeller>>) => {
                  if (event.data.message.type === "IFRAME_INITIALIZED_RECEIVED") {
                    clearInterval(checkIframeIsInitialized);

                    appTellerManager.sendMessage({
                      message: {
                        type: "SIGN_TXN",
                        txn: signTxnRequestParams
                      },

                      origin: generateEmbeddedWalletURL(webWalletURLs.TRANSACTION_SIGN),
                      targetWindow: daffiWalletIframe.contentWindow!
                    });
                  }

                  if (event.data.message.type === "SIGN_TXN_CALLBACK") {
                    document.getElementById(DAFFI_WALLET_IFRAME_ID)?.remove();
                    closeDaffiWalletSignTxnModal();

                    resolve(
                      event.data.message.signedTxns.map((txn) =>
                        base64ToUint8Array(txn.signedTxn)
                      )
                    );
                  }

                  if (event.data.message.type === "SIGN_TXN_NETWORK_MISMATCH") {
                    reject(
                      new DaffiWalletConnectError(
                        {
                          type: "SIGN_TXN_NETWORK_MISMATCH",
                          detail: event.data.message.error
                        },
                        event.data.message.error || "Network mismatch"
                      )
                    );
                  }

                  if (event.data.message.type === "SESSION_DISCONNECTED") {
                    document.getElementById(DAFFI_WALLET_IFRAME_ID)?.remove();
                    closeDaffiWalletSignTxnModal();

                    resetWalletDetailsFromStorage();

                    reject(
                      new DaffiWalletConnectError(
                        {
                          type: "SESSION_DISCONNECTED",
                          detail: event.data.message.error
                        },
                        event.data.message.error
                      )
                    );
                  }

                  if (event.data.message.type === "SIGN_TXN_CALLBACK_ERROR") {
                    document.getElementById(DAFFI_WALLET_IFRAME_ID)?.remove();
                    closeDaffiWalletSignTxnModal();

                    reject(
                      new DaffiWalletConnectError(
                        {
                          type: "SIGN_TXN_CANCELLED"
                        },
                        event.data.message.error
                      )
                    );
                  }
                }
              });
            }

            // Returns a promise that waits for the response from the web wallet.
            // The promise is resolved when the web wallet responds with the signed txn.
            // The promise is rejected when the web wallet responds with an error.
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        waitForTabOpening(webWalletURLs.TRANSACTION_SIGN)
          .then((newDaffiWalletTab) => {
            if (newDaffiWalletTab) {
              appTellerManager.sendMessage({
                message: {
                  type: "SIGN_TXN",
                  txn: signTxnRequestParams
                },

                origin: webWalletURLs.TRANSACTION_SIGN,
                targetWindow: newDaffiWalletTab
              });
            }

            const checkTabIsAliveInterval = setInterval(() => {
              if (newDaffiWalletTab?.closed === true) {
                reject(
                  new DaffiWalletConnectError(
                    {
                      type: "SIGN_TXN_CANCELLED"
                    },
                    "Transaction signing is cancelled by user."
                  )
                );

                clearInterval(checkTabIsAliveInterval);
              }

              // eslint-disable-next-line no-magic-numbers
            }, 2000);

            appTellerManager.setupListener({
              onReceiveMessage: (event: MessageEvent<TellerMessage<DaffiTeller>>) => {
                if (event.data.message.type === "SIGN_TXN_CALLBACK") {
                  newDaffiWalletTab?.close();

                  resolve(
                    event.data.message.signedTxns.map((txn) =>
                      base64ToUint8Array(txn.signedTxn)
                    )
                  );
                }

                if (event.data.message.type === "SIGN_TXN_NETWORK_MISMATCH") {
                  reject(
                    new DaffiWalletConnectError(
                      {
                        type: "SIGN_TXN_NETWORK_MISMATCH",
                        detail: event.data.message.error
                      },
                      event.data.message.error || "Network mismatch"
                    )
                  );
                }

                if (event.data.message.type === "SESSION_DISCONNECTED") {
                  newDaffiWalletTab?.close();

                  resetWalletDetailsFromStorage();

                  reject(
                    new DaffiWalletConnectError(
                      {
                        type: "SESSION_DISCONNECTED",
                        detail: event.data.message.error
                      },
                      event.data.message.error
                    )
                  );
                }

                if (event.data.message.type === "SIGN_TXN_CALLBACK_ERROR") {
                  newDaffiWalletTab?.close();

                  reject(
                    new DaffiWalletConnectError(
                      {
                        type: "SIGN_TXN_CANCELLED"
                      },
                      event.data.message.error
                    )
                  );
                }
              }
            });
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  async signTransaction(
    txGroups: SignerTransaction[][],
    signerAddress?: string
  ): Promise<Uint8Array[]> {
    if (this.platform === "mobile") {
      if (isMobile()) {
        // This is to automatically open the wallet app when trying to sign with it.
        openDaffiWalletRedirectModal();
      } else if (!isMobile() && this.shouldShowSignTxnToast) {
        // This is to inform user go the wallet app when trying to sign with it.
        openDaffiWalletSignTxnToast();
      }

      if (!this.connector) {
        throw new Error("DaffiWalletConnect was not initialized correctly.");
      }
    }

    // Prepare transactions to be sent to wallet
    const signTxnRequestParams = txGroups.flatMap((txGroup) =>
      txGroup.map<DaffiWalletTransaction>((txGroupDetail) =>
        composeTransaction(txGroupDetail, signerAddress)
      )
    );

    // ================================================= //
    // Daffi Wallet Web flow
    if (this.platform === "web") {
      const {webWalletURL} = await getDaffiConnectConfig();

      return this.signTransactionWithWeb(signTxnRequestParams, webWalletURL);
    }
    // ================================================= //

    // ================================================= //
    // Daffi Mobile Wallet flow
    return this.signTransactionWithMobile(signTxnRequestParams);
    // ================================================= //
  }
}

export default DaffiWalletConnect;
/* eslint-enable max-lines */
