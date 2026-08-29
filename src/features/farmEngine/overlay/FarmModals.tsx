import React, { Fragment, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "@xstate/react";
import { Transition } from "@headlessui/react";
import confetti from "canvas-confetti";

import snorklerBumpkin from "assets/npcs/snorkel_bumpkin.png";
import sharkBumpkin from "assets/npcs/shark.png";
import { SUNNYSIDE } from "assets/sunnyside";

import { Modal } from "components/ui/Modal";
import { LetterBoxModals } from "features/farming/mail/LetterBox";
import { SaltSculptureModal } from "features/island/collectibles/components/SaltSculpture";
import { RevealModals } from "./RevealModals";
import { WeatherPlotModal } from "./WeatherPlotModal";
import { RenewPetShrine } from "features/game/components/RenewPetShrine";
import { RemoveKuebikoModal } from "features/island/collectibles/RemoveKuebikoModal";
import { FishermanPuzzle } from "features/island/fisherman/FishingPuzzle";
import { BedContent } from "features/island/collectibles/components/Bed";
import type { BedName } from "features/game/types/game";
import { RemoveHungryCaterpillarModal } from "features/island/collectibles/RemoveHungryCaterpillarModal";
import { ObsidianShrineModal } from "features/island/collectibles/components/ObsidianShrine";
import type { PetShrineName } from "features/game/types/pets";
import { Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Loading } from "features/auth/components";
import {
  Expanding,
  ExpansionRequirements,
} from "components/ui/layouts/ExpansionRequirements";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import { PeteHelp } from "features/game/expansion/components/PeteHelp";
import { Guide } from "features/helios/components/hayseedHank/components/Guide";
import type { GuidePath } from "features/helios/components/hayseedHank/lib/guide";
import {
  IslandUpgraderModal,
  UPGRADE_DESCRIPTIONS,
  UPGRADE_MESSAGES,
  UPGRADE_PREVIEW,
} from "features/game/expansion/components/IslandUpgrader";
import { expansionRequirements } from "features/game/events/landExpansion/expandLand";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE, type StockableName } from "features/game/lib/constants";
import type {
  Bumpkin,
  ExpansionRequirements as IExpansionRequirements,
  AscensionIslandType,
} from "features/game/types/game";
import { ASCENSION_ISLANDS, getIslandName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { NPC_WEARABLES } from "lib/npcs";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";
import { useNow } from "lib/utils/hooks/useNow";
import type { FarmModalRequest, GameBridge } from "../bridge/GameBridge";
import { getRestockLists, getShipmentAmount } from "../lib/restock";
import { SeasonalSeed } from "features/island/plots/components/SeasonalSeed";
import type { SeedName } from "features/game/types/seeds";
import { LavaPitModalContent } from "features/game/expansion/components/lavaPit/LavaPitModalContent";
import { FlowerBedModal } from "features/island/flowers/FlowerBedModal";
import { UpgradeSaltFarmModalPanel } from "features/game/expansion/components/salt/UpgradeSaltFarmModalPanel";
import { FishermanModal } from "features/island/fisherman/FishermanModal";
import { WaterTrapModal } from "features/island/fisherman/WaterTrapModal";
import { CrustaceanCaught } from "features/island/fisherman/CrustaceanCaught";
import {
  BeehiveLevel,
  FishermanCaught,
  FlowerCongratulations,
  FlowerInstaGrow,
} from "./farmModalContents";
import { BuildingModals } from "./BuildingModals";
import { CharacterModals } from "./CharacterModals";

/**
 * The React half of every in-world interaction: Phaser renders the sprite and
 * detects the click; the modal that opens lives here, one per FarmModalName.
 * Content mirrors the DOM components it replaces (named in each section) —
 * those components are deleted with the React farm at the flag flip.
 */

const _state = (state: MachineState) => state.context.state;

/** [Bed.tsx] the unlock-farmhand modal against the UNCHANGED machine. */
const BedFarmhandHost: React.FC<{ name: BedName; onClose: () => void }> = ({
  name,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const unlockingFarmhand = useSelector(gameService, (s: MachineState) =>
    s.matches("unlockingFarmhand"),
  );
  const unlockingFarmhandSuccess = useSelector(gameService, (s: MachineState) =>
    s.matches("unlockingFarmhandSuccess"),
  );
  const latestFarmhand = useSelector(gameService, (s: MachineState) => {
    const farmHands = Object.values(s.context.state.farmHands.bumpkins);
    return farmHands[farmHands.length - 1]?.equipped;
  });
  const isFarmhandUnlocking = unlockingFarmhand || unlockingFarmhandSuccess;

  return (
    <Modal
      show
      onHide={isFarmhandUnlocking ? undefined : onClose}
      backdrop={isFarmhandUnlocking ? "static" : true}
    >
      <CloseButtonPanel
        onClose={isFarmhandUnlocking ? undefined : onClose}
        title={isFarmhandUnlocking ? undefined : t("unlock.farmhand")}
      >
        <BedContent
          name={name}
          handleContinue={() => {
            gameService.send("CONTINUE");
            onClose();
          }}
          unlockingFarmhand={unlockingFarmhand}
          unlockingFarmhandSuccess={unlockingFarmhandSuccess}
          unlockFarmhand={() =>
            gameService.send("farmHand.unlocked", {
              effect: { type: "farmHand.unlocked" },
            })
          }
          latestFarmhand={latestFarmhand}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

/** [FishermanNPC.tsx] the map-piece puzzle gate before reeling in. */
const FishingChallengeHost: React.FC<{
  bridge: GameBridge;
  onDone: () => void;
  onClose: () => void;
}> = ({ bridge, onDone, onClose }) => {
  const { gameService } = useContext(Context);
  const maps = useSelector(
    gameService,
    (state: MachineState) => state.context.state.fishing.wharf.maps ?? {},
  );
  return (
    <Modal show>
      <Panel>
        <FishermanPuzzle
          onCatch={() => {
            onClose();
            onDone();
          }}
          onMiss={() => {
            // Keep easy fish, mark difficult fish as missed.
            bridge.dispatch("map.missed" as never);
            bridge.dispatch("SAVE" as never);
            onClose();
            onDone();
          }}
          onRetry={() => bridge.dispatch("fish.retried" as never)}
          maps={maps}
        />
      </Panel>
    </Modal>
  );
};

/** [MovableComponent] removal side-effect warnings; confirm sends REMOVE. */
const RemoveWarningHost: React.FC<{
  bridge: GameBridge;
  data: { name: "Kuebiko" | "Hungry Caterpillar"; id: string; action: string };
  onClose: () => void;
}> = ({ bridge, data, onClose }) => {
  const onRemove = () => {
    bridge.landscaping.send({
      type: "REMOVE",
      event: data.action as never,
      id: data.id,
      name: data.name,
      location: "farm",
    });
    onClose();
  };
  if (data.name === "Kuebiko") {
    return <RemoveKuebikoModal onClose={onClose} onRemove={onRemove} />;
  }
  return <RemoveHungryCaterpillarModal onClose={onClose} onRemove={onRemove} />;
};

export const FarmModals: React.FC<{
  bridge: GameBridge;
  /** Fires when any farm modal opens/closes, so the engine can gate input. */
  onOpenChange?: (open: boolean) => void;
}> = ({ bridge, onOpenChange }) => {
  const { t } = useAppTranslation();
  const { gameService, showAnimations, selectedItem } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [open, setOpen] = useState<FarmModalRequest | undefined>();

  useEffect(
    () => bridge.farmModal.subscribe((request) => setOpen(request)),
    [bridge],
  );

  const close = () => setOpen(undefined);

  // [TravelTeaser.tsx] tabs
  const [peteTab, setPeteTab] = useState<"explore" | "guide">("explore");
  const [guide, setGuide] = useState<GuidePath>();

  // [IslandUpgrader.tsx] upgrade flow
  const [showTravelAnimation, setShowTravelAnimation] = useState(false);
  const [showUpgraded, setShowUpgraded] = useState(false);

  const anyOpen = open !== undefined || showTravelAnimation || showUpgraded;
  useEffect(() => {
    onOpenChange?.(anyOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyOpen]);

  const now = useNow();
  const { requirements, baseTimeSeconds, timeBoostsUsed } =
    expansionRequirements({ game: state, now });

  const onUpgrade = async () => {
    setShowTravelAnimation(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    close();
    gameService.send("PAUSE");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    gameService.send("farm.upgraded");
    gameService.send("SAVE");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowUpgraded(true);
    gameService.send("PLAY");

    setShowTravelAnimation(false);
    if (showAnimations) confetti();
  };

  const islandType = state.island.type;
  const isAscensionIsland = ASCENSION_ISLANDS.includes(
    islandType as AscensionIslandType,
  );
  const welcomeMessage = isAscensionIsland
    ? t("islandupgrade.welcomeAscensionIsland", {
        island: getIslandName(islandType),
        level: state.island.ascensionLevel ?? 0,
      })
    : UPGRADE_MESSAGES[islandType];
  const upgradePreview = UPGRADE_PREVIEW[islandType];

  const laTomatina = state.specialEvents.current["La Tomatina"];
  const { tools: restockTools, seeds: restockSeeds } = getRestockLists(state);

  const closeIcon = (onClick: () => void) => (
    <img
      src={SUNNYSIDE.icons.close}
      className="absolute cursor-pointer z-20"
      onClick={onClick}
      style={{
        top: `${PIXEL_SCALE * 6}px`,
        right: `${PIXEL_SCALE * 6}px`,
        width: `${PIXEL_SCALE * 11}px`,
      }}
    />
  );

  return (
    <>
      {/* [Snorkler.tsx] */}
      <Modal show={open?.name === "snorkler"} onHide={close}>
        <img
          className="absolute w-48 left-4 -top-32 -z-10"
          src={snorklerBumpkin}
        />
        <Panel>
          <div className="p-2">
            {closeIcon(close)}
            <p>{t("snorkler.vastOcean")}</p>
            <p className="mt-2">{t("snorkler.goldBeneath")}</p>
          </div>
        </Panel>
      </Modal>

      {/* [SharkBumpkin.tsx] */}
      <Modal show={open?.name === "sharkBumpkin"} onHide={close}>
        <img
          className="absolute w-64 left-4 -top-44 -z-10"
          src={sharkBumpkin}
        />
        <Panel>
          {closeIcon(close)}
          <div className="py-2 px-1">
            <p>{t("sharkBumpkin.dialogue.shhhh")}</p>
            <p className="mt-2">{t("sharkBumpkin.dialogue.scareGoblins")}</p>
          </div>
        </Panel>
      </Modal>

      {/* [TravelTeaser.tsx] */}
      <Modal show={open?.name === "travelTeaser"} onHide={close}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          onClose={close}
          tabs={[
            {
              id: "explore",
              icon: SUNNYSIDE.icons.expression_chat,
              name: t("explore"),
            },
            {
              id: "guide",
              icon: SUNNYSIDE.icons.expression_confused,
              name: t("guide"),
            },
          ]}
          currentTab={peteTab}
          setCurrentTab={setPeteTab}
        >
          <div
            style={{ maxHeight: "300px" }}
            className="scrollable overflow-y-auto"
          >
            {peteTab === "explore" && <PeteHelp />}
            {peteTab === "guide" && (
              <Guide selected={guide} onSelect={setGuide} />
            )}
          </div>
        </CloseButtonPanel>
      </Modal>

      {/* [RestockBoat.tsx] */}
      <Modal show={open?.name === "restockBoat"} onHide={close}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          onClose={close}
        >
          <div className="p-1">
            <Label type="default" className="mb-2">
              {t("gems.shipment.arrived")}
            </Label>
            <p className="text-sm mb-2">{t("gems.shipment.success")}</p>
            <p className="text-sm mb-2">{t("gems.shipment.shops")}</p>
          </div>
          <div className="mt-1 h-auto overflow-y-auto overflow-x-hidden scrollable pl-1">
            {restockTools.length > 0 && (
              <Label
                icon={ITEM_DETAILS.Axe.image}
                type="default"
                className="ml-2 mb-1"
              >
                {t("tools")}
              </Label>
            )}
            <div className="flex flex-wrap mb-2">
              {restockTools.map(([item, amount]) => (
                <Box
                  key={item}
                  count={getShipmentAmount(
                    state,
                    item as StockableName,
                    amount as number,
                  )}
                  image={ITEM_DETAILS[item as StockableName].image}
                />
              ))}
            </div>
            {restockSeeds.length > 0 && (
              <Label
                icon={CROP_LIFECYCLE["Basic Biome"].Sunflower.seed}
                type="default"
                className="ml-2 mb-1"
              >
                {t("seeds")}
              </Label>
            )}
            <div className="flex flex-wrap mb-2">
              {restockSeeds.map(([item, amount]) => (
                <Box
                  key={item}
                  count={getShipmentAmount(
                    state,
                    item as StockableName,
                    amount as number,
                  )}
                  image={ITEM_DETAILS[item as StockableName].image}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={() => {
              gameService.send("shipment.restocked");
              if (showAnimations) confetti();
              close();
            }}
          >
            {t("gems.replenish")}
          </Button>
        </CloseButtonPanel>
      </Modal>

      {/* [LaTomatina.tsx] */}
      <Modal show={open?.name === "laTomatina" && !!laTomatina} onHide={close}>
        <CloseButtonPanel onClose={close}>
          {laTomatina && (
            <SpecialEventModalContent
              event={laTomatina}
              eventName="La Tomatina"
              onClose={close}
            />
          )}
        </CloseButtonPanel>
      </Modal>

      {/* [IslandUpgrader.tsx] */}
      <Modal
        show={open?.name === "islandUpgrader"}
        onHide={showTravelAnimation ? undefined : close}
      >
        <IslandUpgraderModal onUpgrade={onUpgrade} onClose={close} />
      </Modal>
      {createPortal(
        <Transition
          show={showTravelAnimation}
          enter="transform transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform transition-opacity duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div
            style={{ zIndex: 9999999 }}
            className="bg-black text-white fixed inset-0 pointer-events-none flex justify-center items-center"
          >
            <Loading text={t("islandupgrade.exploring")} />
          </div>
        </Transition>,
        document.body,
      )}
      <Modal show={showUpgraded}>
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk}>
          <div className="p-2">
            <p className="text-sm mb-2">{welcomeMessage}</p>
            <p className="text-xs mb-2">{UPGRADE_DESCRIPTIONS[islandType]}</p>
            {upgradePreview && (
              <img src={upgradePreview} className="w-full rounded-md mb-2" />
            )}
            <p className="text-xs mb-2">{t("islandupgrade.itemsReturned")}</p>
          </div>
          <Button onClick={() => setShowUpgraded(false)}>
            {t("continue")}
          </Button>
        </CloseButtonPanel>
      </Modal>

      {/* [Pontoon.tsx] speed-up */}
      <Modal
        show={open?.name === "pontoon" && !!state.expansionConstruction}
        onHide={close}
      >
        <Panel>
          {state.expansionConstruction && (
            <Expanding
              onClose={close}
              state={state}
              readyAt={state.expansionConstruction.readyAt}
              onInstantExpanded={(cost, paymentMethod = "gems") => {
                gameService.send("expansion.spedUp", { paymentMethod });
                gameAnalytics.trackSink({
                  currency: paymentMethod === "coins" ? "Coins" : "Gem",
                  amount: cost,
                  item: "Instant Expand",
                  type: "Fee",
                });
                close();
              }}
            />
          )}
        </Panel>
      </Modal>

      {/* [Plot.tsx] out-of-season seed warning */}
      <Modal show={open?.name === "seasonalSeed"} onHide={close}>
        <SeasonalSeed
          seed={selectedItem as SeedName}
          season={state.season.season}
          onClose={close}
        />
      </Modal>

      {/* [NonFertilePlot.tsx] water well warning */}
      <Modal show={open?.name === "nonFertilePlot"} onHide={close}>
        <CloseButtonPanel title={t("statements.crop.water")} onClose={close}>
          <div className="p-2">
            {t(
              (state.buildings["Water Well"] ?? []).length > 0
                ? "statements.upgrade.water.well"
                : state.inventory["Water Well"]?.gte(1)
                  ? "statements.water.well.needed.three"
                  : "statements.water.well.needed.one",
            )}
            <img
              src={SUNNYSIDE.building.well}
              alt="well"
              width={PIXEL_SCALE * 25}
              className="mx-auto mt-4 mb-2"
            />
          </div>
        </CloseButtonPanel>
      </Modal>

      {/* [LavaPit.tsx] start/collect flow */}
      <Modal show={open?.name === "lavaPit"} onHide={close}>
        {open?.name === "lavaPit" && typeof open.data === "string" && (
          <LavaPitModalContent id={open.data} onClose={close} />
        )}
      </Modal>

      {/* [Boulder.tsx] teaser */}
      <Modal show={open?.name === "boulder"} onHide={close}>
        <Panel>
          <div className="p-2 flex flex-col items-center">
            {closeIcon(close)}
            <p className="text-center mb-2">
              {t("resources.boulder.rareMineFound")}
            </p>
            <img src={SUNNYSIDE.tools.iron_pickaxe} className="w-1/4 mb-2" />
            <p className="text-center text-xs mb-1">
              {t("resources.boulder.advancedMining")}
            </p>
            <p className="text-center text-xs">{t("coming.soon")}</p>
          </div>
        </Panel>
      </Modal>

      {/* [FlowerBed.tsx] plant / cross-breed */}
      <Modal show={open?.name === "flowerBed"} onHide={close}>
        {open?.name === "flowerBed" && typeof open.data === "string" && (
          <FlowerBedModal id={open.data} onClose={close} />
        )}
      </Modal>

      {/* [FlowerBed.tsx] insta-grow */}
      <Modal show={open?.name === "flowerInstaGrow"} onHide={close}>
        {open?.name === "flowerInstaGrow" && typeof open.data === "string" && (
          <FlowerInstaGrow id={open.data} onClose={close} />
        )}
      </Modal>

      {/* [FlowerBed.tsx] first-harvest congratulations */}
      {/* [TornadoPlot/TsunamiPlot/GreatFreezePlot] destroyed-crops info */}
      {open?.name === "weatherPlot" && (
        <WeatherPlotModal
          event={
            (open.data as { event: "tornado" | "tsunami" | "greatFreeze" })
              .event
          }
          onClose={close}
        />
      )}

      {/* [GenieLamp/ManekiNeko/FestiveTree] reveal flows */}
      <RevealModals bridge={bridge} open={open} onClose={close} />

      {/* [Bed.tsx] unlock-farmhand flow */}
      {open?.name === "bedFarmhand" && (
        <BedFarmhandHost
          name={(open.data as { name: BedName }).name}
          onClose={close}
        />
      )}

      {/* [FishermanNPC.tsx] treasure-map fishing puzzle before the reel */}
      {open?.name === "fishingChallenge" && (
        <FishingChallengeHost
          bridge={bridge}
          onDone={(open.data as { onDone: () => void }).onDone}
          onClose={close}
        />
      )}

      {/* [MovableComponent] Kuebiko / Hungry Caterpillar removal warnings */}
      {open?.name === "removeWarning" && (
        <RemoveWarningHost
          bridge={bridge}
          data={
            open.data as {
              name: "Kuebiko" | "Hungry Caterpillar";
              id: string;
              action: string;
            }
          }
          onClose={close}
        />
      )}

      {/* [PetShrine.tsx / ObsidianShrine.tsx] expired-shrine renewal */}
      {open?.name === "renewPetShrine" && (
        <RenewPetShrine
          show
          onHide={close}
          name={(open.data as { name: PetShrineName | "Obsidian Shrine" }).name}
          id={(open.data as { id: string }).id}
          location="farm"
        />
      )}

      {/* [ObsidianShrine.tsx] active bulk plant/harvest/fertilise */}
      {open?.name === "obsidianShrine" && (
        <ObsidianShrineModal
          show
          onClose={close}
          createdAt={(open.data as { createdAt: number }).createdAt}
        />
      )}

      {/* [SaltSculpture.tsx] level buffs + upgrade */}
      <SaltSculptureModal
        show={open?.name === "saltSculpture"}
        onClose={close}
      />

      {/* [LetterBox.tsx] mailbox: news / daily gift / community */}
      <LetterBoxModals isOpen={open?.name === "letterBox"} onClose={close} />

      <Modal show={open?.name === "flowerCongratulations"} onHide={close}>
        {open?.name === "flowerCongratulations" &&
          typeof open.data === "string" && (
            <FlowerCongratulations id={open.data} onClose={close} />
          )}
      </Modal>

      {/* [Beehive.tsx] honey level */}
      <Modal show={open?.name === "beehiveLevel"} onHide={close}>
        {open?.name === "beehiveLevel" && typeof open.data === "string" && (
          <BeehiveLevel id={open.data} onClose={close} />
        )}
      </Modal>

      {/* [Beehive.tsx] swarm bonus */}
      <Modal show={open?.name === "beehiveSwarm"} onHide={close}>
        <Panel bumpkinParts={NPC_WEARABLES.stevie}>
          <div className="p-2 flex flex-col items-center">
            <Label type="vibrant" className="mb-2">
              {t("beehive.beeSwarm")}
            </Label>
            <p className="text-sm text-center mb-2">
              {t("beehive.pollinationCelebration")}
            </p>
            <Button onClick={close}>{t("continue")}</Button>
          </div>
        </Panel>
      </Modal>

      {/* [UpgradeSaltFarm] */}
      <Modal show={open?.name === "upgradeSaltFarm"} onHide={close}>
        {open?.name === "upgradeSaltFarm" && (
          <UpgradeSaltFarmModalPanel onClose={close} />
        )}
      </Modal>

      {/* [Fisherman.tsx / FishermanNPC.tsx] */}
      <Modal show={open?.name === "fisherman"} onHide={close}>
        {open?.name === "fisherman" &&
          ((open.data as { locked?: boolean } | undefined)?.locked ? (
            <CloseButtonPanel onClose={close}>
              <div className="p-2 flex flex-col items-center">
                <Label
                  type="danger"
                  icon={SUNNYSIDE.icons.lock}
                  className="mb-2"
                >
                  {t("warning.level.required", { lvl: 5 })}
                </Label>
                <img src={SUNNYSIDE.icons.fish_icon} className="w-10 mb-2" />
              </div>
            </CloseButtonPanel>
          ) : (open.data as { caught?: boolean } | undefined)?.caught ? (
            <FishermanCaught onClose={close} />
          ) : (
            <FishermanModal
              onClose={close}
              onCast={(bait, chum, multiplier, guaranteedCatch) => {
                gameService.send("rod.casted", {
                  bait,
                  chum,
                  multiplier,
                  guaranteedCatch,
                });
                gameService.send("SAVE");
                close();
              }}
            />
          ))}
      </Modal>

      {/* [WaterTrapSpot.tsx] place a trap */}
      <Modal show={open?.name === "waterTrap"} onHide={close}>
        {open?.name === "waterTrap" && typeof open.data === "string" && (
          <WaterTrapModal
            waterTrap={
              state.crabTraps.trapSpots?.[open.data]?.waterTrap ?? undefined
            }
            onPlace={(trapType, chum) => {
              gameService.send({
                type: "waterTrap.placed",
                trapId: open.data as string,
                waterTrap: trapType,
                chum,
              });
              gameService.send("SAVE");
              close();
            }}
            onClose={close}
          />
        )}
      </Modal>

      {/* [WaterTrapSpot.tsx] catch collected */}
      <Modal show={open?.name === "crustaceanCaught"} onHide={close}>
        {open?.name === "crustaceanCaught" && (
          <CrustaceanCaught
            collectedCatch={
              open.data as { item: never; amount: number } | undefined
            }
            onClose={close}
          />
        )}
      </Modal>

      {/* [UpcomingExpansion.tsx] requirements */}
      <Modal show={open?.name === "expansionRequirements"} onHide={close}>
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grimbly} onClose={close}>
          {requirements && (
            <ExpansionRequirements
              state={state}
              inventory={state.inventory}
              coins={state.coins}
              bumpkin={state.bumpkin as Bumpkin}
              details={{ description: translate("landscape.expansion.one") }}
              onClose={close}
              requirements={requirements as IExpansionRequirements}
              baseTimeSeconds={baseTimeSeconds}
              timeBoostsUsed={timeBoostsUsed}
            />
          )}
        </CloseButtonPanel>
      </Modal>

      {/* Buildings [BuildingRenderer clicks] */}
      <BuildingModals open={open} onClose={close} />

      {/* Characters [PlayerRenderer/PetRenderer/AirdropRenderer clicks] */}
      <CharacterModals open={open} onClose={close} />
    </>
  );
};
