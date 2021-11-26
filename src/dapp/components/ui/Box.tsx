import React from "react";

import leftEdge from "../../images/ui/panel/dt_box_9slice_lc.png";
import rightEdge from "../../images/ui/panel/dt_box_9slice_rc.png";
import bottomEdge from "../../images/ui/panel/dt_box_9slice_bc.png";
import topEdge from "../../images/ui/panel/dt_box_9slice_tc.png";
import topLeft from "../../images/ui/panel/dt_box_9slice_tl.png";
import bottomLeft from "../../images/ui/panel/dt_box_9slice_bl.png";
import topRight from "../../images/ui/panel/dt_box_9slice_tr.png";
import bottomRight from "../../images/ui/panel/dt_box_9slice_br.png";
import selectBox from "../../images/ui/select-box/select_box.png";

import leftEdgeInner from "../../images/ui/panel/lt_box_9slice_lc.png";
import rightEdgeInner from "../../images/ui/panel/lt_box_9slice_rc.png";
import bottomEdgeInner from "../../images/ui/panel/lt_box_9slice_bc.png";
import topEdgeInner from "../../images/ui/panel/lt_box_9slice_tc.png";
import topLeftInner from "../../images/ui/panel/lt_box_9slice_tl.png";
import bottomLeftInner from "../../images/ui/panel/lt_box_9slice_bl.png";
import topRightInner from "../../images/ui/panel/lt_box_9slice_tr.png";
import bottomRightInner from "../../images/ui/panel/lt_box_9slice_br.png";

import "./Panel.css";

export interface BoxProps {
  isSelected?: boolean;
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  image?: string;
}

export const Box: React.FC<BoxProps> = ({
  children,
  isSelected,
  count,
  onClick,
  disabled,
  image,
}) => {
  return (
    <div className={`box-panel`} onClick={onClick}>
      {
        <div
          className={`box-pixel-panel ${isSelected && "box-active"} ${
            disabled && "box-disabled"
          }`}
        >
          {count && <span className={`box-count`}>{count}</span>}
          {children}
          {image && <img src={image} className="box-item" />}
          {isSelected && <img className="select-box" src={selectBox} />}
          <img id="panel-left-edge" src={leftEdgeInner} />
          <img id="panel-right-edge" src={rightEdgeInner} />
          <img id="panel-bottom-edge" src={bottomEdgeInner} />
          <img id="panel-top-edge" src={topEdgeInner} />
          <img id="panel-top-left" src={topLeftInner} />
          <img id="panel-bottom-left" src={bottomLeftInner} />
          <img id="panel-bottom-right" src={bottomRightInner} />
          <img id="panel-top-right" src={topRightInner} />
        </div>
      }

      <img id="panel-left-edge" src={leftEdge} />
      <img id="panel-right-edge" src={rightEdge} />
      <img id="panel-bottom-edge" src={bottomEdge} />
      <img id="panel-top-edge" src={topEdge} />
      <img id="panel-top-left" src={topLeft} />
      <img id="panel-bottom-left" src={bottomLeft} />
      <img id="panel-bottom-right" src={bottomRight} />
      <img id="panel-top-right" src={topRight} />
    </div>
  );
};
