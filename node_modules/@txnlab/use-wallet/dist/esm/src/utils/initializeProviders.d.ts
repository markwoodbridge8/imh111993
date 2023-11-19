import type algosdk from 'algosdk';
import { NodeConfig, ProviderConfig, ProviderConfigMapping, SupportedProviders } from '../types';
export declare const initializeProviders: <T extends keyof ProviderConfigMapping>(providers: (T | ProviderConfig<T>)[], nodeConfig?: NodeConfig, algosdkStatic?: typeof algosdk) => Promise<SupportedProviders>;
