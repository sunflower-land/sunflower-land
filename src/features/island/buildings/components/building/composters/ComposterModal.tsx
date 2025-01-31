import React, { useContext, useEffect, useState } from "react";

import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import powerup from "assets/icons/level_up.png";
import compost from "assets/composters/compost.png";

import {
  WORM,
  ComposterName,
  composterDetails,
  SEASON_COMPOST_REQUIREMENTS,
  CompostName,
} from "features/game/types/composters";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { GameState, Inventory } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SquareIcon } from "components/ui/SquareIcon";
import { OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { setImageWidth } from "lib/images";
import { Loading } from "features/auth/components";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import {
  getCompostAmount,
  getReadyAt,
} from "features/game/events/landExpansion/startComposter";
import { isWearableActive } from "features/game/lib/wearables";
import {
  getSpeedUpCost,
  getSpeedUpTime,
} from "features/game/events/landExpansion/accelerateComposter";
import { isCollectibleActive } from "features/game/lib/collectibleBuilt";
import { hasFeatureAccess } from "lib/flags";
import { SEASON_ICONS } from "../market/SeasonalSeeds";
import { RecipeInfoPanel } from "../craftingBox/components/RecipeInfoPanel";

const WORM_OUTPUT: Record<ComposterName, { min: number; max: number }> = {
  "Compost Bin": { min: 2, max: 4 },
  "Turbo Composter": { min: 2, max: 3 },
  "Premium Composter": { min: 1, max: 3 },
};

function getWormOutput({
  state,
  building,
}: {
  state: GameState;
  building: ComposterName;
}) {
  const { skills } = state.bumpkin;
  let { min, max } = WORM_OUTPUT[building];
  if (isWearableActive({ name: "Bucket O' Worms", game: state })) {
    min += 1;
    max += 1;
  }

  // +1 Worm if the player has Wormy Treat skill
  if (skills["Wormy Treat"]) {
    min += 1;
    max += 1;
  }

  // +2 Bait if the player has Composting Overhaul skill
  if (skills["Composting Overhaul"]) {
    min += 2;
    max += 2;
  }

  // -1 bait if player has More with less skill (in exchange for +10 fishing limit)
  if (skills["More With Less"]) {
    min -= 1;
    max -= 1;
  }

  // -3 worms with Composting Revamp
  if (skills["Composting Revamp"]) {
    min -= 3;
    max -= 3;
  }

  // If min/max somehow goes negative, show as 0
  if (min < 0) {
    min = 0;
  }

  if (max < 0) {
    max = 0;
  }

  return { min, max };
}

export const COMPOSTER_IMAGES: Record<
  ComposterName,
  {
    idle: string;
    composting: string;
    ready: string;
    width: number;
  }
> = {
  "Compost Bin": {
    composting: SUNNYSIDE.building.basicComposting,
    idle: SUNNYSIDE.building.basicComposter,
    ready: SUNNYSIDE.building.basicReady,
    width: 24,
  },
  "Turbo Composter": {
    composting: SUNNYSIDE.building.advancedComposting,
    idle: SUNNYSIDE.building.advancedComposter,
    ready: SUNNYSIDE.building.advancedReady,
    width: 27,
  },
  "Premium Composter": {
    composting: SUNNYSIDE.building.expertComposting,
    idle: SUNNYSIDE.building.expertComposter,
    ready: SUNNYSIDE.building.expertReady,
    width: 34,
  },
};
const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `composter-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

const Timer: React.FC<{ readyAt: number }> = ({ readyAt }) => {
  const [secondsLeft, setSecondsLeft] = useState((readyAt - Date.now()) / 1000);

  const active = readyAt >= Date.now();

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setSecondsLeft((readyAt - Date.now()) / 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <div className="flex items-center mb-2">
      <img src={SUNNYSIDE.icons.timer} className="h-5 mr-1" />

      <span className="text-xs mr-1">
        {secondsToString(secondsLeft, {
          length: "full",
        })}
      </span>
    </div>
  );
};

const FertiliserLabel: React.FC<{
  fertiliser: CompostName;
  state: GameState;
}> = ({ fertiliser, state }) => {
  const { t } = useAppTranslation();

  if (fertiliser === "Sprout Mix") {
    return (
      <Label
        icon={powerup}
        secondaryIcon={SUNNYSIDE.icons.plant}
        type="success"
        className="text-xs whitespace-pre-line"
      >
        {isCollectibleActive({ name: "Knowledge Crab", game: state })
          ? "+0.4"
          : "+0.2"}{" "}
        {t("crops")}
      </Label>
    );
  }

  if (fertiliser === "Fruitful Blend") {
    return (
      <Label
        icon={powerup}
        secondaryIcon={ITEM_DETAILS.Apple.image}
        type="success"
        className="text-xs whitespace-pre-line"
      >
        {"+0.1"} {t("fruit")}
      </Label>
    );
  }

  if (fertiliser === "Rapid Root") {
    return (
      <Label
        icon={SUNNYSIDE.icons.stopwatch}
        secondaryIcon={SUNNYSIDE.icons.plant}
        type="info"
        className="text-xs whitespace-pre-line"
      >
        {t("guide.compost.cropGrowthTime")}
      </Label>
    );
  }

  return null;
};

const ComposterModalContent: React.FC<{
  composterName: ComposterName;
  startComposter: () => void;
  readyAt: number;
  onCollect: () => void;
  onBoost: () => void;
}> = ({ composterName, startComposter, readyAt, onCollect, onBoost }) => {
  const { gameService } = useContext(Context);
  const [showRequirements, setShowRequirements] = useState(false);

  const { t } = useAppTranslation();

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { inventory, bumpkin, buildings } = state;

  const { produce, worm } = composterDetails[composterName];

  const { resourceBoostMilliseconds } = getSpeedUpTime({
    state,
    composter: composterName,
  });

  const { resourceBoostRequirements } = getSpeedUpCost(state, composterName);

  const { produceAmount } = getCompostAmount({
    skills: bumpkin.skills,
    building: composterName,
  });

  const { min, max } = getWormOutput({ state, building: composterName });
  const { timeToFinishMilliseconds } = getReadyAt({
    gameState: state,
    composter: composterName,
  });

  const composting = !!readyAt && readyAt > Date.now();
  const isReady = readyAt && readyAt < Date.now();

  const produces = buildings[composterName]?.[0].producing?.items ?? {};

  const requires = hasFeatureAccess(state, "WEATHER_SHOP")
    ? SEASON_COMPOST_REQUIREMENTS[composterName][state.season.season]
    : buildings[composterName]?.[0].requires ?? {};

  const boost = buildings[composterName]?.[0].boost;

  const boostResource = bumpkin.skills["Feathery Business"] ? "Feather" : "Egg";

  const hasRequirements = getKeys(requires).every((name) => {
    const amount = requires[name] || new Decimal(0);

    const count = inventory[name] || new Decimal(0);

    return count.gte(amount);
  });

  const disabled = !hasRequirements || composting;

  const accelerate = () => {
    gameService.send("compost.accelerated", {
      building: composterName,
    });
    onBoost();
  };

  const [isConfirmBoostModalOpen, showConfirmBoostModal] = useState(false);
  const applyBoost = () => {
    accelerate();
    showConfirmBoostModal(false);
  }; // We could do without this const but I added it for better security

  if (isReady) {
    return (
      <>
        {hasFeatureAccess(state, "WEATHER_SHOP") && (
          <Label
            icon={SEASON_ICONS[state.season.season]}
            type="default"
            className="ml-2"
          >
            {t(`season.${state.season.season}`)}
          </Label>
        )}
        <div className="flex p-2 -mt-2">
          <img
            src={COMPOSTER_IMAGES[composterName].ready}
            className="w-14 object-contain mr-2"
          />
          <div className="mt-2 flex-1">
            <div className="flex flex-wrap">
              {getKeys(produces).map((name) => (
                <div
                  key={name}
                  className="flex space-x-2 justify-start mr-2 mb-1"
                >
                  <img src={ITEM_DETAILS[name].image} className="h-5" />
                  <Label type="default">{`${produces[name]} ${name}`}</Label>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
              <span className="text-xs">{t("compost.complete")}</span>
            </div>
          </div>
        </div>

        <Button
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={onCollect}
        >
          {t("collect")}
        </Button>
      </>
    );
  }

  if (composting) {
    return (
      <>
        {hasFeatureAccess(state, "WEATHER_SHOP") && (
          <Label
            icon={SEASON_ICONS[state.season.season]}
            type="default"
            className="ml-2"
          >
            {t(`season.${state.season.season}`)}
          </Label>
        )}
        <div className="flex p-2 -mt-2">
          <img
            src={COMPOSTER_IMAGES[composterName].composting}
            className="w-14 object-contain mr-2"
          />
          <div className="mt-2 flex-1">
            <Timer readyAt={readyAt} />
            <div className="flex flex-wrap my-1">
              {getKeys(produces).map((name) => (
                <div
                  key={name}
                  className="flex space-x-2 justify-start mr-2 mb-1"
                >
                  <img src={ITEM_DETAILS[name].image} className="h-5" />
                  <Label type="default">
                    {name in WORM ? `? ${name}s` : `${produces[name]} ${name}`}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        {!boost && (
          <>
            <Button
              className="text-xxs sm:text-sm mb-2 whitespace-nowrap"
              onClick={onCollect}
              disabled={true}
            >
              {t("collect")}
            </Button>
            <OuterPanel className="!p-1">
              <div className="flex justify-between mb-1">
                <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                  {`${secondsToString(resourceBoostMilliseconds / 1000, {
                    length: "short",
                  })} Boost`}
                </Label>
                <RequirementLabel
                  type="item"
                  item={boostResource}
                  requirement={new Decimal(resourceBoostRequirements)}
                  balance={inventory[boostResource] ?? new Decimal(0)}
                />
              </div>
              <p className="text-xs mb-2">
                {t(
                  bumpkin.skills["Feathery Business"]
                    ? "guide.compost.addFeathers.speed"
                    : "guide.compost.addEggs.speed",
                )}
              </p>
              <Button
                disabled={
                  !boost &&
                  !(inventory[boostResource] ?? new Decimal(0)).gte(
                    resourceBoostRequirements,
                  )
                }
                onClick={() => showConfirmBoostModal(true)}
              >
                {t(
                  bumpkin.skills["Feathery Business"]
                    ? "guide.compost.addFeathers"
                    : "guide.compost.addEggs",
                )}
              </Button>
              <ConfirmationModal
                show={isConfirmBoostModalOpen}
                onHide={() => showConfirmBoostModal(false)}
                messages={[
                  bumpkin.skills["Feathery Business"]
                    ? t("guide.compost.addFeathers.confirmation", {
                        noFeathers: resourceBoostRequirements,
                        time: secondsToString(
                          resourceBoostMilliseconds / 1000,
                          {
                            length: "short",
                          },
                        ),
                      })
                    : t("guide.compost.addEggs.confirmation", {
                        noEggs: resourceBoostRequirements,
                        time: secondsToString(
                          resourceBoostMilliseconds / 1000,
                          {
                            length: "short",
                          },
                        ),
                      }),
                ]}
                onCancel={() => showConfirmBoostModal(false)}
                onConfirm={applyBoost}
                confirmButtonLabel={t(
                  bumpkin.skills["Feathery Business"]
                    ? "guide.compost.addFeathers"
                    : "guide.compost.addEggs",
                )}
                disabled={
                  !(inventory[boostResource] ?? new Decimal(0)).gte(
                    resourceBoostRequirements,
                  )
                }
              />
            </OuterPanel>
          </>
        )}
        {boost && (
          <OuterPanel className="!p-1">
            <div className="flex justify-between">
              <Label
                type="info"
                icon={SUNNYSIDE.icons.stopwatch}
                secondaryIcon={SUNNYSIDE.icons.confirm}
              >
                {`${secondsToString(resourceBoostMilliseconds / 1000, {
                  length: "short",
                })} Boosted`}
              </Label>
              <Label type="default" icon={ITEM_DETAILS[boostResource].image}>
                {resourceBoostRequirements}{" "}
                {t(
                  bumpkin.skills["Feathery Business"]
                    ? "guide.compost.feathers"
                    : "guide.compost.eggs",
                )}
              </Label>
            </div>
          </OuterPanel>
        )}
      </>
    );
  }

  if (getKeys(requires).length === 0) {
    return (
      <>
        {hasFeatureAccess(state, "WEATHER_SHOP") && (
          <Label
            icon={SEASON_ICONS[state.season.season]}
            type="default"
            className="ml-2"
          >
            {t(`season.${state.season.season}`)}
          </Label>
        )}
        <div className="flex p-2 -mt-2 items-center">
          <img
            src={COMPOSTER_IMAGES[composterName].ready}
            className="object-contain mr-2"
            onLoad={(e) => setImageWidth(e.currentTarget)}
            style={{
              opacity: 0,
            }}
          />
          <Loading text={t("loading")} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {hasFeatureAccess(state, "WEATHER_SHOP") && (
          <Label
            icon={SEASON_ICONS[state.season.season]}
            type="default"
            className="ml-2"
          >
            {t(`season.${state.season.season}`)}
          </Label>
        )}
        <div className="flex flex-col h-full px-1 py-0">
          <div className="flex flex-wrap my-1">
            <div className="flex space-x-2 justify-start mr-2">
              <SquareIcon icon={ITEM_DETAILS[produce].image} width={14} />
              <div className="block">
                <p className="text-xs mb-1">{`${produceAmount} ${produce}`}</p>
                <FertiliserLabel fertiliser={produce} state={state} />
              </div>
            </div>
            <div className="flex space-x-1 justify-start">
              <SquareIcon icon={ITEM_DETAILS[worm].image} width={14} />
              <div className="block">
                <p className="text-xs mb-1">
                  {max === 0 ? `0 ${worm}s` : `${min}-${max} ${worm}s`}
                </p>
                <Label
                  icon={SUNNYSIDE.tools.fishing_rod}
                  type="default"
                  className="text-xs whitespace-pre-line"
                >
                  {t("guide.compost.fishingBait")}
                </Label>
              </div>
            </div>
          </div>
          <div
            className="border-t border-white w-full my-2 pt-2 flex-col"
            onClick={() => setShowRequirements(!showRequirements)}
          >
            <div className="relative w-[140px] h-0">
              <RecipeInfoPanel
                show={showRequirements}
                ingredients={getKeys(requires).map((item) => ({
                  collectible: item,
                }))}
                title={t("requirements")}
                onClick={() => {
                  setShowRequirements(false);
                }}
              />
            </div>

            <div className="flex justify-between">
              <Label type="default">{t("requirements")}</Label>
              <RequirementLabel
                type="time"
                waitSeconds={timeToFinishMilliseconds / 1000}
              />
            </div>

            <div className="flex justify-between gap-x-3 gap-y-2 flex-wrap mt-2">
              {/* Item ingredients requirements */}
              {getKeys(requires).map((ingredientName, index) => (
                <RequirementLabel
                  key={index}
                  type="item"
                  item={ingredientName}
                  balance={inventory[ingredientName] ?? new Decimal(0)}
                  requirement={new Decimal(requires[ingredientName] ?? 0)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        disabled={disabled}
        className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
        onClick={() => startComposter()}
      >
        {t("compost")}
      </Button>
    </>
  );
};

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  startComposter: () => void;
  composterName: ComposterName;
  onCollect: () => void;
  readyAt?: number;
  onBoost: () => void;
}

export const ComposterModal: React.FC<Props> = ({
  showModal,
  composterName,
  setShowModal,
  startComposter,
  readyAt,
  onCollect,
  onBoost,
}) => {
  const [tab, setTab] = useState(0);

  const { t } = useAppTranslation();

  useEffect(() => {
    if (showModal && !hasRead()) {
      setTab(1);
    }
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <CloseButtonPanel
        onClose={() => {
          setShowModal(false);
        }}
        tabs={[
          { icon: compost, name: "Composter" },
          {
            icon: SUNNYSIDE.icons.expression_confused,
            name: t("guide"),
          },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === 0 && (
          <ComposterModalContent
            composterName={composterName}
            startComposter={startComposter}
            readyAt={readyAt}
            onCollect={onCollect}
            onBoost={onBoost}
          />
        )}
        {tab === 1 && (
          <>
            <div className="p-2">
              <img
                src={SUNNYSIDE.tutorial.composting}
                className="w-full mx-auto rounded-lg mb-2"
              />
              <div className="flex mb-2">
                <div className="w-12 flex justify-center">
                  <img
                    src={SUNNYSIDE.icons.timer}
                    className="h-6 mr-2 object-contain"
                  />
                </div>
                <p className="text-xs  flex-1">
                  {t("guide.compost.placeCrops")}
                  {"."}
                </p>
              </div>
              <div className="flex mb-2">
                <div className="w-12 flex justify-center">
                  <img src={compost} className="h-6 mr-2 object-contain" />
                </div>
                <p className="text-xs  flex-1">
                  {t("guide.compost.compostCycle")}
                  {"."}
                </p>
              </div>
              <div className="flex mb-2">
                <div className="w-12 flex justify-center">
                  <img
                    src={SUNNYSIDE.tools.fishing_rod}
                    className="h-6 mr-2 object-contain"
                  />
                </div>
                <p className="text-xs flex-1">
                  {t("guide.compost.yieldsWorms")}
                  {"."}
                </p>
              </div>
              <div className="flex mb-2">
                <div className="w-12 flex justify-center">
                  <img
                    src={ITEM_DETAILS.Egg.image}
                    className="h-6 mr-2 object-contain"
                  />
                </div>
                <p className="text-xs flex-1">
                  {t("guide.compost.useEggs")}
                  {"."}
                </p>
              </div>
              <div className="flex mb-2">
                <div className="w-12 flex justify-center">
                  <img
                    src={SEASON_ICONS["autumn"]}
                    className="h-6 mr-2 object-contain"
                  />
                </div>
                <p className="text-xs flex-1">
                  {t("guide.compost.seasons")}
                  {"."}
                </p>
              </div>
            </div>
            <Button
              className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
              onClick={() => {
                setTab(0);
                acknowledgeRead();
              }}
            >
              {t("ok")}
            </Button>
          </>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};

interface CraftingProps {
  gameState: GameState;
  stock?: Decimal;
  isLimitedItem?: boolean;
  details: any;
  boost?: string;
  requirements?: Inventory;
  limit?: number;
  actionView?: JSX.Element;
  hideDescription?: boolean;
  seconds: number;
}
export const CraftingRequirements: React.FC<CraftingProps> = ({
  gameState,
  stock,
  isLimitedItem = false,
  limit,
  details,
  boost,
  requirements,
  actionView,
  hideDescription,
  seconds,
}: CraftingProps) => {
  const getItemDetail = ({
    hideDescription,
  }: {
    hideDescription?: boolean;
  }) => {
    const { image: icon, description, name } = details;
    const title = details.quantity
      ? `${details.quantity} x ${details.item}`
      : name;

    return (
      <>
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
          {icon && !!details.item && (
            <div className="sm:mt-2">
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          <span className="sm:text-center">{title}</span>
        </div>
        {!hideDescription && (
          <span className="text-xs sm:mt-1 whitespace-pre-line sm:text-center">
            {description}
          </span>
        )}
      </>
    );
  };

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        {/* Item ingredients requirements */}
        {!!requirements &&
          getKeys(requirements).map((ingredientName, index) => (
            <RequirementLabel
              key={index}
              type="item"
              item={ingredientName}
              balance={gameState.inventory[ingredientName] ?? new Decimal(0)}
              requirement={
                (requirements ?? {})[ingredientName] ?? new Decimal(0)
              }
            />
          ))}

        <RequirementLabel type="time" waitSeconds={seconds} />
      </div>
    );
  };
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col h-full px-1 py-0">
        {getItemDetail({ hideDescription })}
        {limit && (
          <p className="my-1 text-xs text-left sm:text-center">{`${t(
            "max",
          )} ${limit} ${t("statements.perplayer")}`}</p>
        )}
        {getRequirements()}
      </div>
      {actionView}
    </div>
  );
};
