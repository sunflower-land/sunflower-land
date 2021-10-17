import React from 'react'


import present from '../../images/decorations/crate_base.jpg'


import { RewardModal } from '../ui/RewardModal'
import {
    service,
    Context,
    BlockchainEvent,
    BlockchainState,
} from '../../machine'
import { useService } from '@xstate/react'

interface Props {
    account: string
}

export const Reward: React.FC<Props> = ({ account }) => {
    const [showModal, setShowModal] = React.useState(false)
    const [reward, setReward] = React.useState(null)
    const [machineState, send] = useService<
        Context,
        BlockchainEvent,
        BlockchainState
    >(service)

    const onUpgrade = () => {
        setShowModal(true)
    }

    const onUpgradeConfirm = () => {
        service.send('UPGRADE')
    }

    React.useEffect(() => {
        const load = async () => {
            console.log('Load it')
            const reward = await machineState.context.blockChain.getReward()
            console.log({ set: reward})
            setReward(reward)
        }

        if (account) {
            load()

        }
    }, [account])

    // if (!reward) {
    //     return null
    // }

    return (
        <>

            <RewardModal reward={reward} onClose={() => setShowModal(false)} isOpen={showModal}/>

            {/* Present */}
            <div style={{ gridColumn: '14/15', gridRow: '10/11'}}>
                <img id='present' src={present} onClick={onUpgrade} />
            </div>
        </>
    )
}
