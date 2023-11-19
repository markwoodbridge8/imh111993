import type algosdk from 'algosdk';
import type { Network } from '../../types/node';
import type { Metadata } from '../../types/wallet';
export type WindowExtended = {
    algorand: AlgoSigner;
} & Window & typeof globalThis;
export type GenesisId = 'betanet-v1.0' | 'testnet-v1.0' | 'mainnet-v1.0' | string;
export type EnableParams = {
    genesisID?: GenesisId;
    genesisHash?: string;
    accounts?: string[];
};
export type EnableResponse = {
    genesisID: GenesisId;
    genesisHash: string;
    accounts: string[];
};
export type AlgoSignerTransaction = {
    txn: string;
    signers?: string[];
    stxn?: string;
    multisig?: string;
    authAddr?: string;
};
export type AlgoSigner = {
    enable: (params?: EnableParams) => Promise<EnableResponse>;
    signTxns: (transactions: AlgoSignerTransaction[]) => Promise<string[]>;
    encoding: {
        msgpackToBase64(transaction: Uint8Array): string;
        byteArrayToString(transaction: Uint8Array): string;
    };
};
export type AlgoSignerClientConstructor = {
    metadata: Metadata;
    client: AlgoSigner;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
};
