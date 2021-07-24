import React from 'react'

import house from '../../images/buildings/house.png'
import tree from '../../images/decorations/tree.png'
import box from '../../images/decorations/box.png'
import cauliflower from '../../images/cauliflower/fruit.png'
import potato from '../../images/potato/fruit.png'
import woodHorizontal from '../../images/fence/wood_horizontal.png'
import woodPost from '../../images/fence/wood_post.png'
import stoneVertical from '../../images/fence/stone_vertical.png'
import stoneBottomLeft from '../../images/fence/stone_bottom_left.png'
import stoneHorizontal from '../../images/fence/stone-horizontal.png'
import stoneFence from '../../images/fence/stone-fence.png'


interface Props {}

export const Tiles: React.FC<Props> = () => {
    return (
        <>
            {/*First to second path*/}
            <div className='dirt' style={{ gridColumn: '4/5', gridRow: '8/9'}} />
            <div className='dirt' style={{ gridColumn: '5/6', gridRow: '8/9'}} />
            <div className='dirt' style={{ gridColumn: '6/7', gridRow: '8/9'}} />
            <div className='top-edge' style={{ gridColumn: '6/7', gridRow: '7/8'}} />
            <div className='top-edge' style={{ gridColumn: '4/5', gridRow: '7/8'}} />
            <div className='bottom-edge' style={{ gridColumn: '4/5', gridRow: '9/10'}} />
            <div className='bottom-edge' style={{ gridColumn: '5/6', gridRow: '9/10'}} />
            <div className='bottom-edge' style={{ gridColumn: '6/7', gridRow: '9/10'}} />

            {/*Second to fourth path*/}
            <div className='dirt' style={{ gridColumn: '5/6', gridRow: '7/8'}} />
            <div className='dirt' style={{ gridColumn: '5/6', gridRow: '6/7'}} />
            <div className='dirt' style={{ gridColumn: '4/5', gridRow: '5/6'}} />
            <div className='dirt' style={{ gridColumn: '5/6', gridRow: '5/6'}} />
            <div className='left-edge' style={{ gridColumn: '4/5', gridRow: '6/7'}} />
            <div className='left-edge' style={{ gridColumn: '4/5', gridRow: '7/8'}} />
            <div className='right-edge' style={{ gridColumn: '6/7', gridRow: '6/7'}} />
            <div className='right-edge' style={{ gridColumn: '6/7', gridRow: '7/8'}} />
            

            {/*Third to fifth path*/}
            <div className='dirt' style={{ gridColumn: '6/7', gridRow: '5/6'}} />
            <div className='dirt' style={{ gridColumn: '7/8', gridRow: '5/6'}} />
            <div className='dirt' style={{ gridColumn: '7/8', gridRow: '4/5'}} />
            <div className='dirt' style={{ gridColumn: '8/9', gridRow: '5/6'}} />
            <div className='dirt' style={{ gridColumn: '9/10', gridRow: '5/6'}} />
            <div className='dirt' style={{ gridColumn: '10/11', gridRow: '5/6'}} />
            <div className='dirt' style={{ gridColumn: '11/12', gridRow: '5/6'}} />
            <div className='top-edge' style={{ gridColumn: '4/5', gridRow: '4/5'}} />
            <div className='top-edge' style={{ gridColumn: '5/6', gridRow: '4/5'}} />
            <div className='top-edge' style={{ gridColumn: '6/7', gridRow: '4/5'}} />
            <div className='top-edge' style={{ gridColumn: '8/9', gridRow: '4/5'}} />
            <div className='top-edge' style={{ gridColumn: '9/10', gridRow: '4/5'}} />
            <div className='top-edge' style={{ gridColumn: '10/11', gridRow: '4/5'}} />

            <div className='bottom-edge' style={{ gridColumn: '4/5', gridRow: '6/7'}} />
            <div className='bottom-edge' style={{ gridColumn: '6/7', gridRow: '6/7'}} />
            <div className='bottom-edge' style={{ gridColumn: '7/8', gridRow: '6/7'}} />
            <div className='bottom-edge' style={{ gridColumn: '8/9', gridRow: '6/7'}} />
            <div className='bottom-edge' style={{ gridColumn: '9/10', gridRow: '6/7'}} />
            <div className='bottom-edge' style={{ gridColumn: '10/11', gridRow: '6/7'}} />
            <div className='bottom-edge' style={{ gridColumn: '11/12', gridRow: '6/7'}} />
            <div className='right-edge' style={{ gridColumn: '12/13', gridRow: '5/6'}} />
            <div className='right-edge' style={{ gridColumn: '8/9', gridRow: '3/4'}} />
            <div className='right-edge' style={{ gridColumn: '8/9', gridRow: '4/5'}} />
            <div className='left-edge' style={{ gridColumn: '6/7', gridRow: '4/5'}} />

            {/* Trees */}
            <div style={{ gridColumn: '12/13', gridRow: '1/2'}}>
                <img className='tree' src={tree} />
            </div>
            <div style={{ gridColumn: '9/10', gridRow: '1/2'}}>
                <img className='tree' src={tree} />
            </div>
            <div style={{ gridColumn: '10/11', gridRow: '1/2'}}>
                <img className='tree-offset' src={tree} />
            </div>

            <div style={{ gridColumn: '14/15', gridRow: '1/2'}}>
                <img className='tree' src={tree} />
            </div>
            <div style={{ gridColumn: '15/16', gridRow: '1/2'}}>
                <img className='tree-offset' src={tree} />
            </div>

            <div style={{ gridColumn: '4/5', gridRow: '1/2'}}>
                <img className='tree' src={tree} />
            </div>
            <div style={{ gridColumn: '7/8', gridRow: '1/2'}}>
                <img className='tree-offset' src={tree} />
            </div>

            <div style={{ gridColumn: '1/2', gridRow: '2/3'}}>
                <img className='tree' src={tree} />
            </div>
            <div style={{ gridColumn: '2/3', gridRow: '2/3'}}>
                <img className='tree-offset' src={tree} />
            </div>

            {/* Fence */}
            <div style={{ gridColumn: '7/8', gridRow: '6/7'}}>
                <img className='fence-horizontal' src={woodHorizontal} />
            </div>
            <div style={{ gridColumn: '8/9', gridRow: '6/7'}}>
                <img className='fence-horizontal' src={woodHorizontal} />
            </div>
            <div style={{ gridColumn: '9/10', gridRow: '6/7'}}>
                <img className='fence-post' src={woodPost} />
            </div>

            <div style={{ gridColumn: '7/8', gridRow: '10/11'}}>
                <img className='fence-horizontal' src={woodHorizontal} />
            </div>
            <div style={{ gridColumn: '8/9', gridRow: '10/11'}}>
                <img className='fence-horizontal' src={woodHorizontal} />
            </div>
            <div style={{ gridColumn: '9/10', gridRow: '10/11'}}>
                <img className='fence-post' src={woodPost} />
            </div>
        </>
    )
}
