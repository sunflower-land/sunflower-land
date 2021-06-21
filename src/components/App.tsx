import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { BlockChain } from './Blockchain'
import Farm from './Farm'
import { Panel } from './Panel'
import { Button } from './Button'


export const App: React.FC = () => {
  const [blockChain, setBlockChain] = React.useState<BlockChain>(null)
  const [isStarted, setIsStarted] = React.useState(false)

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
        <Modal centered show={!isStarted}>
          <Panel>
            <div>
              <h1 className="header">
                Fruit Market Coin
              </h1>
              <Button onClick={() => setIsStarted(true)}>
                <span>
                  Get Started
                </span>
              </Button>
            </div>
          </Panel>
        </Modal>
      {/*         
      </div> */}
    </div>
  )
}

export default App

