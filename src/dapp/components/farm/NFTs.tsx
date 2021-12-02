import React from "react";
import { Prop } from "xstate/lib/model.types";

import statue from "../../images/ui/sunflower_statue.png";
import scarecrow from "../../images/ui/scarecrow.png";
import { Inventory } from "../../types/crafting";

import "./NFTs.css";

interface Props {
  inventory: Inventory;
}
export const NFTs: React.FC<Props> = ({ inventory }) => {
  return (
    <>
      <div id="statue">
        {inventory["Sunflower Statue"] > 0 && <img src={statue} alt="statue" />}
      </div>

      <div id="scarecrow">
        {inventory["Scarecrow"] > 0 && <img src={scarecrow} alt="statue" />}
      </div>
      <div className="dirt" style={{ gridColumn: 6, gridRow: 7 }} />
      <div className="dirt" style={{ gridColumn: 6, gridRow: 6 }} />
    </>
  );
};
