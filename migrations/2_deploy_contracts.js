var bobaToken = artifacts.require("BobaToken");
var milkToken = artifacts.require("MilkToken");
var teaToken = artifacts.require("TeaToken");
var pearlToken = artifacts.require("pearlToken");
var bobaFarm = artifacts.require("BobaFarm");

module.exports = async function(deployer) {

  await deployer.deploy(bobaToken);
  const bobaTokenInstance = await bobaToken.deployed();
  
  await deployer.deploy(milkToken, 2000000);
  const milkTokenInstance = await milkToken.deployed();

  await deployer.deploy(teaToken, 2500000);
  const teaTokenInstance = await teaToken.deployed();

  await deployer.deploy(pearlToken, 2400000);
  const pearlTokenInstance = await pearlToken.deployed();

  await deployer.deploy(bobaFarm, bobaTokenInstance.address, milkTokenInstance.address, teaTokenInstance.address, pearlTokenInstance.address);
};
