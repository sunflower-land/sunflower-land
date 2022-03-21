import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import {
  getAvailableUpgrades,
  getLevel,
  SkillName,
  SKILL_TREE,
} from "features/game/types/skills";
import house from "assets/buildings/house.png";
import smoke from "assets/buildings/smoke.gif";
import player from "assets/icons/player.png";
import questionMark from "assets/icons/expression_confused.png";

import plant from "assets/icons/plant.png";
import pickaxe from "assets/tools/stone_pickaxe.png";

import * as AuthProvider from "features/auth/lib/Provider";

import { Action } from "components/ui/Action";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

export const House: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const chooseSkill = (skill: SkillName) => {
    gameService.send("LEVEL_UP", { skill });
  };

  const toolLevel = getLevel(gameState.context.state.skills.gathering);
  const farmingLevel = getLevel(gameState.context.state.skills.farming);
  const totalLevel = toolLevel + farmingLevel;

  const Badges = () => {
    const BADGES: InventoryItemName[] = [
      "Green Thumb",
      "Barn Manager",
      "Seed Specialist",
      "Wrangler",
      "Lumberjack",
      "Prospector",
      "Logger",
      "Gold Rush",
    ];

    const badges = BADGES.map((badge) => {
      if (gameState.context.state.inventory[badge]) {
        return (
          <img
            key={badge}
            src={ITEM_DETAILS[badge].image}
            alt={badge}
            className="w-6 h-6 mr-2"
          />
        );
      }

      return null;
    }).filter(Boolean);

    if (badges.length === 0) {
      return (
        <span className="text-xs text-shadow">
          Reach level 5 in a profession to unlock a skill
        </span>
      );
    }

    return <div className="flex">{badges}</div>;
  };

  const Content = () => {
    // During dev, hide behind the withdraw flag
    if (!authState.context.token?.userAccess.withdraw) {
      return <span>Coming soon</span>;
    }

    if (gameState.matches("levelling")) {
      return <span className="loading">Levelling up</span>;
    }

    const choices = getAvailableUpgrades(gameState.context.state);
    if (choices.length > 0) {
      const firstChoice = SKILL_TREE[choices[0]];
      return (
        <div className="flex flex-col items-center">
          {firstChoice.profession === "farming" && (
            <div className="flex justify-between">
              <img src={plant} alt="farming" className="w-6 h-6 mx-2" />
              <span>
                Level {firstChoice.level} {firstChoice.profession}
              </span>
              <img src={plant} alt="farming" className="w-6 h-6 mx-2" />
            </div>
          )}
          {firstChoice.profession === "gathering" && (
            <div className="flex justify-between">
              <img src={pickaxe} alt="farming" className="w-6 h-6 mx-2" />
              <span>
                Level {firstChoice.level} {firstChoice.profession}
              </span>

              <img src={pickaxe} alt="farming" className="w-6 h-6 mx-2" />
            </div>
          )}

          <span className="text-center text-sm underline">Choose a skill</span>
          {/* TODO - update badge images */}
          <div className="flex w-full mt-3">
            {choices.map((choice) => {
              const details = ITEM_DETAILS[choice];
              return (
                <Button
                  key={choice}
                  className="flex flex-col items-center mx-2"
                  onClick={() => chooseSkill(choice)}
                >
                  <span className="text-sm">{choice}</span>
                  <img
                    className="w-1/3  my-2"
                    src={details.image}
                    alt="green thumb"
                  />
                  <span className="text-xs">{details.description}</span>
                </Button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex sm:flex-col flex-row">
          <InnerPanel className="w-1/3 p-2 flex flex-col items-center">
            <img src={questionMark} className="w-1/2 mb-2" />
            <span className="text-sm text-shadow">Name: ?</span>
            <span className="text-sm text-shadow">{`Level: ${totalLevel}`}</span>
          </InnerPanel>
          <div className="px-2 overflow-hidden">
            <div className="flex items-center">
              <span className="text-sm">Farming</span>
              <img src={plant} className="w-4 h-4 ml-2" />
            </div>
            <div className="flex items-center mt-1 flex-wrap">
              {new Array(10).fill(null).map((_, index) => {
                if (index < farmingLevel) {
                  return (
                    <Label
                      key={index}
                      className="w-5 h-7 mr-1 flex flex-col items-center"
                    />
                  );
                }

                return (
                  <OuterPanel
                    key={index}
                    className="w-5 h-7 mr-1 flex flex-col items-center"
                  />
                );
              })}
              <span>{farmingLevel}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-sm">Tools</span>
              <img src={pickaxe} className="w-4 h-4 ml-2" />
            </div>
            <div className="flex items-center mt-1 flex-wrap">
              {new Array(10).fill(null).map((_, index) => {
                if (index < toolLevel) {
                  return (
                    <Label
                      key={index}
                      className="w-5 h-7 mr-1 flex flex-col items-center"
                    />
                  );
                }

                return (
                  <OuterPanel
                    key={index}
                    className="w-5 h-7 mr-1 flex flex-col items-center"
                  />
                );
              })}
              <span>{toolLevel}</span>
            </div>
          </div>
        </div>

        <InnerPanel className="flex w-1/2 sm:w-1/3 mt-2 ">
          <img src={player} className="h-5 mr-2" />
          <span className="text-sm text-shadow">Skills</span>
        </InnerPanel>
        <InnerPanel className="relative p-2 mt-1">{Badges()}</InnerPanel>
      </>
    );
  };

  return (
    <>
      <div
        style={{
          width: `${GRID_WIDTH_PX * 3.2}px`,
          position: "absolute",
          right: `${GRID_WIDTH_PX * 39}px`,
          top: `${GRID_WIDTH_PX * 28.8}px`,
        }}
        className="relative cursor-pointer hover:img-highlight"
        onClick={() => open()}
      >
        <img src={house} alt="house" className="w-full" />
        <img
          src={smoke}
          style={{
            width: `${GRID_WIDTH_PX * 0.7}px`,
            position: "absolute",
            left: `${GRID_WIDTH_PX * 0.12}px`,
            top: `${GRID_WIDTH_PX * 0.77}px`,
          }}
        />
        <Action
          className="absolute bottom-10 left-5"
          text="Home"
          icon={player}
          onClick={() => open()}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel>{Content()}</Panel>
      </Modal>
    </>
  );
};
