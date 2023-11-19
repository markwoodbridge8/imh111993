import DaffiWalletLogo from "../../asset/icon/DaffiWallet.svg";
import CloseIcon from "../../asset/icon/Close.svg";
import CloseIconDark from "../../asset/icon/Close--dark.svg";

import styles from "./_daffi-wallet-modal-header.scss";
import {isSmallScreen} from "../../util/screen/screenSizeUtils";
import {isMobile} from "../../util/device/deviceUtils";
import {
  DAFFI_WALLET_REDIRECT_MODAL_ID,
  removeModalWrapperFromDOM
} from "../daffiWalletConnectModalUtils";

const daffiWalletModalHeader = document.createElement("template");

const headerClassName = isMobile()
  ? "daffi-wallet-modal-header daffi-wallet-modal-header--mobile"
  : "daffi-wallet-modal-header daffi-wallet-modal-header--desktop";

daffiWalletModalHeader.innerHTML = `
  <div class="${headerClassName}">
      ${
        isSmallScreen() && isMobile()
          ? ""
          : `<div class="daffi-wallet-modal-header__brand">
              <img src="${DaffiWalletLogo}" />
              <p>Daffi<span style="font-style: italic;">Wallet</span> Connect</p>
            </div>
            `
      } 

      <button
        id="daffi-wallet-modal-header-close-button"
        class="daffi-wallet-button daffi-wallet-modal-header__close-button">
        <img
          class="daffi-wallet-modal-header__close-button__close-icon"
          src="${isSmallScreen() && isMobile() ? CloseIconDark : CloseIcon}"
        />
      </button>
    </div>
`;

export class DaffiWalletModalHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(daffiWalletModalHeader.content.cloneNode(true), styleSheet);

      this.onClose();
    }
  }

  onClose() {
    const closeButton = this.shadowRoot?.getElementById(
      "daffi-wallet-modal-header-close-button"
    );
    const modalId = this.getAttribute("modal-id");

    if (closeButton && modalId === DAFFI_WALLET_REDIRECT_MODAL_ID) {
      closeButton.addEventListener("click", () => {
        removeModalWrapperFromDOM(DAFFI_WALLET_REDIRECT_MODAL_ID);
      });
    }
  }
}
