'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            }
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable')
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a setter')
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot write private member to an object whose class did not declare it')
    return (
      kind === 'a' ? f.call(receiver, value) : f ? (f.value = value) : state.set(receiver, value),
      value
    )
  }
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter')
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      )
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver)
  }
var _AccountAbstraction_ethAdapter, _AccountAbstraction_initializeProtocolKit
Object.defineProperty(exports, '__esModule', { value: true })
const protocol_kit_1 = __importStar(require('@safe-global/protocol-kit'))
/**
 * @class
 * This class helps to abstract the Account Abstraction logic required to interact with the Safe contracts using our Kits
 */
class AccountAbstraction {
  /**
   * @constructor
   * @param ethAdapter The EthAdapter instance to be used by the Account Abstraction (e.g. EthersAdapter)
   */
  constructor(ethAdapter) {
    _AccountAbstraction_ethAdapter.set(this, void 0)
    _AccountAbstraction_initializeProtocolKit.set(
      this,
      async () => {
        const signer = await __classPrivateFieldGet(
          this,
          _AccountAbstraction_ethAdapter,
          'f'
        ).getSignerAddress()
        if (!signer) {
          throw new Error("There's no signer in the provided EthAdapter")
        }
        const owners = [signer]
        const threshold = 1
        const safeAccountConfig = {
          owners,
          threshold
        }
        const safeAddress = await (0, protocol_kit_1.predictSafeAddress)({
          ethAdapter: __classPrivateFieldGet(this, _AccountAbstraction_ethAdapter, 'f'),
          safeAccountConfig
        })
        const isSafeDeployed = await __classPrivateFieldGet(
          this,
          _AccountAbstraction_ethAdapter,
          'f'
        ).isContractDeployed(safeAddress)
        if (isSafeDeployed) {
          this.protocolKit = await protocol_kit_1.default.create({
            ethAdapter: __classPrivateFieldGet(this, _AccountAbstraction_ethAdapter, 'f'),
            safeAddress
          })
        } else {
          this.protocolKit = await protocol_kit_1.default.create({
            ethAdapter: __classPrivateFieldGet(this, _AccountAbstraction_ethAdapter, 'f'),
            predictedSafe: { safeAccountConfig }
          })
        }
      }
      /**
       * Initialize the AccountAbstraction instance with the safe address or the predicted safe address
       * The current implementation only works for a single owner Safe with threshold 1. This will be improved in the future
       */
    )
    __classPrivateFieldSet(this, _AccountAbstraction_ethAdapter, ethAdapter, 'f')
  }
  /**
   * Initialize the AccountAbstraction instance with the safe address or the predicted safe address
   * The current implementation only works for a single owner Safe with threshold 1. This will be improved in the future
   */
  async init() {
    await __classPrivateFieldGet(this, _AccountAbstraction_initializeProtocolKit, 'f').call(this)
  }
  /**
   * Use this method to set the Relay Pack instance to be used by the AccountAbstraction instance
   * It's mandatory to set the instance before using the relayTransaction() method
   * @param relayPack The RelayPack instance to be used by the AccountAbstraction instance (e.g. GelatoRelayPack)
   */
  setRelayKit(relayPack) {
    this.relayKit = relayPack
  }
  /**
   * Use this method to relay a transaction using the Relay Pack instance set in the AccountAbstraction instance
   * @param transactions The list of transactions to be relayed
   * @param options The transaction options
   * @returns The result of the relay transaction execution (e.g. taskId in the case of Gelato)
   */
  async relayTransaction(transactions, options) {
    if (!this.protocolKit) {
      throw new Error('protocolKit not initialized. Call init() first')
    }
    if (!this.relayKit) {
      throw new Error('relayKit not initialized. Call setRelayKit(pack) first')
    }
    const relayedTransaction = await this.relayKit.createRelayedTransaction({
      transactions,
      options
    })
    const signedSafeTransaction = await this.protocolKit.signTransaction(relayedTransaction)
    return await this.relayKit.executeRelayTransaction(signedSafeTransaction, options)
  }
}
;(_AccountAbstraction_ethAdapter = new WeakMap()),
  (_AccountAbstraction_initializeProtocolKit = new WeakMap())
exports.default = AccountAbstraction
//# sourceMappingURL=AccountAbstraction.js.map
