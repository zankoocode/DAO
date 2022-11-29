// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;



// this is a fake nft market place 
contract NFTMarketPlace {
    
    // keeping track of token Ids to owners
    mapping (uint256 => address) tokens;

    uint256 nftPrice = 0.01 ether;

    // purchase NFT from the marketplace by the tokenId
    function purchase (uint256 tokenId) external payable {
        require(msg.value == nftPrice, "the nft costs 0.01 ether");
        tokens[tokenId] = msg.sender;
    }


    // getNFTPrice function will return thee price of NFT
    function getNFTPrice () external view returns (uint256) {
        return nftPrice;
    }


    // available function will check if the NFT of tokenId provided is sold out or not
    function available (uint256 tokenId) external view returns (bool) {
        if (tokens[tokenId] == address(0)) {
            return true;
        } else {
            return false;
        }
    }


}