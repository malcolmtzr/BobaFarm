pragma solidity ^0.8.7;

import "./MilkToken.sol";
import "./TeaToken.sol";
import "./PearlToken.sol";
import "./MilkToken2.sol";
import "./TeaToken2.sol";
import "./PearlToken2.sol";

contract TokenFactory2 {
    event MilkToken2Created(address contractAddress);
    event TeaToken2Created(address contractAddress);
    event PearlToken2Created(address contractAddress);

    MilkToken2[] private milkToken2Array;
    TeaToken2[] private teaToken2Array;
    PearlToken2[] private pearlToken2Array;

    function createNewMilkToken2(uint256 initialSupply) public returns (address) {
        MilkToken2 milkToken2 = new MilkToken2(initialSupply);
        milkToken2Array.push(milkToken2);
        emit MilkToken2Created(address(milkToken2));
        return address(milkToken2);
    }

    function createNewTeaToken2(uint256 initialSupply) public returns (address) {
        TeaToken2 teaToken2 = new TeaToken2(initialSupply);
        teaToken2Array.push(teaToken2);
        emit TeaToken2Created(address(teaToken2));
        return address(teaToken2);
    }

    function createNewPearlToken2(uint256 initialSupply) public returns (address) {
        PearlToken2 pearlToken2 = new PearlToken2(initialSupply);
        pearlToken2Array.push(pearlToken2);
        emit PearlToken2Created(address(pearlToken2));
        return address(pearlToken2);
    }

    function getRecentMilkToken2Address() public view returns (address) {
        return address(milkToken2Array[milkToken2Array.length - 1]);
    }

    function getAllMilkToken2Address() public view returns (address[] memory) {
        address[] memory result = new address[](milkToken2Array.length);
        for (uint i = 0; i <= milkToken2Array.length - 1; i++) {
            result[i] = address(milkToken2Array[i]);
        }
        return result;
    }

    function getRecentTeaToken2Address() public view returns (address) {
        return address(teaToken2Array[teaToken2Array.length - 1]);
    }

    function getAllTeaToken2Address() public view returns (address[] memory) {
        address[] memory result = new address[](teaToken2Array.length);
        for (uint i = 0; i <= teaToken2Array.length - 1; i++) {
            result[i] = address(teaToken2Array[i]);
        }
        return result;
    }

    function getRecentPearlToken2Address() public view returns (address) {
        return address(pearlToken2Array[pearlToken2Array.length - 1]);
    }

    function getAllPearlToken2Address() public view returns (address[] memory) {
        address[] memory result = new address[](pearlToken2Array.length);
        for (uint i = 0; i <= pearlToken2Array.length - 1; i++) {
            result[i] = address(pearlToken2Array[i]);
        }
        return result;
    }    
}