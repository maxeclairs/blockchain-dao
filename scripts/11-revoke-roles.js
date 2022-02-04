// import sdk and token
import sdk from './1-initialize-sdk.js';

const tokenModule = sdk.getTokenModule("0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0");

(async () => {
    
    try{
    // get all roles

    console.log("Existing roles right now", tokenModule.getAllRoleMembers() );

    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);

    console.log("Roles after revoking ourselves ", tokenModule.getAllRoleMembers());

    console.log("Successfully revoked all superpowers from ERC-20 contract");
    }catch(e){
        console.log("Unable to revoke roles", e);
    }
})();