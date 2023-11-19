import {isAndroid} from "./device/deviceUtils";

const DAFFI_WALLET_APP_DEEP_LINK = isAndroid() ? "algorand://" : "algorand-wc://";
const DAFFI_DOWNLOAD_URL = "https://daffiwallet.app/";

function getDaffiWebWalletURL(webWalletURL: string) {
  return {
    ROOT: `https://${webWalletURL}`,
    CONNECT: `https://${webWalletURL}/connect`,
    TRANSACTION_SIGN: `https://${webWalletURL}/transaction/sign`
  };
}

export {DAFFI_WALLET_APP_DEEP_LINK, getDaffiWebWalletURL, DAFFI_DOWNLOAD_URL};
