import type _algosdk from 'algosdk';
import type { AlgodClientOptions } from '../types';
export declare const getAlgosdk: () => Promise<typeof _algosdk>;
export declare const getAlgodClient: (algosdk: typeof _algosdk, algodClientOptions?: AlgodClientOptions) => _algosdk.Algodv2;
export default class Algod {
    algosdk: typeof _algosdk;
    algodClient: _algosdk.Algodv2;
    constructor(algosdk: typeof _algosdk, algodClient: _algosdk.Algodv2);
    static init(algodOptions?: AlgodClientOptions): Promise<Algod>;
}
