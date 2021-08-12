import React from 'react'

import leftEdgeInner from '../../images/ui/panel/lt_box_9slice_lc.png'
import rightEdgeInner from '../../images/ui/panel/lt_box_9slice_rc.png'
import bottomEdgeInner from '../../images/ui/panel/lt_box_9slice_bc.png'
import topEdgeInner from '../../images/ui/panel/lt_box_9slice_tc.png'
import topLeftInner from '../../images/ui/panel/lt_box_9slice_tl.png'
import bottomLeftInner from '../../images/ui/panel/lt_box_9slice_bl.png'
import topRightInner from '../../images/ui/panel/lt_box_9slice_tr.png'
import bottomRightInner from '../../images/ui/panel/lt_box_9slice_br.png'

import './Panel.css'

interface Props {
    onClick: () => void,
    disabled?: boolean
}
export const Button: React.FC<Props> = ({
    children,
    onClick,
    disabled
}) => {
    return (
        <div className={disabled ? "button disabled" : "button"} onClick={disabled ? undefined : onClick}>
            { children }
            <img id="panel-left-edge" src={leftEdgeInner} />
            <img id="panel-right-edge" src={rightEdgeInner} />
            <img id="panel-bottom-edge" src={bottomEdgeInner} />
            <img id="panel-top-edge" src={topEdgeInner} />
            <img id="panel-top-left" src={topLeftInner} />
            <img id="panel-bottom-left" src={bottomLeftInner} />
            <img id="panel-bottom-right" src={bottomRightInner} />
            <img id="panel-top-right" src={topRightInner} />
        </div>
    )
}
