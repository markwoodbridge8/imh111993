import DaffiWalletLogo from "../../../asset/icon/DaffiWallet.svg";
import HelpIcon from "../../../asset/icon/Help.svg";
import SendIcon from "../../../asset/icon/Send.svg";

import Lottie from "@evanhahn/lottie-web-light";

import {
  DAFFI_WALLET_CONNECT_MODAL_ID,
  removeModalWrapperFromDOM
} from "../../daffiWalletConnectModalUtils";
import styles from "./_daffi-wallet-connect-modal-pending-message.scss";
import {isIOS} from "../../../util/device/deviceUtils";
import {
  CONNECT_AUDIO_URL,
  CONNECT_TIMEOUT_INTERVAL,
  DAFFI_LOADER_ANIMATION_URL
} from "./util/daffiWalletConnectModalPendingMessageConstants";

const daffiWalletConnectModalPendingMessageTemplate = document.createElement("template");

daffiWalletConnectModalPendingMessageTemplate.innerHTML = `
  <div class="daffi-wallet-connect-modal-pending-message-section">
    <div class="daffi-wallet-connect-modal-pending-message">
      <div id="daffi-wallet-connect-modal-pending-message-animation-wrapper" class="daffi-wallet-connect-modal-pending-message__animation-wrapper"></div>

      <div class="daffi-wallet-connect-modal-pending-message__text">
        Please wait while we connect you to DaffiWallet
      </div>
    </div>

    <button
      id="daffi-wallet-connect-modal-pending-message-cancel-button"
      class="daffi-wallet-button daffi-wallet-connect-modal-pending-message__cancel-button">
        Cancel
    </button>
  </div>

  <div id="daffi-wallet-connect-modal-pending-message-audio-wrapper"></div>
`;

const daffiWalletConnectTryAgainView = `
  <div class="daffi-wallet-connect-modal-pending-message--try-again-view">
    <div>
      <img src="${DaffiWalletLogo}" alt="DaffiWallet Logo" />

      <h1 class="daffi-wallet-connect-modal-pending-message--try-again-view__title">
        Couldn’t establish connection
      </h1>

      <p class="daffi-wallet-connect-modal-pending-message--try-again-view__description">
        Having issues? Before trying again, make sure to read the support article below and apply the possible solutions.
      </p>
    </div>

    <div>
      <a
        href="https://desk.daffi.me/portal/en/kb/daffi"
        target="_blank"
        rel="noopener noreferrer"
        class="daffi-wallet-connect-modal-pending-message--try-again-view__resolving-anchor">
        <img
          class="daffi-wallet-connect-modal-pending-message--try-again-view__resolving-anchor__image"
          src="${HelpIcon}"
          alt="Help Icon"
        />

        <div>
          <div
            class="daffi-wallet-connect-modal-pending-message--try-again-view__resolving-anchor__title-wrapper">
            <h1
              class="daffi-wallet-connect-modal-pending-message--try-again-view__resolving-anchor__title">
                Resolving WalletConnect issues
            </h1>

            <img src="${SendIcon}" alt="Send Icon"/>
          </div>

          <p
            class="daffi-wallet-connect-modal-pending-message--try-again-view__resolving-anchor__description">
            Unfortunately there are several known issues related to WalletConnect that our team is working on. Some of these issues are related to the WalletConnect JavaScript implementation on the dApp ...
          </p>
        </div>
      </a>

      <button id="daffi-wallet-connect-modal-pending-message-try-again-button" class="daffi-wallet-connect-button daffi-wallet-connect-modal-pending-message--try-again-view__button">
        Close & Try Again
      </button>
    </div>
  </div>
  `;

export class DaffiWalletConnectModalPendingMessageSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        daffiWalletConnectModalPendingMessageTemplate.content.cloneNode(true),
        styleSheet
      );
    }
  }

  connectedCallback() {
    const cancelButton = this.shadowRoot?.getElementById(
      "daffi-wallet-connect-modal-pending-message-cancel-button"
    );

    cancelButton?.addEventListener("click", () => {
      this.onClose();
    });

    this.addAudioForConnection();
    this.renderLottieAnimation();

    setTimeout(() => {
      daffiWalletConnectModalPendingMessageTemplate.innerHTML =
        daffiWalletConnectTryAgainView;

      if (this.shadowRoot) {
        const styleSheet = document.createElement("style");

        styleSheet.textContent = styles;

        this.shadowRoot.innerHTML = "";

        this.shadowRoot.append(
          daffiWalletConnectModalPendingMessageTemplate.content.cloneNode(true),
          styleSheet
        );

        const tryAgainButton = this.shadowRoot?.getElementById(
          "daffi-wallet-connect-modal-pending-message-try-again-button"
        );

        tryAgainButton?.addEventListener("click", () => {
          this.onClose();
        });
      }
    }, CONNECT_TIMEOUT_INTERVAL);
  }

  onClose() {
    removeModalWrapperFromDOM(DAFFI_WALLET_CONNECT_MODAL_ID);
  }

  addAudioForConnection() {
    const shouldUseSound = this.getAttribute("should-use-sound");

    if (shouldUseSound === "true" && isIOS()) {
      const connectAudioWrapper = this.shadowRoot?.getElementById(
        "daffi-wallet-connect-modal-pending-message-audio-wrapper"
      );

      const audio = document.createElement("audio");

      audio.src = CONNECT_AUDIO_URL;
      audio.autoplay = true;
      audio.loop = true;

      connectAudioWrapper?.appendChild(audio);
    }
  }

  renderLottieAnimation() {
    const lottieWrapper = this.shadowRoot?.getElementById(
      "daffi-wallet-connect-modal-pending-message-animation-wrapper"
    );

    if (lottieWrapper) {
      Lottie.loadAnimation({
        container: lottieWrapper,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: DAFFI_LOADER_ANIMATION_URL
      });
    }
  }
}
