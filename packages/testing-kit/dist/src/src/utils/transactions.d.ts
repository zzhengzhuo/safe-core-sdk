import { Hex, WalletClient, Transport, Chain, Account } from 'viem'
export declare function waitTransactionReceipt(
  hash: Hex
): Promise<import('viem').TransactionReceipt>
export declare function getDeployer(): Promise<WalletClient<Transport, Chain, Account>>
//# sourceMappingURL=transactions.d.ts.map
