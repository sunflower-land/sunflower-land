import React from 'react'


import present from '../../images/decorations/crate_base.jpg'

import { service } from '../../machine'

import { RewardModal } from '../ui/RewardModal'

interface Props {
}

export const Reward: React.FC<Props> = () => {
    const [showModal, setShowModal] = React.useState(false)

    const onUpgrade = () => {
        setShowModal(true)
    }

    const onUpgradeConfirm = () => {
        service.send('UPGRADE')
    }

    return (
        <>

            <RewardModal onClose={() => setShowModal(false)} isOpen={showModal}/>

            {/* Present */}
            <div style={{ gridColumn: '10/11', gridRow: '8/9'}}>
                <img id='present' src={present} onClick={onUpgrade} />
            </div>
        </>
    )
}
