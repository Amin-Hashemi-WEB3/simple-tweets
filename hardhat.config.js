require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();



task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
      goerli: {
         url: process.env.API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
      },
    },
      etherscan: {
    apiKey:"process.env.ETHERSCAN_KEY",
    
  }
};
