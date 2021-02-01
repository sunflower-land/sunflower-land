const ContractName = artifacts.require("ContractName")

module.exports = async function(callback) {
  try {
    // Get Accounts
    const accounts = await web3.eth.getAccounts()
    // Assign accounts to variables
    const bank = accounts[0]
    const acc1 = accounts[1]
    const acc2 = accounts[2]
    const acc3 = accounts[3]
    const acc4 = accounts[4]
    const acc5 = accounts[5]
    const acc6 = accounts[6]
    const acc7 = accounts[7]
    const acc8 = accounts[8]
    const acc9 = accounts[9]

    // Fetch the deployed contract
    const contract = await ContractName.deployed()
    console.log('Contract fetched', contract.address)
  }
  catch(error) {
    console.log(error)
  }

  callback()
}