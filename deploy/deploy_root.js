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
  } else if(chainId == 5) {
    // Goerli Testnet
    this.fxRoot = config.testnet.fxRoot;
    this.checkpointManager = config.testnet.checkpointManager;    
  } else {
    return
  }

  const FxERC20 = await deployments.get('FxERC20'); 
  console.log("Root Deploy: ", chainId, FxERC20.address);

  const deployContract = await deploy('FxERC20RootTunnel', {
    from: deployer,
    args: [
      this.checkpointManager, 
      this.fxRoot, 
      FxERC20.address
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_root'
module.exports.tags = ['FxERC20RootTunnel'];
