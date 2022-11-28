// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// interface of NFT market place
interface INFTMarketPlace {
    function getNFTPrice () external view returns (uint256);

    function available (uint256 tokenId) external view returns (bool);

    function purchase (uint256 tokenId) external payable;
}   

interface IZCDtoken {
    function balanceOf(address owner) external view returns (uint256);
}

import "@openzeppelin/contracts/access/Ownable.sol";

contract DAO is Ownable {

    // this struct is containing all relevant information
    struct Proposal {
    // nftTokenId - the tokenID of the NFT to purchase from NFTMarketplace if the proposal passes
        uint256 nftTokenId;
    // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
        uint256 deadline;
    // yesVotes - number of yes votes for this proposal
        uint256 yesVotes;
    // noVotes - number of no votes for this proposal
        uint256 noVotes;
    // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
    // voters - a mapping of CryptoDevsNFT tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not
        mapping(address => bool) voters;
    }

    // Create a mapping of ID to Proposal
        mapping(uint256 => Proposal) public proposals;
    // Number of proposals that have been created
        uint256 public numProposals;

    INFTMarketPlace NFTMarketPlace;
    IZCDtoken ZCDToken;

    constructor (address _NFTMarketPlace, address _ZCDToken) {
        NFTMarketPlace = INFTMarketPlace(_NFTMarketPlace);
        ZCDToken = IZCDtoken(_ZCDToken);
    }

    modifier onlyTokenHolder {
        require(ZCDToken.balanceOf(msg.sender) > 0, "not a DAO member");
        _;
    }

    function createProposal (uint256 tokenId) external onlyTokenHolder returns (uint256) {
        require(NFTMarketPlace.available(tokenId), "NFT is not available");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = tokenId;
        proposal.deadline = block.timestamp + 24 hours;
        numProposals++;
        return numProposals - 1;
    } 

    modifier onlyActiveProposals (uint256 proposalIndex){
        require(proposals[proposalIndex].deadline > block.timestamp, "deadline exeeded");
        _;
    }

    enum Vote {
        Yes, 
        No
    }

    function voteOnProposal (uint256 proposalIndex, Vote vote) external onlyTokenHolder onlyActiveProposals (proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        
        uint256 numOfVotes = 0;
        if (proposal.voters[msg.sender] == false) {
            numOfVotes++;
            proposal.voters[msg.sender] = true;
        }
        require (numOfVotes > 0, "you have already voted");

        if (vote == Vote.Yes) {
            proposal.yesVotes += numOfVotes;
        } else {
            proposal.noVotes += numOfVotes;
        }
    } 

    modifier inActiveProposalsOnly (uint256 proposalIndex) {
        require(proposals[proposalIndex].deadline <= block.timestamp, "deadline is not exeeded");
        require(proposals[proposalIndex].executed == false, "proposal have already been exected");
        _;
    } 

    function execute (uint256 proposalIndex) external onlyTokenHolder inActiveProposalsOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];

        if (proposal.yesVotes > proposal.noVotes) {
            uint256 NFTPrice = NFTMarketPlace.getNFTPrice();
            require(address(this).balance >= NFTPrice, "contract doesnt have enough funds");
            NFTMarketPlace.purchase{value: NFTPrice}(proposal.nftTokenId);

        }
        proposal.executed = true;
    }

   

    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}