import React from 'react'
import './App.css'
import { Field }  from './Field'

enum Commodity {
    Apple = 1,
    Avocado = 2
}

interface Square {
    commodity: Commodity
    createdAt: number
}

interface Props {
    land: Square[]
}

export const Land: React.FC<Props> = ({ land }) => {
    return (
        <div className='land'>
            {
                land.map(square => (
                    <Field /> 
                ))
            }
        </div>
    )
}
