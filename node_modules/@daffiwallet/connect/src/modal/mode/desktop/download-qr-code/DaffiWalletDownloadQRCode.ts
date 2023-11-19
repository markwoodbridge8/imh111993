import DaffiWalletLogo from "../../../../asset/icon/DaffiWallet.svg";

import QRCodeStyling from "qr-code-styling";

import styles from "./_daffi-wallet-download-qr-code.scss";
import {DAFFI_DOWNLOAD_URL} from "../../../../util/daffiWalletConstants";

const daffiWalletDownloadQRCode = document.createElement("template");

daffiWalletDownloadQRCode.innerHTML = `
  <div id="daffi-wallet-download-qr-code-wrapper" class="daffi-wallet-download-qr-code-wrapper"></div>  
`;

export class DaffiWalletDownloadQRCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        daffiWalletDownloadQRCode.content.cloneNode(true),
        styleSheet
      );
    }
  }

  connectedCallback() {
    const downloadQRCode = new QRCodeStyling({
      width: 205,
      height: 205,
      type: "svg",
      data: DAFFI_DOWNLOAD_URL,
      image: DaffiWalletLogo,
      dotsOptions: {
        color: "#000",
        type: "extra-rounded"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
      },
      cornersSquareOptions: {type: "extra-rounded"},
      cornersDotOptions: {
        type: "dot"
      }
    });
    const downloadQRCodeWrapper = this.shadowRoot?.getElementById(
      "daffi-wallet-download-qr-code-wrapper"
    );

    if (downloadQRCodeWrapper) {
      downloadQRCode.append(downloadQRCodeWrapper);
    }
  }
}
