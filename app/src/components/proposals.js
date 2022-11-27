import React, { useState } from "react";
import './proposals.css';
import { useAccount, useBalance, useContract, useContractRead, useContractWrite} from 'wagmi'
import { ZCD_ABI, 
         DAO_ABI,
         DAO_CONTRACT_ADDRESS,
         ZCD_CONTRACT_ADDRESS} from '../constants/index.js';

function ProposalsTab () {

    const [DAOEtherBalance, setDAOEtherBalance] = useState(0);

    const [numOfProposals, setNumOfProposals] = useState(0);

    const [proposals, setProposals] = useState([]);

    const [ZCDBalance, setZCDBalance] = useState(0);

    const [idOfProposal, setIdOfProposal] = useState(0);

    const [proposalIndex, setProposalIndex] = useState("");

    const [proposalToExecuteId, setProposalToExecuteToId] = useState("");

    const [NFTTokenId, setNFTTokenId] = useState("");

    const [vote, setVote] = useState("");

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
                deadline: data.deadline,
                yesVotes: data.yesVotes,
                noVotes: data.noVotes,
                executed: data.executed
            }
            return parse
        },
        onError(data) {
            console.log(data)
        }
    })

    const getAllProposals = async () => {
        try {
            const proposals = [];
            while(idOfProposal < numOfProposals) {
               const proposal = await getProposalById();
                proposals.push(proposal);
                idOfProposal++;
            }
            await setProposals(proposals);
            return proposals
        } catch (err) {
            console.log(err)
        }
    }

    const { write: voteOnProposal } = useContractWrite({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'voteOnProposal',
        args: [proposalIndex, vote],
        onSuccess(data){
            getAllProposals();
        },
        onError(data) {
            console.log(data)
        }
    })

    const { write: executeProposal } = useContractWrite({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: 'execute',
        args: [proposalToExecuteId],

    })

    const handleOnClickCreate = () => {
        return (
            <body>
            <div className="create-page">
                <input className="create-proposal-id" onChange={(e)=>{  setNFTTokenId(e.target.value)}} placeholder="NFT Token Id To be Proposed"/>
                <button className="propose-btn" >
                    Propose
                </button>
            </div>
            </body>
        )
    }
    return (
        <div className="propaslsTab">

            <div className="search-for-proposal">
               
                <input placeholder="proposal id" id="proposal-search" />
                <button className="search-btn">
                    Search
                </button>
            </div>

            <div className="proposal-div">
                <div className="proposal-info">
                <p className="proposal-id">
                    Proposal {/* ID of Proposal*/}
                    
                </p>
                <ul>
                    <li>
                        NFT Id: 
                    </li>
                    <li>
                        Deadline: 
                    </li>
                   <li>
                    For: 
                   </li>
                   <li>
                    Against:
                   </li>
                </ul>
                </div>
                <div className="buttons">
                <button className="vote-btn">
                    Vote
                </button>
                <button className="execute-btn">
                    Execute
                </button>
                </div>
            </div>

        <div className="create-div">
        <button className="create-btn" onClick={handleOnClickCreate}>
            Create
        </button>
        </div>
            

        </div>
    )
}

export default ProposalsTab;