pragma solidity ^0.8.7;

import "./MilkToken.sol";
import "./TeaToken.sol";
import "./PearlToken.sol";

contract TokenFactory {
    event MilkTokenCreated(address contractAddress);
    event TeaTokenCreated(address contractAddress);
    event PearlTokenCreated(address contractAddress);

    MilkToken[] public milkTokenArray;
    TeaToken[] public teaTokenArray;
    PearlToken[] public pearlTokenArray;

    function createNewMilkToken(uint256 initialSupply) public returns (address) {
        MilkToken milkToken = new MilkToken(initialSupply);
        milkTokenArray.push(milkToken);
        emit MilkTokenCreated(address(milkToken));
        return address(milkToken);
    }

    function createNewTeaToken(uint256 initialSupply) public returns (address) {
        TeaToken teaToken = new TeaToken(initialSupply);
        teaTokenArray.push(teaToken);
        emit TeaTokenCreated(address(teaToken));
        return address(teaToken);
    }

    function createNewPearlToken(uint256 initialSupply) public returns (address) {
        PearlToken pearlToken = new PearlToken(initialSupply);
        pearlTokenArray.push(pearlToken);
        emit PearlTokenCreated(address(pearlToken));
        return address(pearlToken);
    }

    function getMilkTokenAddressByIndex(uint256 index) public view returns (address) {
        return address(milkTokenArray[index]);
    }

    function getTeaTokenAddressByIndex(uint256 index) public view returns (address) {
        return address(teaTokenArray[index]);
    }

    function getPearlTokenAddressByIndex(uint256 index) public view returns (address) {
        return address(pearlTokenArray[index]);
    }
}