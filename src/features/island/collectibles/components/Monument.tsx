import React, { useContext, useEffect, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { Panel } from "components/ui/Panel";
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
  isHelpComplete,
  MonumentName,
  REQUIRED_CHEERS,
} from "features/game/types/monuments";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import { _hasCheeredToday, PROJECT_IMAGES } from "./Project";
import powerup from "assets/icons/level_up.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { FarmHelped } from "features/island/hud/components/FarmHelped";
import helpIcon from "assets/icons/help.webp";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { GameState } from "features/game/types/game";

const ProjectModal: React.FC<{
  project: MonumentName;
  onClose: () => void;
  cheers: number;
  state: GameState;
}> = ({ project, onClose, cheers, state }) => {
  const { t } = useAppTranslation();

  const isProjectComplete = cheers >= REQUIRED_CHEERS[project];
  const boostLabel = COLLECTIBLE_BUFF_LABELS[project]?.({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  });

  return (
    <Panel>
      <div className="flex justify-between sm:flex-row flex-col space-y-1">
        <Label
          type="default"
          icon={ITEM_DETAILS[project].image}
          className="ml-1"
        >
          {t("completed.monument")}
        </Label>
      </div>

      <div className="flex flex-col gap-1 text-xs p-2">
        <span>
          {isProjectComplete &&
            t("monument.completed", {
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

      {isProjectComplete && boostLabel && (
        <Label type="success" icon={powerup} className="mb-1 ml-2">
          {boostLabel[0].shortDescription}
        </Label>
      )}

      <Button onClick={onClose}>{t("close")}</Button>
    </Panel>
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

const MonumentImage = (
  input: MonumentProps & {
    open: boolean;
    isProjectComplete: boolean;
    setIsCompleting: (isCompleting: boolean) => void;
  },
) => {
  useEffect(() => {
    if (input.open && input.isProjectComplete) {
      input.setIsCompleting(true);
    }
  }, [input.open]);

  return (
    <div className="absolute cursor-pointer" style={input.divStyle}>
      <img src={input.image} style={input.imgStyle} alt={input.alt} />
    </div>
  );
};

type MonumentProps = React.ComponentProps<typeof ImageStyle> & {
  project: MonumentName;
};

export const Monument: React.FC<MonumentProps> = (input) => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const state = useSelector(gameService, (state) => state.context.state);
  const totalHelpedToday = useSelector(
    gameService,
    (state) => state.context.totalHelpedToday,
  );

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

  const [isCompleting, setIsCompleting] = useState(false);
  const [showHelped, setShowHelped] = useState(false);

  // V2 - local only event
  const handleHelpProject = async () => {
    gameService.send({
      type: "project.helped",
      project: input.project,
      totalHelpedToday: totalHelpedToday ?? 0,
    });

    if (
      isHelpComplete({
        game: gameService.getSnapshot().context.state,
      })
    ) {
      setShowHelped(true);
    }
  };

  let image = PROJECT_IMAGES[input.project].empty;

  if (isProjectComplete) {
    image = PROJECT_IMAGES[input.project].ready;
  } else if (projectPercentage >= 20) {
    image = PROJECT_IMAGES[input.project].halfway;
  }

  return (
    <>
      <Modal show={showHelped}>
        <CloseButtonPanel bumpkinParts={state.bumpkin.equipped}>
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
                    handleHelpProject();
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
              {!isProjectComplete && (
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
              )}
            </>
          )}
        </PopoverButton>

        <PopoverPanel
          anchor={{ to: "left start" }}
          className={classNames("flex", { hidden: isProjectComplete })}
        >
          <SFTDetailPopoverInnerPanel>
            <SFTDetailPopoverLabel name={input.name} />
            <Label type="info" icon={helpIcon} className="ml-2 sm:ml-0">
              {t("cheers.progress", {
                progress: `${projectCheers}/${requiredCheers}`,
              })}
            </Label>
          </SFTDetailPopoverInnerPanel>
        </PopoverPanel>
      </Popover>

      <Modal show={isCompleting} onHide={() => setIsCompleting(false)}>
        <ProjectModal
          project={input.project}
          onClose={() => setIsCompleting(false)}
          state={state}
          cheers={projectCheers}
        />
      </Modal>
    </>
  );
};
