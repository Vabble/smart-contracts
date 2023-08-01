const ethers = require('ethers');  
const { BigNumber } = ethers;

const NETWORK = 'mumbai';
const ZERO_ADDRESS = ethers.constants.AddressZero;
const CONFIG = {
  oldVAB: "0x5cBbA5484594598a660636eFb0A1AD953aFa4e32", // vab
  newVAB: "0x53BeF80E0EBE5A89dfb67782b12435aBeB943754", // exm

  usdcAdress: "0x7493d25DAfE9dA7B73Ffd52F009D978E2415bE0c",
  usdtAdress: "0x47719C2b2A6853d04213efc85075674E93D02037",
};

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
}

module.exports = {
  NETWORK,
  ZERO_ADDRESS,
  CONFIG,
  getBigNumber,
};
