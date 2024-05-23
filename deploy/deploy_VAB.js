// Deploy Command
// npx hardhat run .\deploy\deploy_VAB.js --network base

// Verify Command
// npx hardhat verify --network base 0x2C9ab600D71967fF259c491aD51F517886740cbc --contract contracts/Ethereum/Vabble.sol:Vabble

const { ethers } = require("hardhat");

async function main() {
	// Retrieve the contract factory
	const Vabble = await ethers.getContractFactory("Vabble");

	// Deploy the contract
	const vabble = await Vabble.deploy();

	// Wait for deployment to finish
	await vabble.deployed();

	console.log("Vabble deployed to:", vabble.address);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
