import { useEffect, useState, useNemo, useMemo } from "react";
import { UnsupportedChainIdError } from "@web3-react/core";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK, TokenModule } from "@3rdweb/sdk";
import { ethers } from "ethers";

// instantiate the sdk on Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// get the reference of our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule("0x715B7E357c8fAD291C6C0E4739D721bB3bca2F5d");

const tokenModule = sdk.getTokenModule("0x94A5DD0Dd5c48C7eb4348a54f5100B777a471Ca0");

const voteModule = sdk.getVoteModule("0x480ddCBc75d7b3543270Bf1Bab6419DE5C60a096");

const App = () => {

  //use connectWallet hook from thirdweb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // get signer
  const signer = provider ? provider.getSigner() : undefined;

  // declare state variable to check the user has our NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // isClaiming state for loading state as the NFT is being minted
  const [isClaiming, setIsClaiming] = useState(false);

  // holds the no. of tokens each member has
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  // array that holds the memberAddress
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // fetch all proposals from our contract
  useEffect(()=>{
    if(!hasClaimedNFT){
      return;
    }

    //get all proposals with getAll()
    voteModule
    .getAll()
    .then((proposals) => {
      //set state
      setProposals(proposals);
      console.log("Proposals:", proposals)
    })
    .catch((error)=>{
      console.error("Failed to get proposals", error);
    });
  }, [hasClaimedNFT]);

  // check if the use has already voted
  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    // return if we don't get any proposals
    if(!proposals.length){
      return;
    }

    // check if the use has already voted on first proposal
    voteModule
    .hasVoted(proposals[0].proposalId, address)
    .then((hasVoted) => {
      setHasVoted(hasVoted);
      if (hasVoted){
        console.log("User has already voted");
      }else{
        console.log("User has not voted yet.");
      }
    })
    .catch((e)=>{
      console.log("Failed to check if use has voted", e)
    });
  },[hasClaimedNFT, proposals, address]);


  // a fancy function to shorten the wallet address
  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  };

  // useEffect to grab all the addresses of members with NFT
  useEffect( () => {
   if (!hasClaimedNFT) {
     return;
   } 

   // get the addresses of the users with our NFTs
   bundleDropModule
   .getAllClaimerAddresses("0")
   .then((addresses) => {
     console.log("Member addresses: ", addresses)
     setMemberAddresses(addresses);
   });
  }, [hasClaimedNFT]);

  // this useEffect grabs the number of tokens each member holds
  useEffect( () => {
    if(!hasClaimedNFT){
      return;
    }

    // grab all the balances of tokens
    tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("Amounts: ", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((e) => {
      console.error("Failed to get tokem amounts.", e);
    });
  }, [hasClaimedNFT]);

  // combine member address and member token into one array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // if the address is not in the memberTokenAmounts, it means they don't hold any token
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  // useEffect to pass our signer to the sdk
  useEffect( () => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    
    // exit if the wallet is not connected
    if (!address) {
      return;
    }

    // check if the user has NFT by using bundleDropModule.balanceOf
    return (
      bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // if balance is greater than 0 then the user has our membership NFT
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("User has membership NFT");
        } else {
          setHasClaimedNFT(false);
          console.log("User does not have membership NFT");
        }
      })
      .catch((e) => {
        setHasClaimedNFT(false);
        console.log("Failed to check if user has membership NFT", e);
        })
    )
  }, [address]);
  if (error instanceof UnsupportedChainIdError ) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }

  if (!address){
    return (
      <div className="landing">
        <h1>Welcome to MusicDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">Connect Wallet</button>
      </div>
    );
  }

 // If the user has already claimed their NFT we want to display the interal DAO page to them
  // only DAO members will see this. Render all the members + token amounts.
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🎵 MusicDAO Member Dashboad</h1>
        <p>Congratulations on being a member!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🎵 MusicDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => {
          setIsClaiming(true);
          // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
          bundleDropModule
            .claim("0", 1)
            .catch((err) => {
              console.error("failed to claim", err);
              setIsClaiming(false);
            })
            .finally(() => {
              // Stop loading state.
              setIsClaiming(false);
              // Set claim state.
              setHasClaimedNFT(true);
              // Show user their fancy new NFT!
              console.log(
                `Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
              );
            });
        }}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;