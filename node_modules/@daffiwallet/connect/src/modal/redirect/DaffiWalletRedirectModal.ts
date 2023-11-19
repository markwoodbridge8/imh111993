import DaffiWalletLogo from "../../asset/icon/DaffiWallet.svg";

import {generateDaffiWalletAppDeepLink} from "../../util/daffiWalletUtils";
import {
  DAFFI_WALLET_REDIRECT_MODAL_ID,
  removeModalWrapperFromDOM
} from "../daffiWalletConnectModalUtils";
import styles from "./_daffi-wallet-redirect-modal.scss";

const daffiWalletRedirectModalTemplate = document.createElement("template");

daffiWalletRedirectModalTemplate.innerHTML = `
  <div class="daffi-wallet-modal daffi-wallet-modal--mobile">
    <div class="daffi-wallet-modal__body">
      <daffi-wallet-modal-header modal-id="${DAFFI_WALLET_REDIRECT_MODAL_ID}"></daffi-wallet-modal-header/>

      <div class="daffi-wallet-redirect-modal">
        <div class="daffi-wallet-redirect-modal__content">
          <img src="${DaffiWalletLogo}" />

          <h1 class="daffi-wallet-redirect-modal__content__title">
            Can't Launch DaffiWallet
          </h1>

          <p class="daffi-wallet-redirect-modal__content__description">
            We couldn't redirect you to DaffiWallet automatically. Please try again.
          </p>

          <p class="daffi-wallet-redirect-modal__content__install-daffi-text">
            Don't have DaffiWallet installed yet?
            <br />
            
            <a
              id="daffi-wallet-redirect-modal-download-daffi-link"
              class="daffi-wallet-redirect-modal__content__install-daffi-text__link"
              href="https://daffiwallet.app/"
              rel="noopener noreferrer"
              target="_blank">
              Tap here to install.
            </a>
          </p>
        </div>

        <a
          id="daffi-wallet-redirect-modal-launch-daffi-link"
          class="daffi-wallet-redirect-modal__launch-daffi-wallet-button"
          rel="noopener noreferrer"
          target="_blank">
          Launch DaffiWallet
        </a>
      </div>
    </div>
  </div>
`;

export class DaffiWalletRedirectModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        daffiWalletRedirectModalTemplate.content.cloneNode(true),
        styleSheet
      );

      const downloadDaffiLink = this.shadowRoot?.getElementById(
        "daffi-wallet-redirect-modal-download-daffi-link"
      );

      downloadDaffiLink?.addEventListener("click", () => {
        this.onClose();
      });

      const launchDaffiLink = this.shadowRoot?.getElementById(
        "daffi-wallet-redirect-modal-launch-daffi-link"
      );

      launchDaffiLink?.addEventListener("click", () => {
        this.onClose();
        window.open(generateDaffiWalletAppDeepLink(), "_blank");
      });
    }
  }

  connectedCallback() {
    const daffiWalletDeepLink = window.open(generateDaffiWalletAppDeepLink(), "_blank");

    if (daffiWalletDeepLink && !daffiWalletDeepLink.closed) {
      this.onClose();
    }
  }

  onClose() {
    removeModalWrapperFromDOM(DAFFI_WALLET_REDIRECT_MODAL_ID);
  }
}
