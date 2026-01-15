// src/index.ts
import Safe4 from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

// src/utils/index.ts
import { validateEthereumAddress } from "@safe-global/protocol-kit";

// src/constants.ts
var DEFAULT_SAFE_MODULES_VERSION = "0.2.0";
var DEFAULT_DEPLOYMENT_TYPE = "canonical";
var TRANSACTION_EXECUTED = "The transaction has been executed, check the ethereumTxHash in the transactions property to view it on the corresponding blockchain explorer";
var TRANSACTION_SAVED = "The transaction was not executed on-chain yet. There are pending signatures and you need to confirm it with other Safe owners first. Use the confirm(safeTxHash) method with other signer connected to the client";
var OFFCHAIN_MESSAGE_SAVED = "The message was stored using the Safe Transaction Service, you need to confirm it with other Safe owners in order to make it valid. Use the confirmMessage(messageHash) method with other signer connected to the client";
var OFFCHAIN_MESSAGE_CONFIRMED = "The message was stored using Safe services and now is confirmed and valid";
var SAFE_OPERATION_SAVED = "The UserOperation was stored using the Safe Transaction Service as an SafeOperation, you need to confirm it with other Safe owners in order to make it valid. Use the confirmSafeOperation(safeOperationHash) method with other signer connected to the client";
var SAFE_OPERATION_SENT_TO_BUNDLER = "The SafeOperation was sent to the bundler for being processed. Check the userOperationHash in the safeOperations property to see the SafeOperation in the corresponding explorer";
var SAFE_DEPLOYED = "A new Safe account was deployed, check the ethereumTxHash in the safeAccountDeployment property to view it on the corresponding blockchain explorer";
var MESSAGES = {
  ["DEPLOYED_AND_EXECUTED" /* DEPLOYED_AND_EXECUTED */]: `${SAFE_DEPLOYED}. ${TRANSACTION_EXECUTED}`,
  ["DEPLOYED_AND_PENDING_SIGNATURES" /* DEPLOYED_AND_PENDING_SIGNATURES */]: `${SAFE_DEPLOYED}. ${TRANSACTION_SAVED}`,
  ["EXECUTED" /* EXECUTED */]: TRANSACTION_EXECUTED,
  ["PENDING_SIGNATURES" /* PENDING_SIGNATURES */]: TRANSACTION_SAVED,
  ["MESSAGE_PENDING_SIGNATURES" /* MESSAGE_PENDING_SIGNATURES */]: OFFCHAIN_MESSAGE_SAVED,
  ["MESSAGE_CONFIRMED" /* MESSAGE_CONFIRMED */]: OFFCHAIN_MESSAGE_CONFIRMED,
  ["DEPLOYED_AND_MESSAGE_PENDING_SIGNATURES" /* DEPLOYED_AND_MESSAGE_PENDING_SIGNATURES */]: `${SAFE_DEPLOYED}. ${OFFCHAIN_MESSAGE_SAVED}`,
  ["DEPLOYED_AND_MESSAGE_CONFIRMED" /* DEPLOYED_AND_MESSAGE_CONFIRMED */]: `${SAFE_DEPLOYED}. ${OFFCHAIN_MESSAGE_CONFIRMED}`,
  ["SAFE_OPERATION_EXECUTED" /* SAFE_OPERATION_EXECUTED */]: SAFE_OPERATION_SENT_TO_BUNDLER,
  ["SAFE_OPERATION_PENDING_SIGNATURES" /* SAFE_OPERATION_PENDING_SIGNATURES */]: SAFE_OPERATION_SAVED
};

// src/utils/sendTransaction.ts
import { waitForTransactionReceipt } from "viem/actions";
var sendTransaction = async ({
  transaction,
  protocolKit
}) => {
  const signer = await protocolKit.getSafeProvider().getExternalSigner();
  const client = protocolKit.getSafeProvider().getExternalProvider();
  if (!signer)
    throw new Error("SafeProvider must be initialized with a signer to use this function");
  const hash = await signer.sendTransaction({
    to: transaction.to,
    data: transaction.data,
    value: BigInt(transaction.value),
    account: signer.account
  });
  const receipt = await waitForTransactionReceipt(client, { hash });
  return receipt.transactionHash;
};

// src/utils/proposeTransaction.ts
import { buildSignatureBytes } from "@safe-global/protocol-kit";
var proposeTransaction = async ({
  safeTransaction,
  protocolKit,
  apiKit
}) => {
  safeTransaction = await protocolKit.signTransaction(safeTransaction);
  const signerAddress = await protocolKit.getSafeProvider().getSignerAddress() || "0x";
  const ethSig = safeTransaction.getSignature(signerAddress);
  const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
  const txOptions = {
    safeAddress: await protocolKit.getAddress(),
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: signerAddress,
    senderSignature: buildSignatureBytes([ethSig])
  };
  await apiKit.proposeTransaction(txOptions);
  return safeTxHash;
};

// src/utils/index.ts
var isValidAddress = (address) => {
  try {
    validateEthereumAddress(address);
    return true;
  } catch {
    return false;
  }
};
var isValidSafeConfig = (config) => {
  if (!config.owners || !config.threshold) return false;
  return true;
};
var waitSafeTxReceipt = async (txResult) => {
  const receipt = txResult.transactionResponse ? await txResult.transactionResponse.wait() : void 0;
  return receipt;
};
var createSafeClientResult = ({
  status,
  safeAddress,
  deploymentTxHash,
  safeTxHash,
  txHash,
  messageHash,
  userOperationHash,
  safeOperationHash
}) => {
  return {
    safeAddress,
    description: MESSAGES[status],
    status,
    transactions: txHash || safeTxHash ? { ethereumTxHash: txHash, safeTxHash } : void 0,
    messages: messageHash ? { messageHash } : void 0,
    safeOperations: userOperationHash || safeOperationHash ? { userOperationHash, safeOperationHash } : void 0,
    safeAccountDeployment: deploymentTxHash ? { ethereumTxHash: deploymentTxHash } : void 0
  };
};

// src/BaseClient.ts
var BaseClient = class {
  constructor(protocolKit, apiKit) {
    this.protocolKit = protocolKit;
    this.apiKit = apiKit;
  }
  /**
   * Returns the Safe address.
   *
   * @returns {string} The Safe address
   */
  async getAddress() {
    return this.protocolKit.getAddress();
  }
  /**
   * Checks if the current Safe is deployed.
   *
   * @returns {boolean} if the Safe contract is deployed
   */
  async isDeployed() {
    return this.protocolKit.isSafeDeployed();
  }
  /**
   * Checks if a specific address is an owner of the current Safe.
   *
   * @param {string} ownerAddress - The account address
   * @returns {boolean} TRUE if the account is an owner
   */
  async isOwner(ownerAddress) {
    return this.protocolKit.isOwner(ownerAddress);
  }
  /**
   * Returns the list of Safe owner accounts.
   *
   * @returns The list of owners
   */
  async getOwners() {
    return this.protocolKit.getOwners();
  }
  /**
   * Returns the Safe threshold.
   *
   * @returns {number} The Safe threshold
   */
  async getThreshold() {
    return this.protocolKit.getThreshold();
  }
  /**
   * Returns the Safe nonce.
   *
   * @returns {number} The Safe nonce
   */
  async getNonce() {
    return this.protocolKit.getNonce();
  }
  /**
   * Returns a list of owners who have approved a specific Safe transaction.
   *
   * @param {string} txHash - The Safe transaction hash
   * @returns {string[]} The list of owners
   */
  async getOwnersWhoApprovedTransaction(txHash) {
    return this.protocolKit.getOwnersWhoApprovedTx(txHash);
  }
  /**
   * Encodes the data for adding a new owner to the Safe.
   *
   * @param {AddOwnerTxParams | AddPasskeyOwnerTxParams} addOwnerParams - The parameters for adding a new owner
   * @returns {TransactionBase} The encoded data
   */
  async createAddOwnerTransaction(addOwnerParams) {
    const addOwnerTransaction = await this.protocolKit.createAddOwnerTx(addOwnerParams);
    return this.#buildTransaction(addOwnerTransaction);
  }
  /**
   * Encodes the data for removing an owner from the Safe.
   *
   * @param {RemoveOwnerTxParams | RemovePasskeyOwnerTxParams} removeOwnerParams - The parameters for removing an owner
   * @returns {TransactionBase} The encoded data
   */
  async createRemoveOwnerTransaction(removeOwnerParams) {
    const removeOwnerTransaction = await this.protocolKit.createRemoveOwnerTx(removeOwnerParams);
    return this.#buildTransaction(removeOwnerTransaction);
  }
  /**
   * Encodes the data for swapping an owner in the Safe.
   *
   * @param {SwapOwnerTxParams} swapParams - The parameters for swapping an owner
   * @returns {TransactionBase} The encoded data
   */
  async createSwapOwnerTransaction(swapParams) {
    const swapOwnerTransaction = await this.protocolKit.createSwapOwnerTx(swapParams);
    return this.#buildTransaction(swapOwnerTransaction);
  }
  /**
   * Encodes the data for changing the Safe threshold.
   *
   * @param {ChangeThresholdTxParams} changeThresholdParams - The parameters for changing the Safe threshold
   * @returns {TransactionBase} The encoded data
   */
  async createChangeThresholdTransaction(changeThresholdParams) {
    const changeThresholdTransaction = await this.protocolKit.createChangeThresholdTx(
      changeThresholdParams.threshold
    );
    return this.#buildTransaction(changeThresholdTransaction);
  }
  async #buildTransaction(safeTransaction) {
    return {
      to: safeTransaction.data.to,
      value: safeTransaction.data.value,
      data: safeTransaction.data.data
    };
  }
};

// src/SafeClient.ts
var SafeClient = class extends BaseClient {
  constructor(protocolKit, apiKit) {
    super(protocolKit, apiKit);
  }
  /**
   * Sends transactions through the Safe protocol.
   * You can send an array to transactions { to, value, data} that we will convert to a transaction batch
   *
   * @param {SendTransactionProps} props The SendTransactionProps object.
   * @param {TransactionBase[]} props.transactions An array of transactions to be sent.
   * @param {string} props.transactions[].to The recipient address of the transaction.
   * @param {string} props.transactions[].value The value of the transaction.
   * @param {string} props.transactions[].data The data of the transaction.
   * @param {string} props.from The sender address of the transaction.
   * @param {number | string} props.gasLimit The gas limit of the transaction.
   * @param {number | string} props.gasPrice The gas price of the transaction.
   * @param {number | string} props.maxFeePerGas The max fee per gas of the transaction.
   * @param {number | string} props.maxPriorityFeePerGas The max priority fee per gas of the transaction.
   * @param {number} props.nonce The nonce of the transaction.
   * @returns {Promise<SafeClientResult>} A promise that resolves to the result of the transaction.
   */
  async send({
    transactions,
    ...transactionOptions
  }) {
    const isSafeDeployed = await this.protocolKit.isSafeDeployed();
    const isMultisigSafe = await this.protocolKit.getThreshold() > 1;
    const safeTransaction = await this.protocolKit.createTransaction({ transactions });
    if (isSafeDeployed) {
      if (isMultisigSafe) {
        return this.#proposeTransaction({ safeTransaction });
      } else {
        return this.#executeTransaction({ safeTransaction, ...transactionOptions });
      }
    } else {
      if (isMultisigSafe) {
        return this.#deployAndProposeTransaction({ safeTransaction, ...transactionOptions });
      } else {
        return this.#deployAndExecuteTransaction({ safeTransaction, ...transactionOptions });
      }
    }
  }
  /**
   * Confirms a transaction by its safe transaction hash.
   *
   * @param {ConfirmTransactionProps} props The ConfirmTransactionProps object.
   * @param {string} props.safeTxHash  The hash of the safe transaction to confirm.
   * @returns {Promise<SafeClientResult>} A promise that resolves to the result of the confirmed transaction.
   * @throws {Error} If the transaction confirmation fails.
   */
  async confirm({ safeTxHash }) {
    const safeAddress = await this.protocolKit.getAddress();
    let transactionResponse = await this.apiKit.getTransaction(safeTxHash);
    if (transactionResponse.isExecuted) {
      return createSafeClientResult({
        status: "EXECUTED" /* EXECUTED */,
        safeAddress,
        txHash: transactionResponse.transactionHash || "",
        safeTxHash
      });
    }
    if (this.#needsConfirmation(transactionResponse)) {
      const signedTransaction = await this.protocolKit.signTransaction(transactionResponse);
      const signature = signedTransaction.encodedSignatures();
      await this.apiKit.confirmTransaction(safeTxHash, signature);
      transactionResponse = await this.apiKit.getTransaction(safeTxHash);
    }
    if (!this.#needsConfirmation(transactionResponse)) {
      const executedTransactionResponse = await this.protocolKit.executeTransaction(transactionResponse);
      await waitSafeTxReceipt(executedTransactionResponse);
      return createSafeClientResult({
        status: "EXECUTED" /* EXECUTED */,
        safeAddress,
        txHash: executedTransactionResponse.hash,
        safeTxHash
      });
    }
    return createSafeClientResult({
      status: "PENDING_SIGNATURES" /* PENDING_SIGNATURES */,
      safeAddress,
      safeTxHash
    });
  }
  /**
   * Retrieves the pending transactions for the current safe address.
   *
   * @async
   * @returns {Promise<SafeMultisigTransactionListResponse>} A promise that resolves to an array of pending transactions.
   * @throws {Error} If there is an issue retrieving the safe address or pending transactions.
   */
  async getPendingTransactions() {
    const safeAddress = await this.protocolKit.getAddress();
    return this.apiKit.getPendingTransactions(safeAddress);
  }
  extend(extendFunc) {
    const result = extendFunc(this);
    if (result instanceof Promise) {
      return result.then((extensions) => Object.assign(this, extensions));
    } else {
      return Object.assign(this, result);
    }
  }
  /**
   * Deploys and executes a transaction in one step.
   *
   * @param {SafeTransaction} safeTransaction  The safe transaction to be executed
   * @param {TransactionOptions} options  Optional transaction options
   * @returns  A promise that resolves to the result of the transaction
   */
  async #deployAndExecuteTransaction({
    safeTransaction,
    ...transactionOptions
  }) {
    safeTransaction = await this.protocolKit.signTransaction(safeTransaction);
    const transactionBatchWithDeployment = await this.protocolKit.wrapSafeTransactionIntoDeploymentBatch(
      safeTransaction,
      transactionOptions
    );
    const hash = await sendTransaction({
      transaction: transactionBatchWithDeployment,
      protocolKit: this.protocolKit
    });
    await this.#reconnectSafe();
    return createSafeClientResult({
      safeAddress: await this.protocolKit.getAddress(),
      status: "DEPLOYED_AND_EXECUTED" /* DEPLOYED_AND_EXECUTED */,
      deploymentTxHash: hash,
      txHash: hash
    });
  }
  /**
   * Deploys and proposes a transaction in one step.
   *
   * @param {SafeTransaction} safeTransaction The safe transaction to be proposed
   * @param {TransactionOptions} transactionOptions  Optional transaction options
   * @returns  A promise that resolves to the result of the transaction
   */
  async #deployAndProposeTransaction({
    safeTransaction,
    ...transactionOptions
  }) {
    const safeDeploymentTransaction = await this.protocolKit.createSafeDeploymentTransaction();
    const hash = await sendTransaction({
      transaction: { ...safeDeploymentTransaction, ...transactionOptions },
      protocolKit: this.protocolKit
    });
    await this.#reconnectSafe();
    safeTransaction = await this.protocolKit.signTransaction(safeTransaction);
    const safeTxHash = await proposeTransaction({
      safeTransaction,
      protocolKit: this.protocolKit,
      apiKit: this.apiKit
    });
    return createSafeClientResult({
      safeAddress: await this.protocolKit.getAddress(),
      status: "DEPLOYED_AND_PENDING_SIGNATURES" /* DEPLOYED_AND_PENDING_SIGNATURES */,
      deploymentTxHash: hash,
      safeTxHash
    });
  }
  /**
   * Executes a transaction.
   *
   * @param {SafeTransaction} safeTransaction The safe transaction to be executed
   * @param {TransactionOptions} transactionOptions Optional transaction options
   * @returns A promise that resolves to the result of the transaction
   */
  async #executeTransaction({
    safeTransaction,
    ...transactionOptions
  }) {
    safeTransaction = await this.protocolKit.signTransaction(safeTransaction);
    const { hash } = await this.protocolKit.executeTransaction(safeTransaction, transactionOptions);
    return createSafeClientResult({
      safeAddress: await this.protocolKit.getAddress(),
      status: "EXECUTED" /* EXECUTED */,
      txHash: hash
    });
  }
  /**
   *  Proposes a transaction to the Safe.
   * @param { SafeTransaction } safeTransaction The safe transaction to propose
   * @returns The SafeClientResult
   */
  async #proposeTransaction({ safeTransaction }) {
    const safeTxHash = await proposeTransaction({
      safeTransaction,
      protocolKit: this.protocolKit,
      apiKit: this.apiKit
    });
    return createSafeClientResult({
      safeAddress: await this.protocolKit.getAddress(),
      status: "PENDING_SIGNATURES" /* PENDING_SIGNATURES */,
      safeTxHash
    });
  }
  #needsConfirmation(transactionResponse) {
    return (transactionResponse.confirmations?.length || 0) < transactionResponse.confirmationsRequired;
  }
  async #reconnectSafe() {
    this.protocolKit = await this.protocolKit.connect({
      provider: this.protocolKit.getSafeProvider().provider,
      signer: this.protocolKit.getSafeProvider().signer,
      safeAddress: await this.protocolKit.getAddress()
    });
  }
};

// src/extensions/messages/onChainMessages.ts
import { getSignMessageLibContract, hashSafeMessage } from "@safe-global/protocol-kit";
import { OperationType } from "@safe-global/types-kit";
function onChainMessages() {
  return (client) => ({
    /**
     * Creates and sends a message as a regular transaction using the SignMessageLib contract
     * The message can be a string or an EIP712TypedData object
     * As this method creates a new transaction you can confirm it using the safeTxHash and the confirm() method and
     * retrieve the pending transactions using the getPendingTransactions() method from the general client
     * @param {SendOnChainMessageProps} props The message properties
     * @returns {Promise<SafeClientResult>} A SafeClientResult. You can get the safeTxHash to confirm from the transaction property
     */
    async sendOnChainMessage(props) {
      const { message, ...transactionOptions } = props;
      const signMessageLibContract = await getSignMessageLibContract({
        safeProvider: client.protocolKit.getSafeProvider(),
        safeVersion: client.protocolKit.getContractVersion()
      });
      const transaction = {
        to: signMessageLibContract.getAddress(),
        value: "0",
        data: signMessageLibContract.encode("signMessage", [hashSafeMessage(message)]),
        operation: OperationType.DelegateCall
      };
      return client.send({ transactions: [transaction], ...transactionOptions });
    }
  });
}

// src/extensions/messages/SafeMessageClient.ts
import { hashSafeMessage as hashSafeMessage2 } from "@safe-global/protocol-kit";
var SafeMessageClient = class {
  /**
   * @constructor
   * @param {Safe} protocolKit A Safe instance
   * @param {SafeApiKit} apiKit A SafeApiKit instance
   */
  constructor(protocolKit, apiKit) {
    this.protocolKit = protocolKit;
    this.apiKit = apiKit;
  }
  /**
   * Send off-chain messages using the Transaction service
   *
   * @param {SendOffChainMessageProps} props The message properties
   * @param {string | EIP712TypedData} props.message The message to be sent. Can be a raw string or an EIP712TypedData object
   * @returns {Promise<SafeClientResult>} A SafeClientResult. You can get the messageHash to confirmMessage() afterwards from the messages property
   */
  async sendMessage({ message }) {
    const isSafeDeployed = await this.protocolKit.isSafeDeployed();
    const safeMessage = this.protocolKit.createMessage(message);
    if (isSafeDeployed) {
      return this.#addMessage({ safeMessage });
    } else {
      return this.#deployAndAddMessage({ safeMessage });
    }
  }
  /**
   * Confirms an off-chain message using the Transaction service
   *
   * @param {ConfirmOffChainMessageProps} props The confirmation properties
   * @param {string} props.messageHash The messageHash. Returned from the sendMessage() method inside the SafeClientResult messages property
   * @returns {Promise<SafeClientResult>} A SafeClientResult with the result of the confirmation
   */
  async confirmMessage({ messageHash }) {
    let messageResponse = await this.apiKit.getMessage(messageHash);
    const safeAddress = await this.protocolKit.getAddress();
    const threshold = await this.protocolKit.getThreshold();
    let safeMessage = this.protocolKit.createMessage(messageResponse.message);
    safeMessage = await this.protocolKit.signMessage(safeMessage);
    await this.apiKit.addMessageSignature(messageHash, safeMessage.encodedSignatures());
    messageResponse = await this.apiKit.getMessage(messageHash);
    return createSafeClientResult({
      status: messageResponse.confirmations.length === threshold ? "MESSAGE_CONFIRMED" /* MESSAGE_CONFIRMED */ : "MESSAGE_PENDING_SIGNATURES" /* MESSAGE_PENDING_SIGNATURES */,
      safeAddress,
      messageHash
    });
  }
  /**
   * Get the list of pending off-chain messages. This messages can be confirmed using the confirmMessage() method
   *
   * @param {ListOptions} options The pagination options
   * @returns {Promise<SafeMessageListResponse>} A list of pending messages
   */
  async getPendingMessages(options) {
    const safeAddress = await this.protocolKit.getAddress();
    return this.apiKit.getMessages(safeAddress, options);
  }
  /**
   * Deploys a new Safe account based on the provided config and adds a message using the Transaction service
   * - If the Safe threshold > 1, we need to deploy the Safe account first and afterwards add the message
   *   The message should be confirmed with other owners using the confirmMessage() method until the threshold is reached in order to be valid
   * - If the threshold = 1, we can deploy the Safe account and add the message in one step. The message will be valid immediately
   *
   * @param {SafeTransaction} safeMessage  The safe message
   * @returns {Promise<SafeClientResult>} The SafeClientResult
   */
  async #deployAndAddMessage({
    safeMessage
  }) {
    let deploymentTxHash;
    const threshold = await this.protocolKit.getThreshold();
    const safeDeploymentTransaction = await this.protocolKit.createSafeDeploymentTransaction();
    try {
      deploymentTxHash = await sendTransaction({
        transaction: safeDeploymentTransaction,
        protocolKit: this.protocolKit
      });
      await this.#updateProtocolKitWithDeployedSafe();
    } catch (error) {
      throw new Error("Could not deploy the Safe account");
    }
    try {
      const { messages } = await this.#addMessage({ safeMessage });
      const messageResponse = await this.apiKit.getMessage(messages?.messageHash || "0x");
      return createSafeClientResult({
        safeAddress: await this.protocolKit.getAddress(),
        status: messageResponse.confirmations.length === threshold ? "DEPLOYED_AND_MESSAGE_CONFIRMED" /* DEPLOYED_AND_MESSAGE_CONFIRMED */ : "DEPLOYED_AND_MESSAGE_PENDING_SIGNATURES" /* DEPLOYED_AND_MESSAGE_PENDING_SIGNATURES */,
        deploymentTxHash,
        messageHash: messages?.messageHash
      });
    } catch (error) {
      throw new Error("Could not add a new off-chain message to the Safe account");
    }
  }
  /**
   * Add a new off-chain message using the Transaction service
   * - If the threshold > 1, remember to confirmMessage() after sendMessage()
   * - If the threshold = 1, then the message is confirmed and valid immediately
   *
   * @param {SafeMessage} safeMessage The message
   * @returns {Promise<SafeClientResult>} The SafeClientResult
   */
  async #addMessage({ safeMessage }) {
    const safeAddress = await this.protocolKit.getAddress();
    const threshold = await this.protocolKit.getThreshold();
    const signedMessage = await this.protocolKit.signMessage(safeMessage);
    const messageHash = await this.protocolKit.getSafeMessageHash(hashSafeMessage2(safeMessage.data));
    try {
      await this.apiKit.addMessage(safeAddress, {
        message: safeMessage.data,
        signature: signedMessage.encodedSignatures()
      });
    } catch (error) {
      throw new Error("Could not add a new off-chain message to the Safe account");
    }
    const message = await this.apiKit.getMessage(messageHash);
    return createSafeClientResult({
      safeAddress: await this.protocolKit.getAddress(),
      status: message.confirmations.length === threshold ? "MESSAGE_CONFIRMED" /* MESSAGE_CONFIRMED */ : "MESSAGE_PENDING_SIGNATURES" /* MESSAGE_PENDING_SIGNATURES */,
      messageHash
    });
  }
  /**
   * This method updates the Safe instance with the deployed Safe account
   */
  async #updateProtocolKitWithDeployedSafe() {
    this.protocolKit = await this.protocolKit.connect({
      provider: this.protocolKit.getSafeProvider().provider,
      signer: this.protocolKit.getSafeProvider().signer,
      safeAddress: await this.protocolKit.getAddress()
    });
  }
};

// src/extensions/messages/offChainMessages.ts
function offChainMessages() {
  return (client) => {
    const safeMessageClient = new SafeMessageClient(client.protocolKit, client.apiKit);
    return {
      /**
       * Creates an off-chain message using the Transaction service
       *
       * @param {SendOffChainMessageProps} props The message properties
       * @returns {Promise<SafeClientResult>} A SafeClientResult. You can get the messageHash to confirmMessage() afterwards from the messages property       */
      async sendOffChainMessage(props) {
        return safeMessageClient.sendMessage(props);
      },
      /**
       * Confirms an off-chain message using the Transaction service
       *
       * @param {ConfirmOffChainMessageProps} props The confirmation properties
       * @returns {Promise<SafeClientResult>} A SafeClientResult with the result of the confirmation
       */
      async confirmOffChainMessage(props) {
        return safeMessageClient.confirmMessage(props);
      },
      /**
       * Get the list of pending off-chain messages. This messages can be confirmed using the confirmMessage() method
       *
       * @param {ListOptions} options The pagination options
       * @returns {Promise<SafeMessageListResponse>} A list of pending messages
       */
      async getPendingOffChainMessages(options) {
        return safeMessageClient.getPendingMessages(options);
      }
    };
  };
}

// src/extensions/safe-operations/safeOperations.ts
import { Safe4337Pack } from "@safe-global/relay-kit";

// src/extensions/safe-operations/SafeOperationClient.ts
import { buildSignatureBytes as buildSignatureBytes2 } from "@safe-global/protocol-kit";
var SafeOperationClient = class {
  constructor(safe4337Pack, apiKit) {
    this.protocolKit = safe4337Pack.protocolKit;
    this.apiKit = apiKit;
    this.safe4337Pack = safe4337Pack;
  }
  /**
   * Send SafeOperations from a group of transactions.
   * This method will convert your transactions in a batch and:
   * - If the threshold > 1 it will save for later the SafeOperation using the Transaction service
   *   You must confirmSafeOperation() with other owners
   * - If the threshold = 1 the SafeOperation can be submitted to the bundler so it will execute it immediately
   *
   * @param {Safe4337CreateTransactionProps} props The Safe4337CreateTransactionProps object
   * @param {SafeTransaction[]} props.transactions An array of transactions to be batched
   * @param {TransactionOptions} [props.amountToApprove] The amount to approve for the SafeOperation
   * @param {TransactionOptions} [props.validUntil] The validUntil timestamp for the SafeOperation
   * @param {TransactionOptions} [props.validAfter] The validAfter timestamp for the SafeOperation
   * @param {TransactionOptions} [props.feeEstimator] The feeEstimator to calculate the fees
   * @returns {Promise<SafeClientResult>} A promise that resolves with the status of the SafeOperation
   */
  async sendSafeOperation({
    transactions,
    ...sendSafeOperationOptions
  }) {
    const safeAddress = await this.protocolKit.getAddress();
    const isMultisigSafe = await this.protocolKit.getThreshold() > 1;
    let safeOperation = await this.safe4337Pack.createTransaction({
      transactions,
      options: sendSafeOperationOptions
    });
    safeOperation = await this.safe4337Pack.signSafeOperation(safeOperation);
    if (isMultisigSafe) {
      await this.apiKit.addSafeOperation(safeOperation);
      const safeOperationHash = safeOperation.getHash();
      return createSafeClientResult({
        safeAddress,
        status: "SAFE_OPERATION_PENDING_SIGNATURES" /* SAFE_OPERATION_PENDING_SIGNATURES */,
        safeOperationHash
      });
    }
    const userOperationHash = await this.safe4337Pack.executeTransaction({
      executable: safeOperation
    });
    await this.#waitForOperationToFinish({ userOperationHash });
    return createSafeClientResult({
      safeAddress,
      status: "SAFE_OPERATION_EXECUTED" /* SAFE_OPERATION_EXECUTED */,
      userOperationHash,
      safeOperationHash: safeOperation.getHash()
    });
  }
  /**
   * Confirms the stored safeOperation
   *
   * @param {ConfirmSafeOperationProps} props The confirmation properties
   * @param {string} props.safeOperationHash The hash of the safe operation to confirm.
   * The safeOperationHash can be extracted from the SafeClientResult of the sendSafeOperation method under the safeOperations property
   * You must confirmSafeOperation() with the other owners and once the threshold is reached the SafeOperation will be sent to the bundler
   * @returns {Promise<SafeClientResult>} A promise that resolves to the result of the safeOperation.
   */
  async confirmSafeOperation({
    safeOperationHash
  }) {
    const safeAddress = await this.protocolKit.getAddress();
    const threshold = await this.protocolKit.getThreshold();
    let safeOperationResponse = await this.apiKit.getSafeOperation(safeOperationHash);
    if (safeOperationResponse.userOperation?.ethereumTxHash) {
      return createSafeClientResult({
        status: "SAFE_OPERATION_EXECUTED" /* SAFE_OPERATION_EXECUTED */,
        safeAddress,
        userOperationHash: safeOperationResponse.userOperation.userOperationHash,
        safeOperationHash
      });
    }
    if (this.#needsConfirmation(safeOperationResponse, threshold)) {
      const signature = buildSignatureBytes2([await this.protocolKit.signHash(safeOperationHash)]);
      await this.apiKit.confirmSafeOperation(safeOperationHash, signature);
      safeOperationResponse = await this.apiKit.getSafeOperation(safeOperationHash);
    }
    if (!this.#needsConfirmation(safeOperationResponse, threshold)) {
      const userOperationHash = await this.safe4337Pack.executeTransaction({
        executable: safeOperationResponse
      });
      await this.#waitForOperationToFinish({ userOperationHash });
      return createSafeClientResult({
        status: "SAFE_OPERATION_EXECUTED" /* SAFE_OPERATION_EXECUTED */,
        safeAddress,
        userOperationHash,
        safeOperationHash
      });
    }
    return createSafeClientResult({
      status: "SAFE_OPERATION_PENDING_SIGNATURES" /* SAFE_OPERATION_PENDING_SIGNATURES */,
      safeAddress,
      safeOperationHash
    });
  }
  /**
   * Retrieves the pending Safe operations for the current Safe account
   *
   * @async
   * @param {ListOptions} options The pagination options
   * @returns {Promise<GetSafeOperationListResponse>} A promise that resolves to an array of pending Safe operations.
   * @throws {Error} If there is an issue retrieving the safe address or pending Safe operations.
   */
  async getPendingSafeOperations(options) {
    const safeAddress = await this.protocolKit.getAddress();
    return this.apiKit.getPendingSafeOperations(safeAddress, options);
  }
  #needsConfirmation(safeOperationResponse, threshold) {
    return (safeOperationResponse.confirmations?.length || 0) < threshold;
  }
  /**
   * Helper method to wait for the operation to finish
   * @param userOperationHash The userOperationHash to wait for. This comes from the bundler and can be obtained from the
   * SafeClientResult method under the safeOperations property
   */
  async #waitForOperationToFinish({
    userOperationHash
  }) {
    let userOperationReceipt = null;
    while (!userOperationReceipt) {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      userOperationReceipt = await this.safe4337Pack.getUserOperationReceipt(userOperationHash);
    }
  }
};

// src/extensions/safe-operations/safeOperations.ts
function safeOperations({ bundlerUrl }, paymasterOptions) {
  return async (client) => {
    const { provider, signer } = client.protocolKit.getSafeProvider();
    const isSafeDeployed = await client.protocolKit.isSafeDeployed();
    let options;
    if (isSafeDeployed) {
      const safeAddress = await client.protocolKit.getAddress();
      options = {
        safeAddress
      };
    } else {
      const { safeDeploymentConfig, safeAccountConfig } = client.protocolKit.getPredictedSafe();
      options = {
        owners: safeAccountConfig.owners,
        threshold: safeAccountConfig.threshold,
        ...safeDeploymentConfig
      };
    }
    const safe4337Pack = await Safe4337Pack.init({
      provider,
      signer,
      safeModulesVersion: DEFAULT_SAFE_MODULES_VERSION,
      bundlerUrl,
      options,
      paymasterOptions
    });
    client.protocolKit = safe4337Pack.protocolKit;
    const safeOperationClient = new SafeOperationClient(safe4337Pack, client.apiKit);
    return {
      /**
       * Send SafeOperations from a group of transactions.
       * This method will convert your transactions in a batch and:
       * - If the threshold > 1 it will save for later the SafeOperation using the Transaction service
       *   You must confirmSafeOperation() with other owners
       * - If the threshold = 1 the SafeOperation can be submitted to the bundler so it will execute it immediately
       *
       * @param {Safe4337CreateTransactionProps} props The Safe4337CreateTransactionProps object
       * @returns {Promise<SafeClientResult>} A promise that resolves with the status of the SafeOperation
       */
      async sendSafeOperation(props) {
        return safeOperationClient.sendSafeOperation(props);
      },
      /**
       * Confirms the stored safeOperation
       *
       * @param {ConfirmSafeOperationProps} props The ConfirmSafeOperationProps object
       * @returns {Promise<SafeClientResult>} A promise that resolves to the result of the safeOperation.
       */
      async confirmSafeOperation(props) {
        return safeOperationClient.confirmSafeOperation(props);
      },
      /**
       * Retrieves the pending Safe operations for the current Safe account
       *
       * @async
       * @param {ListOptions} options The pagination options
       * @returns {Promise<GetSafeOperationListResponse>} A promise that resolves to an array of pending Safe operations.
       * @throws {Error} If there is an issue retrieving the safe address or pending Safe operations.
       */
      async getPendingSafeOperations(options2) {
        return safeOperationClient.getPendingSafeOperations(options2);
      }
    };
  };
}

// src/index.ts
async function createSafeClient(config) {
  const protocolKit = await getProtocolKitInstance(config);
  const apiKit = await getApiKitInstance(protocolKit, config);
  if (!protocolKit || !apiKit) throw new Error("Failed to create a kit instances");
  return new SafeClient(protocolKit, apiKit);
}
async function getProtocolKitInstance(config) {
  if (config.safeAddress && isValidAddress(config.safeAddress)) {
    return Safe4.init({
      provider: config.provider,
      signer: config.signer,
      safeAddress: config.safeAddress
    });
  } else if (config.safeOptions && isValidSafeConfig(config.safeOptions)) {
    let protocolKit;
    const initConfig = {
      provider: config.provider,
      signer: config.signer,
      predictedSafe: {
        safeAccountConfig: {
          owners: config.safeOptions.owners,
          threshold: config.safeOptions.threshold
        },
        safeDeploymentConfig: {
          saltNonce: config.safeOptions.saltNonce,
          deploymentType: DEFAULT_DEPLOYMENT_TYPE
        }
      }
    };
    try {
      protocolKit = await Safe4.init(initConfig);
    } catch (error) {
      const isDeploymentTypeUnresolvedError = error instanceof Error && error.message && error.message.startsWith("Invalid") && error.message.includes("contract address");
      if (isDeploymentTypeUnresolvedError && initConfig.predictedSafe.safeDeploymentConfig?.deploymentType) {
        delete initConfig.predictedSafe.safeDeploymentConfig.deploymentType;
        protocolKit = await Safe4.init(initConfig);
      } else {
        throw error;
      }
    }
    const isSafeDeployed = await protocolKit.isSafeDeployed();
    if (isSafeDeployed) {
      return Safe4.init({
        provider: config.provider,
        signer: config.signer,
        safeAddress: await protocolKit.getAddress()
      });
    }
    return protocolKit;
  } else {
    throw new Error(
      "Invalid configuration: either a valid safeAddress or valid safeOptions must be provided."
    );
  }
}
async function getApiKitInstance(protocolKit, config) {
  const chainId = await protocolKit.getChainId();
  return new SafeApiKit({
    chainId,
    apiKey: config.apiKey,
    txServiceUrl: config.txServiceUrl
  });
}
export {
  SafeClient,
  createSafeClient,
  offChainMessages,
  onChainMessages,
  safeOperations
};
