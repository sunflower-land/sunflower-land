import React from 'react'

import base from '../../images/buildings/base.png'
import door from '../../images/buildings/door.png'
import level from '../../images/buildings/level.png'
import levels from '../../images/buildings/levels.png'
import window from '../../images/buildings/window.png'
import sideHouse from '../../images/buildings/side-house-2.png'
import roof from '../../images/buildings/roof.png'
import sideHouse3 from '../../images/buildings/side-house-3.png'
import chimney from '../../images/buildings/chimney.png'
import smoke from '../../images/buildings/smoke.gif'

import box from '../../images/decorations/box.png'
import cauliflower from '../../images/cauliflower/fruit.png'
import potato from '../../images/potato/fruit.png'
import sunflower from '../../images/sunflower/fruit.png'
import pumpkin from '../../images/pumpkin/fruit.png'
import sunflowerPot from '../../images/decorations/sunflower_pot.png'

import { service } from '../../machine'

import { Pickaxe } from '../ui/Pickaxe'
import { UpgradeModal } from '../ui/UpgradeModal'

interface Props {
    farmSize: number
    balance: number
}

export const Barn: React.FC<Props> = ({ farmSize, balance }) => {
    const [showModal, setShowModal] = React.useState(false)

    const onUpgrade = () => {
        setShowModal(true)
    }

    const onUpgradeConfirm = () => {
        service.send('UPGRADE')
    }

    return (
        <>
            {/* Barn dirt*/}
            <div className='dirt' style={{ gridColumn: '11/12', gridRow: '8/9'}} />
            <div className='dirt' style={{ gridColumn: '12/13', gridRow: '8/9'}} />
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '8/9'}} />
            <div className='dirt' style={{ gridColumn: '14/15', gridRow: '8/9'}} />
            <div className='dirt' style={{ gridColumn: '11/12', gridRow: '9/10'}} />
            <div className='dirt' style={{ gridColumn: '12/13', gridRow: '9/10'}} />
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '9/10'}} />
            <div className='dirt' style={{ gridColumn: '14/15', gridRow: '9/10'}} />
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '10/11'}} />
            <div className='dirt' style={{ gridColumn: '14/15', gridRow: '10/11'}} />
            <div className='top-edge' style={{ gridColumn: '11/12', gridRow: '7/8'}} />
            <div className='top-edge' style={{ gridColumn: '12/13', gridRow: '7/8'}} />
            <div className='top-edge' style={{ gridColumn: '13/14', gridRow: '7/8'}} />
            <div className='top-edge' style={{ gridColumn: '14/15', gridRow: '7/8'}} />
            <div className='bottom-edge' style={{ gridColumn: '11/12', gridRow: '10/11'}} />
            <div className='bottom-edge' style={{ gridColumn: '12/13', gridRow: '10/11'}} />
            <div className='bottom-edge' style={{ gridColumn: '13/14', gridRow: '11/12'}} />
            <div className='bottom-edge' style={{ gridColumn: '14/15', gridRow: '11/12'}} />
            <div className='left-edge' style={{ gridColumn: '10/11', gridRow: '8/9'}} />
            <div className='left-edge' style={{ gridColumn: '10/11', gridRow: '9/10'}} />
            <div className='left-edge' style={{ gridColumn: '12/13', gridRow: '10/11'}} />
            <div className='left-edge' style={{ gridColumn: '14/15', gridRow: '8/9'}} />
            <div className='left-edge' style={{ gridColumn: '14/15', gridRow: '9/10'}} />
            <div className='left-edge' style={{ gridColumn: '14/15', gridRow: '10/11'}} />

            {/* Barn */}
            <div style={{ gridColumn: '12/13', gridRow: '7/8'}}>
                <div id='house'>
                    <img id='base' src={base} />
                    <img id='door' src={door} />
                    <img id='window' src={window} />
                    <img id='chimney' src={chimney} />
                    <img id='smoke' src={smoke} />
                    <img id='sunflower-pot' src={sunflowerPot} />

                    {
                        farmSize > 5 && (
                            <img id='level' src={level} />
                        )
                    }
                    {
                        farmSize > 8 && (
                            <img id='side-house' src={sideHouse} />
                        )
                    }
                    
                    {
                        farmSize === 14 && (
                            <img id='side-house2' src={sideHouse3} />
                        )
                    }
                    {
                        farmSize === 17 && [
                            <img id='level2' src={levels} />,
                            <img id='level2-roof' src={roof} />
                        ]
                    }
                </div>
                {
                    farmSize < 17 && (
                        <Pickaxe className="loop" onClick={onUpgrade} />
                    )
                }
                <UpgradeModal onClose={() => setShowModal(false)} isOpen={showModal} farmSize={farmSize} balance={balance} />
            </div>

            {/* Barn Decorations */}
            <div style={{ gridColumn: '10/11', gridRow: '8/9'}}>
                <img id='box1' src={box} />
                <img id='cauliflower-box' src={cauliflower} />
            </div>
            <div style={{ gridColumn: '11/12', gridRow: '9/10'}}>
                <img id='box2' src={box} />
                <img id='potato-box-1' src={potato} />
                <img id='potato-box-2' src={potato} />
            </div>

            <div style={{ gridColumn: '14/15', gridRow: '9/10'}}>
                <img id='box2' src={box} />
                <img id='sunflower-box-1' src={sunflower} />
                <img id='sunflower-box-2' src={sunflower} />
            </div>
            <div style={{ gridColumn: '14/15', gridRow: '9/10'}}>
                <img id='box1' src={box} />
                <img id='pumpkin-box-1' src={pumpkin} />
                <img id='pumpkin-box-2' src={pumpkin} />
            </div>
        </>
    )
}
