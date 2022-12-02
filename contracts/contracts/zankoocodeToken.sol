// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract zankoocodeToken is Context ,ERC20Votes {

    uint256 public token_maxSupply = 21e24;

    constructor () 
    ERC20 ("zankoocode", "ZCD") 
    ERC20Permit("zankoocode") 
    { 
        _mint(_msgSender(), token_maxSupply);
    }

    // The functions below are overrides required by Solidity.

	function _afterTokenTransfer(
		address from,
		address to,
		uint256 amount
	) internal override(ERC20Votes) {
		super._afterTokenTransfer(from, to, amount);
	}

	function _mint(address to, uint256 amount) internal override(ERC20Votes) {
		super._mint(to, amount);
	}

	function _burn(address account, uint256 amount)
		internal
		override(ERC20Votes)
	{
		super._burn(account, amount);
	}
}