// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const main = async () => {
  const [owner, randomPerson,RP2] = await hre.ethers.getSigners();
  const tweetContractFactory = await hre.ethers.getContractFactory("SimpleTweets");
  const tweetContract = await tweetContractFactory.deploy();
  await tweetContract.deployed();

  console.log("Contract deployed to:", tweetContract.address);
  console.log("Contract deployed by:", owner.address);

 

  let tweetTxn = await tweetContract.tweet("Booyakasha!");
  await tweetTxn.wait();

  tweetTxn = await tweetContract.connect(randomPerson).tweet("Hear me now rude boy!");
await tweetTxn.wait();


let allTweets = await tweetContract.getAllTweets();
  console.log(allTweets);

 let tweetCount;
  tweetCount = await tweetContract.getTotalTweets();
  console.log(tweetCount.toNumber());

 
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


