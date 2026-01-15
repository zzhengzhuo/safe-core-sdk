import { WalletClient, Chain, Transport, Account as ViemAccount } from 'viem'
export interface Account {
  signer: WalletClient<Transport, Chain, ViemAccount>
  address: string
}
export declare function getAccounts(): Promise<Account[]>
//# sourceMappingURL=setupTestNetwork.d.ts.map
