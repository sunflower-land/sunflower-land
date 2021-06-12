import React from 'react';
import './App.css';

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
    <div className='text-monospace'>
      <div className="container-fluid mt-5 text-center">
        <h1>Welcome to Fruit Market</h1>
        {
          !blockChain && 'Loading...'
        }
        {
          blockChain && (<Farm blockChain={blockChain} />)
        }
        
      </div>
    </div>
  )
}

export default App

