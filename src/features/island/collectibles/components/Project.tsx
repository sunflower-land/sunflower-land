import React, { useContext, useEffect, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import cheer from "assets/icons/cheer.webp";
import { Context, useGame } from "features/game/GameProvider";
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
import {
  getMonumentBoostedAmount,
  getMonumentRewards,
  hasHelpedFarmToday,
  isHelpComplete,
  MonumentName,
  REQUIRED_CHEERS,
} from "features/game/types/monuments";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import chest from "assets/icons/chest.png";
import { Box } from "components/ui/Box";
import { formatNumber } from "lib/utils/formatNumber";

import { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

import farmerMonumentOne from "assets/monuments/shovel_monument_stage_1.webp";
import farmerMonumentTwo from "assets/monuments/shovel_monument_stage_2.webp";

import minerMonumentOne from "assets/monuments/pickaxe_monument_stage_1.webp";
import minerMonumentTwo from "assets/monuments/pickaxe_monument_stage_2.webp";

import woodcutterMonumentOne from "assets/monuments/axe_monument_stage_1.webp";
import woodcutterMonumentTwo from "assets/monuments/axe_monument_stage_2.webp";

import basicCookingPotOne from "assets/monuments/basic_cooking_pot_stage_1.webp";
import expertCookingPotOne from "assets/monuments/expert_cooking_pot_stage_1.webp";
import advancedCookingPotOne from "assets/monuments/advanced_cooking_pot_stage_1.webp";

import bigOrangeOne from "assets/monuments/big_orange_stage_1.webp";
import bigOrangeTwo from "assets/monuments/big_orange_stage_2.webp";
import bigOrangeThree from "assets/monuments/big_orange_stage_3.webp";

import bigAppleOne from "assets/monuments/big_apple_stage_1.webp";
import bigAppleTwo from "assets/monuments/big_apple_stage_2.webp";
import bigAppleThree from "assets/monuments/big_apple_stage_3.webp";

import bigBananaOne from "assets/monuments/big_banana_stage_1.webp";
import bigBananaTwo from "assets/monuments/big_banana_stage_2.webp";
import bigBananaThree from "assets/monuments/big_banana_stage_3.webp";

import { getPlayer } from "features/social/actions/getPlayer";
import { useAuth } from "features/auth/lib/Provider";
import { Player } from "features/social/types/types";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Loading } from "features/auth/components";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { FarmHelped } from "features/island/hud/components/FarmHelped";

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
    empty: bigOrangeOne,
    halfway: bigOrangeTwo,
    ready: bigOrangeThree,
  },
  "Big Apple": {
    empty: bigAppleOne,
    halfway: bigAppleTwo,
    ready: bigAppleThree,
  },
  "Big Banana": {
    empty: bigBananaOne,
    halfway: bigBananaTwo,
    ready: bigBananaThree,
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
  const { gameService } = useGame();

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
            progress: `${cheers}/${REQUIRED_CHEERS(gameService.getSnapshot().context.state)[project]}`,
          })}
        </Label>
      </div>
      <div className="p-2 text-xs flex flex-col gap-2">
        {hasFeatureAccess(
          gameService.getSnapshot().context.visitorState!,
          "CHEERS_V2",
        ) ? (
          <span>
            {t("cheer.village.project.description.charm", {
              project,
              username,
            })}
          </span>
        ) : (
          <span>
            {t("cheer.village.project.description", {
              project,
              username,
            })}
          </span>
        )}

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
}> = ({ project, onClose, onComplete, cheers, state }) => {
  const { t } = useAppTranslation();

  const { gameService } = useGame();
  const { authService } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState<Player>();

  const rewards = getMonumentRewards({ state, monument: project });

  const rewardItem = rewards[project];

  let amount = rewardItem?.amount ?? 0;
  if (rewardItem?.item === "Love Charm") {
    amount = getMonumentBoostedAmount({ gameState: state, amount });
  }

  const isProjectComplete =
    cheers >= REQUIRED_CHEERS(gameService.getSnapshot().context.state)[project];

  useEffect(() => {
    const winnerId = state.socialFarming.villageProjects[project]?.winnerId;

    const load = async () => {
      setIsLoading(true);

      const winner = await getPlayer({
        token: authService.getSnapshot().context.user.rawToken!,
        farmId: gameService.getSnapshot().context.farmId,
        followedPlayerId: winnerId!,
      });

      setIsLoading(false);

      setWinner(winner);
    };

    if (
      isProjectComplete &&
      winnerId &&
      hasFeatureAccess(gameService.getSnapshot().context.state, "CHEERS_V2")
    ) {
      load();
    }
  }, [isProjectComplete]);

  if (isLoading) {
    return (
      <Panel>
        <Loading />
      </Panel>
    );
  }

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
              requiredCheers: REQUIRED_CHEERS(
                gameService.getSnapshot().context.state,
              )[project],
              remaining:
                REQUIRED_CHEERS(gameService.getSnapshot().context.state)[
                  project
                ] - cheers,
            })}
        </span>
      </div>

      {hasFeatureAccess(state, "CHEERS_V2") &&
        isProjectComplete &&
        !!winner && (
          <>
            <div className="flex justify-between flex-wrap">
              <Label
                type="chill"
                icon={SUNNYSIDE.icons.heart}
                className="mb-1 ml-2"
              >
                {t("project.friendBonus")}
              </Label>
              <div className="flex items-center mr-4">
                <NPCIcon
                  width={20}
                  parts={winner?.data?.clothing as BumpkinParts}
                />
                <div className="ml-1">
                  <p className="text-xs">{winner.data?.username}</p>
                </div>
              </div>
            </div>

            <p className="text-xs ml-2 mb-2">
              {t("project.friendBonus.description")}
            </p>
          </>
        )}

      <Label type="warning" icon={chest} className="mb-1 ml-2">
        {t("reward")}
      </Label>

      {rewardItem && (
        <ButtonPanel className="flex items-start cursor-context-menu hover:brightness-100 mb-1">
          <Box
            image={
              rewardItem?.item ? ITEM_DETAILS[rewardItem.item].image : chest
            }
            className="-mt-2 -ml-1 -mb-1"
          />
          <div className="flex flex-col">
            <Label type="default" className="mr-1 mb-1">
              {`${formatNumber(amount)} x ${rewardItem.item}`}
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

export const _hasCheeredToday =
  (project: MonumentName) => (state: MachineState) => {
    const today = new Date().toISOString().split("T")[0];

    if (
      state.context.visitorState &&
      hasFeatureAccess(state.context.visitorState!, "CHEERS_V2")
    ) {
      const hasHelpedToday = hasHelpedFarmToday({
        game: state.context.visitorState,
        farmId: state.context.farmId,
      });

      if (hasHelpedToday) {
        return true;
      }

      if (
        state.context.state?.socialFarming.villageProjects[project]?.helpedAt
      ) {
        return true;
      }
    }

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

  const { authService } = useAuth();

  const projectCheers = useSelector(gameService, _cheers(input.project));
  const cheersAvailable = useSelector(gameService, _cheersAvailable);
  const hasCheeredProjectToday = useSelector(
    gameService,
    _hasCheeredToday(input.project),
  );
  const username = useSelector(gameService, _username);

  const requiredCheers = REQUIRED_CHEERS(
    gameService.getSnapshot().context.state,
  )[input.project];
  const projectPercentage = Math.round((projectCheers / requiredCheers) * 100);
  const isProjectComplete = projectCheers >= requiredCheers;

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];

  const hasCheers = cheersAvailable.gt(0);

  const [isCheering, setIsCheering] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showHelped, setShowHelped] = useState(false);

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
      gameService.send("project.completed", {
        effect: {
          type: "project.completed",
          project: input.project,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  // V2 - local only event
  const handleHelpProject = async () => {
    gameService.send("project.helped", {
      project: input.project,
    });

    if (isHelpComplete({ game: gameService.getSnapshot().context.state })) {
      setShowHelped(true);
    }
  };

  const onClick = () => {
    if (isProjectComplete || hasCheeredProjectToday) {
      setIsCheering(true);
      return;
    }

    if (
      hasFeatureAccess(
        gameService.getSnapshot().context.visitorState!,
        "CHEERS_V2",
      )
    ) {
      handleHelpProject();
    } else {
      setIsCheering(true);
    }
  };

  let image = PROJECT_IMAGES[input.project].empty;

  if (projectPercentage >= 100) {
    image = PROJECT_IMAGES[input.project].ready;
  } else if (projectPercentage >= 20) {
    image = PROJECT_IMAGES[input.project].halfway;
  }

  return (
    <>
      <Modal show={showHelped}>
        <CloseButtonPanel
          bumpkinParts={gameService.state.context.state.bumpkin.equipped}
        >
          <FarmHelped onClose={() => setShowHelped(false)} />
        </CloseButtonPanel>
      </Modal>

      <Popover>
        <PopoverButton as="div">
          {({ open }) => (
            <>
              {!isVisiting && (
                <MonumentImage
                  {...input}
                  open={open}
                  image={image}
                  setIsCompleting={setIsCompleting}
                  isProjectComplete={isProjectComplete}
                />
              )}

              {isVisiting && (
                <div className="absolute" style={input.divStyle}>
                  <img src={image} style={input.imgStyle} alt={input.alt} />
                </div>
              )}

              {isVisiting &&
                !hasCheeredProjectToday &&
                !isProjectComplete &&
                (hasCheers ||
                  hasFeatureAccess(
                    gameService.getSnapshot().context.visitorState!,
                    "CHEERS_V2",
                  )) && (
                  <div
                    className={classNames(
                      "absolute -top-4 -right-4 pointer-events-auto cursor-pointer hover:img-highlight",
                      {
                        "animate-pulsate": hasCheers,
                      },
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                  >
                    <div
                      className="relative mr-2"
                      style={{ width: `${PIXEL_SCALE * 20}px` }}
                    >
                      <img className="w-full" src={SUNNYSIDE.icons.disc} />
                      <img
                        className={classNames("absolute")}
                        src={
                          hasFeatureAccess(
                            gameService.getSnapshot().context.visitorState!,
                            "CHEERS_V2",
                          )
                            ? SUNNYSIDE.icons.drag
                            : cheer
                        }
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
                progress: `${projectCheers}/${REQUIRED_CHEERS(gameService.getSnapshot().context.state)[input.project]}`,
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
