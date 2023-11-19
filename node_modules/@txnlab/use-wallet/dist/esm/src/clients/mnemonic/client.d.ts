import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import type { TransactionsArray } from '../../types/api';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { MnemonicWalletClientConstructor } from './types';
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
export default MnemonicWalletClient;
