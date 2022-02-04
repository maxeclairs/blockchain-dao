import sdk from './1-initialize-sdk.js';

const appModule = sdk.getAppModule("0xb155f65Fb8bd89559Ba74Ce3b5c05537112490Da");

(async () => {
    try {
        
        const voteModule = await appModule.deployVoteModule({
        
            //governance contract name
            name: "MusicDAO Proposals",

            // location of the governance contract
            votingTokenAddress: "0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0",

            // start time of voting
            proposalStartWaitTimeInSeconds: 0,

            // voting period
            proposalVotingTimeInSeconds: 60 * 60 * 24,

            // minimum % of tokens used to pass the proposal
            votingQuorumFraction: 0,

            minimumNumberOfTokensNeededToPropose: "0",

        });
        console.log("Vote module deployed at address", voteModule.address);

    } catch (e) {
        console.error("Unable to deploye vote module", e);
        process.exit(1);
    }
})();