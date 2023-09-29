const ethers = require('ethers');  
const { BigNumber } = ethers;

// const NETWORK = 'Polygon';
// const NETWORK = 'Mumbai';
// const NETWORK = 'Ethereum';
const NETWORK = 'Goerli';

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
    fxERC20: "0xAd87e3b217c66B0D45dEaFBC540330d300811b94",
    rootFxERC20: "0xd26CD6ce2a1705C49610F951f232510532c6856D"
  },
  testnet: {
    fxRoot: "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA", // goerli
    fxChild: "0xCf73231F28B7331BBe3124B907840A94851f9f11", // mumbai
    checkpointManager: "0x2890bA17EfE978480615e330ecB65333b880928e", // goerli
    fxERC20: "0x62757EB8B0d25661B0D7CE4253c318E4Fb3b1a1e", // mumbai
    rootFxERC20: "0x6dd0F2215Ce78fED85BC5d48C8eA7199201f2F64", // goerli
    vab: "0x482a493EA47903a571b20E35B770aFfE06600a3D", // goerli
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
