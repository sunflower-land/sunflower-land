import React from 'react'
import young from './images/apples/image_part_161.png'
import terrain from './images/apples/soil.png'

import { Commodity, Square } from './types/contract'
interface Props {
    square: Square
    onClick: () => void
}

export const Field: React.FC<Props> = ({ square, onClick }) => {
    const Content = () => {
        if (square.commodity == Commodity.Apple) {
            return (
                <img src={young} className="field-image"/>
            )
        }

        return <img src={terrain} className="field-image"/>
    }
    return (
        <div className="field" onClick={onClick}>
            <Content />
        </div>
    )
}
