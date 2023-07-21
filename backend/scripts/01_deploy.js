const hre = require("hardhat");

async function main() {
  // Deploy Marketplace
  const marketplace = await hre.ethers.deployContract("Marketplace");
  await marketplace.waitForDeployment();

  console.log(`Marketplace deployed to ${marketplace.target}`);

  // Deploy ERC4907 NFT Collection
  const rentableNFTs = await hre.ethers.deployContract("RentableNFTs");
  await rentableNFTs.waitForDeployment();

  console.log(`RentableNFTs deployed to ${rentableNFTs.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
