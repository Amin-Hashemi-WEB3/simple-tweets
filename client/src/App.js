import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/SimpleTweets.json";
import LoadingBar from 'react-top-loading-bar'




const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [tweetNumber, setTweetNumber] = useState(0);
  const [allTweets, setAllTweets] = useState([]);
  const [progress, setProgress] = useState(0);
  const [mining, setMining] = React.useState(false);
  const [tweetValue, setTweetValue] = React.useState("")



  const contractAddress = "0xe559806EfC1Fb9e2D3689F1829d7991ac58422c7";
  const contractABI = abi.abi;


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllTweets();
        getTotalTweets();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const tweet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tweetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await tweetPortalContract.getTotalTweets();
        console.log("Retrieved total tweet count...", count.toNumber());
        

        /*
        * Execute the actual tweet from your smart contract
        */
        const tweetTxn = await tweetPortalContract.tweet(tweetValue);
        console.log("Mining...", tweetTxn.hash);
        setMining(mining => !mining);
        setProgress(progress + 30);
        await tweetTxn.wait();
        setMining(mining => !mining);
        setProgress(100);
        console.log("Mined -- ", tweetTxn.hash);
        setTweetValue("type your tweet");

        count = await tweetPortalContract.getTotalTweets();
        console.log("Retrieved total tweet count...", count.toNumber());
        //setTweetNumber(count.toNumber());
        getTotalTweets();
        

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalTweets = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const tweetPortalContract = new ethers.Contract(contractAddress,contractABI, signer);
    let _totalTweets = await tweetPortalContract.getTotalTweets();
    setTweetNumber(_totalTweets.toNumber());
  }

  const getAllTweets = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tweetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllTweets method from your Smart Contract
         */
        const tweets = await tweetPortalContract.getAllTweets();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let tweetsCleaned = [];
        tweets.forEach(tweet => {
          tweetsCleaned.push({
            address: tweet.tweetr,
            timestamp: new Date(tweet.timestamp * 1000),
            message: tweet.message
          });
        });
        
        /*
         * Store our data in React State
         */
        setAllTweets(tweetsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewTweet = (from, timestamp, message) => {
    console.log("NewTweet", from, timestamp, message);
    setAllTweets(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewTweet", onNewTweet);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewTweet", onNewTweet);
    }
  };
}, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        🐦 Hey there!
        </div>

        <div className="bio">
          Hello, I am Amin. This is one of my first web3 projects. Write a message and Tweet! Connect your Ethereum wallet using Goerli (currently).
           <p>Wallet with address {currentAccount} is connected</p>
           <p>You have been tweeted {tweetNumber} at times</p>

        </div>

        {
          currentAccount ? (
            <textarea name="tweetArea"
            placeholder="type your tweet"
            type="text"
            id="tweet"
            value={tweetValue}
            onChange={e => setTweetValue(e.target.value)} />
            ) : null
        }
        <br/> 

        <LoadingBar color="teal" shadow = {true} progress={progress} onLoaderFinished={() => setProgress(0)} />
        <button className="tweetButton" onClick={tweet}>
          Send your Tweet
        </button>

        
          

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="tweetButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allTweets.map((tweet, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {tweet.address}</div>
              <div>Time: {tweet.timestamp.toString()}</div>
              <div>Message: {tweet.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}

export default App

