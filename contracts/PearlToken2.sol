pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PearlToken2 is ERC20 {
    constructor (uint256 initialSupply) ERC20("PearlToken2", "PEARL2") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view override returns (uint8) {
        return 0;
    }    
}