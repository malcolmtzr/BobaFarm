pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BobaToken is ERC20, Ownable {
    constructor () ERC20("BobaToken", "BOBA") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    //transferOwnership in Ownable
}