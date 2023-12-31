const { expect } = require('chai');
const { ethers } = require('hardhat');
const { CONFIG, getBigNumber } = require('../scripts/utils');
const ERC20 = require('../scripts/ERC20.json');
const FxERC20 = require('../scripts/FxERC20.json');
const { BigNumber } = require('ethers');

describe('FxERC20', function () {
  before(async function () {        
    this.FxERC20Factory = await ethers.getContractFactory('FxERC20');

    this.signers = await ethers.getSigners();
    this.deployer = this.signers[0];    
  });

  beforeEach(async function () {
    this.VabToken = await (await this.FxERC20Factory.deploy(
    )).deployed();
  });

  it('faucet destroy', async function () {
    const chainId = await this.VabToken.connect(this.deployer).getChainId(
      {from: this.deployer.address}
    );

    expect(chainId).to.be.equal(80001);

    let totalSupply = await this.VabToken.totalSupply();
    expect(totalSupply).to.be.equal(0);

    const ZERO_ADDRESS = ethers.constants.AddressZero;

    await this.VabToken.connect(this.deployer).initialize(
      this.deployer.address, ZERO_ADDRESS, ZERO_ADDRESS, "VAB", "VAB", 18,
      {from: this.deployer.address}
    );

    const supply = getBigNumber(1000000);    
    await this.VabToken.connect(this.deployer).faucet(supply, {
      from: this.deployer.address
    });

    totalSupply = await this.VabToken.totalSupply();
    expect(totalSupply).to.be.equal(supply);


  });
});
