import type algosdk from 'algosdk';
import type { Network } from '../../types/node';
import type { Metadata } from '../../types/wallet';
export type KmdOptions = {
    wallet: string;
    password: string;
    host: string;
    token: string;
    port: string;
};
export interface ListWalletResponse {
    id: string;
    name: string;
    driver_name?: string;
    driver_version?: number;
    mnemonic_ux?: boolean;
    supported_txs?: Array<any>;
}
export interface InitWalletHandle {
    wallet_handle_token: string;
    message?: string;
    error?: boolean;
}
export type KMDWalletClientConstructor = {
    metadata: Metadata;
    client: algosdk.Kmd;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    wallet: string;
    password: string;
    network: Network;
};
