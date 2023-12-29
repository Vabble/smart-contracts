module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { config } = require('../scripts/utils');

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
	console.log("Chain ID: ", chainId);

  if(chainId == 1) {
    // Ethereum Mainnet
    this.fxRoot = config.mainnet.fxRoot;
    this.checkpointManager = config.mainnet.checkpointManager;
    this.fxERC20Token = config.mainnet.rootFxERC20;
  } else if(chainId == 5) {
    // Goerli Testnet
    this.fxRoot = config.testnet.fxRoot;
    this.checkpointManager = config.testnet.checkpointManager;    
    this.fxERC20Token = config.testnet.rootFxERC20;
  } else {
    return
  }

  const deployContract = await deploy('FxERC20RootTunnel', {
    from: deployer,
    args: [
      this.checkpointManager, 
      this.fxRoot, 
      this.fxERC20Token
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_root'
module.exports.tags = ['FxERC20RootTunnel'];
