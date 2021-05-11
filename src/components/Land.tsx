import React from 'react'
import './App.css'
import { Field }  from './Field'
import { Square } from './types/contract'

interface Props {
    land: Square[]
    onClick: (landIndex: number) => void
}

export const Land: React.FC<Props> = ({ land, onClick }) => {
    return (
        <div className='land'>
            {
                land.map((square, index) => (
                    <Field square={square} onClick={() => onClick(index)}/> 
                ))
            }
        </div>
    )
}
