import {DaffiWalletModalHeader} from "./modal/header/DaffiWalletModalHeader";
import {DaffiWalletDownloadQRCode} from "./modal/mode/desktop/download-qr-code/DaffiWalletDownloadQRCode";
import {DaffiWalletModalDesktopMode} from "./modal/mode/desktop/DaffiWalletConnectModalDesktopMode";
import {DaffiWalletModalTouchScreenMode} from "./modal/mode/touch-screen/DaffiWalletModalTouchScreenMode";
import {DaffiWalletConnectModal} from "./modal/DaffiWalletConnectModal";
import {DaffiWalletRedirectModal} from "./modal/redirect/DaffiWalletRedirectModal";
import {DaffiWalletConnectModalInformationSection} from "./modal/section/information/DaffiWalletConnectModalInformationSection";
import {DaffiWalletConnectModalPendingMessageSection} from "./modal/section/pending-message/DaffiWalletConnectModalPendingMessage";
import {DaffiWalletSignTxnToast} from "./modal/sign-toast/DaffiWalletSignTxnToast";
import {DaffiWalletSignTxnModal} from "./modal/sign-txn/DaffiWalletSignTxnModal";

import "./util/screen/setDynamicVhValue";

window.customElements.define("daffi-wallet-connect-modal", DaffiWalletConnectModal);
window.customElements.define(
  "daffi-wallet-modal-desktop-mode",
  DaffiWalletModalDesktopMode
);
window.customElements.define("daffi-wallet-modal-header", DaffiWalletModalHeader);
window.customElements.define(
  "daffi-wallet-modal-touch-screen-mode",
  DaffiWalletModalTouchScreenMode
);
window.customElements.define("daffi-wallet-redirect-modal", DaffiWalletRedirectModal);
window.customElements.define(
  "daffi-wallet-connect-modal-information-section",
  DaffiWalletConnectModalInformationSection
);
window.customElements.define(
  "daffi-wallet-connect-modal-pending-message-section",
  DaffiWalletConnectModalPendingMessageSection
);
window.customElements.define("daffi-wallet-sign-txn-toast", DaffiWalletSignTxnToast);
window.customElements.define("daffi-wallet-sign-txn-modal", DaffiWalletSignTxnModal);
window.customElements.define("daffi-wallet-download-qr-code", DaffiWalletDownloadQRCode);
