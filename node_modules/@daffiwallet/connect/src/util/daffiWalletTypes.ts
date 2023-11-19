type DaffiWalletType = "daffi-wallet" | "daffi-wallet-web";
type DaffiWalletPlatformType = "mobile" | "web" | null;

// eslint-disable-next-line no-magic-numbers
type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;

interface DaffiWalletDetails {
  type: DaffiWalletType;
  accounts: string[];
  selectedAccount: string;
}

export type {
  DaffiWalletType,
  DaffiWalletPlatformType,
  DaffiWalletDetails,
  AlgorandChainIDs
};
