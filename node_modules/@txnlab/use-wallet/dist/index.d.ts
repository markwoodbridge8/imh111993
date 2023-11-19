import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { WalletConnectModalSignOptions, WalletConnectModalSign } from '@walletconnect/modal-sign-html';
import * as react from 'react';
import * as zustand_middleware from 'zustand/middleware';
import * as immer_dist_internal from 'immer/dist/internal';
import * as zustand from 'zustand';

type PublicNetwork = 'betanet' | 'testnet' | 'mainnet';
type Network = PublicNetwork | string;
type Txn = {
    apaa: Uint8Array;
    apas: number[];
    apid: number;
    fee: number;
    fv: number;
    gen: string;
    gh: Uint8Array;
    grp: Uint8Array;
    lv: number;
    snd: Uint8Array;
    type: string;
};
type ConfirmedTxn = {
    'confirmed-round': number;
    'global-state-delta': Record<string, unknown>[];
    'pool-error': string;
    txn: {
        sig: Uint8Array;
        txn: Txn;
    };
};
type TxnType = 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf';
type DecodedTransaction = {
    amt: number;
    fee: number;
    fv: number;
    gen: string;
    gh: Uint8Array;
    grp: Uint8Array;
    lv: number;
    note: Uint8Array;
    rcv: Uint8Array;
    snd: Uint8Array;
    type: TxnType;
};
type DecodedSignedTransaction = {
    sig: Uint8Array;
    txn: DecodedTransaction;
};
type AlgodClientOptions = ConstructorParameters<typeof algosdk.Algodv2>;

type TransactionsArray = ['u' | 's', string][];
type TxnInfo = {
    groupIndex: number;
    amount: number;
    from: string;
    to: string;
    type: TxnType;
    txn: string;
    signedTxn?: Uint8Array;
};
type RawTxnResponse = {
    txId: string;
};

declare enum PROVIDER_ID {
    KMD = "kmd",
    PERA = "pera",
    DAFFI = "daffi",
    MYALGO = "myalgo",
    ALGOSIGNER = "algosigner",
    DEFLY = "defly",
    EXODUS = "exodus",
    WALLETCONNECT = "walletconnect",
    MNEMONIC = "mnemonic"
}
declare const DEFAULT_NETWORK: Network;
declare const DEFAULT_NODE_BASEURL = "https://mainnet-api.algonode.cloud";
declare const DEFAULT_NODE_TOKEN = "";
declare const DEFAULT_NODE_PORT = "";

interface Account {
    providerId: PROVIDER_ID;
    name: string;
    address: string;
    authAddr?: string;
}
type Provider = {
    accounts: Account[];
    isActive: boolean;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    reconnect: () => Promise<void>;
    setActiveProvider: () => void;
    setActiveAccount: (account: string) => void;
    metadata: Metadata;
};
type Asset = {
    amount: number;
    'asset-id': number;
    creator: string;
    'is-frozen': boolean;
    'unit-name': string;
    name: string;
};
type AccountInfo = {
    address: string;
    amount: number;
    'min-balance': number;
    'auth-addr'?: string;
    assets?: Asset[];
};
type WalletProvider = {
    id: PROVIDER_ID;
    name: string;
    icon: string;
    isWalletConnect: boolean;
};
type ExtendValues<Type> = {
    [Property in keyof Type]: Type[Property] | null;
};
type Wallet = ExtendValues<WalletProvider> & {
    accounts: Account[];
};
type Metadata = {
    id: PROVIDER_ID;
    name: string;
    icon: string;
    isWalletConnect: boolean;
};
type ClientOptions = Record<string, any>;

type PeraWalletConnectOptions = {
    bridge?: string;
    shouldShowSignTxnToast?: boolean;
    chainId?: 416001 | 416002 | 416003 | 4160;
};
type PeraWalletClientConstructor = {
    metadata: Metadata;
    client: PeraWalletConnect;
    clientOptions?: PeraWalletConnectOptions;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};

type DeflyWalletConnectOptions = {
    bridge?: string;
    deep_link?: string;
    app_meta?: {
        logo: string;
        name: string;
        main_color: string;
    };
    shouldShowSignTxnToast?: boolean;
};
type DeflyWalletClientConstructor = {
    metadata: Metadata;
    client: DeflyWalletConnect;
    clientOptions?: DeflyWalletConnectOptions;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};

type ExodusOptions = {
    onlyIfTrusted: boolean;
};
type Bytes = Readonly<Uint8Array>;
type Exodus = {
    isConnected: boolean;
    address: string | null;
    connect: ({ onlyIfTrusted }: {
        onlyIfTrusted: boolean;
    }) => Promise<{
        address: string;
    }>;
    disconnect: () => void;
    signAndSendTransaction(transactions: Bytes[]): Promise<{
        txId: string;
    }>;
    signTransaction(transactions: Bytes[]): Promise<Bytes[]>;
};
type ExodusClientConstructor = {
    metadata: Metadata;
    client: Exodus;
    clientOptions: ExodusOptions;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};

type KmdOptions = {
    wallet: string;
    password: string;
    host: string;
    token: string;
    port: string;
};
type KMDWalletClientConstructor = {
    metadata: Metadata;
    client: algosdk.Kmd;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    wallet: string;
    password: string;
    network: Network;
};

/**
 * Helpful resources:
 * https://github.com/randlabs/myalgo-connect
 */

type MyAlgoConnectOptions = {
    disableLedgerNano: boolean;
};
type MyAlgoWalletClientConstructor = {
    metadata: Metadata;
    client: MyAlgoConnect;
    clientOptions?: MyAlgoConnectOptions;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};

type DaffiWalletConnectOptions = {
    bridge?: string;
    shouldShowSignTxnToast?: boolean;
    chainId?: 416001 | 416002 | 416003 | 4160;
};

type NonEmptyArray<T> = [T, ...T[]];

declare abstract class BaseClient {
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    clientOptions?: ClientOptions;
    keepWCAlive: HTMLAudioElement;
    metadata: Metadata;
    static metadata: Metadata;
    abstract connect(onDisconnect: () => void): Promise<Wallet>;
    abstract disconnect(): Promise<void>;
    abstract reconnect(onDisconnect: () => void): Promise<Wallet | null>;
    abstract signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
    protected constructor(metadata: Metadata, algosdk: typeof algosdk, algodClient: algosdk.Algodv2, clientOptions?: ClientOptions);
    healthCheck(): Promise<{}>;
    getAccountInfo(address: string): Promise<AccountInfo>;
    getAssets(address: string): Promise<Asset[]>;
    waitForConfirmation(txId: string, timeout?: number): Promise<{
        'confirmed-round': number;
        'global-state-delta': Record<string, unknown>[];
        'pool-error': string;
        txn: {
            sig: Uint8Array;
            txn: Txn;
        };
        txId: string;
    }>;
    decodeTransaction: (txn: string, isSigned: boolean) => algosdk.Transaction;
    logEncodedTransaction(txn: string, isSigned: boolean): void;
    groupTransactionsBySender(transactions: TransactionsArray): Record<string, TxnInfo[]>;
    sendRawTransactions(transactions: Uint8Array[], waitRoundsToConfirm?: number): Promise<{
        'confirmed-round': number;
        'global-state-delta': Record<string, unknown>[];
        'pool-error': string;
        txn: {
            sig: Uint8Array;
            txn: Txn;
        };
        txId: string;
        id: string;
    }>;
    keepWCAliveStart(): Promise<void>;
    keepWCAliveStop(): void;
}

type ProviderConfigMapping = {
    [PROVIDER_ID.PERA]: {
        clientOptions?: PeraWalletConnectOptions;
        clientStatic?: typeof PeraWalletConnect;
    };
    [PROVIDER_ID.DAFFI]: {
        clientOptions?: DaffiWalletConnectOptions;
        clientStatic?: typeof DaffiWalletConnect;
    };
    [PROVIDER_ID.DEFLY]: {
        clientOptions?: DeflyWalletConnectOptions;
        clientStatic?: typeof DeflyWalletConnect;
    };
    [PROVIDER_ID.WALLETCONNECT]: {
        clientOptions?: WalletConnectModalSignOptions;
        clientStatic?: typeof WalletConnectModalSign;
    };
    [PROVIDER_ID.MYALGO]: {
        clientOptions?: MyAlgoConnectOptions;
        clientStatic?: typeof MyAlgoConnect;
    };
    [PROVIDER_ID.EXODUS]: {
        clientOptions?: ExodusOptions;
        clientStatic?: undefined;
    };
    [PROVIDER_ID.KMD]: {
        clientOptions?: KmdOptions;
        clientStatic?: undefined;
    };
    [PROVIDER_ID.ALGOSIGNER]: {
        clientOptions?: undefined;
        clientStatic?: undefined;
    };
    [PROVIDER_ID.MNEMONIC]: {
        clientOptions?: undefined;
        clientStatic?: undefined;
    };
};
/**
 * Enforces correct configuration given for each provider. For example,
 * if `id` is `PROVIDER_ID.PERA`, then `clientOptions` must be of type
 * `PeraWalletConnectOptions`.
 *
 * @todo install `tsd` to test TypeScript type definitions in CI
 */
type ProviderConfig<T extends keyof ProviderConfigMapping> = {
    [K in T]: {
        id: K;
    } & ProviderConfigMapping[K];
}[T];
type CommonInitParams = {
    network?: Network;
    algodOptions?: AlgodClientOptions;
    algosdkStatic?: typeof algosdk;
};
type InitParams<T extends keyof ProviderConfigMapping> = CommonInitParams & ProviderConfigMapping[T];
type NodeConfig = {
    network: Network;
    nodeServer: string;
    nodeToken?: string | algosdk.AlgodTokenHeader | algosdk.CustomTokenHeader | algosdk.BaseHTTPClient;
    nodePort?: string | number;
    nodeHeaders?: Record<string, string>;
};
type ProviderDef = (ProviderConfig<PROVIDER_ID.PERA> & {
    clientStatic: typeof PeraWalletConnect;
}) | (ProviderConfig<PROVIDER_ID.DEFLY> & {
    clientStatic: typeof DeflyWalletConnect;
}) | (ProviderConfig<PROVIDER_ID.DAFFI> & {
    clientStatic: typeof DaffiWalletConnect;
}) | (ProviderConfig<PROVIDER_ID.WALLETCONNECT> & {
    clientStatic: typeof WalletConnectModalSign;
    clientOptions: WalletConnectModalSignOptions;
}) | (ProviderConfig<PROVIDER_ID.MYALGO> & {
    clientStatic: typeof MyAlgoConnect;
}) | ProviderConfig<PROVIDER_ID.EXODUS> | ProviderConfig<PROVIDER_ID.KMD> | PROVIDER_ID.EXODUS | PROVIDER_ID.KMD | PROVIDER_ID.ALGOSIGNER | PROVIDER_ID.MNEMONIC;
type ProvidersArray = NonEmptyArray<ProviderDef>;
type WalletClient = BaseClient;
type SupportedProviders = Partial<Record<PROVIDER_ID, WalletClient | null>>;

declare const reconnectProviders: (providers: SupportedProviders) => Promise<void>;

type NFDTransactionsArray = ['u' | 's', string][];
declare function encodeNFDTransactionsArray(transactionsArray: NFDTransactionsArray): Uint8Array[];

type WalletStore = {
    accounts: Account[];
    activeAccount: Account | null | undefined;
    setActiveAccount: (account: Account) => void;
    clearActiveAccount: (id: PROVIDER_ID) => void;
    addAccounts: (accounts: Account[]) => void;
    removeAccounts: (providerId: PROVIDER_ID) => void;
};
declare const useWalletStore: zustand.UseBoundStore<Omit<Omit<Omit<zustand.StoreApi<WalletStore>, "setState"> & {
    setState(nextStateOrUpdater: WalletStore | Partial<WalletStore> | ((state: immer_dist_internal.WritableDraft<WalletStore>) => void), shouldReplace?: boolean | undefined): void;
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<zustand_middleware.PersistOptions<WalletStore, WalletStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: WalletStore) => void) => () => void;
        onFinishHydration: (fn: (state: WalletStore) => void) => () => void;
        getOptions: () => Partial<zustand_middleware.PersistOptions<WalletStore, WalletStore>>;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(nextStateOrUpdater: WalletStore | Partial<WalletStore> | ((state: immer_dist_internal.WritableDraft<WalletStore>) => void), shouldReplace?: boolean | undefined, action?: A | undefined): void;
}>;

declare const _default: react.Provider<Partial<Record<PROVIDER_ID, BaseClient | null>> | null>;

declare class PeraWalletClient extends BaseClient {
    #private;
    clientOptions?: PeraWalletConnectOptions;
    network: Network;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network }: PeraWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.PERA>): Promise<BaseClient | null>;
    connect(onDisconnect: () => void): Promise<Wallet>;
    reconnect(onDisconnect: () => void): Promise<{
        accounts: {
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    } | null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}

declare class MyAlgoWalletClient extends BaseClient {
    #private;
    clientOptions?: MyAlgoConnectOptions;
    network: Network;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network }: MyAlgoWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.MYALGO>): Promise<BaseClient | null>;
    connect(): Promise<{
        accounts: {
            providerId: PROVIDER_ID;
            address: string;
            name: string;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    }>;
    reconnect(): Promise<null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], transactions: Uint8Array[], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}

declare class DeflyWalletClient extends BaseClient {
    #private;
    clientOptions?: DeflyWalletConnectOptions;
    network: Network;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network }: DeflyWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.DEFLY>): Promise<BaseClient | null>;
    connect(onDisconnect: () => void): Promise<Wallet>;
    reconnect(onDisconnect: () => void): Promise<{
        accounts: {
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    } | null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}

declare class ExodusClient extends BaseClient {
    #private;
    clientOptions: ExodusOptions;
    network: Network;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network }: ExodusClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, algosdkStatic, network }: InitParams<PROVIDER_ID.EXODUS>): Promise<BaseClient | null>;
    connect(): Promise<{
        accounts: {
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    }>;
    reconnect(onDisconnect: () => void): Promise<null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}

type GenesisId = 'betanet-v1.0' | 'testnet-v1.0' | 'mainnet-v1.0' | string;
type EnableParams = {
    genesisID?: GenesisId;
    genesisHash?: string;
    accounts?: string[];
};
type EnableResponse = {
    genesisID: GenesisId;
    genesisHash: string;
    accounts: string[];
};
type AlgoSignerTransaction = {
    txn: string;
    signers?: string[];
    stxn?: string;
    multisig?: string;
    authAddr?: string;
};
type AlgoSigner = {
    enable: (params?: EnableParams) => Promise<EnableResponse>;
    signTxns: (transactions: AlgoSignerTransaction[]) => Promise<string[]>;
    encoding: {
        msgpackToBase64(transaction: Uint8Array): string;
        byteArrayToString(transaction: Uint8Array): string;
    };
};
type AlgoSignerClientConstructor = {
    metadata: Metadata;
    client: AlgoSigner;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};

declare class AlgoSignerClient extends BaseClient {
    #private;
    network: Network;
    walletStore: typeof useWalletStore;
    constructor({ metadata, client, algosdk, algodClient, network }: AlgoSignerClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ algodOptions, algosdkStatic, network }: InitParams<PROVIDER_ID.ALGOSIGNER>): Promise<BaseClient | null>;
    connect(): Promise<{
        accounts: {
            authAddr?: string | undefined;
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    }>;
    reconnect(onDisconnect: () => void): Promise<null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], transactions: Uint8Array[], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
    getGenesisID(): string;
    getAuthAddress(address: string): string | undefined;
}

type WalletConnectClientConstructor = {
    metadata: Metadata;
    client: WalletConnectModalSign;
    clientOptions: WalletConnectModalSignOptions;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
    chain: string;
};

declare class WalletConnectClient extends BaseClient {
    #private;
    clientOptions?: WalletConnectModalSignOptions;
    network: Network;
    chain: string;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network, chain }: WalletConnectClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.WALLETCONNECT>): Promise<BaseClient | null>;
    connect(): Promise<Wallet>;
    reconnect(): Promise<{
        accounts: {
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    } | null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}

declare class KMDWalletClient extends BaseClient {
    #private;
    walletId: string;
    network: Network;
    constructor({ metadata, client, wallet, password, algosdk, algodClient, network }: KMDWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, algosdkStatic, network }: InitParams<PROVIDER_ID.KMD>): Promise<BaseClient | null>;
    connect(): Promise<Wallet>;
    disconnect(): Promise<void>;
    reconnect(): Promise<Wallet | null>;
    requestPassword(): string;
    getWalletToken(walletId: string, password: string): Promise<string>;
    releaseToken(token: string): Promise<void>;
    listWallets(): Promise<Record<string, string>>;
    listAccounts(wallet: string, password: string): Promise<Array<Account>>;
    getWalletId(): Promise<string>;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}

type MnemonicWalletClientConstructor = {
    metadata: Metadata;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};

declare class MnemonicWalletClient extends BaseClient {
    #private;
    network: Network;
    constructor({ metadata, algosdk, algodClient, network }: MnemonicWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ algodOptions, algosdkStatic, network }: InitParams<PROVIDER_ID.MNEMONIC>): Promise<BaseClient | null>;
    connect(): Promise<{
        accounts: {
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    }>;
    disconnect(): Promise<void>;
    reconnect(): Promise<null>;
    requestPassword(): string;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
    signEncodedTransactions(_transactions: TransactionsArray): Promise<Uint8Array[]>;
}

declare function useWallet(): {
    clients: Partial<Record<PROVIDER_ID, BaseClient | null>> | null;
    providers: Provider[] | null;
    connectedAccounts: Account[];
    connectedActiveAccounts: Account[];
    activeAccount: Account | null | undefined;
    activeAddress: string | undefined;
    status: string;
    isActive: boolean;
    isReady: boolean;
    signer: algosdk.TransactionSigner;
    signTransactions: (transactions: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean) => Promise<Uint8Array[]>;
    sendTransactions: (transactions: Uint8Array[], waitRoundsToConfirm?: number) => Promise<{
        'confirmed-round': number;
        'global-state-delta': Record<string, unknown>[];
        'pool-error': string;
        txn: {
            sig: Uint8Array;
            txn: Txn;
        };
        txId: string;
        id: string;
    }>;
    getAddress: () => string | undefined;
    groupTransactionsBySender: (transactions: TransactionsArray) => Record<string, TxnInfo[]>;
    getAccountInfo: () => Promise<AccountInfo>;
    getAssets: () => Promise<Asset[]>;
};

interface InitializeProvidersOptions {
    providers: ProvidersArray;
    nodeConfig?: NodeConfig;
    algosdkStatic?: typeof algosdk;
    debug?: boolean;
}
declare function useInitializeProviders({ providers, nodeConfig, algosdkStatic, debug }: InitializeProvidersOptions): Partial<Record<PROVIDER_ID, BaseClient | null>> | null;

export { Account, AccountInfo, AlgodClientOptions, Asset, ClientOptions, CommonInitParams, ConfirmedTxn, DEFAULT_NETWORK, DEFAULT_NODE_BASEURL, DEFAULT_NODE_PORT, DEFAULT_NODE_TOKEN, DecodedSignedTransaction, DecodedTransaction, InitParams, Metadata, Network, NodeConfig, PROVIDER_ID, Provider, ProviderConfig, ProviderConfigMapping, ProvidersArray, PublicNetwork, RawTxnResponse, SupportedProviders, TransactionsArray, Txn, TxnInfo, TxnType, Wallet, WalletClient, _default as WalletProvider, AlgoSignerClient as algosigner, DeflyWalletClient as defly, encodeNFDTransactionsArray, ExodusClient as exodus, KMDWalletClient as kmd, MnemonicWalletClient as mnemonic, MyAlgoWalletClient as myalgo, PeraWalletClient as pera, reconnectProviders, useInitializeProviders, useWallet, WalletConnectClient as walletconnect };
