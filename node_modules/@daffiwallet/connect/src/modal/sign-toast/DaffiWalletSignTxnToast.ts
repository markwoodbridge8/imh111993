import CloseIcon from "../../asset/icon/Close--small.svg";

import Lottie from "@evanhahn/lottie-web-light";

import styles from "./_daffi-wallet-sign-txn-toast.scss";
import {
  DAFFI_WALLET_SIGN_TXN_TOAST_ID,
  removeModalWrapperFromDOM
} from "../daffiWalletConnectModalUtils";
import {SIGN_TXN_ANIMATION_URL} from "./util/daffiWalletSignTxnToastConstants";

const daffiWalletSignTxnToastTemplate = document.createElement("template");

daffiWalletSignTxnToastTemplate.innerHTML = `
  <div class="daffi-wallet-sign-txn-toast">
    <div class="daffi-wallet-sign-txn-toast__header">
      <button
        id="daffi-wallet-sign-txn-toast-close-button"
        class="daffi-wallet-sign-txn-toast__header__close-button">
        <img src="${CloseIcon}" />
      </button>
    </div>
    <div class="daffi-wallet-sign-txn-toast__content">
      <div id="daffi-wallet-sign-txn-toast-lottie-animation" style="width:368;height:368" class="daffi-wallet-sign-txn-toast__content__lottie-animation"></div>
      <p class="daffi-wallet-sign-txn-toast__content__description">
        Please launch <b>DaffiWallet</b> on your iOS or Android device to sign this transaction.
      </p>
    </div>
  </div>
`;

export class DaffiWalletSignTxnToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        daffiWalletSignTxnToastTemplate.content.cloneNode(true),
        styleSheet
      );

      const closeButton = this.shadowRoot.getElementById(
        "daffi-wallet-sign-txn-toast-close-button"
      );

      closeButton?.addEventListener("click", () => {
        removeModalWrapperFromDOM(DAFFI_WALLET_SIGN_TXN_TOAST_ID);
      });

      this.renderLottieAnimation();
    }
  }

  renderLottieAnimation() {
    const lottieWrapper = this.shadowRoot?.getElementById(
      "daffi-wallet-sign-txn-toast-lottie-animation"
    );

    if (lottieWrapper) {
      Lottie.loadAnimation({
        container: lottieWrapper,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: SIGN_TXN_ANIMATION_URL
      });
    }
  }
}
