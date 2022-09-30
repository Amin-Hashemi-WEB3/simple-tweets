const hre = require("hardhat");

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const simpleTweetFactory = await hre.ethers.getContractFactory("SimpleTweets");
  const tweetContract = await simpleTweetFactory.deploy();
  await tweetContract.deployed();

  console.log("SimpleTweet address: ", tweetContract.address);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
