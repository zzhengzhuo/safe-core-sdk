import Safe from '@safe-global/protocol-kit'
import { RelayKitBasePack } from '@safe-global/relay-kit'
import {
  MetaTransactionData,
  MetaTransactionOptions,
  EthAdapter
} from '@safe-global/safe-core-sdk-types'
/**
 * @class
 * This class helps to abstract the Account Abstraction logic required to interact with the Safe contracts using our Kits
 */
declare class AccountAbstraction {
  #private
  protocolKit: Safe
  relayKit?: RelayKitBasePack
  /**
   * @constructor
   * @param ethAdapter The EthAdapter instance to be used by the Account Abstraction (e.g. EthersAdapter)
   */
  constructor(ethAdapter: EthAdapter)
  /**
   * Initialize the AccountAbstraction instance with the safe address or the predicted safe address
   * The current implementation only works for a single owner Safe with threshold 1. This will be improved in the future
   */
  init(): Promise<void>
  /**
   * Use this method to set the Relay Pack instance to be used by the AccountAbstraction instance
   * It's mandatory to set the instance before using the relayTransaction() method
   * @param relayPack The RelayPack instance to be used by the AccountAbstraction instance (e.g. GelatoRelayPack)
   */
  setRelayKit(relayPack: RelayKitBasePack): void
  /**
   * Use this method to relay a transaction using the Relay Pack instance set in the AccountAbstraction instance
   * @param transactions The list of transactions to be relayed
   * @param options The transaction options
   * @returns The result of the relay transaction execution (e.g. taskId in the case of Gelato)
   */
  relayTransaction(
    transactions: MetaTransactionData[],
    options?: MetaTransactionOptions
  ): Promise<unknown>
}
export default AccountAbstraction
