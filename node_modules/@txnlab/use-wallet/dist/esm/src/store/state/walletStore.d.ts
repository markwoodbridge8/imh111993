import type { Account } from '../../types';
import { PROVIDER_ID } from '../../constants';
export declare const walletStoreSelector: (state: WalletStore) => {
    accounts: Account[];
    activeAccount: Account | null | undefined;
    setActiveAccount: (account: Account) => void;
    clearActiveAccount: (id: PROVIDER_ID) => void;
    addAccounts: (accounts: Account[]) => void;
    removeAccounts: (providerId: PROVIDER_ID) => void;
};
export type WalletStore = {
    accounts: Account[];
    activeAccount: Account | null | undefined;
    setActiveAccount: (account: Account) => void;
    clearActiveAccount: (id: PROVIDER_ID) => void;
    addAccounts: (accounts: Account[]) => void;
    removeAccounts: (providerId: PROVIDER_ID) => void;
};
export declare const useWalletStore: import("zustand").UseBoundStore<Omit<Omit<Omit<import("zustand").StoreApi<WalletStore>, "setState"> & {
    setState(nextStateOrUpdater: WalletStore | Partial<WalletStore> | ((state: import("immer/dist/internal").WritableDraft<WalletStore>) => void), shouldReplace?: boolean | undefined): void;
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<WalletStore, WalletStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: WalletStore) => void) => () => void;
        onFinishHydration: (fn: (state: WalletStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<WalletStore, WalletStore>>;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(nextStateOrUpdater: WalletStore | Partial<WalletStore> | ((state: import("immer/dist/internal").WritableDraft<WalletStore>) => void), shouldReplace?: boolean | undefined, action?: A | undefined): void;
}>;
export declare const useHydratedWalletStore: import("zustand").UseBoundStore<Omit<Omit<Omit<import("zustand").StoreApi<WalletStore>, "setState"> & {
    setState(nextStateOrUpdater: WalletStore | Partial<WalletStore> | ((state: import("immer/dist/internal").WritableDraft<WalletStore>) => void), shouldReplace?: boolean | undefined): void;
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<WalletStore, WalletStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: WalletStore) => void) => () => void;
        onFinishHydration: (fn: (state: WalletStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<WalletStore, WalletStore>>;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(nextStateOrUpdater: WalletStore | Partial<WalletStore> | ((state: import("immer/dist/internal").WritableDraft<WalletStore>) => void), shouldReplace?: boolean | undefined, action?: A | undefined): void;
}>;
