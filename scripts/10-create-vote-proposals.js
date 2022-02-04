// import ethers and sdk
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// get vote module
const voteModule = sdk.getVoteModule("0x480ddCBc75d7b3543270Bf1Bab6419DE5C60a096");

// ERC-20 contract
const tokenModule = sdk.getTokenModule("0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0");

(async () => {
    try{
        const amount = 100_000;
        // create proposal to mint 100000 new tokens
        await voteModule.propose(
            "Should the DAO mint additional " + amount + " tokens into the treasury?",
            [
                {
                    // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
                    // to send in this proposal. Here, we are sending 0 ETH. because we are 
                    // minting new tokens
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        "mint",
                        [
                            voteModule.address, // tokens are minted to voteModule
                            ethers.utils.parseUnits(amount.toString(), 18), // how much will be mint
                        ]
                    ),
                    // token module will execute the mint
                    toAddress: tokenModule.address,
                },
            ]
        );
        console.log("Successfully created proposal to mint tokens");
    } catch(e){
        console.log("Unable to create first proposal", e);
        process.exit(1);
    }

    try {
        const amount = 1_000;

        await voteModule.propose(
            "Should the DAO transfer " + amount + " to " + process.env.WALLET_ADDRESS +
            " for creating proposals?",
            [
                {
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    toAddress: tokenModule.address,
                },
            ]
        );
        console.log("Successfully created proposal to reward!");
    } catch(e){
        console.log("Unable to create second proposal!", e);
    }
})();