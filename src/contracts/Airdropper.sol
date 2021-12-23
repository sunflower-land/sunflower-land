// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";


contract Airdropper {
    function multisend(address _tokenAddr, address[] memory _to, uint256 _value) public returns (bool)  {
        assert(_to.length <= 150);
        // loop through to addresses and send value
        for (uint8 i = 0; i < _to.length; i++) {
            assert((ERC20(_tokenAddr).transferFrom(msg.sender, _to[i], _value)) == true);
        }

        return true;
    }
}