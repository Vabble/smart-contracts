module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { config } = require('../scripts/utils');

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
	
  if(chainId == 1) {
    // Ethereum Mainnet
    this.fxRoot = config.mainnet.fxRoot;
    this.checkpointManager = config.mainnet.checkpointManager;
    // this.rootFxERC20 = config.mainnet.rootFxERC20;
    this.fxERC20Token = config.mainnet.fxERC20;
    this.rootToken = config.mainnet.rootToken;
    this.childToken = config.mainnet.childToken;
  } else if(chainId == 5) {
    // Goerli Testnet
    this.fxRoot = config.testnet.fxRoot;
    this.checkpointManager = config.testnet.checkpointManager;    
    // this.rootFxERC20 = config.testnet.rootFxERC20;
    this.fxERC20Token = config.testnet.fxERC20;
    this.rootToken = config.testnet.rootToken;
    this.childToken = config.testnet.childToken;
  } else {
    return
  }

  const FxERC20 = await deployments.get('FxERC20'); 
  console.log("Root Deploy: ", chainId);

  const deployContract = await deploy('FxERC20RootTunnel', {
    from: deployer,
    args: [
      this.checkpointManager, 
      this.fxRoot, 
      this.fxERC20Token,
      this.rootToken,
      this.childToken
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_root'
module.exports.tags = ['FxERC20RootTunnel'];
