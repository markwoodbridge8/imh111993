import {generateDaffiWalletConnectDeepLink} from "../../../util/daffiWalletUtils";
import styles from "./_daffi-wallet-modal-touch-screen-mode.scss";

const daffiWalletModalTouchScreenMode = document.createElement("template");

const touchScreenDefaultMode = `
  <div class="daffi-wallet-connect-modal-touch-screen-mode">
    <daffi-wallet-connect-modal-information-section></daffi-wallet-connect-modal-information-section>

    <div>
      <a
        id="daffi-wallet-connect-modal-touch-screen-mode-launch-daffi-wallet-button"
        class="daffi-wallet-connect-modal-touch-screen-mode__launch-daffi-wallet-button"
        rel="noopener noreferrer"
        target="_blank">
        Launch DaffiWallet
      </a>

      <div
        class="daffi-wallet-connect-modal-touch-screen-mode__new-to-daffi-box">
        <p
          class="daffi-wallet-connect-modal-touch-screen-mode__new-to-daffi-box__text"
          >
          New to DaffiWallet?
        </p>
      </div>

      <a
        href="https://daffiwallet.app/"
        class="daffi-wallet-connect-modal-touch-screen-mode__install-daffi-wallet-button"
        rel="noopener noreferrer"
        target="_blank">
        Install DaffiWallet
      </a>
    </div>
  </div>
`;

export class DaffiWalletModalTouchScreenMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    daffiWalletModalTouchScreenMode.innerHTML = touchScreenDefaultMode;

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        daffiWalletModalTouchScreenMode.content.cloneNode(true),
        styleSheet
      );

      const launchDaffiLink = this.shadowRoot?.getElementById(
        "daffi-wallet-connect-modal-touch-screen-mode-launch-daffi-wallet-button"
      );
      const URI = this.getAttribute("uri");

      if (launchDaffiLink && URI) {
        launchDaffiLink.setAttribute("href", generateDaffiWalletConnectDeepLink(URI));
        launchDaffiLink.addEventListener("click", () => {
          this.onClickLaunch();
        });
      }
    }
  }

  onClickLaunch() {
    daffiWalletModalTouchScreenMode.innerHTML = `
    <div class="daffi-wallet-connect-modal-touch-screen-mode daffi-wallet-connect-modal-touch-screen-mode--pending-message-view">
      <daffi-wallet-connect-modal-pending-message-section should-use-sound="${this.getAttribute(
        "should-use-sound"
      )}"></daffi-wallet-connect-modal-pending-message-section>
    </div>
  `;

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.innerHTML = "";

      this.shadowRoot.append(
        daffiWalletModalTouchScreenMode.content.cloneNode(true),
        styleSheet
      );
    }
  }
}
