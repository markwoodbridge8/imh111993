import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import { useWalletStore } from '../../store';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { AlgoSignerClientConstructor } from './types';
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
export default AlgoSignerClient;
