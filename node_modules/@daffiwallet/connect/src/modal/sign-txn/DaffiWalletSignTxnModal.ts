import {
  DAFFI_WALLET_MODAL_CLASS,
  DAFFI_WALLET_SIGN_TXN_MODAL_ID
} from "../daffiWalletConnectModalUtils";
import styles from "./_daffi-wallet-sign-txn-modal.scss";

const daffiWalletSignTxnModal = document.createElement("template");

daffiWalletSignTxnModal.innerHTML = `
  <div class="${DAFFI_WALLET_MODAL_CLASS} daffi-wallet-sign-txn-modal">
    <div class="daffi-wallet-modal__body">
      <daffi-wallet-modal-header modal-id="${DAFFI_WALLET_SIGN_TXN_MODAL_ID}"></daffi-wallet-modal-header/>

      <div class="daffi-wallet-sign-txn-modal__body__content" />
    </div>
  </div>
`;

export class DaffiWalletSignTxnModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(daffiWalletSignTxnModal.content.cloneNode(true), styleSheet);
    }
  }
}
