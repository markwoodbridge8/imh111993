import type algosdk from 'algosdk';
import type { NodeConfig, ProvidersArray } from '../types/providers';
interface InitializeProvidersOptions {
    providers: ProvidersArray;
    nodeConfig?: NodeConfig;
    algosdkStatic?: typeof algosdk;
    debug?: boolean;
}
export default function useInitializeProviders({ providers, nodeConfig, algosdkStatic, debug }: InitializeProvidersOptions): Partial<Record<import("..").PROVIDER_ID, import("../clients/base/base").default | null>> | null;
export {};
