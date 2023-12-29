module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { config } = require('../scripts/utils');

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
	
  if(chainId == 137) {
    // Polygon Mainnet
    this.fxChild = config.mainnet.fxChild;   
  } else if(chainId == 80001) {
    // Mumbai Testnet
    this.fxChild = config.testnet.fxChild;    
  } else {
    return
  }

  const FxERC20 = await deployments.get('FxERC20'); 
  console.log("Root Deploy: ", chainId, FxERC20.address);

  const deployContract = await deploy('FxERC20ChildTunnel', {
    from: deployer,
    args: [
      this.fxChild, 
      FxERC20.address
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_child'
module.exports.tags = ['FxERC20ChildTunnel'];
