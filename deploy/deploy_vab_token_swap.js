module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { CONFIG } = require('../scripts/utils');

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;

  if (chainId == 1 || chainId == 5) { // ethereum or goerli
    return
  }

  const deployContract = await deploy('VABTokenSwap', {
    from: deployer,
    args: [
      CONFIG.oldVAB,
      CONFIG.newVAB
    ],
    log: true,
    deterministicDeployment: false,
    skipIfAlreadyDeployed: false,
  });   
};

module.exports.id = 'deploy_vab_token_swap'
module.exports.tags = ['VABTokenSwap'];
