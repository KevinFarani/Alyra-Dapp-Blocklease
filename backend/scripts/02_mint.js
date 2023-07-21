const hre = require("hardhat");
const { CONTRACT_RENTABLENFTS_ADDR, CONTRACT_MARKETPLACE_ADDR } = require("../constants.js");

async function main() {

    // -- Users
    const [MARKETPLACE_OWNER, NFT_LENDER_1, NFT_LENDER_2] = await ethers.getSigners();

    // -- Contract
    const rentableNFTs = await ethers.getContractAt("RentableNFTs", CONTRACT_RENTABLENFTS_ADDR);

    // -- Mint
    let tx;
    tx = await rentableNFTs.connect(NFT_LENDER_1).mint("fakeURI");
    tx.wait();
    tx = await rentableNFTs.connect(NFT_LENDER_1).mint("fakeURI");
    tx.wait();
    tx = await rentableNFTs.connect(NFT_LENDER_2).mint("fakeURI");
    tx.wait();

    let balanceOf_Lender1 = await rentableNFTs.balanceOf(NFT_LENDER_1.address);
    let balanceOf_Lender2 = await rentableNFTs.balanceOf(NFT_LENDER_2.address);
    console.log(`NFT_LENDER_1 has minted ${balanceOf_Lender1} NFTs`);
    console.log(`NFT_LENDER_2 has minted ${balanceOf_Lender2} NFTs`);

    // -- Approve marketplace
    tx = await rentableNFTs.connect(NFT_LENDER_1).setApprovalForAll(CONTRACT_MARKETPLACE_ADDR, true);
    tx.wait();
    tx = await rentableNFTs.connect(NFT_LENDER_2).setApprovalForAll(CONTRACT_MARKETPLACE_ADDR, true);
    tx.wait();

    console.log("Marketplace contract is approved on NFTs contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
