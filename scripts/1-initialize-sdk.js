import { ThirdwebSDK } from '@3rdweb/sdk';
import ethers from 'ethers';

// importing .env file
import dotenv from 'dotenv';
dotenv.config();


// quick checks to see if .env file is setup correctly
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == '') {
    console.error('Please setup .env file with your private key');
    process.exit(1);
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == '') {
    console.error('Please setup .env file with your Alchemy API URL');
    process.exit(1);
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == '') {
    console.error('Please setup .env file with your wallet address');
    process.exit(1);
}

const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY,

        // RPC url, we'll use Alchemy URL from env file
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

(async  () => {
    try {
        const apps = await sdk.getApps();
        console.log("App address is: ", apps[0].address);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})()

export default sdk;
