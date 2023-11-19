import DaffiWalletLogo from "../../../asset/icon/DaffiWallet.png";

import {isSmallScreen} from "../../../util/screen/screenSizeUtils";
import styles from "./_daffi-wallet-connect-modal-information-section.scss";
import {isMobile} from "../../../util/device/deviceUtils";

const daffiWalletConnectModalInformationSectionTemplate =
  document.createElement("template");
const informationSectionClassNames = isMobile()
  ? "daffi-wallet-connect-modal-information-section daffi-wallet-connect-modal-information-section--mobile"
  : "daffi-wallet-connect-modal-information-section daffi-wallet-connect-modal-information-section--desktop";

daffiWalletConnectModalInformationSectionTemplate.innerHTML = `
  <section class="${informationSectionClassNames}">
    <img
      src="${DaffiWalletLogo}"
      id="daffi-wallet-connect-modal-information-section-daffi-icon"
      class="daffi-wallet-connect-modal-information-section__daffi-icon"
      alt="DaffiWallet Logo"
    />

    <h1 id="daffi-wallet-connect-modal-information-section-connect-daffi-mobile" class="daffi-wallet-connect-modal-information-section__connect-daffi-title">
        Connect to Daffi<span style="font-style: italic;">Wallet</span>
    </h1>

    <h1 class="daffi-wallet-connect-modal-information-section__title">
      Daffi<span style="font-style: italic;">Wallet</span><br/>Everyday<br/>Crypto
    </h1>
    <p class="daffi-wallet-connect-modal-information-section__features-item__description">
     install on<br/>Android &nbsp; &nbsp; &nbsp; IOS
    </p>
  </section>
`;

export class DaffiWalletConnectModalInformationSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        daffiWalletConnectModalInformationSectionTemplate.content.cloneNode(true),
        styleSheet
      );

      if (isSmallScreen() && isMobile()) {
        this.shadowRoot
          .getElementById("daffi-wallet-connect-modal-information-section-title")
          ?.setAttribute("style", "display: none;");
      } else {
        this.shadowRoot
          .getElementById("daffi-wallet-connect-modal-information-section-daffi-icon")
          ?.setAttribute("src", DaffiWalletLogo);
        this.shadowRoot
          .getElementById(
            "daffi-wallet-connect-modal-information-section-connect-daffi-mobile"
          )
          ?.setAttribute("style", "display: none;");
      }
    }
  }
}
