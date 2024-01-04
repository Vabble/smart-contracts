const ethers = require('ethers');
const { BigNumber } = ethers;

// const NETWORK = 'Ethereum';
// const NETWORK = 'Goerli';
// const NETWORK = 'Polygon';
const NETWORK = 'Mumbai';

const ZERO_ADDRESS = ethers.constants.AddressZero;
const CONFIG = {
  oldVAB: "0xed28b1890fbb4aa9ded528c1034fed278ff68f5d",
  newVAB: "0xf27BeDc0C8a29DF0c4F91493EBa24814fF04D504",
};

const config = {
  mainnet: {
    fxRoot: "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2",
    fxChild: "0x8397259c983751DAf40400790063935a11afa28a",
    checkpointManager: "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287",
  },
  testnet: {
    fxRoot: "0xFF408f17800d0cAd044CD9F9af330C549113C161", // goerli
    fxChild: "0x6A82dc2b16b876c4e1E24927E9982a323850a48b", // mumbai
    checkpointManager: "0x2890bA17EfE978480615e330ecB65333b880928e", // goerli    
  }
}

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
}

module.exports = {
  NETWORK,
  ZERO_ADDRESS,
  CONFIG,
  getBigNumber,
  config
};
