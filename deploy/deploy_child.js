module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { config } = require('../scripts/utils');

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
	
  if(chainId == 137) {
    // Polygon Mainnet
    this.fxChild = config.mainnet.fxChild;   
    this.fxERC20Token = config.mainnet.fxERC20;
    this.rootToken = config.mainnet.rootToken;
    this.childToken = config.mainnet.childToken;
  } else if(chainId == 80001) {
    // Mumbai Testnet
    this.fxChild = config.testnet.fxChild;    
    this.fxERC20Token = config.testnet.fxERC20;
    this.rootToken = config.testnet.rootToken;
    this.childToken = config.testnet.childToken;
  } else {
    return
  }

  console.log("Child Deploy: ", chainId);

  const deployContract = await deploy('FxERC20ChildTunnel', {
    from: deployer,
    args: [
      this.fxChild, 
      this.fxERC20Token,
      this.rootToken,
      this.childToken
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_child'
module.exports.tags = ['FxERC20ChildTunnel'];
