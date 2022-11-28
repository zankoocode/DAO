import React, { useEffect, useState } from "react";
import './proposals.css';
import { useAccount, useBalance, useContract, useContractRead, useContractWrite} from 'wagmi'
import { ZCD_ABI, 
         DAO_ABI,
         DAO_CONTRACT_ADDRESS,
         ZCD_CONTRACT_ADDRESS,
         NFT_MARKETPLACE_CONTRACT_ADDRESS,
         NFT_CONTRACT_ABI} from '../constants/index.js';
import Popup from "./Popup";
import { utils } from "ethers";
import { id } from "ethers/lib/utils.js";

function ProposalsTab () {

    const [DAOEtherBalance, setDAOEtherBalance] = useState(0);

    const [numOfProposals, setNumOfProposals] = useState(0);

    const [proposals, setProposals] = useState([]);

    const [ZCDBalance, setZCDBalance] = useState(0);

    const [idOfProposal, setIdOfProposal] = useState("");

    const [proposalIndex, setProposalIndex] = useState(0);

    const [proposalToExecuteId, setProposalToExecuteToId] = useState("");

    const [NFTTokenIdParsed, setNFTTokenIdParsed] = useState("");

    const [deadlineParsed, setDeadlineParsed] = useState("");

    const [forVotesParsed, setForVotesParsed] = useState("");

    const [againstVotesParsed, setAgainstVotesParsed] = useState("");

    const [executedParsed, setExecutedParsed] = useState(null);

    const [NFTTokenId, setNFTTokenId] = useState("");

    const [popupCreate, setPopupCreate] = useState(false);

    const [popupVote, setPopupVote] = useState(false);

    const [vote, setVote] = useState(1);

    const account = useAccount();

    const { refetch: getDAOEtherBalance } = useBalance({
        address: DAO_CONTRACT_ADDRESS,
        onSuccess(data) {
            setDAOEtherBalance(data);
           
        },
        onError(data) {
            console.log(data)
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
        args: [NFTTokenId],
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
            
             console.log(parse)
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
        args: [proposalToExecuteId],

    })

   
    return (
        <div className="propaslsTab">

            <div className="search-for-proposal">
               
                <input placeholder="proposal id" id="proposal-search" onChange={(e) => setIdOfProposal(e.target.value)}/>
                <button className="search-btn" onClick={getProposalById}>
                    Search
                </button>
            </div>

            <div className="proposal-div">

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
                        Deadline: <br/> { deadlineParsed.toLocaleString() }
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
                
                { executedParsed ? <p> "Proposal have been executed" </p>:
                <div className="buttons">
                <button className="vote-btn" onClick={()=> setPopupVote(true)} disabled={!idOfProposal || utils.formatEther(ZCDBalance) <= 0}>
                    Vote
                </button>
                <button className="execute-btn" disabled={!idOfProposal || utils.formatEther(ZCDBalance) <= 0}>
                    Execute
                </button>
                </div>}
                
            </div>

        <div className="create-div">
        <button className="create-btn" onClick={() => setPopupCreate(true)}>
            Create
        </button>
        </div>
            
                        
            <Popup trigger={popupCreate} >

                <label htmlFor="create-input" className="label-input-create">{utils.formatEther(ZCDBalance) <= 0 ? "You dont own any governance token" : "NFT Token Id you want to propose:"}  </label>
               <input className="create-input" onChange={(e)=> setNFTTokenId(e.target.value)} 
                    id="create-input" placeholder="Token Id" type="number" disabled={utils.formatEther(ZCDBalance) <= 0}/>

                
               <button className="propose-btn" onClick={createProposal} disabled={utils.formatEther(ZCDBalance) <= 0}>
                    Propose
               </button>
               <button className="close-btn" onClick={() => setPopupCreate(false)}>
                    Close
                </button>
            </Popup>


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