import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import socialScoreIcon from "assets/icons/social_score.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/lib/crafting";
import { WORKBENCH_MONUMENTS } from "features/game/types/monuments";

export const VisitorGuide: React.FC = () => {
  return (
    <div className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
      <Label type="default">Betty's Farm</Label>
      <p className="text-sm mb-2 p-1">
        Howdy Bumpkin, welcome to my farm. Roll up your sleeves and help me out
        to earn social points.
      </p>
      <Label type="default">Tasks</Label>
      <div className="flex items-center">
        <Box image={ITEM_DETAILS.Dung.image} />
        <div>
          <p className="text-sm">Pick up 5 x Clutter</p>
          <div className="flex items-center my-0.5">
            <p className="text-xs mr-1">+5 Social Points</p>
            <img src={socialScoreIcon} alt="Social Points" className="h-4" />
          </div>
        </div>
      </div>

      {getKeys(WORKBENCH_MONUMENTS).map((monument) => (
        <div className="flex items-center">
          <Box image={ITEM_DETAILS[monument].image} />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-sm">Cheer {monument}</p>
            </div>
            <div className="flex items-center my-0.5">
              <p className="text-xs mr-1">+5 Social Points</p>
              <img src={socialScoreIcon} alt="Social Points" className="h-4" />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center">
        <Box image={SUNNYSIDE.icons.expression_confused} />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-sm">Catch 2 x Pests</p>
            <Label type="danger">Net required</Label>
          </div>
          <div className="flex items-center my-0.5">
            <p className="text-xs mr-1 italic">Coming soon</p>
            <img src={socialScoreIcon} alt="Social Points" className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
