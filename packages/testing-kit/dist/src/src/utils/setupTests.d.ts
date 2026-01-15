import { GetContractReturnType, Abi, WalletClient } from 'viem'
import { Account } from './setupTestNetwork'
import { ContractNetworksConfig } from './setupContractNetworks'
import { SafeVersion } from '@safe-global/types-kit'
type SetupTestsOptions = {
  safeConfig?: {
    numberOfOwners: number
    threshold?: number
  }
  predictedSafeConfig?: {
    numberOfOwners: number
    threshold?: number
  }
}
type SetupTestsReturnType = {
  safe: GetContractReturnType<Abi, WalletClient>
  accounts: Account[]
  contractNetworks: ContractNetworksConfig
  chainId: bigint
  predictedSafe: PredictedSafeProps
}
type SafeAccountConfig = {
  owners: string[]
  threshold: number
}
type SafeDeploymentConfig = {
  safeVersion?: SafeVersion
}
type PredictedSafeProps = {
  safeAccountConfig: SafeAccountConfig
  safeDeploymentConfig?: SafeDeploymentConfig
}
export declare const setupTests: (options?: SetupTestsOptions) => Promise<SetupTestsReturnType>
export {}
//# sourceMappingURL=setupTests.d.ts.map
