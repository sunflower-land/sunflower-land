import React, { useContext, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import cheer from "assets/icons/cheer.webp";
import { Context } from "features/game/GameProvider";
import { LiveProgressBar, ProgressBar } from "components/ui/ProgressBar";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import classNames from "classnames";

export type VillageProjectName = Extract<
  InventoryItemName,
  | "Farmer's Monument"
  | "Woodcutter's Monument"
  | "Miner's Monument"
  | "Teamwork Monument"
>;

export const REQUIRED_CHEERS: Record<VillageProjectName, number> = {
  "Farmer's Monument": 600,
  "Woodcutter's Monument": 600,
  "Miner's Monument": 600,
  "Teamwork Monument": 600,
};

const CheerModal: React.FC<{
  project: VillageProjectName;
  cheers: number;
  username: string;
  onClose: () => void;
  onCheer: () => void;
}> = ({ project, cheers, username, onClose, onCheer }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <div className="flex justify-between sm:flex-row flex-col space-y-1">
        <Label
          type="default"
          icon={ITEM_DETAILS["Farmer's Monument"].image}
          className="ml-1"
        >
          {t("cheer.village.project")}
        </Label>
        <Label type="info" icon={cheer} className="ml-2 sm:ml-0">
          {t("kingdomChores.progress", {
            progress: `${cheers}/${REQUIRED_CHEERS["Woodcutter's Monument"]}`,
          })}
        </Label>
      </div>
      <div className="p-2 text-xs flex flex-col gap-2">
        <span>
          {t("cheer.village.project.description", {
            project,
            goron: "goron",
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
        <Button onClick={onCheer}>{t("cheer")}</Button>
      </div>
    </Panel>
  );
};

const _cheers = (project: VillageProjectName) => (state: MachineState) => {
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

const _hasCheeredToday =
  (project: VillageProjectName) => (state: MachineState) => {
    const today = new Date().toISOString().split("T")[0];

    if (
      state.context.visitorState?.socialFarming.cheeredProjects.date !== today
    ) {
      return false;
    }

    return (
      state.context.visitorState?.socialFarming.cheeredProjects.projects[
        project
      ]?.includes(state.context.farmId) ?? false
    );
  };

type MonumentProps = React.ComponentProps<typeof ImageStyle> & {
  project: VillageProjectName;
};

export const Monument: React.FC<MonumentProps> = (input) => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);

  const projectCheers = useSelector(gameService, _cheers(input.project));
  const cheersAvailable = useSelector(gameService, _cheersAvailable);
  const hasCheeredProjectToday = useSelector(
    gameService,
    _hasCheeredToday(input.project),
  );
  const username = useSelector(gameService, _username);

  const projectPercentage = Math.round(
    (projectCheers / REQUIRED_CHEERS["Woodcutter's Monument"]) * 100,
  );

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];

  const hasCheers = cheersAvailable.gt(0);

  const [isCheering, setIsCheering] = useState(false);
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

  return (
    <>
      <ImageStyle {...input} />
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
      <Modal show={isCheering} onHide={() => setIsCheering(false)}>
        <CheerModal
          project={input.project}
          cheers={projectCheers}
          onClose={() => setIsCheering(false)}
          onCheer={handleCheer}
          username={username}
        />
      </Modal>
    </>
  );
};
