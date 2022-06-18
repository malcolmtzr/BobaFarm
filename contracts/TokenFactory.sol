pragma solidity ^0.8.7;

import "./MilkToken.sol";
import "./TeaToken.sol";
import "./PearlToken.sol";

contract TokenFactory {
    event MilkTokenCreated(address contractAddress);
    event TeaTokenCreated(address contractAddress);
    event PearlTokenCreated(address contractAddress);

    MilkToken[] private milkTokenArray;
    TeaToken[] private teaTokenArray;
    PearlToken[] private pearlTokenArray;

    function createNewMilkToken(address user, uint256 initialSupply) public returns (address) {
        MilkToken milkToken = new MilkToken(user, initialSupply);
        milkTokenArray.push(milkToken);
        emit MilkTokenCreated(address(milkToken));
        return address(milkToken);
    }

    function createNewTeaToken(address user, uint256 initialSupply) public returns (address) {
        TeaToken teaToken = new TeaToken(user, initialSupply);
        teaTokenArray.push(teaToken);
        emit TeaTokenCreated(address(teaToken));
        return address(teaToken);
    }

    function createNewPearlToken(address user, uint256 initialSupply) public returns (address) {
        PearlToken pearlToken = new PearlToken(user, initialSupply);
        pearlTokenArray.push(pearlToken);
        emit PearlTokenCreated(address(pearlToken));
        return address(pearlToken);
    }

    function getRecentMilkTokenAddress() public view returns (address) {
        return address(milkTokenArray[milkTokenArray.length - 1]);
    }

    function getAllMilkTokenAddress() public view returns (address[] memory) {
        address[] memory result = new address[](milkTokenArray.length);
        for (uint i = 0; i <= milkTokenArray.length - 1; i++) {
            result[i] = address(milkTokenArray[i]);
        }
        return result;
    }

    function getRecentTeaTokenAddress() public view returns (address) {
        return address(teaTokenArray[teaTokenArray.length - 1]);
    }

    function getAllTeaTokenAddress() public view returns (address[] memory) {
        address[] memory result = new address[](teaTokenArray.length);
        for (uint i = 0; i <= teaTokenArray.length - 1; i++) {
            result[i] = address(teaTokenArray[i]);
        }
        return result;
    }

    function getRecentPearlTokenAddress() public view returns (address) {
        return address(pearlTokenArray[pearlTokenArray.length - 1]);
    }

    function getAllPearlTokenAddress() public view returns (address[] memory) {
        address[] memory result = new address[](pearlTokenArray.length);
        for (uint i = 0; i <= pearlTokenArray.length - 1; i++) {
            result[i] = address(pearlTokenArray[i]);
        }
        return result;
    }
}