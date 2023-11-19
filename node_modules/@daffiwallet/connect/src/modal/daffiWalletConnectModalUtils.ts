import DaffiWalletConnectError from "../util/DaffiWalletConnectError";
import {waitForElementCreatedAtShadowDOM} from "../util/dom/domUtils";

export type DAFFI_CONNECT_MODAL_VIEWS = "default" | "download-daffi";

export interface DaffiWalletModalConfig {
  isWebWalletAvailable: boolean;
  shouldDisplayNewBadge: boolean;
  shouldUseSound: boolean;
}

// The ID of the wrapper element for DaffiWalletConnectModal
const DAFFI_WALLET_CONNECT_MODAL_ID = "daffi-wallet-connect-modal-wrapper";

// The ID of the wrapper element for DaffiWalletRedirectModal
const DAFFI_WALLET_REDIRECT_MODAL_ID = "daffi-wallet-redirect-modal-wrapper";

// The ID of the wrapper element for DaffiWalletSignTxnToast
const DAFFI_WALLET_SIGN_TXN_TOAST_ID = "daffi-wallet-sign-txn-toast-wrapper";

// The ID of the wrapper element for DaffiWalletSignTxnModal
const DAFFI_WALLET_SIGN_TXN_MODAL_ID = "daffi-wallet-sign-txn-modal-wrapper";

// The ID of the Daffi wallet iframe
const DAFFI_WALLET_IFRAME_ID = "daffi-wallet-iframe";

// The className of Daffi wallet modal
const DAFFI_WALLET_MODAL_CLASS = "daffi-wallet-modal";

// The className of Web Wallet IFrame
const DAFFI_WALLET_WEB_WALLET_IFRAME_CLASS =
  "daffi-wallet-connect-modal-desktop-mode__web-wallet-iframe";

function createModalWrapperOnDOM(modalId: string) {
  const wrapper = document.createElement("div");

  wrapper.setAttribute("id", modalId);

  document.body.appendChild(wrapper);

  return wrapper;
}

function openDaffiWalletConnectModal(modalConfig: DaffiWalletModalConfig) {
  return (uri: string) => {
    if (!document.getElementById(DAFFI_WALLET_CONNECT_MODAL_ID)) {
      const root = createModalWrapperOnDOM(DAFFI_WALLET_CONNECT_MODAL_ID);
      const newURI = `${uri}&algorand=true`;
      const {isWebWalletAvailable, shouldDisplayNewBadge, shouldUseSound} = modalConfig;

      root.innerHTML = `<daffi-wallet-connect-modal uri="${newURI}" is-web-wallet-available="${isWebWalletAvailable}" should-display-new-badge="${shouldDisplayNewBadge}" should-use-sound="${shouldUseSound}"></daffi-wallet-connect-modal>`;
    }
  };
}

function setupDaffiWalletConnectModalCloseListener(onClose: VoidFunction) {
  const daffiWalletConnectModalWrapper = document.getElementById(
    DAFFI_WALLET_CONNECT_MODAL_ID
  );

  const daffiWalletConnectModal = daffiWalletConnectModalWrapper
    ?.querySelector("daffi-wallet-connect-modal")
    ?.shadowRoot?.querySelector(`.${DAFFI_WALLET_MODAL_CLASS}`);

  const closeButton = daffiWalletConnectModal
    ?.querySelector("daffi-wallet-modal-header")
    ?.shadowRoot?.getElementById("daffi-wallet-modal-header-close-button");

  closeButton?.addEventListener("click", () => {
    onClose();

    removeModalWrapperFromDOM(DAFFI_WALLET_CONNECT_MODAL_ID);
  });
}

/**
 * Creates a DaffiWalletRedirectModal instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openDaffiWalletRedirectModal() {
  const root = createModalWrapperOnDOM(DAFFI_WALLET_REDIRECT_MODAL_ID);

  root.innerHTML = "<daffi-wallet-redirect-modal></daffi-wallet-redirect-modal>";
}

function openDaffiWalletSignTxnModal() {
  const root = createModalWrapperOnDOM(DAFFI_WALLET_SIGN_TXN_MODAL_ID);

  root.innerHTML = "<daffi-wallet-sign-txn-modal></daffi-wallet-sign-txn-modal>";

  const signTxnModal = root.querySelector("daffi-wallet-sign-txn-modal");

  return signTxnModal
    ? waitForElementCreatedAtShadowDOM(
        signTxnModal,
        "daffi-wallet-sign-txn-modal__body__content"
      )
    : Promise.reject();
}

function closeDaffiWalletSignTxnModal(rejectPromise?: (error: any) => void) {
  removeModalWrapperFromDOM(DAFFI_WALLET_SIGN_TXN_MODAL_ID);

  if (rejectPromise) {
    rejectPromise(
      new DaffiWalletConnectError(
        {
          type: "SIGN_TXN_CANCELLED"
        },
        "Transaction sign is cancelled"
      )
    );
  }
}

/**
 * Creates a DaffiWalletSignTxnToast instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openDaffiWalletSignTxnToast() {
  const root = createModalWrapperOnDOM(DAFFI_WALLET_SIGN_TXN_TOAST_ID);

  root.innerHTML = "<daffi-wallet-sign-txn-toast></daffi-wallet-sign-txn-toast>";
}

function closeDaffiWalletSignTxnToast() {
  removeModalWrapperFromDOM(DAFFI_WALLET_SIGN_TXN_TOAST_ID);
}

function removeModalWrapperFromDOM(modalId: string) {
  const wrapper = document.getElementById(modalId);

  if (wrapper) {
    wrapper.remove();
  }
}

export {
  DAFFI_WALLET_CONNECT_MODAL_ID,
  DAFFI_WALLET_REDIRECT_MODAL_ID,
  DAFFI_WALLET_SIGN_TXN_TOAST_ID,
  DAFFI_WALLET_SIGN_TXN_MODAL_ID,
  DAFFI_WALLET_MODAL_CLASS,
  DAFFI_WALLET_WEB_WALLET_IFRAME_CLASS,
  DAFFI_WALLET_IFRAME_ID,
  openDaffiWalletConnectModal,
  setupDaffiWalletConnectModalCloseListener,
  openDaffiWalletRedirectModal,
  openDaffiWalletSignTxnToast,
  closeDaffiWalletSignTxnToast,
  removeModalWrapperFromDOM,
  openDaffiWalletSignTxnModal,
  closeDaffiWalletSignTxnModal
};
