module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
  
    if (chainId == 1 || chainId == 5) { // ethereum or goerli
      return
    }
    
    const deployContract = await deploy('FxERC20', {
      from: deployer,
      args: [  
      ],
      log: true,
      deterministicDeployment: false,
      skipIfAlreadyDeployed: false,
    });   
  };
  
  module.exports.id = 'deploy_fxerc20'
  module.exports.tags = ['FxERC20'];
  