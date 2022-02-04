import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// bundle drop module from ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule("0x715B7E357c8fAD291C6C0E4739D721bB3bca2F5d");

// ERC-20 Token module
const tokenModule = sdk.getTokenModule("0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0");

(async ()=>{
    try {
        // get the addresses with membership NFT
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

        if (walletAddresses.length === 0){
            console.error("No NFTs has been claimed yet. Ask your friends to claim free NTFs!");
            process.exit(0);
        }

        // loop through the array of addresses
        const airdropTargets = walletAddresses.map((address) => {
            // pick a random number between 1000 and 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000 );
            console.log("Going to airdrop", randomAmount, "tokens to", address);

            // store data in the dictionary for airdrops
            const airdropTarget = {
                address,
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
            };

            return airdropTarget;
        });

        // call transferBatch on all airdrop targets
        console.log("Starting the airdrop...");
        await tokenModule.transferBatch(airdropTargets);
        console.log("Successfully airdropped MDGT to all the Members")

    } catch(e){
        console.error(e)
    }

})();