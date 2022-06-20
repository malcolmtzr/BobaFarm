pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TeaToken2 is ERC20, Ownable {
    constructor (uint256 initialSupply) ERC20("TeaToken2", "TEA2") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view override returns (uint8) {
        return 0;
    }    
}