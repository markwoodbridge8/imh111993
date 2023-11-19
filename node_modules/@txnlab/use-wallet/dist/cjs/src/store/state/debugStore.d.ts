type DebugStore = {
    debug: boolean;
    setDebug: (debug: boolean) => void;
};
export declare const useDebugStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DebugStore>>;
export {};
