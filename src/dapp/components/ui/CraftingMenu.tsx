import React from 'react'

import { Panel } from '../ui/Panel'

import hammer from '../../images/ui/hammer.png'
import basket from '../../images/ui/basket.png'
import { Box } from './Box'

import './Crafting.css'


export const CraftingMenu: React.FC= () => {
    return (
        <div id="crafting">
            <div id="crafting-items">
                <Box>
                    <img src={hammer} className='box-item'/>
                </Box>
                <Box>
                    <img src={hammer} className='box-item'/>
                </Box>
                <Box>
                    <img src={hammer} className='box-item'/>
                </Box>
                <Box>
                    <img src={hammer} className='box-item'/>
                </Box>
                <Box>
                    <img src={hammer} className='box-item'/>
                </Box>
                <Box/>
                <Box/>
            </div>
            <div id='recipe'>
                <span id='recipe-title'>Hammer</span>
                <img src={hammer} id='crafting-item'/>
                <span id='recipe-description'>Used for building coups, barns and other structures.</span>

            </div>
        </div>
                       
    )
}
