// eslint-disable-next-line import/no-unresolved
import {IWalletConnectSession} from "@walletconnect/types";

import {DaffiWalletDetails, DaffiWalletPlatformType} from "../daffiWalletTypes";
import {DAFFI_WALLET_LOCAL_STORAGE_KEYS} from "./storageConstants";

function getLocalStorage() {
  return typeof localStorage === "undefined" ? undefined : localStorage;
}

function saveWalletDetailsToStorage(
  accounts: string[],
  type?: "daffi-wallet" | "daffi-wallet-web"
) {
  getLocalStorage()?.setItem(
    DAFFI_WALLET_LOCAL_STORAGE_KEYS.WALLET,
    JSON.stringify({
      type: type || "daffi-wallet",
      accounts,
      selectedAccount: accounts[0]
    })
  );
}

function getWalletDetailsFromStorage(): DaffiWalletDetails | null {
  const storedWalletDetails = getLocalStorage()?.getItem(
    DAFFI_WALLET_LOCAL_STORAGE_KEYS.WALLET
  );

  if (storedWalletDetails) {
    return JSON.parse(storedWalletDetails) as DaffiWalletDetails;
  }

  return null;
}

function getWalletConnectObjectFromStorage(): IWalletConnectSession | null {
  const storedWalletConnectObject = getLocalStorage()?.getItem(
    DAFFI_WALLET_LOCAL_STORAGE_KEYS.WALLETCONNECT
  );

  if (storedWalletConnectObject) {
    return JSON.parse(storedWalletConnectObject) as IWalletConnectSession;
  }

  return null;
}

function resetWalletDetailsFromStorage() {
  return new Promise<undefined>((resolve, reject) => {
    try {
      getLocalStorage()?.removeItem(DAFFI_WALLET_LOCAL_STORAGE_KEYS.WALLETCONNECT);
      getLocalStorage()?.removeItem(DAFFI_WALLET_LOCAL_STORAGE_KEYS.WALLET);
      resolve(undefined);
    } catch (error) {
      reject(error);
    }
  });
}

function getWalletPlatformFromStorage() {
  const walletDetails = getWalletDetailsFromStorage();
  let walletType: DaffiWalletPlatformType = null;

  if (walletDetails?.type === "daffi-wallet") {
    walletType = "mobile";
  } else if (walletDetails?.type === "daffi-wallet-web") {
    walletType = "web";
  }

  return walletType;
}

export {
  getLocalStorage,
  saveWalletDetailsToStorage,
  resetWalletDetailsFromStorage,
  getWalletDetailsFromStorage,
  getWalletConnectObjectFromStorage,
  getWalletPlatformFromStorage
};
