const { expect } = require('chai');
const { ethers } = require('hardhat');
const { CONFIG, getBigNumber } = require('../scripts/utils');
const ERC20 = require('../scripts/ERC20.json');
const { BigNumber } = require('ethers');

describe('VABTokenSwap', function () {
  before(async function () {        
    this.swapFactory = await ethers.getContractFactory('VABTokenSwap');

    this.signers = await ethers.getSigners();
    this.auditor = this.signers[0];
    this.newAuditor = this.signers[1];    
    this.studio1 = this.signers[2];    
    this.studio2 = this.signers[3];       
    this.studio3 = this.signers[4]; 
    this.customer1 = this.signers[5];
    this.customer2 = this.signers[6];
    this.customer3 = this.signers[7];
  });

  beforeEach(async function () {
    this.VAB = new ethers.Contract(CONFIG.oldVAB, JSON.stringify(ERC20), ethers.provider);
    this.EXM = new ethers.Contract(CONFIG.newVAB, JSON.stringify(ERC20), ethers.provider);
    
    this.swap = await (await this.swapFactory.deploy(CONFIG.oldVAB, CONFIG.newVAB)).deployed();     

    // ====== VAB
    // Transfering VAB token to user1, 2, 3
    await this.VAB.connect(this.auditor).transfer(this.customer1.address, getBigNumber(5000), {from: this.auditor.address});
    await this.VAB.connect(this.auditor).transfer(this.customer2.address, getBigNumber(5000), {from: this.auditor.address});
    await this.VAB.connect(this.auditor).transfer(this.customer3.address, getBigNumber(5000), {from: this.auditor.address});

    // Approve to transfer
    await this.VAB.connect(this.auditor).approve(this.swap.address, getBigNumber(1000000));
    await this.VAB.connect(this.customer1).approve(this.swap.address, getBigNumber(10000));
    await this.VAB.connect(this.customer2).approve(this.swap.address, getBigNumber(10000));
    await this.VAB.connect(this.customer3).approve(this.swap.address, getBigNumber(10000));  

    // ====== EXM
    // Transfering EXM token to user1, 2, 3
    await this.EXM.connect(this.auditor).transfer(this.customer1.address, getBigNumber(5000), {from: this.auditor.address});
    await this.EXM.connect(this.auditor).transfer(this.customer2.address, getBigNumber(5000), {from: this.auditor.address});
    await this.EXM.connect(this.auditor).transfer(this.customer3.address, getBigNumber(5000), {from: this.auditor.address});

    // Approve to transfer
    await this.EXM.connect(this.auditor).approve(this.swap.address, getBigNumber(1000000));
    await this.EXM.connect(this.customer1).approve(this.swap.address, getBigNumber(10000));
    await this.EXM.connect(this.customer2).approve(this.swap.address, getBigNumber(10000));
    await this.EXM.connect(this.customer3).approve(this.swap.address, getBigNumber(10000));  

    // Confirm auditor
    expect(await this.swap.owner()).to.be.equal(this.auditor.address);    
    
    this.events = [];
  });

  it('Transfer ownership', async function () {
    // Transfer auditor to new address
    await this.swap.transferOwnership(this.newAuditor.address);
    
    expect(await this.swap.owner()).to.be.equal(this.newAuditor.address);            
  });

  it('Swap Test', async function () {
    const vabBalance1 = await this.VAB.balanceOf(this.customer1.address) // old VAB
    const exmBalance1 = await this.EXM.balanceOf(this.customer1.address) // new VAB
    console.log('=====balances-before:', vabBalance1.toString(), exmBalance1.toString())
    // 5078.045311936606546366 5000.000000000000000000
    // 4578.045311936606546366 5500.000000000000000000

    // =========== swap
    const swapAmount = getBigNumber(500)
    await expect(
      this.swap.connect(this.customer1).swap(swapAmount, {from: this.customer1.address})
    ).to.be.revertedWith('Insufficient pool new tokens');

    // =========== addLiquidity
    const newVABamount = getBigNumber(20000) // EXM
    await this.swap.connect(this.auditor).addLiquidity(newVABamount, {from: this.auditor.address})
    const liquidityAmount = await this.EXM.balanceOf(this.swap.address)    
    expect(liquidityAmount).to.be.equal(newVABamount);  

    await this.swap.connect(this.customer1).swap(swapAmount, {from: this.customer1.address})
    
    const vabBalance2 = await this.VAB.balanceOf(this.customer1.address) // old VAB
    const exmBalance2 = await this.EXM.balanceOf(this.customer1.address) // new VAB
    // console.log('=====balances-after:', vabBalance2.toString(), exmBalance2.toString())
    expect(vabBalance2).to.be.equal(BigNumber.from(vabBalance1).sub(swapAmount));  
    expect(exmBalance2).to.be.equal(BigNumber.from(exmBalance1).add(swapAmount));  

    const newVABAddress = await this.swap.newVAB()    
    const oldVABAddress = await this.swap.oldVAB()    
    expect(oldVABAddress).to.be.equal(this.VAB.address);  
    expect(newVABAddress).to.be.equal(this.EXM.address);  

    const vabBalance3 = await this.VAB.balanceOf(this.swap.address) // old VAB
    const exmBalance3 = await this.EXM.balanceOf(this.swap.address) // new VAB
    // console.log('=====balances-contract1:', vabBalance3.toString(), exmBalance3.toString())


    // =========== withdrawOldVABToken
    const wAmount = getBigNumber(100);
    await expect(
      this.swap.connect(this.customer1).withdrawOldVABToken(wAmount, {from: this.customer1.address})
    ).to.be.revertedWith('Ownable: caller is not the owner');

    await this.swap.connect(this.auditor).withdrawOldVABToken(wAmount, {from: this.auditor.address})
    const vabBalance4 = await this.VAB.balanceOf(this.swap.address) // old VAB
    const exmBalance4 = await this.EXM.balanceOf(this.swap.address) // new VAB
    expect(vabBalance4).to.be.equal(BigNumber.from(vabBalance3).sub(wAmount));  
    expect(exmBalance4).to.be.equal(exmBalance3); 
    // console.log('=====balances-contract2:', vabBalance4.toString(), exmBalance4.toString())

    
    // =========== withdrawNewVABToken
    await this.swap.connect(this.auditor).withdrawNewVABToken(wAmount, {from: this.auditor.address})
    const vabBalance5 = await this.VAB.balanceOf(this.swap.address) // old VAB
    const exmBalance5 = await this.EXM.balanceOf(this.swap.address) // new VAB
    expect(vabBalance5).to.be.equal(vabBalance4);  
    expect(exmBalance5).to.be.equal(BigNumber.from(exmBalance4).sub(wAmount)); 


    // =========== addPairTokens
    await expect(
      this.swap.connect(this.auditor).addPairTokens(CONFIG.newVAB, CONFIG.usdcAdress, {from: this.auditor.address})
    ).to.be.revertedWith('wrong decimals');

    await expect(
      this.swap.connect(this.auditor).addPairTokens(this.customer1.address, CONFIG.usdcAdress, {from: this.auditor.address})
    ).to.be.revertedWith('old: not contract address');

    await this.swap.connect(this.auditor).addPairTokens(CONFIG.usdtAdress, CONFIG.usdcAdress, {from: this.auditor.address})
    const newAddress = await this.swap.newVAB()    
    const oldAddress = await this.swap.oldVAB()    
    expect(oldAddress).to.be.equal(CONFIG.usdtAdress);  
    expect(newAddress).to.be.equal(CONFIG.usdcAdress);  

    console.log('=====test end')
  });
});
