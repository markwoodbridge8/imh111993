import type algosdk from 'algosdk';
import { TransactionsArray, Provider } from '../types';
import { PROVIDER_ID } from '../constants';
export default function useWallet(): {
    clients: Partial<Record<PROVIDER_ID, import("../clients/base/base").default | null>> | null;
    providers: Provider[] | null;
    connectedAccounts: import("../types").Account[];
    connectedActiveAccounts: import("../types").Account[];
    activeAccount: import("../types").Account | null | undefined;
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
            txn: import("../types").Txn;
        };
        txId: string;
        id: string;
    }>;
    getAddress: () => string | undefined;
    groupTransactionsBySender: (transactions: TransactionsArray) => Record<string, import("../types").TxnInfo[]>;
    getAccountInfo: () => Promise<import("../types").AccountInfo>;
    getAssets: () => Promise<import("../types").Asset[]>;
};
