const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UTG", function() {
  it("Should mint and transfer an NFT to someone", async function () {
    const NerdGuy = await ethers.getContractFactory("UnsatiableGuy");
    const nerdGuy = await NerdGuy.deploy();

    await nerdGuy.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI = 'cid/test.png';

    let balance = await nerdGuy.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await nerdGuy.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.05') });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await nerdGuy.balanceOf(recipient);
    expect(await nerdGuy.isContentOwned(metadataURI)).to.equal(true); 
    
  });
});