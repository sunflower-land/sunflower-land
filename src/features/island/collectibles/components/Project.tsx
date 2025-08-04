import React, { useContext, useEffect, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import cheer from "assets/icons/cheer.webp";
import { Context } from "features/game/GameProvider";
import { LiveProgressBar, ProgressBar } from "components/ui/ProgressBar";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { MonumentName } from "features/game/types/monuments";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import chest from "assets/icons/chest.png";
import { Box } from "components/ui/Box";
import { formatNumber } from "lib/utils/formatNumber";
import {
  getLoveCharmBoost,
  REQUIRED_CHEERS,
  REWARD_ITEMS,
} from "features/game/events/landExpansion/completeProject";

import farmerMonumentOne from "assets/monuments/shovel_monument_stage_1.webp";
import farmerMonumentTwo from "assets/monuments/shovel_monument_stage_2.webp";

import minerMonumentOne from "assets/monuments/pickaxe_monument_stage_1.webp";
import minerMonumentTwo from "assets/monuments/pickaxe_monument_stage_2.webp";

import woodcutterMonumentOne from "assets/monuments/axe_monument_stage_1.webp";
import woodcutterMonumentTwo from "assets/monuments/axe_monument_stage_2.webp";

import basicCookingPotOne from "assets/monuments/basic_cooking_pot_stage_1.webp";

import expertCookingPotOne from "assets/monuments/expert_cooking_pot_stage_1.webp";

import advancedCookingPotOne from "assets/monuments/advanced_cooking_pot_stage_1.webp";

export const PROJECT_IMAGES: Record<
  MonumentName,
  {
    empty: string;
    halfway: string;
    ready: string;
  }
> = {
  "Farmer's Monument": {
    empty: farmerMonumentOne,
    halfway: farmerMonumentTwo,
    ready: ITEM_DETAILS["Farmer's Monument"].image,
  },
  "Miner's Monument": {
    empty: minerMonumentOne,
    halfway: minerMonumentTwo,
    ready: ITEM_DETAILS["Miner's Monument"].image,
  },
  "Woodcutter's Monument": {
    empty: woodcutterMonumentOne,
    halfway: woodcutterMonumentTwo,
    ready: ITEM_DETAILS["Woodcutter's Monument"].image,
  },
  "Teamwork Monument": {
    // TODO - no progress for Teamwork Monuments
    empty: ITEM_DETAILS["Teamwork Monument"].image,
    halfway: ITEM_DETAILS["Teamwork Monument"].image,
    ready: ITEM_DETAILS["Teamwork Monument"].image,
  },
  "Basic Cooking Pot": {
    empty: basicCookingPotOne,
    halfway: basicCookingPotOne,
    ready: ITEM_DETAILS["Basic Cooking Pot"].image,
  },
  "Expert Cooking Pot": {
    empty: expertCookingPotOne,
    halfway: expertCookingPotOne,
    ready: ITEM_DETAILS["Expert Cooking Pot"].image,
  },
  "Advanced Cooking Pot": {
    empty: advancedCookingPotOne,
    halfway: advancedCookingPotOne,
    ready: ITEM_DETAILS["Advanced Cooking Pot"].image,
  },
  // TODO - no growth stages for giant fruit?
  "Big Orange": {
    empty: ITEM_DETAILS["Big Orange"].image,
    halfway: ITEM_DETAILS["Big Orange"].image,
    ready: ITEM_DETAILS["Big Orange"].image,
  },
  "Big Apple": {
    empty: ITEM_DETAILS["Big Apple"].image,
    halfway: ITEM_DETAILS["Big Apple"].image,
    ready: ITEM_DETAILS["Big Apple"].image,
  },
  "Big Banana": {
    empty: ITEM_DETAILS["Big Banana"].image,
    halfway: ITEM_DETAILS["Big Banana"].image,
    ready: ITEM_DETAILS["Big Banana"].image,
  },
};

export const CheerModal: React.FC<{
  project: MonumentName;
  cheers: number;
  username: string;
  onClose: () => void;
  onCheer: () => void;
  cheersAvailable: Decimal;
}> = ({ project, cheers, username, onClose, onCheer, cheersAvailable }) => {
  const { t } = useAppTranslation();

  const hasCheersAvailable = cheersAvailable.gt(0);

  return (
    <Panel>
      <div className="flex justify-between sm:flex-row flex-col space-y-1">
        <Label
          type="default"
          icon={ITEM_DETAILS[project].image}
          className="ml-1"
        >
          {t("cheer.village.project")}
        </Label>
        <Label type="info" icon={cheer} className="ml-2 sm:ml-0">
          {t("kingdomChores.progress", {
            progress: `${cheers}/${REQUIRED_CHEERS[project]}`,
          })}
        </Label>
      </div>
      <div className="p-2 text-xs flex flex-col gap-2">
        <span>
          {t("cheer.village.project.description", {
            project,
            username,
          })}
        </span>
        <span>
          {t("cheer.village.project.confirm", {
            project,
          })}
        </span>
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={onCheer} disabled={!hasCheersAvailable}>
          {t("cheer")}
        </Button>
      </div>
    </Panel>
  );
};

const ProjectModal: React.FC<{
  state: GameState;
  project: MonumentName;
  onClose: () => void;
  onComplete: () => void;
  cheers: number;
}> = ({ project, onClose, onComplete, cheers }) => {
  const { t } = useAppTranslation();

  const rewardItem = REWARD_ITEMS[project];

  let amount = rewardItem?.amount ?? 0;
  if (rewardItem?.item === "Love Charm") {
    amount += getLoveCharmBoost(state, amount);
  }

  const isProjectComplete = cheers >= REQUIRED_CHEERS[project];

  return (
    <Panel>
      <div className="flex justify-between sm:flex-row flex-col space-y-1">
        <Label
          type="default"
          icon={ITEM_DETAILS[project].image}
          className="ml-1"
        >
          {t("complete.project")}
        </Label>
      </div>

      <div className="flex flex-col gap-1 text-xs p-2">
        <span>
          {isProjectComplete &&
            t("project.completed", {
              project,
            })}
          {!isProjectComplete &&
            t("project.incomplete", {
              project,
              cheers,
              requiredCheers: REQUIRED_CHEERS[project],
            })}
        </span>
      </div>

      <Label type="warning" icon={chest} className="mb-1 ml-2">
        {t("reward")}
      </Label>

      {rewardItem && (
        <ButtonPanel className="flex items-start cursor-context-menu hover:brightness-100 mb-1">
          <Box
            image={
              REWARD_ITEMS[project]?.item
                ? ITEM_DETAILS[rewardItem.item].image
                : chest
            }
            className="-mt-2 -ml-1 -mb-1"
          />
          <div className="flex flex-col">
            <Label type="default" className="mr-1 mb-1">
              {`${formatNumber(rewardItem.amount)} x ${rewardItem.item}`}
            </Label>

            <p className="text-xs ml-0.5">
              {ITEM_DETAILS[rewardItem.item]?.description
                ? ITEM_DETAILS[rewardItem.item].description
                : t("reward.collectible")}
            </p>
          </div>
        </ButtonPanel>
      )}

      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={onComplete} disabled={!isProjectComplete}>
          {t("complete")}
        </Button>
      </div>
    </Panel>
  );
};

const _cheers = (project: MonumentName) => (state: MachineState) => {
  return (
    state.context.state.socialFarming.villageProjects[project]?.cheers ?? 0
  );
};
const _username = (state: MachineState) => {
  return state.context.state.username ?? state.context.farmId.toString();
};

const _cheersAvailable = (state: MachineState) => {
  return state.context.visitorState?.inventory["Cheer"] ?? new Decimal(0);
};

const _hasCheeredToday = (project: MonumentName) => (state: MachineState) => {
  const today = new Date().toISOString().split("T")[0];

  if (state.context.visitorState?.socialFarming.cheersGiven.date !== today) {
    return false;
  }

  return (
    state.context.visitorState?.socialFarming.cheersGiven.projects[
      project
    ]?.includes(state.context.farmId) ?? false
  );
};

const MonumentImage = (
  input: ProjectProps & {
    open: boolean;
    isProjectComplete: boolean;
    setIsCompleting: (isCompleting: boolean) => void;
  },
) => {
  useEffect(() => {
    if (input.open && input.isProjectComplete) {
      input.setIsCompleting(true);
    }
  }, [input.open, input.isProjectComplete]);

  return (
    <div className="absolute" style={input.divStyle}>
      <img src={input.image} style={input.imgStyle} alt={input.alt} />
    </div>
  );
};

type ProjectProps = React.ComponentProps<typeof ImageStyle> & {
  project: MonumentName;
};

export const Project: React.FC<ProjectProps> = (input) => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const projectCheers = useSelector(gameService, _cheers(input.project));
  const cheersAvailable = useSelector(gameService, _cheersAvailable);
  const hasCheeredProjectToday = useSelector(
    gameService,
    _hasCheeredToday(input.project),
  );
  const username = useSelector(gameService, _username);

  const projectPercentage = Math.round(
    (projectCheers / REQUIRED_CHEERS[input.project]) * 100,
  );
  const isProjectComplete = projectPercentage >= 100;

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];

  const hasCheers = cheersAvailable.gt(0);

  const [isCheering, setIsCheering] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [, setRender] = useState<number>(0);

  const handleCheer = async () => {
    try {
      gameService.send("villageProject.cheered", {
        effect: {
          type: "villageProject.cheered",
          project: input.project,
          // In the context of visiting, this is the farmId of the land being visited
          farmId: gameService.getSnapshot().context.farmId,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsCheering(false);
    }
  };

  const handleComplete = async () => {
    try {
      gameService.send({
        type: "project.completed",
        project: input.project,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  let image = PROJECT_IMAGES[input.project].empty;

  if (projectPercentage >= 20) {
    image = PROJECT_IMAGES[input.project].halfway;
  } else if (projectPercentage >= 100) {
    image = PROJECT_IMAGES[input.project].ready;
  }

  return (
    <>
      <Popover>
        <PopoverButton as="div">
          {({ open }) => (
            <>
              <MonumentImage
                {...input}
                image={image}
                open={open}
                setIsCompleting={setIsCompleting}
                isProjectComplete={isProjectComplete}
              />

              {isVisiting && !hasCheeredProjectToday && (
                <div
                  className={classNames(
                    "absolute -top-4 -right-4 pointer-events-auto cursor-pointer hover:img-highlight",
                    {
                      "animate-pulsate": hasCheers,
                    },
                  )}
                  onClick={() => setIsCheering(true)}
                >
                  <div
                    className="relative mr-2"
                    style={{ width: `${PIXEL_SCALE * 20}px` }}
                  >
                    <img className="w-full" src={SUNNYSIDE.icons.disc} />
                    <img
                      className={classNames("absolute")}
                      src={cheer}
                      style={{
                        width: `${PIXEL_SCALE * 17}px`,
                        right: `${PIXEL_SCALE * 2}px`,
                        top: `${PIXEL_SCALE * 2}px`,
                      }}
                    />
                  </div>
                </div>
              )}
              <div
                className="absolute bottom-2 left-1/2"
                style={{
                  width: `${PIXEL_SCALE * 20}px`,
                }}
              >
                {!hasCheeredProjectToday && (
                  <ProgressBar
                    type="quantity"
                    percentage={projectPercentage}
                    formatLength="full"
                    className="ml-1 -translate-x-1/2"
                  />
                )}
                {hasCheeredProjectToday && (
                  <LiveProgressBar
                    startAt={new Date(today).getTime()}
                    endAt={new Date(tomorrow).getTime()}
                    formatLength="short"
                    onComplete={() => setRender((r) => r + 1)}
                    className="ml-1 -translate-x-1/2"
                  />
                )}
              </div>
            </>
          )}
        </PopoverButton>

        <PopoverPanel anchor={{ to: "left start" }} className="flex">
          <SFTDetailPopoverInnerPanel>
            <SFTDetailPopoverLabel name={input.name} />
            <Label type="info" icon={cheer} className="ml-2 sm:ml-0">
              {t("cheers.progress", {
                progress: `${projectCheers}/${REQUIRED_CHEERS[input.project]}`,
              })}
            </Label>
          </SFTDetailPopoverInnerPanel>
        </PopoverPanel>
      </Popover>

      <Modal show={isCheering} onHide={() => setIsCheering(false)}>
        <CheerModal
          project={input.project}
          cheers={projectCheers}
          cheersAvailable={cheersAvailable}
          onClose={() => setIsCheering(false)}
          onCheer={handleCheer}
          username={username}
        />
      </Modal>

      <Modal show={isCompleting} onHide={() => setIsCompleting(false)}>
        <ProjectModal
          state={gameService.getSnapshot().context.state}
          project={input.project}
          onClose={() => setIsCompleting(false)}
          onComplete={handleComplete}
          cheers={projectCheers}
        />
      </Modal>
    </>
  );
};
