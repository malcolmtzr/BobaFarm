var bobaToken = artifacts.require("BobaToken");
var tokenFactory = artifacts.require("TokenFactory");
var tokenFactory2 = artifacts.require("TokenFactory2");
var milkToken2 = artifacts.require("MilkToken2");
var teaToken2 = artifacts.require("TeaToken2");
var pearlToken2 = artifacts.require("pearlToken2");
var bobaFarm = artifacts.require("BobaFarm");

module.exports = async function(deployer) {

  //const address = 0xA89AB2C15216c5A6460c26fDA9F213d38452b591;

  await deployer.deploy(bobaToken);
  const bobaTokenInstance = await bobaToken.deployed();

  await deployer.deploy(tokenFactory);
  await deployer.deploy(tokenFactory2);

  await deployer.deploy(milkToken2, 2000000);
  const milkToken2Instance = await milkToken2.deployed();

  await deployer.deploy(teaToken2, 2500000);
  const teaToken2Instance = await teaToken2.deployed();

  await deployer.deploy(pearlToken2, 2400000);
  const pearlToken2Instance = await pearlToken2.deployed();

  //const milkTokenInstance = await tokenFactoryInstance.createNewMilkToken(address, 2000000);

  //const teaTokenInstance = await tokenFactoryInstance.createNewTeaToken(address, 2500000);

  //const pearlTokenInstance = await tokenFactoryInstance.createNewPearlToken(address, 2400000);

  await deployer.deploy(bobaFarm, bobaTokenInstance.address, milkToken2Instance.address, teaToken2Instance.address, pearlToken2Instance.address);
  const bobaFarmInstance = await bobaFarm.deployed();
  //await bobaFarmInstance.addTokensToFarm(milkToken2Instance.address, teaToken2Instance.address, pearlToken2Instance.address);
};
