import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule("0x715B7E357c8fAD291C6C0E4739D721bB3bca2F5d");

(async () => {
    try{
        //create a claim condition factory
        const claimConditionFactory = await bundleDrop.getClaimConditionFactory();

        // specify the conditions with newClaimPhase
        claimConditionFactory.newClaimPhase({
            // start time, the time since when users are allowed to mint NFTs
            startTime: new Date(),
            maxQuantity: 50_000, // max number of membership NFTs that can be minted
            maxQuantityPerTransaction: 1, // tokes that can be minted per transaction
        });

        // now we will interact with our deployed contract and adjust the conditions
        // we pass 0 as the token id because this is our first token on this ERC-1155 contract
        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("Successfully set claim condition on bundle drop at address", bundleDrop.address);
    } catch (e) {
        console.log("Failed to set Claim Condition", e);
    }
})()
    

