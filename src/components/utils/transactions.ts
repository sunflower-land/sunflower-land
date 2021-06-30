
import Web3 from 'web3';

const DEFAULT_INTERVAL = 500;

const DEFAULT_BLOCKS_TO_WAIT = 0;

interface Options {
  interval: number;
  blocksToWait: number;
}

/**
 * Wait for one or multiple transactions to confirm.
 *
 * @param web3
 * @param txnHash A transaction hash or list of those
 * @param options Wait timers
 * @return Transaction receipt
 */
export function waitTransaction(web3: Web3, txnHash: string|string[], options: Options = null): Promise<any> {
    const interval = options && options.interval ? options.interval : DEFAULT_INTERVAL;
    const blocksToWait = options && options.blocksToWait ? options.blocksToWait : DEFAULT_BLOCKS_TO_WAIT;
    var transactionReceiptAsync = async function(txnHash, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txnHash);
            if (!receipt) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
              if (blocksToWait > 0) {
                var resolvedReceipt = await receipt;
                if (!resolvedReceipt || !resolvedReceipt.blockNumber) setTimeout(function () { transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
                else {
                  try {
                  var block = await web3.eth.getBlock(resolvedReceipt.blockNumber)
                  var current = await web3.eth.getBlock('latest');
                  if (current.number - block.number >= blocksToWait) {
                    var txn = await web3.eth.getTransaction(txnHash)
                    if (txn.blockNumber != null) resolve(resolvedReceipt);
                    else reject(new Error('Transaction with hash: ' + txnHash + ' ended up in an uncle block.'));
                  }
                  else setTimeout(function () {
                      transactionReceiptAsync(txnHash, resolve, reject);
                  }, interval);
                  }
                  catch (e) {
                    setTimeout(function () {
                        transactionReceiptAsync(txnHash, resolve, reject);
                    }, interval);
                  }
                }
              }
              else resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };

    // Resolve multiple transactions once
    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(waitTransaction(web3, oneTxHash, options));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};


/**
 * Check if the transaction was success based on the receipt.
 *
 * https://ethereum.stackexchange.com/a/45967/620
 *
 * @param receipt Transaction receipt
 */
export function isSuccessfulTransaction(receipt: any): boolean {
  if(receipt.status == '0x1' || receipt.status == 1) {
    return true;
  } else {
    return false;
  }
}
