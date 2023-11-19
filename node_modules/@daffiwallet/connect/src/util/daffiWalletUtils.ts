import {detectBrowser, isAndroid, isIOS} from "./device/deviceUtils";
import {DAFFI_WALLET_APP_DEEP_LINK} from "./daffiWalletConstants";

function generateDaffiWalletAppDeepLink(shouldAddBrowserName = true): string {
  let appDeepLink = DAFFI_WALLET_APP_DEEP_LINK;
  const browserName = detectBrowser();

  if (shouldAddBrowserName && browserName) {
    appDeepLink = `${appDeepLink}?browser=${encodeURIComponent(browserName)}`;
  }

  return appDeepLink;
}

function generateEmbeddedWalletURL(url: string) {
  const newURL = new URL(url);

  newURL.searchParams.append("embedded", "true");

  return newURL.toString();
}

/**
 * @param {string} uri WalletConnect uri
 * @returns {string} Daffi Wallet deeplink
 */
function generateDaffiWalletConnectDeepLink(uri: string): string {
  let appDeepLink = generateDaffiWalletAppDeepLink(false);

  // Add `wc` suffix to the deeplink if it doesn't exist
  if (isIOS() && !appDeepLink.includes("-wc")) {
    appDeepLink = appDeepLink.replace("://", "-wc://");
  }

  let deepLink = `${appDeepLink}wc?uri=${encodeURIComponent(uri)}`;
  const browserName = detectBrowser();

  if (isAndroid()) {
    deepLink = uri;
  }

  if (browserName) {
    deepLink = `${deepLink}&browser=${encodeURIComponent(browserName)}`;
  }

  return deepLink;
}

export {
  generateDaffiWalletAppDeepLink,
  generateDaffiWalletConnectDeepLink,
  generateEmbeddedWalletURL
};
