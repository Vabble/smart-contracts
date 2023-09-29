module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { NETWORK, config } = require('../scripts/utils');

  if(NETWORK == 'Ethereum') {
    // Ethereum Mainnet
    this.fxRoot = config.mainnet.fxRoot;
    this.checkpointManager = config.mainnet.checkpointManager;
    // this.rootFxERC20 = config.mainnet.rootFxERC20;
    this.fxERC20Token = config.mainnet.fxERC20;
  } else if(NETWORK == 'Goerli') {
    // Goerli Testnet
    this.fxRoot = config.testnet.fxRoot;
    this.checkpointManager = config.testnet.checkpointManager;
    // this.rootFxERC20 = config.testnet.rootFxERC20;
    this.fxERC20Token = config.testnet.fxERC20;
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
