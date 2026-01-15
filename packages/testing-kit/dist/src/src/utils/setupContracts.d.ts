import { GetContractReturnType, Abi, WalletClient } from 'viem'
export declare const getSafeSingleton: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getFactory: () => Promise<{
  contract: GetContractReturnType<Abi, WalletClient>
  abi: Abi
}>
export declare const getSafeTemplate: () => Promise<GetContractReturnType<Abi, WalletClient>>
export declare const getSafeWithOwners: (
  owners: string[],
  threshold?: number,
  fallbackHandler?: string
) => Promise<GetContractReturnType<Abi, WalletClient>>
export declare const getCompatibilityFallbackHandler: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getMultiSend: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getMultiSendCallOnly: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getSignMessageLib: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getCreateCall: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getSimulateTxAccessor: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getSafeWebAuthnSignerFactory: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getSafeWebAuthnSharedSigner: () => Promise<{
  contract: GetContractReturnType
  abi: Abi
}>
export declare const getWebAuthnContract: () => Promise<GetContractReturnType<Abi>>
export declare const getDailyLimitModule: () => Promise<GetContractReturnType<Abi>>
export declare const getSocialRecoveryModule: () => Promise<GetContractReturnType<Abi>>
export declare const getStateChannelModule: () => Promise<GetContractReturnType<Abi>>
export declare const getWhiteListModule: () => Promise<GetContractReturnType<Abi>>
export declare const getERC20Mintable: () => Promise<GetContractReturnType<Abi, WalletClient>>
export declare const getDebugTransactionGuard: () => Promise<GetContractReturnType<Abi>>
export declare const getDefaultCallbackHandler: () => Promise<GetContractReturnType<Abi>>
//# sourceMappingURL=setupContracts.d.ts.map
