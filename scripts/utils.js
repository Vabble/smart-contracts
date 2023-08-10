const ethers = require('ethers');  
const { BigNumber } = ethers;

const NETWORK = 'mumbai';
const ZERO_ADDRESS = ethers.constants.AddressZero;
const CONFIG = {
  // usdcAdress: "0x7493d25DAfE9dA7B73Ffd52F009D978E2415bE0c",
  // usdtAdress: "0x47719C2b2A6853d04213efc85075674E93D02037",
  // oldVAB: "0x5cBbA5484594598a660636eFb0A1AD953aFa4e32", // vab
  // newVAB: "0x53BeF80E0EBE5A89dfb67782b12435aBeB943754", // exm

  oldVAB: "0xed28b1890fbb4aa9ded528c1034fed278ff68f5d",
  newVAB: "0xf27BeDc0C8a29DF0c4F91493EBa24814fF04D504",
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
