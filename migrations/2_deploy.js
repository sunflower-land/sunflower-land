const Token = artifacts.require("Token");
const farm = artifacts.require("Farm");

module.exports = async function (deployer) {
  //deploy Token
  await deployer.deploy(Token);

  //assign token into variable to get it's address
  const token = await Token.deployed();
  //pass token address for contract(for future minting)
  await deployer.deploy(farm, token.address);
  //assign contract into variable to get it's address
  const farmContract = await farm.deployed();
  //change token's owner/minter from deployer to farm
  await token.passMinterRole(farmContract.address);
};
