import React, { useContext, useEffect, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import helpIcon from "assets/icons/help.webp";
import { Context, useGame } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import {
  ButtonPanel,
  InnerPanel,
  OuterPanel,
  Panel,
} from "components/ui/Panel";
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
  hasHelpedFarmToday,
  isHelpComplete,
  MonumentName,
  RAFFLE_REWARDS,
  REQUIRED_CHEERS,
  REWARD_ITEMS,
} from "features/game/types/monuments";
import chest from "assets/icons/chest.png";
import { Box } from "components/ui/Box";
import { formatNumber } from "lib/utils/formatNumber";

import { GameState } from "features/game/types/game";

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
import { INSTA_GROW_PRICES } from "features/game/events/landExpansion/instaGrowProject";
import { RequirementLabel } from "components/ui/RequirementsLabel";

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
        <Label type="info" icon={helpIcon} className="ml-2 sm:ml-0">
          {t("kingdomChores.progress", {
            progress: `${cheers}/${REQUIRED_CHEERS[project]}`,
          })}
        </Label>
      </div>
      <div className="p-2 text-xs flex flex-col gap-2">
        <span>
          {t("cheer.village.project.description.charm", {
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

const ProjectComplete: React.FC<{
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

  const rewardItem = REWARD_ITEMS[project];

  const amount = rewardItem?.amount ?? 0;

  const isProjectComplete = cheers >= REQUIRED_CHEERS[project];

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

    if (isProjectComplete && winnerId) {
      load();
    }
  }, [isProjectComplete]);

  if (isLoading) {
    return (
      <InnerPanel>
        <Loading />
      </InnerPanel>
    );
  }

  return (
    <InnerPanel>
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
              remaining: REQUIRED_CHEERS[project] - cheers,
            })}
        </span>
      </div>

      {isProjectComplete && RAFFLE_REWARDS[project] && !!winner && (
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
    </InnerPanel>
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

  const { gameService, gameState } = useGame();

  const [showConfirmInsta, setShowConfirmInsta] = useState(false);

  const required = REQUIRED_CHEERS[project];

  const isProjectComplete = cheers >= required;

  const instaGrow = () => {
    gameService.send("project.instantGrow", {
      project,
    });
  };

  if (isProjectComplete) {
    return (
      <ProjectComplete
        onComplete={onComplete}
        state={state}
        project={project}
        onClose={onClose}
        cheers={cheers}
      />
    );
  }

  const instaGrowPrice = INSTA_GROW_PRICES[project] ?? 0;
  const obsidian = gameState.context.state.inventory.Obsidian ?? new Decimal(0);
  const hasObsidian = obsidian.gte(instaGrowPrice);

  if (showConfirmInsta) {
    return (
      <>
        <InnerPanel>
          <Label type="danger">{t("instaGrow")}</Label>
          <div className="flex flex-col gap-1 text-sm p-2">
            <span>
              {t("instaGrow.confirmation", {
                project,
                amount: instaGrowPrice,
              })}
            </span>
          </div>
          <div className="flex">
            <Button className="mr-1" onClick={() => setShowConfirmInsta(false)}>
              {t("close")}
            </Button>
            <Button onClick={instaGrow}>{t("confirm")}</Button>
          </div>
        </InnerPanel>
      </>
    );
  }

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex justify-between">
          <Label type="default">{project}</Label>
          <Label type="info" icon={helpIcon} className="ml-2 sm:ml-0">
            {t("cheers.progress", {
              progress: `${cheers}/${REQUIRED_CHEERS[project]}`,
            })}
          </Label>
        </div>
        <div className="flex flex-col gap-1 text-sm p-2">
          <span>{t("project.incomplete")}</span>
        </div>
      </InnerPanel>
      {!!instaGrowPrice && (
        <InnerPanel className="mb-1">
          <div className="p-1">
            <Label type="vibrant">{t("instaGrow")}</Label>
            <p className="text-sm my-1">
              {t("instaGrow.description", { project })}
            </p>
            <div className="flex justify-start">
              <RequirementLabel
                item="Obsidian"
                requirement={new Decimal(instaGrowPrice)}
                type="item"
                balance={obsidian}
              />
            </div>
          </div>
          <Button
            disabled={!hasObsidian}
            onClick={() => setShowConfirmInsta(true)}
          >
            {t("instaGrow")}
          </Button>
        </InnerPanel>
      )}
    </>
  );
};

const _cheers = (project: MonumentName) => (state: MachineState) => {
  return (
    state.context.state.socialFarming.villageProjects[project]?.cheers ?? 0
  );
};

const _cheersAvailable = (state: MachineState) => {
  return state.context.visitorState?.inventory["Cheer"] ?? new Decimal(0);
};

export const _hasCheeredToday =
  (project: MonumentName) => (state: MachineState) => {
    const today = new Date().toISOString().split("T")[0];

    if (state.context.visitorState) {
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

type ProjectProps = React.ComponentProps<typeof ImageStyle> & {
  project: MonumentName;
};

export const Project: React.FC<ProjectProps> = (input) => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);

  const projectCheers = useSelector(gameService, _cheers(input.project));
  const cheersAvailable = useSelector(gameService, _cheersAvailable);
  const hasCheeredProjectToday = useSelector(
    gameService,
    _hasCheeredToday(input.project),
  );

  const requiredCheers = REQUIRED_CHEERS[input.project];
  const projectPercentage = Math.round((projectCheers / requiredCheers) * 100);
  const isProjectComplete = projectCheers >= requiredCheers;

  const hasCheers = cheersAvailable.gt(0);

  const [showHelped, setShowHelped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      setShowDetails(false);
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
    if (!isVisiting) {
      setShowDetails(true);
      return;
    }

    handleHelpProject();
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

      <>
        <div className="absolute" style={input.divStyle} onClick={onClick}>
          <img src={image} style={input.imgStyle} alt={input.alt} />
        </div>

        {isVisiting && !hasCheeredProjectToday && !isProjectComplete && (
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
                src={helpIcon}
                style={{
                  width: `${PIXEL_SCALE * 15}px`,
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
          <ProgressBar
            type="quantity"
            percentage={projectPercentage}
            formatLength="full"
            className="ml-1 -translate-x-1/2"
          />
        </div>
      </>

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <CloseButtonPanel container={OuterPanel}>
          <ProjectModal
            state={gameService.getSnapshot().context.state}
            project={input.project}
            onClose={() => setShowDetails(false)}
            onComplete={handleComplete}
            cheers={projectCheers}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
