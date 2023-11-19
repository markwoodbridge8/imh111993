## @daffiwallet/connect

JavaScript SDK for integrating [Daffi Wallet](https://web.daffiwallet.app/) to web applications.

[![](https://img.shields.io/npm/v/@daffiwallet/connect?style=flat-square)](https://www.npmjs.com/package/@daffiwallet/connect) [![](https://img.shields.io/bundlephobia/min/@daffiwallet/connect?style=flat-square)](https://www.npmjs.com/package/@daffiwallet/connect)

## Getting Started

[Learn how to integrate with your JavaScript application](#guide)

[Learn how to Sign Transactions](#sign-transaction)

[Try it out using CodeSandbox](#example-applications)

## Quick Start

Let's start with installing `@daffiwallet/connect`

```
npm install --save @daffiwallet/connect
```

```jsx
// Connect handler
daffiWallet
  .connect()
  .then((newAccounts) => {
    // Setup the disconnect event listener
    daffiWallet.connector?.on("disconnect", handleDisconnectWalletClick);

    setAccountAddress(newAccounts[0]);
  })
  .reject((error) => {
    // You MUST handle the reject because once the user closes the modal, daffiWallet.connect() promise will be rejected.
    // For the async/await syntax you MUST use try/catch
    if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
      // log the necessary errors
    }
  });
```

If you don't want the user's account information to be lost by the dApp when the user closes the browser with user’s wallet connected to the dApp, you need to handle the reconnect session status. You can do this in the following way.

```jsx
// On the every page refresh
daffiWallet.reconnectSession().then((accounts) => {
  // Setup the disconnect event listener
  daffiWallet.connector?.on("disconnect", handleDisconnectWalletClick);

  if (accounts.length) {
    setAccountAddress(accounts[0]);
  }
});
```

After that you can sign transaction with this way

```jsx
// Single Transaction
try {
  const signedTxn = await daffiWallet.signTransaction([singleTxnGroups]);
} catch (error) {
  console.log("Couldn't sign Opt-in txns", error);
}
```

## Options

| option                   | default | value                                 |          |
| ------------------------ | ------- | ------------------------------------- | -------- |
| `chainId`                | `4160`  | `416001`, `416002`, `416003` , `4160` | optional |
| `shouldShowSignTxnToast` | `true`  | `boolean`                             | optional |

#### **`chainId`**

Determines which Algorand network your dApp uses.

**MainNet**: 416001

**TestNet**: 416002

**BetaNet**: 416003

**All Networks**: 4160

#### **`shouldShowSignTxnToast`**

It's enabled by default but in some cases, you may not need the toast message (e.g. you already have signing guidance for users). To disable it, use the shouldShowSignTxnToast option:

## Methods

#### `DaffiWalletConnect.connect(): Promise<string[]>`

Starts the initial connection flow and returns the array of account addresses.

#### `DaffiWalletConnect.reconnectSession(): Promise<string[]>`

Reconnects to the wallet if there is any active connection and returns the array of account addresses.

#### `DaffiWalletConnect.disconnect(): Promise<void | undefined>`

Disconnects from the wallet and resets the related storage items.

#### `DaffiWalletConnect.platform: DaffiWalletPlatformType`

Returns the platform of the active session. Possible responses: _`mobile | web | null`_

#### `DaffiWalletConnect.isConnected: boolean`

Checks if there's any active session regardless of platform. Possible responses: _`true | false`_

#### `DaffiWalletConnect.signTransaction(txGroups: SignerTransaction[][], signerAddress?: string): Promise<Uint8Array[]>`

Starts the sign process and returns the signed transaction in `Uint8Array`

## Customizing Style

You can override the z-index using the `.daffi-wallet-modal` class so that the modal does not conflict with another component on your application.

```scss
.daffi-wallet-modal {
  // The default value of z-index is 10. You can lower and raise it as much as you want.
  z-index: 11;
}
```

## Your app name on Daffi Wallet

By default, the connect wallet drawer on Daffi Wallet gets the app name from `document.title`.

In some cases, you may want to customize it. You can achieve this by adding a meta tag to your HTML between the `head` tag.

```html
<meta name="name" content="My dApp" />
```

## Contributing

All contributions are welcomed! To get more information about the details, please read the [contribution](./CONTRIBUTING.md) guide first.
