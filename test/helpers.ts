export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
export const EVM_REVERT = 'VM Exception while processing transaction: revert'

export const wait = (seconds: number) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const advanceTime = (time: number) => {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as any).send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [time],
      id: new Date().getTime()
    }, (err: any, result: any) => {
      if (err) { return reject(err) }
      return resolve(result)
    })
  })
}

export const advanceBlock = () => {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as any).send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime()
    }, async (err: any, result: any) => {
      if (err) { return reject(err) }
      const newBlockHash = (await web3.eth.getBlock('latest')).hash

      return resolve(newBlockHash)
    })
  })
}

export const takeSnapshot = () => {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as any).send({
      jsonrpc: '2.0',
      method: 'evm_snapshot',
      id: new Date().getTime()
    }, (err: any, snapshotId: any) => {
      if (err) { return reject(err) }
      return resolve(snapshotId)
    })
  })
}

export const revertToSnapShot = (id: string) => {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as any).send({
      jsonrpc: '2.0',
      method: 'evm_revert',
      params: [id],
      id: new Date().getTime()
    }, (err: any, result: any) => {
      if (err) { return reject(err) }
      return resolve(result)
    })
  })
}

export const advanceTimeAndBlock = async (time: number) => {
  await advanceTime(time)
  await advanceBlock()
  return Promise.resolve(web3.eth.getBlock('latest'))
}
