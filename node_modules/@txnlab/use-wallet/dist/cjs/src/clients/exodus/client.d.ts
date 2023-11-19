import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { ExodusClientConstructor, ExodusOptions } from './types';
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
export default ExodusClient;
