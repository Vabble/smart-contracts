const ethers = require('ethers');
const { BigNumber } = ethers;

// const NETWORK = 'Ethereum';
// const NETWORK = 'Goerli';
const NETWORK = 'Polygon';
// const NETWORK = 'Mumbai';

const ZERO_ADDRESS = ethers.constants.AddressZero;
const CONFIG = {
  oldVAB: "0xf27BeDc0C8a29DF0c4F91493EBa24814fF04D504",
  newVAB: "0xEa73Dcf6F49f8d6aD5a129aaedE776d78d418CFD",
};

const config = {
  mainnet: {
    fxRoot: "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2",
    fxChild: "0x8397259c983751DAf40400790063935a11afa28a",
    checkpointManager: "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287",
  },
  testnet: {
    fxRoot: "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA", // goerli
    fxChild: "0xCf73231F28B7331BBe3124B907840A94851f9f11", // mumbai
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
