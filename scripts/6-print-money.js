import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// get token module
const tokenModule = sdk.getTokenModule("0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0");

(async () => {
    try{
        // total supply of tokens
        const amount = 1_000_000;

        // with util function from "ethers", convert the amount to have 18 decimals
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);

        // mint the tokens
        await tokenModule.mint(amountWith18Decimals);
        const totalSuppy = await tokenModule.totalSupply();

        // console log the total no. of tokens
        console.log("There are ", ethers.utils.formatUnits(totalSuppy, 18), "MDGT in circulation.");

    } catch(e){
        console.error("Failed to generate tokens", e);
    }

})();


