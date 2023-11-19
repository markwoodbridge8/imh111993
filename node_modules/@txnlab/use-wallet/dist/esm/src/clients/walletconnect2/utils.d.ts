import { JsonRpcRequest } from './types';
export declare const formatJsonRpcRequest: <T = any>(method: string, params: T) => JsonRpcRequest;
