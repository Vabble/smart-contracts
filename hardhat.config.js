const { utils } = require("ethers");

require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("@nomicfoundation/hardhat-verify");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter")
require('dotenv').config();


const { NETWORK } = require('./scripts/utils');

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

const alchemy_key = process.env.ALCHEMY_KEY;
const etherScan_api_key = process.env.ETHER_SCAN_API_KEY;
const baseScan_api_key = process.env.BASE_SCAN_API_KEY;

const mnemonic = process.env.MNEMONIC;
const privateKey = process.env.DEPLOY_PRIVATE_KEY;
const coinmarketcap_api_key = process.env.COINMARKETCAP_API_KEY;

const chainIds = {
	mainnet: 1,			// Etherium mainnet
	base: 8453,			// Sepolia testnet
	baseSepolia: 84532, // Base Sepolia testnet
	matic: 137,			// Polygon mainnet
	amoy: 80002, 		// Amoy Polygon testnet
	ganache: 1337,		// For Development
	hardhat: 31337,		// For Development
};
if (!mnemonic || !alchemy_key) {
	throw new Error("Please set your data in a .env file");
}

module.exports = {
	defaultNetwork: 'hardhat',
	gasReporter: {
		coinmarketcap: coinmarketcap_api_key,
		currency: "USD",
		enabled: false
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		dev: {
			default: 1,
		},
	},
	networks: {
		hardhat: {
			allowUnlimitedContractSize: true,
			chainId: chainIds.mumbai,
			saveDeployments: true,
			forking: {
				// url: `https://eth-goerli.alchemyapi.io/v2/${alchemy_key}`,
				// blockNumber: 11328709,
				url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemy_key}`
			},
			accounts: [{
				privateKey: privateKey,
				balance: '10000000000000000000000',  // 
			}],
			// gasPrice: 22500000000,
			gasMultiplier: 2,
			// throwOnTransactionFailures: true,
			// blockGasLimit: 1245000000 
		},
		// Ethereum mainnet
		mainnet: {
			url: `https://eth-mainnet.alchemyapi.io/v2/${alchemy_key}`,
			accounts: [
				privateKey
			],
			chainId: chainIds.mainnet,
			live: false,
			saveDeployments: true
		},
		// Base testnet (Sepolia)
		base: {
			url: `https://base-mainnet.g.alchemy.com/v2/${alchemy_key}`,
			accounts: [
				privateKey
			],
			chainId: chainIds.base,
			live: false,
			saveDeployments: true,
			tags: ["staging"],
			gasPrice: 5000000000,
			gasMultiplier: 2,
		},
		// Base testnet (Sepolia)
		baseSepolia: {
			url: `https://base-sepolia.g.alchemy.com/v2/${alchemy_key}`,
			accounts: [
				privateKey
			],
			chainId: chainIds.baseSepolia,
			live: false,
			saveDeployments: true,
			tags: ["staging"],
			gasPrice: 5000000000,
			gasMultiplier: 2,
		},
		// Polygon mainnet
		matic: {
			url: "https://polygon-rpc.com",
			chainId: chainIds.matic,
			accounts: [
				privateKey
			],
			live: true,
			saveDeployments: true
		},
	},
	etherscan: {
		apiKey: baseScan_api_key
		// apiKey: etherScan_api_key
		// apiKey: baseScan_api_key
	},
	paths: {
		deploy: "deploy",
		deployments: "deployments",
		sources: "contracts",
		tests: "test"
	},
	mocha: {
		timeout: 200e3
	},
	solidity: {
		compilers: [
			{
				version: '0.8.4',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: '0.8.17',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	}
};
