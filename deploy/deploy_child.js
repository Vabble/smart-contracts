module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { NETWORK, config } = require('../scripts/utils');

  if(NETWORK == 'Polygon') {
    // Polygon Mainnet
    this.fxChild = config.mainnet.fxChild;
    this.fxERC20Token = config.mainnet.fxERC20;
  } else if(NETWORK == 'Mumbai') {
    // Mumbai Testnet
    this.fxChild = config.testnet.fxChild;
    this.fxERC20Token = config.testnet.fxERC20;
  } else {
    return
  }

  const deployContract = await deploy('FxERC20ChildTunnel', {
    from: deployer,
    args: [
      this.fxChild, 
      this.fxERC20Token
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_child'
module.exports.tags = ['FxERC20ChildTunnel'];
