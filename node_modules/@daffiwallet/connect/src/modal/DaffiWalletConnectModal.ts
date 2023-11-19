import {isMobile} from "../util/device/deviceUtils";
import {isSmallScreen} from "../util/screen/screenSizeUtils";
import {
  DAFFI_WALLET_CONNECT_MODAL_ID,
  DAFFI_WALLET_MODAL_CLASS
} from "./daffiWalletConnectModalUtils";
import styles from "./_daffi-wallet-modal.scss";

const daffiWalletConnectModal = document.createElement("template");
const daffiWalletConnectModalClassNames = isMobile()
  ? `${DAFFI_WALLET_MODAL_CLASS} ${DAFFI_WALLET_MODAL_CLASS}--mobile`
  : `${DAFFI_WALLET_MODAL_CLASS} ${DAFFI_WALLET_MODAL_CLASS}--desktop`;

export class DaffiWalletConnectModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      if (isSmallScreen() && isMobile()) {
        daffiWalletConnectModal.innerHTML = `
        <div class="${daffiWalletConnectModalClassNames}">
          <div class="daffi-wallet-modal__body" part="body">
            <daffi-wallet-modal-header modal-id="${DAFFI_WALLET_CONNECT_MODAL_ID}"></daffi-wallet-modal-header/>
      
            <daffi-wallet-modal-touch-screen-mode uri="${this.getAttribute(
              "uri"
            )}" should-use-sound="${this.getAttribute(
          "should-use-sound"
        )}"></daffi-wallet-modal-touch-screen-mode>
          </div>
        </div>
      `;

        this.shadowRoot.append(
          daffiWalletConnectModal.content.cloneNode(true),
          styleSheet
        );
      } else {
        daffiWalletConnectModal.innerHTML = `
          <div class="${daffiWalletConnectModalClassNames}">
            <div class="daffi-wallet-modal__body">
              <daffi-wallet-modal-header modal-id="${DAFFI_WALLET_CONNECT_MODAL_ID}"></daffi-wallet-modal-header/>
        
              <daffi-wallet-modal-desktop-mode id="daffi-wallet-modal-desktop-mode" uri="${this.getAttribute(
                "uri"
              )}" is-web-wallet-available="${this.getAttribute(
          "is-web-wallet-available"
        )}" should-display-new-badge="${this.getAttribute(
          "should-display-new-badge"
        )}"></daffi-wallet-modal-desktop-mode>
            </div>
          </div>
        `;

        this.shadowRoot.append(
          daffiWalletConnectModal.content.cloneNode(true),
          styleSheet
        );
      }
    }
  }
}
