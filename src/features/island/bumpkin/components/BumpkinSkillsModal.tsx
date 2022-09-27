import React, { useState } from "react";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import {
  BumpkinSkillName,
  BumpkinSkillTree,
  BUMPKIN_SKILL_TREE,
  SKILL_TREE_CATEGORIES,
} from "features/game/types/bumpkinSkills";

import question from "assets/icons/expression_confused.png";
import { Box } from "components/ui/Box";
import close from "assets/icons/close.png";
import crown from "assets/tools/hammer.png";
import confirm from "assets/icons/confirm.png";
import leftArrow from "assets/icons/arrow_left.png";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import border from "assets/ui/panel/green_border.png";

const CropSkillTree = ({
  onClick,
  selectedSkill,
}: {
  selectedSkill: BumpkinSkillName;
  onClick: (skill: BumpkinSkillName) => void;
}) => {
  return (
    <div className="grid grid-rows-4 mt-2 auto-cols-max mx-auto">
      <div className="row-start-1 col-start-2 flex justify-center">
        <Box
          isSelected={selectedSkill === "Green Thumb"}
          key={"Green Thumb"}
          onClick={() => onClick("Green Thumb")}
          image={BUMPKIN_SKILL_TREE["Green Thumb"]?.image}
          showOverlay
          overlayIcon={<img src={confirm} alt="" className="absolute w-5" />}
        />
      </div>
      <div className="row-start-2 col-start-2 flex justify-center">
        <Box
          isSelected={selectedSkill === "Cultivator"}
          key={"Cultivator"}
          onClick={() => onClick("Cultivator")}
          image={BUMPKIN_SKILL_TREE["Cultivator"]?.image}
        />
      </div>
      <div className="row-start-3 col-start-2 flex justify-center">
        <Box
          isSelected={selectedSkill === "Master Farmer"}
          key={"Master Farmer"}
          onClick={() => onClick("Master Farmer")}
          image={BUMPKIN_SKILL_TREE["Master Farmer"]?.image}
        />
      </div>
      <div className="row-start-4 col-start-1 flex justify-end">
        <Box
          isSelected={selectedSkill === "Golden Flowers"}
          key={"Golden Flowers"}
          onClick={() => onClick("Golden Flowers")}
          image={BUMPKIN_SKILL_TREE["Golden Flowers"]?.image}
        />
      </div>
      <div className="relative row-start-4 col-start-2 flex justify-center">
        <Box
          isSelected={selectedSkill === "Plant Whisperer"}
          key={"Plant Whisperer"}
          onClick={() => onClick("Plant Whisperer")}
          image={BUMPKIN_SKILL_TREE["Plant Whisperer"]?.image}
        />
      </div>
      <div className="row-start-4 col-start-3 flex justify-start">
        <Box
          isSelected={selectedSkill === "Happy Crop"}
          key={"Happy Crop"}
          onClick={() => onClick("Happy Crop")}
          image={BUMPKIN_SKILL_TREE["Happy Crop"]?.image}
        />
      </div>
    </div>
  );
};

const SkillPointLabel = ({ points }: { points: number }) => (
  <div
    className="bg-green-background text-white text-shadow text-xs object-contain justify-center items-center whitespace-nowrap mb-1 max-w-min px-1"
    // Custom styles to get pixelated border effect
    style={{
      // border: "5px solid transparent",
      borderStyle: "solid",
      borderWidth: "5px",
      borderImage: `url(${border}) 30 stretch`,
      borderImageSlice: "25%",
      imageRendering: "pixelated",
      borderImageRepeat: "repeat",
      borderRadius: "15px",
    }}
  >
    <p>{`Skill Points: ${points}`}</p>
  </div>
);

export const BumpkinSkillsModal: React.FC = () => {
  const [selectedSkill, setSelectedSkill] =
    useState<BumpkinSkillName>("Green Thumb");
  const [selectedSkillTree, setSelectedSkillTree] =
    useState<BumpkinSkillTree | null>(null);

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive>
            <img src={crown} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Skills</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={console.log}
        />
      </div>

      <div
        style={{
          minHeight: "200px",
        }}
      >
        {!selectedSkillTree ? (
          <>
            {SKILL_TREE_CATEGORIES.map((tree) => (
              <div key={tree} onClick={() => setSelectedSkillTree(tree)}>
                <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
                  <Label className="px-1 text-xxs absolute -top-3 -right-1">
                    2/7
                  </Label>
                  <div className="flex justify-center">
                    <img src={question} className="h-12 mr-2" />
                    <span className="text-sm">{tree}</span>
                  </div>
                </OuterPanel>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col">
            <div className="flex justify-end">
              <SkillPointLabel points={3} />
            </div>
            <OuterPanel className="relative flex-1 min-w-[42%] flex flex-col justify-between items-center shadow-none">
              <div className="flex flex-col justify-center items-center p-2 relative w-full">
                <img
                  src={leftArrow}
                  className="absolute top-1 left-1 self-start w-5 cursor-pointer right-96"
                  alt="back"
                  onClick={() => setSelectedSkillTree(null)}
                />
                <span className="text-shadow mb-1 text-center text-sm sm:text-base">
                  {selectedSkill}
                </span>
                <span className="text-shadow text-center mt-1 text-xxs sm:text-xs">
                  {BUMPKIN_SKILL_TREE[selectedSkill].boosts[0]}
                </span>

                <div className="border-t border-white w-full mt-2 pt-1 mb-2 text-center">
                  <div className="flex justify-center flex-wrap items-end mt-2">
                    <span className="text-shadow text-center text-xxs sm:text-xs">
                      Required Skill Points:
                    </span>
                    <span className="text-xxs sm:text-xs text-shadow text-center mt-2">
                      {BUMPKIN_SKILL_TREE[selectedSkill].requirements.points}
                    </span>
                  </div>
                  {BUMPKIN_SKILL_TREE[selectedSkill].requirements.skill && (
                    <div className="flex justify-center flex-wrap items-center my-2">
                      <span className="text-shadow text-center text-xxs sm:text-xs">
                        Required Skills:
                      </span>
                      <img
                        src={
                          BUMPKIN_SKILL_TREE[
                            BUMPKIN_SKILL_TREE[selectedSkill].requirements
                              .skill as BumpkinSkillName
                          ].image
                        }
                        className=""
                      />
                    </div>
                  )}
                </div>
                <Button
                  onClick={console.log}
                  disabled={false}
                  className="text-xs"
                >
                  Claim skill
                </Button>
              </div>
            </OuterPanel>
            <span className="text-center my-2 text-sm">{`${selectedSkillTree} Skill Path`}</span>
            <CropSkillTree
              onClick={(skillName) => setSelectedSkill(skillName)}
              selectedSkill={selectedSkill}
            />
          </div>
        )}
      </div>
    </Panel>
  );
};
