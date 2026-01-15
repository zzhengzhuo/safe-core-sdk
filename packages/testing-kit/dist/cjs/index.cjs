"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  compatibilityFallbackHandlerDeployed: () => compatibilityFallbackHandlerDeployed,
  createCallDeployed: () => createCallDeployed,
  describeif: () => describeif,
  getAccounts: () => getAccounts,
  getCompatibilityFallbackHandler: () => getCompatibilityFallbackHandler,
  getContractNetworks: () => getContractNetworks,
  getCreateCall: () => getCreateCall,
  getDailyLimitModule: () => getDailyLimitModule,
  getDebugTransactionGuard: () => getDebugTransactionGuard,
  getDefaultCallbackHandler: () => getDefaultCallbackHandler,
  getDeployer: () => getDeployer,
  getERC20Mintable: () => getERC20Mintable,
  getFactory: () => getFactory,
  getMultiSend: () => getMultiSend,
  getMultiSendCallOnly: () => getMultiSendCallOnly,
  getSafeSingleton: () => getSafeSingleton,
  getSafeTemplate: () => getSafeTemplate,
  getSafeWebAuthnSharedSigner: () => getSafeWebAuthnSharedSigner,
  getSafeWebAuthnSignerFactory: () => getSafeWebAuthnSignerFactory,
  getSafeWithOwners: () => getSafeWithOwners,
  getSignMessageLib: () => getSignMessageLib,
  getSimulateTxAccessor: () => getSimulateTxAccessor,
  getSocialRecoveryModule: () => getSocialRecoveryModule,
  getStateChannelModule: () => getStateChannelModule,
  getWebAuthnContract: () => getWebAuthnContract,
  getWhiteListModule: () => getWhiteListModule,
  itif: () => itif,
  multiSendCallOnlyDeployed: () => multiSendCallOnlyDeployed,
  multiSendDeployed: () => multiSendDeployed,
  proxyFactoryDeployed: () => proxyFactoryDeployed,
  safeDeployed: () => safeDeployed,
  safeVersionDeployed: () => safeVersionDeployed,
  safeWebAuthnSharedSignerDeployed: () => safeWebAuthnSharedSignerDeployed,
  safeWebAuthnSignerFactoryDeployed: () => safeWebAuthnSignerFactoryDeployed,
  setupTests: () => setupTests,
  signMessageLibDeployed: () => signMessageLibDeployed,
  simulateTxAccessorDeployed: () => simulateTxAccessorDeployed,
  waitTransactionReceipt: () => waitTransactionReceipt
});
module.exports = __toCommonJS(index_exports);

// src/hardhat/deploy/deploy-contracts.ts
var safeVersionDeployed = process.env.SAFE_VERSION;
var safeContracts = {
  "1.4.1": { name: "Safe_SV1_4_1" },
  "1.3.0": { name: "Safe_SV1_3_0" },
  "1.2.0": { name: "Safe_SV1_2_0" },
  "1.1.1": { name: "Safe_SV1_1_1" },
  "1.0.0": { name: "Safe_SV1_0_0" }
};
var proxyFactoryContracts = {
  "1.4.1": { name: "SafeProxyFactory_SV1_4_1" },
  "1.3.0": { name: "SafeProxyFactory_SV1_3_0" },
  "1.2.0": { name: "SafeProxyFactory_SV1_2_0" },
  "1.1.1": { name: "SafeProxyFactory_SV1_1_1" },
  "1.0.0": { name: "SafeProxyFactory_SV1_0_0" }
};
var multiSendContracts = {
  "1.4.1": { name: "MultiSend_SV1_4_1" },
  "1.3.0": { name: "MultiSend_SV1_3_0" },
  "1.2.0": { name: "MultiSend_SV1_2_0" },
  "1.1.1": { name: "MultiSend_SV1_2_0" },
  "1.0.0": { name: "MultiSend_SV1_2_0" }
};
var multiSendCallOnlyContracts = {
  "1.4.1": { name: "MultiSendCallOnly_SV1_4_1" },
  "1.3.0": { name: "MultiSendCallOnly_SV1_3_0" },
  "1.2.0": { name: "MultiSendCallOnly_SV1_3_0" },
  "1.1.1": { name: "MultiSendCallOnly_SV1_3_0" },
  "1.0.0": { name: "MultiSendCallOnly_SV1_3_0" }
};
var compatibilityFallbackHandlerContracts = {
  "1.4.1": { name: "CompatibilityFallbackHandler_SV1_4_1" },
  "1.3.0": { name: "CompatibilityFallbackHandler_SV1_3_0" },
  "1.2.0": { name: "CompatibilityFallbackHandler_SV1_3_0" },
  "1.1.1": { name: "CompatibilityFallbackHandler_SV1_3_0" },
  "1.0.0": { name: "CompatibilityFallbackHandler_SV1_3_0" }
};
var signMessageLibContracts = {
  "1.4.1": { name: "SignMessageLib_SV1_4_1" },
  "1.3.0": { name: "SignMessageLib_SV1_3_0" },
  "1.2.0": { name: "SignMessageLib_SV1_3_0" },
  "1.1.1": { name: "SignMessageLib_SV1_3_0" },
  "1.0.0": { name: "SignMessageLib_SV1_3_0" }
};
var createCallContracts = {
  "1.4.1": { name: "CreateCall_SV1_4_1" },
  "1.3.0": { name: "CreateCall_SV1_3_0" },
  "1.2.0": { name: "CreateCall_SV1_3_0" },
  "1.1.1": { name: "CreateCall_SV1_3_0" },
  "1.0.0": { name: "CreateCall_SV1_3_0" }
};
var simulateTxAccessorContracts = {
  "1.4.1": { name: "SimulateTxAccessor_SV1_4_1" },
  "1.3.0": { name: "SimulateTxAccessor_SV1_3_0" },
  "1.2.0": { name: "SimulateTxAccessor_SV1_3_0" },
  "1.1.1": { name: "SimulateTxAccessor_SV1_3_0" },
  "1.0.0": { name: "SimulateTxAccessor_SV1_3_0" }
};
var safeWebAuthnSignerFactoryContracts = {
  "1.4.1": { name: "SafeWebAuthnSignerFactory_SV1_4_1" },
  "1.3.0": { name: "SafeWebAuthnSignerFactory_SV1_4_1" },
  "1.2.0": { name: "SafeWebAuthnSignerFactory_SV1_4_1" },
  "1.1.1": { name: "SafeWebAuthnSignerFactory_SV1_4_1" },
  "1.0.0": { name: "SafeWebAuthnSignerFactory_SV1_4_1" }
};
var safeWebAuthnSharedSignerContracts = {
  "1.4.1": { name: "SafeWebAuthnSharedSigner" },
  "1.3.0": { name: "SafeWebAuthnSharedSigner" },
  "1.2.0": { name: "SafeWebAuthnSharedSigner" },
  "1.1.1": { name: "SafeWebAuthnSharedSigner" },
  "1.0.0": { name: "SafeWebAuthnSharedSigner" }
};
var safeDeployed = safeContracts[safeVersionDeployed];
var proxyFactoryDeployed = proxyFactoryContracts[safeVersionDeployed];
var multiSendDeployed = multiSendContracts[safeVersionDeployed];
var multiSendCallOnlyDeployed = multiSendCallOnlyContracts[safeVersionDeployed];
var compatibilityFallbackHandlerDeployed = compatibilityFallbackHandlerContracts[safeVersionDeployed];
var signMessageLibDeployed = signMessageLibContracts[safeVersionDeployed];
var createCallDeployed = createCallContracts[safeVersionDeployed];
var simulateTxAccessorDeployed = simulateTxAccessorContracts[safeVersionDeployed];
var safeWebAuthnSignerFactoryDeployed = safeWebAuthnSignerFactoryContracts[safeVersionDeployed];
var safeWebAuthnSharedSignerDeployed = safeWebAuthnSharedSignerContracts[safeVersionDeployed];

// src/utils/helpers.ts
var itif = (condition) => condition ? it : it.skip;
var describeif = (condition) => condition ? describe : describe.skip;

// src/utils/setupContracts.ts
var import_viem = require("viem");
var import_hardhat2 = require("hardhat");
var import_satisfies = __toESM(require("semver/functions/satisfies.js"));

// src/utils/transactions.ts
var import_hardhat = __toESM(require("hardhat"));
async function waitTransactionReceipt(hash) {
  return (await import_hardhat.viem.getPublicClient()).waitForTransactionReceipt({ hash });
}
async function getDeployer() {
  const { deployer } = await import_hardhat.default.getNamedAccounts();
  return import_hardhat.viem.getWalletClient(deployer);
}

// src/utils/setupContracts.ts
var ZERO_ADDRESS = import_viem.zeroAddress;
var getSafeSingleton = async () => {
  const safeDeployment = await import_hardhat2.deployments.get(safeDeployed.name);
  const contract = await import_hardhat2.viem.getContractAt(safeDeployed.name, safeDeployment.address);
  return {
    contract,
    abi: safeDeployment.abi
  };
};
var getFactory = async () => {
  const factoryDeployment = await import_hardhat2.deployments.get(proxyFactoryDeployed.name);
  const factoryAddress = factoryDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(proxyFactoryDeployed.name, factoryAddress, {
    client: { wallet: await getDeployer() }
  });
  return {
    contract,
    abi: factoryDeployment.abi
  };
};
var getSafeTemplate = async () => {
  const randomSaltNonce = Math.floor(Math.random() * 1e9) + 1;
  const singleton = (await getSafeSingleton()).contract;
  const factory = (await getFactory()).contract;
  const singletonAddress = singleton.address;
  const { result } = await factory.simulate.createProxyWithNonce([
    singletonAddress,
    "0x",
    randomSaltNonce
  ]);
  const hash = await factory.write.createProxyWithNonce([singletonAddress, "0x", randomSaltNonce]);
  await waitTransactionReceipt(hash);
  return import_hardhat2.viem.getContractAt(safeDeployed.name, result);
};
var getSafeWithOwners = async (owners, threshold, fallbackHandler) => {
  const template = await getSafeTemplate();
  if ((0, import_satisfies.default)(safeVersionDeployed, "<=1.0.0")) {
    await template.write.setup([
      owners,
      threshold || owners.length,
      ZERO_ADDRESS,
      "0x",
      ZERO_ADDRESS,
      0,
      ZERO_ADDRESS
    ]);
  } else {
    await template.write.setup([
      owners,
      threshold || owners.length,
      ZERO_ADDRESS,
      "0x",
      fallbackHandler || (await getCompatibilityFallbackHandler()).contract.address,
      ZERO_ADDRESS,
      0,
      ZERO_ADDRESS
    ]);
  }
  return template;
};
var getCompatibilityFallbackHandler = async () => {
  const compatibilityFallbackHandlerDeployment = await import_hardhat2.deployments.get(
    compatibilityFallbackHandlerDeployed.name
  );
  const compatibilityFallbackHandlerDeploymentAddress = compatibilityFallbackHandlerDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(
    compatibilityFallbackHandlerDeployed.name,
    compatibilityFallbackHandlerDeploymentAddress
  );
  return {
    contract,
    abi: compatibilityFallbackHandlerDeployment.abi
  };
};
var getMultiSend = async () => {
  const multiSendDeployment = await import_hardhat2.deployments.get(multiSendDeployed.name);
  const multiSendAddress = multiSendDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(multiSendDeployed.name, multiSendAddress);
  return {
    contract,
    abi: multiSendDeployment.abi
  };
};
var getMultiSendCallOnly = async () => {
  const multiSendCallOnlyDeployment = await import_hardhat2.deployments.get(multiSendCallOnlyDeployed.name);
  const multiSendAddress = multiSendCallOnlyDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(
    multiSendCallOnlyDeployed.name,
    multiSendAddress
  );
  return {
    contract,
    abi: multiSendCallOnlyDeployment.abi
  };
};
var getSignMessageLib = async () => {
  const signMessageLibDeployment = await import_hardhat2.deployments.get(signMessageLibDeployed.name);
  const signMessageLibAddress = signMessageLibDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(
    signMessageLibDeployed.name,
    signMessageLibAddress
  );
  return {
    contract,
    abi: signMessageLibDeployment.abi
  };
};
var getCreateCall = async () => {
  const createCallDeployment = await import_hardhat2.deployments.get(createCallDeployed.name);
  const createCallAddress = createCallDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(createCallDeployed.name, createCallAddress);
  return {
    contract,
    abi: createCallDeployment.abi
  };
};
var getSimulateTxAccessor = async () => {
  const simulateTxAccessorDeployment = await import_hardhat2.deployments.get(simulateTxAccessorDeployed.name);
  const simulateTxAccessorAddress = simulateTxAccessorDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(
    simulateTxAccessorDeployed.name,
    simulateTxAccessorAddress
  );
  return {
    contract,
    abi: simulateTxAccessorDeployment.abi
  };
};
var getSafeWebAuthnSignerFactory = async () => {
  const safeWebAuthnSignerFactoryDeployment = await import_hardhat2.deployments.get(
    safeWebAuthnSignerFactoryDeployed.name
  );
  const safeWebAuthnSignerFactoryAddress = safeWebAuthnSignerFactoryDeployment.address;
  const contract = await import_hardhat2.viem.getContractAt(
    proxyFactoryDeployed.name,
    safeWebAuthnSignerFactoryAddress,
    {
      client: { wallet: await getDeployer() }
    }
  );
  return {
    contract,
    abi: safeWebAuthnSignerFactoryDeployment.abi
  };
};
var getSafeWebAuthnSharedSigner = async () => {
  const safeWebAuthnSharedSignerDeployment = await import_hardhat2.deployments.get(
    safeWebAuthnSharedSignerDeployed.name
  );
  return {
    contract: await import_hardhat2.viem.getContractAt(
      safeWebAuthnSharedSignerDeployed.name,
      safeWebAuthnSharedSignerDeployment.address
    ),
    abi: safeWebAuthnSharedSignerDeployment.abi
  };
};
var getWebAuthnContract = async () => {
  const webAuthnContractDeployment = await import_hardhat2.deployments.get("WebAuthnContract");
  const dailyLimitModuleAddress = webAuthnContractDeployment.address;
  return await import_hardhat2.viem.getContractAt("WebAuthnContract", dailyLimitModuleAddress);
};
var getDailyLimitModule = async () => {
  const dailyLimitModuleDeployment = await import_hardhat2.deployments.get("DailyLimitModule");
  const dailyLimitModuleAddress = dailyLimitModuleDeployment.address;
  return await import_hardhat2.viem.getContractAt("DailyLimitModule", dailyLimitModuleAddress);
};
var getSocialRecoveryModule = async () => {
  const socialRecoveryModuleDeployment = await import_hardhat2.deployments.get("SocialRecoveryModule");
  const socialRecoveryModuleAddress = socialRecoveryModuleDeployment.address;
  return await import_hardhat2.viem.getContractAt("SocialRecoveryModule", socialRecoveryModuleAddress);
};
var getStateChannelModule = async () => {
  const stateChannelModuleDeployment = await import_hardhat2.deployments.get("StateChannelModule");
  const stateChannelModuleAddress = stateChannelModuleDeployment.address;
  return await import_hardhat2.viem.getContractAt("StateChannelModule", stateChannelModuleAddress);
};
var getWhiteListModule = async () => {
  const whiteListModuleDeployment = await import_hardhat2.deployments.get("WhitelistModule");
  const whiteListModuleAddress = whiteListModuleDeployment.address;
  return await import_hardhat2.viem.getContractAt("WhitelistModule", whiteListModuleAddress);
};
var getERC20Mintable = async () => {
  const eRC20MintableDeployment = await import_hardhat2.deployments.get("ERC20Mintable");
  const eRC20MintableAddress = eRC20MintableDeployment.address;
  return await import_hardhat2.viem.getContractAt("ERC20Mintable", eRC20MintableAddress, {
    client: { wallet: await getDeployer() }
  });
};
var getDebugTransactionGuard = async () => {
  const contractName = (0, import_satisfies.default)(safeVersionDeployed, "<=1.3.0") ? "DebugTransactionGuard_SV1_3_0" : "DebugTransactionGuard_SV1_4_1";
  const debugTransactionGuardDeployment = await import_hardhat2.deployments.get(contractName);
  const debugTransactionGuardAddress = debugTransactionGuardDeployment.address;
  return await import_hardhat2.viem.getContractAt(contractName, debugTransactionGuardAddress);
};
var getDefaultCallbackHandler = async () => {
  const contractName = (0, import_satisfies.default)(safeVersionDeployed, "<=1.3.0") ? "DefaultCallbackHandler_SV1_3_0" : "TokenCallbackHandler_SV1_4_1";
  const defaultCallbackHandlerDeployment = await import_hardhat2.deployments.get(contractName);
  const defaultCallbackHandlerAddress = defaultCallbackHandlerDeployment.address;
  return await import_hardhat2.viem.getContractAt(contractName, defaultCallbackHandlerAddress);
};

// src/utils/setupContractNetworks.ts
async function getContractNetworks(chainId) {
  return {
    [chainId.toString()]: {
      safeSingletonAddress: (await getSafeSingleton()).contract.address,
      safeSingletonAbi: (await getSafeSingleton()).abi,
      safeProxyFactoryAddress: (await getFactory()).contract.address,
      safeProxyFactoryAbi: (await getFactory()).abi,
      multiSendAddress: (await getMultiSend()).contract.address,
      multiSendAbi: (await getMultiSend()).abi,
      multiSendCallOnlyAddress: (await getMultiSendCallOnly()).contract.address,
      multiSendCallOnlyAbi: (await getMultiSendCallOnly()).abi,
      fallbackHandlerAddress: (await getCompatibilityFallbackHandler()).contract.address,
      fallbackHandlerAbi: (await getCompatibilityFallbackHandler()).abi,
      signMessageLibAddress: (await getSignMessageLib()).contract.address,
      signMessageLibAbi: (await getSignMessageLib()).abi,
      createCallAddress: (await getCreateCall()).contract.address,
      createCallAbi: (await getCreateCall()).abi,
      simulateTxAccessorAddress: (await getSimulateTxAccessor()).contract.address,
      simulateTxAccessorAbi: (await getSimulateTxAccessor()).abi,
      safeWebAuthnSignerFactoryAddress: (await getSafeWebAuthnSignerFactory()).contract.address,
      safeWebAuthnSignerFactoryAbi: (await getSafeWebAuthnSignerFactory()).abi,
      safeWebAuthnSharedSignerAddress: (await getSafeWebAuthnSharedSigner()).contract.address,
      safeWebAuthnSharedSignerAbi: (await getSafeWebAuthnSharedSigner()).abi
    }
  };
}

// src/utils/setupTestNetwork.ts
var import_hardhat3 = require("hardhat");
var import_viem2 = require("viem");
async function getHardhatAccounts() {
  const wallets = await import_hardhat3.viem.getWalletClients();
  const accounts = [];
  for (let i = 0; i < 10; i++) {
    const wallet = wallets[i];
    const account = { signer: wallet, address: (0, import_viem2.getAddress)(wallet.account.address) };
    accounts.push(account);
  }
  return accounts;
}
async function getAccounts() {
  const accounts = await getHardhatAccounts();
  return accounts;
}

// src/utils/setupTests.ts
var import_hardhat4 = require("hardhat");
var setupTests = import_hardhat4.deployments.createFixture(async ({ deployments: deployments3, getChainId }, options) => {
  const { safeConfig, predictedSafeConfig } = options || {};
  await deployments3.fixture();
  const accounts = await getAccounts();
  const chainId = BigInt(await getChainId());
  const contractNetworks = await getContractNetworks(chainId);
  const safe = await getSafeWithOwners(
    safeConfig ? [...accounts.slice(0, safeConfig?.numberOfOwners).map((account) => account.address)] : [accounts[0].address],
    safeConfig?.threshold || 1
  );
  const predictedSafe = {
    safeAccountConfig: {
      owners: predictedSafeConfig ? [
        ...accounts.slice(0, predictedSafeConfig?.numberOfOwners).map((account) => account.address)
      ] : [accounts[0].address],
      threshold: predictedSafeConfig?.threshold || 1
    },
    safeDeploymentConfig: {
      safeVersion: safeVersionDeployed
    }
  };
  return {
    safe,
    accounts,
    contractNetworks,
    chainId,
    predictedSafe
  };
});
