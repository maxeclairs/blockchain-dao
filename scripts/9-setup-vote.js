// import ethers and sdk
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// create voteModule constant
const voteModule = sdk.getVoteModule("0x480ddCBc75d7b3543270Bf1Bab6419DE5C60a096");

// ERC-20 contract
const tokenModule = sdk.getTokenModule("0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0");

(async ()=> {
    try{
        // grant minting rights to the vote module
        await tokenModule.grantRole("minter", voteModule.address);

        console.log("Minting rights granted to vote module");
    } catch(e){
        console.error("Failed to grant minting rights to vote module", e);
        process.exit(1);
    }

    // transfer tokens to vote module
    try{
        // get our wallet balance
        const ownedTokenBalance = await tokenModule.balanceOf(process.env.WALLET_ADDRESS);

        // grab 50% of our token and transfer it to the vote module
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const amountToTransfer = ownedAmount.div(2);
        await tokenModule.transfer(voteModule.address, amountToTransfer);

        console.log("Transferred", amountToTransfer.toString(), "MDGT to vote module");
    } catch(e){
        console.error("Failed to transfer tokens to vote module", e);
    }
})();