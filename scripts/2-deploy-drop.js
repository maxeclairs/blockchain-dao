import {ethers} from 'ethers';
import sdk from './1-initialize-sdk.js';
import {readFileSync} from 'fs';

const app = sdk.getAppModule("0xb155f65Fb8bd89559Ba74Ce3b5c05537112490Da");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            
            // collection name
            name: "MusicDAO Membership Token",
            
            // collection description
            description: "DAO for Music Lovers",

            //collection image
            image: readFileSync("scripts/assets/music-dao-logo.jpg"),

            // address that will receive the proceeds of the collection, 
            // passed AddressZero because we don't want to charge anyone for this
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log("Deployed Bundle Drop Module, address is: ", bundleDropModule.address);
        console.log(
            "Bundle drom meta data ",
            await bundleDropModule.getMetadata(),
        );
    } catch (e) {
        console.error("Failed to deploy module", e);
        process.exit(1);
    }
})()