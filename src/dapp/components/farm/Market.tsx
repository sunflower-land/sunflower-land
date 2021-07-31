import React from 'react'

import man from '../../images/characters/man.png'
import girl from '../../images/characters/girl.png'
import carrotMan from '../../images/characters/carrot_man.png'
import baldMan from '../../images/characters/bald_man.png'
import chat from '../../images/ui/expression_chat.png'

import { MarketModal } from '../ui/MarketModal'


interface Props {}

export const Market: React.FC<Props> = () => {
    const [showModal, setShowModal] = React.useState(false)


    return (
        <>
            <MarketModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <div  style={{ gridColumn: '12/13', gridRow: '8/9'}}>
                <img className='man' src={man} />
            </div>
            <div  style={{ gridColumn: '13/14', gridRow: '8/9'}}>
                <img className='girl' src={girl} />
            </div>

            <div  style={{ gridColumn: '14/15', gridRow: '9/10'}}>
                <img className='carrotMan' src={carrotMan} />
            </div>

            <div onClick={() => setShowModal(true)} id='salesman' style={{ gridColumn: '13/14', gridRow: '10/11'}}>
                <img className='baldMan' src={baldMan} />
                <img className='chat' src={chat} />
            </div>
        </>
    )
}
