import React, { useState } from "react";
import './proposals.css';
import { useAccount, useBalance, useContractRead, useContractWrite} from 'wagmi'
import { ZCD_ABI, 
         DAO_ABI,
         DAO_CONTRACT_ADDRESS,
         ZCD_CONTRACT_ADDRESS,
         } from '../constants/index.js';
import Popup from "./Popup";
import { utils } from "ethers";


function ProposalsTab () {

    // Ether balance of the DAO contract
    const [DAOEtherBalance, setDAOEtherBalance] = useState(0);
    // number of proposals
    const [numOfProposals, setNumOfProposals] = useState(0);
    // zcd balance of user
    const [ZCDBalance, setZCDBalance] = useState(0);
    // id of proposal to search
    const [idOfProposal, setIdOfProposal] = useState("");

   
    // general state tracking
    const [NFTTokenIdParsed, setNFTTokenIdParsed] = useState("");

    const [deadlineParsed, setDeadlineParsed] = useState("");

    const [forVotesParsed, setForVotesParsed] = useState("");

    const [againstVotesParsed, setAgainstVotesParsed] = useState("");
    
    const [executedParsed, setExecutedParsed] = useState(null);
    // NFT token id retuned among proposals
    const [NFTTokenId, setNFTTokenId] = useState("");
    // popupVote will trigger the props of Popup for creating proposal
    const [popupCreate, setPopupCreate] = useState(false);
    // popupVote will trigger the props of Popup for voting
    const [popupVote, setPopupVote] = useState(false);
    // NFT token id for propose 
    const [NFTTokenIdForPropose, setNFTTokenIdForPropose] = useState("");
    // account of the user
    const account = useAccount();
    // variable to check the time of deadline
    const now = new Date();
   

    const { refetch: getDAOEtherBalance } = useBalance({
        address: DAO_CONTRACT_ADDRESS,
        onSuccess(data) {
            setDAOEtherBalance(data);
           
        },
        onError(data) {
            console.log(data)
            setDAOEtherBalance(data.value)
        }
    })

    const { refetch: getNumOfProposals } = useContractRead({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'numProposals',
        onSuccess(data) {
            setNumOfProposals(data);
            
        },
        onError(data) {
            console.log(data)
        }
    })

    const { refetch: getZCDBalanceUser } = useContractRead({
        address: ZCD_CONTRACT_ADDRESS,
        abi: ZCD_ABI,
        functionName: 'balanceOf',
        args: [account.address],
        onSuccess(data){
            setZCDBalance(data);
            console.log(data)
            
        },
        onError(data) {
            console.log(data)
        }
    })

    const { write: createProposal } = useContractWrite({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'createProposal',
        args: [NFTTokenIdForPropose],
        onSettled(data) {
             getNumOfProposals();
        },
        onError(data) {
            console.log(data)
        }
    })

    const {refetch: getProposalById } = useContractRead({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'proposals',
        args: [idOfProposal],
        onSuccess(data) {
            const parse = {
                proposalId: idOfProposal,
                NFTTokenId: data.nftTokenId,
                deadline: new Date(parseInt(data.deadline.toString()) * 1000),
                yesVotes: data.yesVotes,
                noVotes: data.noVotes,
                executed: data.executed
            }
             setNFTTokenIdParsed(parseInt(parse.NFTTokenId))
             setDeadlineParsed(parse.deadline)
            setForVotesParsed(parseInt(parse.yesVotes))
            setAgainstVotesParsed(parseInt(parse.noVotes))
            setExecutedParsed(parse.executed)
        },
        onError(data) {
            console.log(data)
        },
        enabled: true
    })

   
    const { write: voteOnProposalToAgainst } = useContractWrite({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'voteOnProposal',
        args: [idOfProposal, 1],
        
        onError(data) {
            console.log(data)
        },
        overrides: {
            gasLimit: 100000
        }
    })
    const { write: voteOnProposalToFor } = useContractWrite({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'voteOnProposal',
        args: [idOfProposal, 0],
        
        onError(data) {
            console.log(data)
        },
        overrides: {
            gasLimit: 100000
        }
    })
    const { write: executeProposal } = useContractWrite({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'execute',
        args: [idOfProposal],
        overrides: {
            gasLimit: 100000
        }
    })
    
    return (
        <div className="propaslsTab">

            {/* the search div below will search among the proposals */}
            <div className="search-for-proposal">
                <input placeholder="proposal id" id="proposal-search" onChange={(e) => setIdOfProposal(e.target.value)}/>
                <button className="search-btn" onClick={getProposalById}>
                    Search
                </button>
            </div>


            <div className="proposal-div">
                {/* the condition down below will check if id of the Proposal is provided or not, if it is provided it will return 
                    the information about proposal and if not it will return a message that tells the user to search among the target proposals */}
                    {idOfProposal ? 
                    <div className="proposal-info">
                        <p className="proposal-id">
                    Proposal #{idOfProposal}
                    
                </p>
                <ul>
                    <li>
                        NFT Id: {NFTTokenIdParsed}
                    </li>
                    <li>
                        Deadline: <br/>  {  now.toLocaleString() > deadlineParsed.toLocaleString() ? "deadline reached" : deadlineParsed.toLocaleString() }
                    </li>
                   <li>
                    For: {forVotesParsed}
                   </li>
                   <li>
                    Against: {againstVotesParsed}
                   </li>
                </ul>
            </div> : <div className="proposal-info">
                    <p className="disclaimer">
                        Please first search among the proposals that you want vote or execute
                    </p>
                        <p> Number of Proposals: {parseInt(numOfProposals)}</p>
            </div> }
                
                {/* the condition below will check to see if the proposal have been executed before or not, if so it will just return
                the message Proposal have been executed, and if not it will return buttons to vote and execute*/}
                { executedParsed ?
                 <p className="disclaimer-executed"> Proposal have been executed </p>
                    :
                <div className="buttons">

                {/* the vote button will open a popup window which user can vote, and if the conditions didnt meet it will be disabled*/}
                <button className="vote-btn" onClick={()=> setPopupVote(true)} disabled={deadlineParsed.toLocaleString() < now.toLocaleString() 
                                                                                            || !idOfProposal || utils.formatEther(ZCDBalance) <= 0}>
                    Vote
                </button>
               
                {/* the execute button will execute the proposal and it will be disabled if the conditions didnt meet*/}
                <button className="execute-btn" onClick={executeProposal} disabled={now.toLocaleString() < deadlineParsed.toLocaleString() 
                                                                                    || executedParsed 
                                                                                    || !idOfProposal 
                                                                                    || utils.formatEther(ZCDBalance) <= 0
                                                                                    || DAOEtherBalance < 0}>
                    Execute
                </button>

                </div>}
                
            </div>

        <div className="create-div">
        <button className="create-btn" onClick={() => setPopupCreate(true)}>
            Create
        </button>
        </div>
            
            {/* if the trigger is true the window will Popup*/}      
            <Popup trigger={popupCreate} >

                <label htmlFor="create-input" className="label-input-create">{utils.formatEther(ZCDBalance) <= 0 ? "You dont own any governance token" : "NFT Token Id you want to propose:"}  </label>
                <input className="create-input" onChange={(e)=> setNFTTokenIdForPropose(e.target.value)} 
                    id="create-input" placeholder="Token Id" type="number" disabled={utils.formatEther(ZCDBalance) <= 0}/>

                
               <button className="propose-btn" onClick={createProposal} disabled={utils.formatEther(ZCDBalance) <= 0}>
                    Propose
               </button>
               <button className="close-btn" onClick={() => setPopupCreate(false)}>
                    Close
                </button>
            </Popup>

             {/* if the trigger is true the window will Popup*/}     
            <Popup trigger={popupVote}>
                <p>
                    if you want to cast your vote, either click on For or Against button
                </p>

                <button className="for-btn" onClick={voteOnProposalToFor}> 
                    For
                </button>

                <button className="against-btn" onClick={voteOnProposalToAgainst}>
                    Against
                </button>

                <button className="close-btn" onClick={()=> setPopupVote(false)}>
                    Close
                </button>
            </Popup>
        </div>


    )
}

export default ProposalsTab;