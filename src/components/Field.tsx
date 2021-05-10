import React from 'react'
import young from './images/apples/image_part_001.png'

interface Props {
    fruit: 'apple'
}
export const Field: React.FC<Props> = ({ fruit }) => {
    return (
        <div className="field">
            <img src={young} className="field-image"/>
        </div>
    )
}
