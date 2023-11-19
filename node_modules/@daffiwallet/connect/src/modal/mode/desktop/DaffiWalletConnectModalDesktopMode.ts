import ArrowRight from "../../../asset/icon/Right.svg";
import DaffiWalletLogo from "../../../asset/icon/DaffiWallet.png";

import QRCodeStyling from "qr-code-styling";

import styles from "./_daffi-wallet-connect-modal-desktop-mode.scss";
import accordionStyles from "./accordion/_daffi-wallet-accordion.scss";
import {detectBrowser} from "../../../util/device/deviceUtils";

const daffiWalletConnectModalDesktopMode = document.createElement("template");
const styleSheet = document.createElement("style");
const accordionStyleSheet = document.createElement("style");

styleSheet.textContent = styles;
accordionStyleSheet.textContent = accordionStyles;

const daffiWalletConnectModalDesktopModeDefaultView = `
  <div id="daffi-wallet-connect-modal-desktop-mode" class="daffi-wallet-connect-modal-desktop-mode daffi-wallet-connect-modal-desktop-mode--default">
    <daffi-wallet-connect-modal-information-section></daffi-wallet-connect-modal-information-section>
    
    <div class="daffi-wallet-connect-modal-desktop-mode__default-view">
      <div class="daffi-wallet-accordion-item daffi-wallet-accordion-item--active">
        <a class="daffi-wallet-accordion-toggle">
          <button class="daffi-wallet-accordion-toggle__button"></button>
          <img src="${ArrowRight}" class="daffi-wallet-accordion-icon" />
          <div class="daffi-wallet-accordion-toggle__text">
            Connect with Daffi<span style="font-style: italic;">Wallet</span> Mobile
            <span class="daffi-wallet-accordion-toggle__bold-color"> </span>
          </div>
        </a>
        <div class="daffi-wallet-accordion-item__content">
          <div id="daffi-wallet-connect-modal-connect-qr-code" class="daffi-wallet-connect-qr-code-wrapper f_copy-button"></div>
          
            <p class="daffi-wallet-connect-modal-desktop-mode__download-daffi-description f_copy-button" style="cursor: pointer">
             Copy Key
            </p>
        </div>
      </div>
      <div class="daffi-wallet-accordion-item daffi-wallet-accordion-item--web-wallet">
        <a class="daffi-wallet-accordion-toggle">
          <button class="daffi-wallet-accordion-toggle__button"></button>
          <img src="${ArrowRight}" class="daffi-wallet-accordion-icon" />
          <div class="daffi-wallet-accordion-toggle__content-with-label">
            <div class="daffi-wallet-accordion-toggle__content-with-label__text">
              Connect With Daffi<span style="font-style: italic;">Wallet</span> Web
              <span class="daffi-wallet-accordion-toggle__bold-color"></span>
            </div>
          </div>
        </a>
        <div class="daffi-wallet-accordion-item__content">          
            <p class="daffi-wallet-connect-modal-desktop-mode__download-daffi-description">
             Coming Soon
            </p>
        </div>
      </div>
    </div>
  </div>
  `;

daffiWalletConnectModalDesktopMode.innerHTML =
  daffiWalletConnectModalDesktopModeDefaultView;

export class DaffiWalletModalDesktopMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      this.shadowRoot.append(
        daffiWalletConnectModalDesktopMode.content.cloneNode(true),
        styleSheet,
        accordionStyleSheet
      );

      this.shadowRoot.addEventListener("click", (event) => {
        this.handleAccordion(event as MouseEvent);
      });
    }
  }

  connectedCallback() {
    const shouldDisplayNewBadge = this.getAttribute("should-display-new-badge");
    const daffiWalletNewLabel = this.shadowRoot?.getElementById("daffi-web-new-label");

    if (shouldDisplayNewBadge === "false") {
      daffiWalletNewLabel?.setAttribute("style", "display:none");
    }

    this.handleChangeView();

    if (detectBrowser() === "Chrome" && this.shadowRoot) {
      const iframeWrapper = this.shadowRoot.querySelector(
        ".daffi-wallet-connect-modal-desktop-mode__web-wallet-iframe"
      );

      if (iframeWrapper && this.getAttribute("is-web-wallet-available") === "true") {
        // @ts-ignore ts-2339
        window.onWebWalletConnect(iframeWrapper);
      }
    }
  }

  handleChangeView() {
    const downloadDaffiButton = this.shadowRoot?.getElementById(
      "daffi-wallet-connect-modal-desktop-mode-download-daffi-button"
    );
    const copyButtons = this.shadowRoot?.querySelectorAll(".f_copy-button");
    const backButton = this.shadowRoot?.getElementById(
      "daffi-wallet-connect-modal-download-daffi-view-back-button"
    );
    const webWalletLaunchButton = this.shadowRoot?.getElementById(
      "daffi-wallet-connect-web-wallet-launch-button"
    );

    if (downloadDaffiButton) {
      downloadDaffiButton.addEventListener("click", () => {
        this.onClickDownload();
      });
    }

    if (copyButtons && copyButtons.length) {
      copyButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.onClickCopy();
        });
      });
    }

    if (backButton) {
      backButton.addEventListener("click", () => {
        this.onClickBack();
      });
    }

    if (webWalletLaunchButton) {
      webWalletLaunchButton.addEventListener("click", () => {
        this.webWalletConnect();
      });
    }

    this.renderQRCode();
    this.checkWebWalletAvaliability();
  }

  webWalletConnect() {
    if (this.getAttribute("is-web-wallet-available") === "true") {
      // @ts-ignore ts-2339
      window.onWebWalletConnect();
    }
  }

  handleAccordion(event: MouseEvent) {
    if (event.target instanceof Element) {
      if (!event.target.classList.contains("daffi-wallet-accordion-toggle__button"))
        return;

      if (this.shadowRoot && event.target.parentElement?.parentElement) {
        const accordionItem = event.target.parentElement?.parentElement;

        if (!accordionItem) return;

        if (accordionItem.classList.contains("daffi-wallet-accordion-item--active")) {
          return;
        }

        const accordionItems = this.shadowRoot.querySelectorAll(
          ".daffi-wallet-accordion-item.daffi-wallet-accordion-item--active"
        );

        for (let i = 0; i < accordionItems.length; i++) {
          accordionItems[i].classList.remove("daffi-wallet-accordion-item--active");
        }

        accordionItem.classList.toggle("daffi-wallet-accordion-item--active");
      }
    }
  }

  renderQRCode() {
    const URI = this.getAttribute("uri");
    const isWebWalletAvailable = this.getAttribute("is-web-wallet-available");

    // eslint-disable-next-line no-magic-numbers
    const size = isWebWalletAvailable === "false" ? 250 : 205;

    if (URI) {
      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        data: URI,
        image: DaffiWalletLogo,
        imageOptions: {
          crossOrigin: "anonymous",
          hideBackgroundDots: true,
          imageSize: 0.5,
          margin: 9
        },
        backgroundOptions: {color: "#1a1a1a"},
        dotsOptions: {color: "#ffffff", type: "dots"},
        cornersSquareOptions: {type: "dot"},
        cornersDotOptions: {type: "dot"},
        qrOptions: {typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q"}
      });

      const qrWrapper = this.shadowRoot?.getElementById(
        "daffi-wallet-connect-modal-connect-qr-code"
      );

      if (qrWrapper) {
        qrCode.append(qrWrapper);
      }
    }
  }

  onClickDownload() {
    if (this.shadowRoot) {
      const modalDesktopMode = this.shadowRoot.getElementById(
        "daffi-wallet-connect-modal-desktop-mode"
      );

      if (modalDesktopMode) {
        modalDesktopMode.classList.remove(
          "daffi-wallet-connect-modal-desktop-mode--default"
        );

        modalDesktopMode.classList.add(
          "daffi-wallet-connect-modal-desktop-mode--download"
        );
      }
    }
  }

  onClickCopy() {
    if (this.shadowRoot) {
      const URI = this.getAttribute("uri");

      if (URI) {
        const textarea = document.createElement("textarea");

        textarea.style.position = "fixed";
        textarea.style.left = "0";
        textarea.style.top = "0";
        textarea.style.opacity = "0";
        textarea.value = URI;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        /* eslint-disable */
        document.execCommand("copy"); // copy passed value
        /* eslint-enable */
        document.body.removeChild(textarea);
      }
    }
  }

  onClickBack() {
    if (this.shadowRoot) {
      const modalDesktopMode = this.shadowRoot.getElementById(
        "daffi-wallet-connect-modal-desktop-mode"
      );

      if (modalDesktopMode) {
        modalDesktopMode.classList.add(
          "daffi-wallet-connect-modal-desktop-mode--default"
        );

        modalDesktopMode.classList.remove(
          "daffi-wallet-connect-modal-desktop-mode--download"
        );
      }
    }
  }

  checkWebWalletAvaliability() {
    if (this.getAttribute("is-web-wallet-available") === "false") {
      const desktopModeDefaultView = this.shadowRoot?.querySelector(
        ".daffi-wallet-connect-modal-desktop-mode__default-view"
      );

      desktopModeDefaultView?.classList.add(
        "daffi-wallet-connect-modal-desktop-mode__default-view--web-wallet-not-available"
      );
    }
  }
}
