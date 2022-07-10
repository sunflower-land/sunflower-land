import React from "react";
import bumpkin from "assets/npcs/bumpkin.gif";

import arrowLeft from "assets/icons/arrow_left.png";
import arrowRight from "assets/icons/arrow_right.png";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

const BODIES = [1101, 1102, 1103, 1104];
const HAIR = [1201, 1202, 1203, 1204];
const EYES = [1301, 1302, 1303, 1304];
const MOUTHS = [1401, 1402, 1403, 1404];
const SHIRTS = [1501, 1502, 1503];
const PANTS = [1601, 1602, 1603, 1604];
const SHOES = [1701, 1702, 1703];
export const BumpkinBuilder: React.FC = () => {
  return (
    <div className="flex">
      <div className="w-1/3 flex items-center mb-1 justify-center">
        <img src={bumpkin} className="w-20" />
      </div>
      <div>
        <div className="flex items-center mb-1">
          <span className="mr-2 w-32">Body: </span>
          <Button onClick={() => {}}>1001</Button>
        </div>
        <div className="flex items-center mb-1">
          <span className="mr-2 w-32">Hair: </span>
          <Button onClick={() => {}}>1001</Button>
        </div>
        <div className="flex items-center mb-1">
          <span className="mr-2 w-32">Eyes: </span>
          <Button onClick={() => {}}>1001</Button>
        </div>
        <div className="flex items-center mb-1">
          <span className="mr-2 w-32">Mouth: </span>
          <Button onClick={() => {}}>1001</Button>
        </div>
        <div className="flex items-center mb-1">
          <span className="mr-2 w-32">Shirt: </span>
          <Button onClick={() => {}}>1001</Button>
        </div>
        <div className="flex items-center mb-1">
          <span className="mr-2 w-32">Pants: </span>
          <Button onClick={() => {}}>1001</Button>
        </div>
      </div>
    </div>
  );
};
