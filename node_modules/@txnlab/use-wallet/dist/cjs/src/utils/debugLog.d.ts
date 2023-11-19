import { ProviderConfig, ProviderConfigMapping } from '../types';
export declare const debugLog: (...args: any[]) => void;
export declare const getProviderList: <T extends keyof ProviderConfigMapping>(providers: (T | ProviderConfig<T>)[]) => string;
