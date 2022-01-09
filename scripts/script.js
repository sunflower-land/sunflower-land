// eslint-disable-next-line no-undef
const ContractName = artifacts.require("ContractName");

module.exports = async function (callback) {
  try {
    // Fetch the deployed contract
    const contract = await ContractName.deployed();
    console.log("Contract fetched", contract.address);
  } catch (error) {
    console.log(error);
  }

  callback();
};
