const hre = require("hardhat");
const { CONTRACT_MARKETPLACE_ADDR, CONTRACT_RENTABLENFTS_ADDR } = require("../constants.js");

async function main() {
    
    // -- Users
    const [MARKETPLACE_OWNER, NFT_LENDER_1, NFT_LENDER_2] = await ethers.getSigners();

    // -- Contracts
    const marketplace = await ethers.getContractAt("Marketplace", CONTRACT_MARKETPLACE_ADDR);

    // -- List
    let tx;
    tx = await marketplace.connect(NFT_LENDER_1).listNFT(CONTRACT_RENTABLENFTS_ADDR, 1, ethers.parseEther("0.01"), 1, 10);
    tx.wait();
    tx = await marketplace.connect(NFT_LENDER_1).listNFT(CONTRACT_RENTABLENFTS_ADDR, 2, ethers.parseEther("1"), 1, 10);
    tx.wait();
    tx = await marketplace.connect(NFT_LENDER_2).listNFT(CONTRACT_RENTABLENFTS_ADDR, 3, ethers.parseEther("0.2"), 5, 20);
    tx.wait();
    
    let allListings = await marketplace.getAllListings();
    console.log(`Marketplace have currently ${allListings.length} NFTs listed :`);
    console.log(allListings);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
