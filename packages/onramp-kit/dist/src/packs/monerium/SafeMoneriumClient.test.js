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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const ethers_1 = require('ethers')
const protocol_kit_1 = __importStar(require('@safe-global/protocol-kit')),
  protocolKit = protocol_kit_1
const safe_core_sdk_types_1 = require('@safe-global/safe-core-sdk-types')
const api_kit_1 = __importDefault(require('@safe-global/api-kit'))
const SafeMoneriumClient_1 = require('./SafeMoneriumClient')
const signatures_1 = require('./signatures')
const newOrder = {
  amount: '100',
  counterpart: {
    identifier: {
      standard: 'iban',
      iban: 'iban'
    },
    details: {
      firstName: 'firstName',
      lastName: 'lastName'
    }
  },
  memo: 'memo'
}
jest.mock('@monerium/sdk')
jest.mock('@safe-global/protocol-kit')
jest.mock('@safe-global/api-kit')
describe('SafeMoneriumClient', () => {
  const safeSdk = new protocol_kit_1.default()
  let safeMoneriumClient
  beforeEach(() => {
    jest.clearAllMocks()
    safeSdk.getChainId = jest.fn().mockResolvedValue(5)
    safeSdk.getEthAdapter = jest.fn().mockReturnValue({
      call: jest.fn().mockImplementation(async () => signatures_1.MAGIC_VALUE),
      getSignerAddress: jest.fn().mockResolvedValue('0xSignerAddress')
    })
    safeSdk.getEthAdapter.call = jest.fn().mockImplementation(async () => signatures_1.MAGIC_VALUE)
    safeMoneriumClient = new SafeMoneriumClient_1.SafeMoneriumClient('sandbox', safeSdk)
  })
  it('should create a SafeMoneriumClient instance', () => {
    expect(safeMoneriumClient).toBeInstanceOf(SafeMoneriumClient_1.SafeMoneriumClient)
  })
  it('should allow to get the Safe address', async () => {
    safeSdk.getAddress = jest.fn(() => Promise.resolve('0xSafeAddress'))
    expect(await safeMoneriumClient.getSafeAddress()).toBe('0xSafeAddress')
  })
  it('should allow to send tokens from then Safe to any IBAN', async () => {
    safeSdk.getAddress = jest.fn(() => Promise.resolve('0xSafeAddress'))
    const placeOrderSpy = jest.spyOn(safeMoneriumClient, 'placeOrder')
    //@ts-expect-error - Not all values are mocked
    const signMessageSpy = jest.spyOn(safeMoneriumClient, 'signMessage').mockResolvedValueOnce({
      safe: '0xSafeAddress',
      to: '0xAddress',
      value: '0',
      operation: 1
    })
    await safeMoneriumClient.send({ ...newOrder })
    expect(placeOrderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...newOrder,
        address: '0xSafeAddress',
        chain: 'ethereum',
        message: expect.stringContaining('Send EUR 100 to iban at'),
        network: 'goerli',
        signature: '0x',
        supportingDocumentId: ''
      })
    )
    expect(signMessageSpy).toHaveBeenCalledWith(
      '0xSafeAddress',
      expect.stringContaining('Send EUR 100 to iban at')
    )
  })
  it('should throw if signing message fails', async () => {
    safeSdk.getAddress = jest.fn(() => Promise.resolve('0xSafeAddress'))
    const placeOrderSpy = jest.spyOn(safeMoneriumClient, 'placeOrder')
    const signMessageSpy = jest
      .spyOn(safeMoneriumClient, 'signMessage')
      .mockRejectedValueOnce(new Error('Failed to sign message'))
    await expect(safeMoneriumClient.send({ ...newOrder })).rejects.toThrow('Failed to sign message')
    expect(placeOrderSpy).toHaveBeenCalledTimes(1)
    expect(signMessageSpy).toHaveBeenCalledTimes(1)
  })
  it('should allow to check if a message is signed in the smart contract if the promise is fulfilled', async () => {
    const isMessageSigned = await safeMoneriumClient.isMessageSigned(
      '0xSafeAddress',
      'message to sign'
    )
    expect(isMessageSigned).toBe(true)
  })
  it('should allow to check if a message is NOT signed in the smart contract if the promise is fulfilled', async () => {
    // Promise fullfilled without signature
    safeSdk.getEthAdapter().call = jest.fn().mockImplementation(async () => '0x')
    const isMessageSigned = await safeMoneriumClient.isMessageSigned(
      '0xSafeAddress',
      'message to sign'
    )
    expect(isMessageSigned).toBe(false)
  })
  it('should allow to check if a message is signed in the smart contract and the promise is rejected', async () => {
    class EthersError extends Error {
      constructor(message, data) {
        super(message)
        this.data = data
      }
    }
    // promise is rejected with the signature
    safeSdk.getEthAdapter().call = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(
          new EthersError('execution reverted: "Hash not approved"', signatures_1.MAGIC_VALUE)
        )
      )
    const isMessageSigned = await safeMoneriumClient.isMessageSigned(
      '0xSafeAddress',
      'message to sign'
    )
    expect(isMessageSigned).toBe(true)
  })
  it('should allow to check if a message is NOT signed in the smart contract and the promise is rejected', async () => {
    class EthersError extends Error {
      constructor(message, data) {
        super(message)
        this.data = data
      }
    }
    // promise is rejected without a signature
    safeSdk.getEthAdapter().call = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new EthersError('execution reverted: "Hash not approved"', '0x'))
      )
    const isMessageSigned = await safeMoneriumClient.isMessageSigned(
      '0xSafeAddress',
      'message to sign'
    )
    expect(isMessageSigned).toBe(false)
  })
  it('should allow to check if a message is pending in the safe transaction queue', async () => {
    jest.spyOn(api_kit_1.default.prototype, 'getPendingTransactions').mockResolvedValueOnce({
      count: 0,
      results: []
    })
    const isSignMessagePending = await safeMoneriumClient.isSignMessagePending(
      '0xSafeAddress',
      'message to sign'
    )
    expect(isSignMessagePending).toBe(false)
    jest.spyOn(api_kit_1.default.prototype, 'getPendingTransactions').mockResolvedValueOnce({
      count: 0,
      results: [
        {
          // @ts-expect-error - dataDecoded should have the method property
          dataDecoded: {
            method: 'signMessage',
            parameters: [{ value: (0, ethers_1.hashMessage)('message to sign') }]
          }
        }
      ]
    })
    const isSignMessagePending2 = await safeMoneriumClient.isSignMessagePending(
      '0xSafeAddress',
      'message to sign'
    )
    expect(isSignMessagePending2).toBe(true)
  })
  it('should allow to sign a message', async () => {
    const txData = {
      operation: safe_core_sdk_types_1.OperationType.DelegateCall,
      baseGas: 0,
      safeTxGas: 1000000,
      gasPrice: 0,
      gasToken: '0x000',
      refundReceiver: '0x00000000',
      nonce: 0
    }
    jest.spyOn(protocolKit, 'getSignMessageLibContract').mockResolvedValueOnce({
      encode: jest.fn(),
      getAddress: jest.fn(),
      getMessageHash: jest.fn(),
      signMessage: jest.fn(),
      estimateGas: jest.fn()
    })
    safeSdk.createTransaction = jest.fn().mockResolvedValueOnce({
      data: txData
    })
    safeSdk.getTransactionHash = jest.fn().mockResolvedValueOnce('0xTransactionHash')
    safeSdk.signTransactionHash = jest.fn().mockResolvedValueOnce('0xTransactionSignature')
    jest.spyOn(api_kit_1.default.prototype, 'getTransaction').mockResolvedValueOnce({
      confirmationsRequired: 1,
      //@ts-expect-error - Only required properties are mocked
      confirmations: [{ to: '0xSignerAddress' }]
    })
    const proposeTransactionSpy = jest.spyOn(api_kit_1.default.prototype, 'proposeTransaction')
    safeSdk.executeTransaction = jest.fn()
    await safeMoneriumClient.signMessage('0xSafeAddress', 'message to sign')
    expect(proposeTransactionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        safeAddress: '0xSafeAddress',
        safeTransactionData: txData,
        safeTxHash: '0xTransactionHash',
        senderAddress: '0xSignerAddress',
        senderSignature: undefined
      })
    )
  })
  it('should map the protocol kit chainId to the Monerium Chain types', async () => {
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(1n)
    expect(await safeMoneriumClient.getChain()).toBe('ethereum')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(5n)
    expect(await safeMoneriumClient.getChain()).toBe('ethereum')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(100n)
    expect(await safeMoneriumClient.getChain()).toBe('gnosis')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(10200n)
    expect(await safeMoneriumClient.getChain()).toBe('gnosis')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(137n)
    expect(await safeMoneriumClient.getChain()).toBe('polygon')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(80001n)
    expect(await safeMoneriumClient.getChain()).toBe('polygon')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(300n)
    expect(safeMoneriumClient.getChain()).rejects.toThrowError('Chain not supported: 300')
  })
  it('should map the protocol kit chainId to the Monerium Network types', async () => {
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(1n)
    expect(await safeMoneriumClient.getNetwork()).toBe('mainnet')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(5n)
    expect(await safeMoneriumClient.getNetwork()).toBe('goerli')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(100n)
    expect(await safeMoneriumClient.getNetwork()).toBe('mainnet')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(10200n)
    expect(await safeMoneriumClient.getNetwork()).toBe('chiado')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(137n)
    expect(await safeMoneriumClient.getNetwork()).toBe('mainnet')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(80001n)
    expect(await safeMoneriumClient.getNetwork()).toBe('mumbai')
    safeSdk.getChainId = jest.fn().mockResolvedValueOnce(300n)
    expect(safeMoneriumClient.getNetwork()).rejects.toThrowError('Network not supported: 300')
  })
})
//# sourceMappingURL=SafeMoneriumClient.test.js.map
