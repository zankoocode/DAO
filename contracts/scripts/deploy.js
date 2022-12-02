
const hre = require("hardhat");

async function main() {


  const zankoocodeToken = await hre.ethers.getContractFactory("zankoocodeToken");
  const zcdtoken = await zankoocodeToken.deploy();

  await zcdtoken.deployed();

  console.log(
    `token deployed to ${zcdtoken.address}`
  );

  const TimeLock = await hre.ethers.getContractFactory("TimeLock");
  const timeLock = await TimeLock.deploy(1, [], []);

  await timeLock.deployed();

  console.log(
    `TimeLock deployed to ${timeLock.address}`
  );

  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(zcdtoken.address, timeLock.address);

  await governance.deployed();

  console.log(
    `Governance deployed to ${governance.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
