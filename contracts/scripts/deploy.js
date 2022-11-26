
const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  
  
  const NFTMarketPlace = await hre.ethers.getContractFactory("NFTMarketPlace");
  const nftmarketplace = await NFTMarketPlace.deploy();

  await nftmarketplace.deployed();

  console.log(
    ` NFT Market Place deployed to ${nftmarketplace.address}`
  );

  const DAO = await hre.ethers.getContractFactory("DAO");
  const dao = await DAO.deploy(
    nftmarketplace.address,
    "0x7f0Ed920Ed6b5bd1fBFd5Ab6b46DE777997468A5"
  );

  await dao.deployed();

  console.log(
    ` DAO deployed to ${dao.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
