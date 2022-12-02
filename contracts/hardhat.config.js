require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const GOERLI = process.env.GOERLI;
const MUMBAI = process.env.MUMBAI;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
  
  }
  
  }
  ,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      
    }
  }}
