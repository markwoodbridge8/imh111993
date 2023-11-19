import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { Account, Wallet } from '../../types/wallet';
import type { KMDWalletClientConstructor } from './types';
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
export default KMDWalletClient;
