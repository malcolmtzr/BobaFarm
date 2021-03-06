pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PearlToken is ERC20 {
    constructor (address user, uint256 initialSupply) ERC20("PearlToken", "PEARL") {
        _mint(user, initialSupply);
    }

    function decimals() public view override returns (uint8) {
        return 0;
    }
}