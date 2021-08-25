import React from 'react'
import Modal from 'react-bootstrap/Modal';

import { Panel } from '../ui/Panel'

import disc from '../../images/ui/disc.png'
import hammer from '../../images/ui/hammer.png'
import blacksmith from '../../images/decorations/blacksmith.png'
import nft from '../../images/decorations/statue.png'


interface Props {}

export const Blacksmith: React.FC= () => {
    const [showModal, setShowModal] = React.useState(false)

    return (
        <>
            <Modal centered show={showModal} onHide={() => setShowModal(false)}>
                <Panel>
                    <div id="welcome">
                        NFTs are coming soon...

                        <span style={{
                            fontSize: '12px',
                            marginTop: '20px'
                        }}>
                            You will be able to use Sunflower Farmer tokens to purchase collectibles and NFTs to decorate your farm.
                        </span>

                        <img id='nft' src={nft} />
                    </div>
                </Panel>
            </Modal>
            <div style={{ gridColumn: '4/5', gridRow: '9/10'}} id='minter' onClick={() => setShowModal(true)}>
                <img id='blacksmith' src={blacksmith} />

                <div className="mint" >
                <div className="disc">
                    <img src={disc} className="discBackground"/>
                    <img src={hammer}  className="pickaxe"/>

                        </div>
                        <Panel hasOuter={false}>
                            <span id='upgrade'>
                                Mint NFTs
                            </span>
                        </Panel>

                </div>
            </div>
        </>
    )
}
