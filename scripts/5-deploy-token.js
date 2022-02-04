import sdk from "./1-initialize-sdk.js";

// call app module to deploy new contract
const app = sdk.getAppModule("0xb155f65Fb8bd89559Ba74Ce3b5c05537112490Da");

(async () =>{
    try {

        //deploy standard ERC-20 contract
        const tokenModule = await app.deployTokenModule({
            
            // token name
            name: "MusicDAO Governance Token",

            // symbol
            symbol: "MDGT",

        });
        console.log("Token module deployed at address", tokenModule.address);
    } catch(e){
        console.error("Failed to deploye token module", e);
    }

})();