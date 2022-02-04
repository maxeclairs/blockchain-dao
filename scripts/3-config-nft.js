import sdk from './1-initialize-sdk.js';
import {readFileSync} from 'fs';

const bundleDrop = sdk.getBundleDropModule("0x715B7E357c8fAD291C6C0E4739D721bB3bca2F5d");

(async () => {
    try{
        // create a bundle drop batch
        await bundleDrop.createBatch([
           { // collection name
            name: "MusicDAO Membership Token",
            description: "This NFT will give you access to MusicDAO",
            image: readFileSync("scripts/assets/music-dao-logo.jpg"),        
           },
        ]);
        console.log("Successfully created a new NFT in the drop!");
    } catch (e){
        console.error("Failed to create new NFT", e);
        process.exit(1);
    }
})()