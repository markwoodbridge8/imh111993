import {shuffleArray} from "../array/arrayUtils";
import fetcher from "./fetcher";
import {DaffiWalletConfig} from "./daffiWalletConnectApiTypes";

const DAFFI_CONNECT_CONFIG_URL = "https://wc.peraWallet.app/config.json";

/**
 * @returns {object} {web_wallet: boolean, web_wallet_url: string, use_sound: boolean, display_new_badge: boolean, servers: string[]}
 */
function fetchDaffiConnectConfig() {
  const configURL = DAFFI_CONNECT_CONFIG_URL;

  return fetcher<{
    web_wallet: boolean | undefined;
    web_wallet_url: string | undefined;
    use_sound: boolean | undefined;
    display_new_badge: boolean | undefined;
    servers: string[] | undefined;
    silent: boolean | undefined;
  }>(configURL, {cache: "no-store"});
}

/**
 * @returns {object} {bridgeURL: string, webWalletURL: string, isWebWalletAvailable: boolean, shouldDisplayNewBadge: boolean, shouldUseSound: boolean}
 */
async function getDaffiConnectConfig() {
  let daffiWalletConfig: DaffiWalletConfig = {
    bridgeURL: "",
    webWalletURL: "",
    isWebWalletAvailable: false,
    shouldDisplayNewBadge: false,
    shouldUseSound: true,
    silent: false
  };

  try {
    const response = await fetchDaffiConnectConfig();

    if (typeof response.web_wallet !== "undefined" && response.web_wallet_url) {
      daffiWalletConfig.isWebWalletAvailable = response.web_wallet!;
    }

    if (typeof response.display_new_badge !== "undefined") {
      daffiWalletConfig.shouldDisplayNewBadge = response.display_new_badge!;
    }

    if (typeof response.use_sound !== "undefined") {
      daffiWalletConfig.shouldUseSound = response.use_sound!;
    }

    if (typeof response.silent !== "undefined") {
      daffiWalletConfig.silent = response.silent!;
    }

    daffiWalletConfig = {
      ...daffiWalletConfig,
      bridgeURL: shuffleArray(response.servers || [])[0] || "",
      webWalletURL: response.web_wallet_url || ""
    };
  } catch (error) {
    console.log(error);
  }

  return daffiWalletConfig;
}

export {getDaffiConnectConfig, fetchDaffiConnectConfig};
