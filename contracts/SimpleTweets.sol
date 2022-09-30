// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;


import "hardhat/console.sol";

contract SimpleTweets {
    uint256 totalTweets;

    event NewTweet(address indexed from, uint256 timestamp, string message);

    struct Tweet {
        address tweeter; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Tweet[] tweets;


    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function tweet(string memory _message) public {
        totalTweets += 1;
        console.log("%s has waved! with the following message:", msg.sender, _message);

        tweets.push(Tweet(msg.sender, _message, block.timestamp));

        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        emit NewTweet(msg.sender, block.timestamp, _message);
    }

        /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllTweets() public view returns (Tweet[] memory) {
        return tweets;
    }

    function getTotalTweets() public view returns (uint256) {
        console.log("We have %d total tweets!", totalTweets);
        return totalTweets;
    }
}