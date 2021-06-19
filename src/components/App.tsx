import React from 'react';

import { BlockChain } from './Blockchain'
import Farm from './Farm'


export const App: React.FC = () => {
  const [blockChain, setBlockChain] = React.useState<BlockChain>(null)

  React.useEffect(() => {
    const init = async () => {
      const blockChain = new BlockChain()
      await blockChain.initialise()
      setBlockChain(blockChain)
    }

    init()
  }, [])

  return (
    <div>
      {/* <div>
        <h1>Welcome to Fruit Market</h1>
        {
          !blockChain && 'Loading...'
        } */}
        {
          blockChain && (<Farm blockChain={blockChain} />)
        }
{/*         
      </div> */}
    </div>
  )
}

export default App

