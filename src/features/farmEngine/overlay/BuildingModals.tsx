import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useInterpret } from "@xstate/react";

import tornadoIcon from "assets/icons/tornado.webp";
import tsunamiIcon from "assets/icons/tsunami.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { secondsToString } from "lib/utils/time";
import { CROP_SHORTAGE_HOURS } from "features/game/expansion/lib/boosts";
import { RenewCollectible } from "features/game/components/RenewCollectible";
import type { InventoryRenewableCollectibleName } from "features/game/lib/renewableCollectibles";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { CookableName } from "features/game/types/consumables";
import type {
  BuildingProduct,
  CompostBuilding,
  CropMachineBuilding,
  GameState,
} from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { getKeys } from "lib/object";
import type { BuildingName } from "features/game/types/buildings";
import type { CollectibleName } from "features/game/types/craftables";
import type { ComposterName } from "features/game/types/composters";
import type { ProcessedResource } from "features/game/types/processedFood";
import type { AddSeedsInput } from "features/game/events/landExpansion/supplyCropMachine";
import { getBuildingBumpkinLevelRequired } from "features/game/expansion/lib/buildingRequirements";
import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
} from "features/game/events/landExpansion/upgradeBuilding";
import { Constructing } from "features/island/buildings/components/building/Building";
import { Building as CollectibleConstructingPanel } from "features/island/collectibles/Collectible";
import { FirePitModal } from "features/island/buildings/components/building/firePit/FirePitModal";
import { KitchenModal } from "features/island/buildings/components/building/kitchen/KitchenModal";
import { BakeryModal } from "features/island/buildings/components/building/bakery/BakeryModal";
import { DeliModal } from "features/island/buildings/components/building/deli/DeliModal";
import { SmoothieShackModal } from "features/island/buildings/components/building/smoothieShack/SmoothieShackModal";
import { ShopItems } from "features/island/buildings/components/building/market/ShopItems";
import { WorkbenchModal } from "features/island/buildings/components/building/workBench/components/WorkbenchModal";
import { ComposterModal } from "features/island/buildings/components/building/composters/ComposterModal";
import { CraftingBoxModalContent } from "features/island/buildings/components/building/craftingBox/components/CraftingBoxModalContent";
import { FishMarketModal } from "features/island/buildings/components/building/fishMarket/FishMarketModal";
import { AgingShedModal } from "features/island/buildings/components/building/agingShed/AgingShedModal";
import { CropMachineModal } from "features/island/buildings/components/building/cropMachine/CropMachineModal";
import {
  cropStateMachine,
  findGrowingCropPackIndex,
  hasReadyCrops,
  useCropMachineLiveNow,
  type Context as CropMachineContext,
  type MachineInterpreter as CropMachineInterpreter,
} from "features/island/buildings/components/building/cropMachine/lib/cropMachine";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { WeatherAffectedModal } from "features/island/plots/components/AffectedModal";
import { useCookingState } from "features/island/buildings/lib/useCookingState";
import { useProcessingState } from "features/island/buildings/lib/useProcessingState";
import { useNow } from "lib/utils/hooks/useNow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { gameAnalytics } from "lib/gameAnalytics";
import type { CookingBuilding } from "../entities/buildings/buildingArt";
import type { FarmModalRequest } from "../bridge/GameBridge";

/**
 * The React halves of building clicks [BuildingModals hosted by FarmModals]:
 * Phaser's BuildingRenderer detects the click, these host the SAME modal
 * components the DOM buildings mount locally.
 *
 * Deferred parity gaps: Market's crop-shortage / special-event sale labels
 * over the shop modal; the water well's auto-opening constructing modal on
 * the upgrade edge (opens on click here).
 */

const _state = (state: MachineState) => state.context.state;

// [Market.tsx:37-47]
const hasSoldCropsBefore = (farmActivity: GameState["farmActivity"]) =>
  !!getKeys(CROPS).find((crop) =>
    getKeys(farmActivity).includes(`${crop} Sold`),
  );
const hasBoughtCropsBefore = (farmActivity: GameState["farmActivity"]) =>
  !!getKeys(CROPS).find((crop) =>
    getKeys(farmActivity).includes(`${crop} Seed Bought`),
  );

/** The shared props of the five cooking modals [FirePitModal.tsx:42-51]. */
type CookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  cooking?: BuildingProduct;
  itemInProgress?: CookableName;
  buildingId: string;
  queue: BuildingProduct[];
  readyRecipes: BuildingProduct[];
};

const COOKING_MODALS: Record<CookingBuilding, React.FC<CookingModalProps>> = {
  "Fire Pit": FirePitModal,
  Kitchen: KitchenModal,
  Bakery: BakeryModal,
  Deli: DeliModal,
  "Smoothie Shack": SmoothieShackModal,
};

/**
 * [Market.tsx] crop-shortage 2x-sale countdown + special-event boost labels
 * pinned to the shop modal's top-right.
 */
const MarketSaleLabels: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const createdAt = useSelector(
    gameService,
    (s: MachineState) => s.context.state.createdAt,
  );
  const specialEvents = useSelector(gameService, (s: MachineState) =>
    Object.entries(s.context.state.specialEvents.current)
      .filter(([, event]) => !!event?.isEligible)
      .filter(([, event]) => (event?.endAt ?? Infinity) > Date.now())
      .filter(([, event]) => (event?.startAt ?? 0) < Date.now()),
  );
  const { totalSeconds: cropShortageSecondsLeft } = useCountdown(
    createdAt + CROP_SHORTAGE_HOURS * 60 * 60 * 1000,
  );
  const isCropShortage = cropShortageSecondsLeft > 0;
  const specialEventDetails = specialEvents[0];
  const boostItem = getKeys(specialEventDetails?.[1]?.bonus ?? {})[0];
  const boostAmount =
    specialEventDetails?.[1]?.bonus?.[boostItem]?.saleMultiplier;

  return (
    <>
      {isCropShortage && (
        <Label
          icon={SUNNYSIDE.icons.stopwatch}
          type="vibrant"
          className="absolute right-0 -top-7 shadow-md"
          style={{ wordSpacing: 0 }}
        >
          {`${t("2x.sale")}: ${secondsToString(cropShortageSecondsLeft, {
            length: "medium",
          })} left`}
        </Label>
      )}
      {boostItem && (
        <div className="flex justify-between">
          <Label
            icon={boostItem ? ITEM_DETAILS[boostItem].image : undefined}
            secondaryIcon={lightning}
            type="vibrant"
            className="absolute right-0 -top-7 shadow-md"
          >
            {`${boostAmount}x ${boostItem} ${t("sale")}`}
          </Label>
        </div>
      )}
    </>
  );
};

export const BuildingModals: React.FC<{
  open: FarmModalRequest | undefined;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();

  const data = (open?.data ?? {}) as Record<string, unknown>;

  return (
    <>
      {open?.name === "cooking" && (
        <CookingModalHost
          building={data.building as CookingBuilding}
          buildingId={data.buildingId as string}
          onClose={onClose}
        />
      )}

      {/* [Market.tsx] */}
      <Modal show={open?.name === "market"} onHide={onClose}>
        <ShopItems
          onClose={onClose}
          hasSoldBefore={hasSoldCropsBefore(state.farmActivity)}
          showBuyHelper={
            !hasBoughtCropsBefore(state.farmActivity) &&
            hasSoldCropsBefore(state.farmActivity)
          }
        />
        <MarketSaleLabels />
      </Modal>

      {/* [WorkBench.tsx] mounted only while open so the default tab resets */}
      {open?.name === "workbench" && <WorkbenchModal show onClose={onClose} />}

      {open?.name === "waterWell" && <WaterWellModalHost onClose={onClose} />}

      {open?.name === "composter" && (
        <ComposterModalHost
          name={data.name as ComposterName}
          onClose={onClose}
        />
      )}

      {/* [CraftingBox.tsx] */}
      <Modal show={open?.name === "craftingBox"} onHide={onClose}>
        {open?.name === "craftingBox" && (
          <CraftingBoxModalContent onClose={onClose} />
        )}
      </Modal>

      {open?.name === "fishMarket" && (
        <FishMarketModalHost
          buildingId={data.buildingId as string}
          onClose={onClose}
        />
      )}

      {/* [AgingShed.tsx] */}
      <AgingShedModal isOpen={open?.name === "agingShed"} onClose={onClose} />

      {open?.name === "cropMachine" && (
        <CropMachineModalHost
          buildingId={data.buildingId as string}
          onClose={onClose}
        />
      )}

      {open?.name === "buildingConstructing" && (
        <ConstructingModalHost
          name={data.name as BuildingName}
          id={data.id as string}
          onClose={onClose}
        />
      )}

      {open?.name === "collectibleConstructing" && (
        <CollectibleConstructingHost
          name={data.name as CollectibleName}
          id={data.id as string}
          onClose={onClose}
        />
      )}

      {/* [TimeWarpTotem.tsx / Hourglass.tsx] expired boost with a replacement */}
      {open?.name === "renewCollectible" && (
        <RenewCollectible
          show
          onHide={onClose}
          name={data.name as InventoryRenewableCollectibleName}
          id={data.id as string}
          location="farm"
        />
      )}

      {open?.name === "buildingDestroyed" && (
        <WeatherAffectedModal
          showModal
          setShowModal={(show) => !show && onClose()}
          icon={data.event === "tornado" ? tornadoIcon : tsunamiIcon}
          title={t(data.event as "tornado" | "tsunami")}
          description={t(
            `${data.event as "tornado" | "tsunami"}.building.destroyed.description`,
          )}
          startedAt={
            state.calendar[data.event as "tornado" | "tsunami"]?.startedAt ?? 0
          }
        />
      )}

      {/* [BuildingImageWrapper] level-lock panel */}
      <Modal show={open?.name === "buildingLevelLocked"} onHide={onClose}>
        {open?.name === "buildingLevelLocked" && (
          <CloseButtonPanel onClose={onClose}>
            <div className="p-2 flex flex-col items-center">
              <img src={SUNNYSIDE.icons.lock} className="w-20 my-2" />
              <p className="text-sm">
                {`${data.name} requires Bumpkin level ${
                  getBuildingBumpkinLevelRequired(data.name as BuildingName)
                    .level
                } to use.`}
              </p>
            </div>
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};

/** [FirePit.tsx & siblings] shared cook flow around the five exported modals. */
const CookingModalHost: React.FC<{
  building: CookingBuilding;
  buildingId: string;
  onClose: () => void;
}> = ({ building, buildingId, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const entry = state.buildings[building]?.find((b) => b.id === buildingId);
  const { cooking, queuedRecipes, readyRecipes } = useCookingState(entry ?? {});

  const CookingModal = COOKING_MODALS[building];

  const handleCook = (item: CookableName) => {
    gameService.send({ type: "recipe.cooked", item, buildingId });
  };

  return (
    <CookingModal
      isOpen
      onClose={onClose}
      onCook={handleCook}
      cooking={cooking}
      itemInProgress={cooking?.name as CookableName | undefined}
      buildingId={buildingId}
      queue={queuedRecipes}
      readyRecipes={readyRecipes}
    />
  );
};

/** [WaterWell.tsx] upgrade modal, or the constructing panel mid-upgrade. */
const WaterWellModalHost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { level, upgradeReadyAt, upgradedAt } = state.waterWell;
  const now = useNow({ live: true, autoEndAt: upgradeReadyAt ?? 0 });

  const isUpgrading = (upgradeReadyAt ?? 0) > now;
  const currentLevel = isUpgrading ? level - 1 : level;

  const handleSpeedUp = (gems: number) => {
    gameService.send("upgrade.spedUp", { name: "Water Well" });
    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gems,
      item: "Instant Build",
      type: "Fee",
    });
    onClose();
  };

  if (isUpgrading) {
    return (
      <Modal show onHide={onClose}>
        <CloseButtonPanel onClose={onClose}>
          <Constructing
            name="Water Well"
            readyAt={upgradeReadyAt ?? 0}
            createdAt={upgradedAt ?? 0}
            state={state}
            onClose={onClose}
            onInstantBuilt={handleSpeedUp}
          />
        </CloseButtonPanel>
      </Modal>
    );
  }

  return (
    <UpgradeBuildingModal
      buildingName="Water Well"
      currentLevel={currentLevel}
      nextLevel={Math.min(currentLevel + 1, 4)}
      show
      onClose={onClose}
    />
  );
};

/** [Composter.tsx] start/collect handlers around the exported modal. */
const ComposterModalHost: React.FC<{
  name: ComposterName;
  onClose: () => void;
}> = ({ name, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const composter = state.buildings[name]?.[0] as CompostBuilding | undefined;
  const [, setRender] = useState(0);

  if (!composter) return null;

  const startComposter = () => {
    // The DOM delays 200ms to simulate the lid closing.
    setTimeout(() => {
      gameService.send("composter.started", {
        buildingId: composter.id,
        building: name,
      });
    }, 200);
  };

  const handleCollect = () => {
    const next = gameService.send("compost.collected", {
      buildingId: composter.id,
      building: name,
    });
    if (
      name === "Compost Bin" &&
      next.context.state.farmActivity["Compost Bin Collected"] === 1
    ) {
      gameAnalytics.trackMilestone({ event: "Tutorial:Composting:Completed" });
    }
  };

  return (
    <ComposterModal
      composterName={name}
      showModal
      setShowModal={(show) => !show && onClose()}
      startComposter={startComposter}
      readyAt={composter.producing?.readyAt}
      onCollect={handleCollect}
      onBoost={() => setRender((r) => r + 1)}
    />
  );
};

/** [FishMarket.tsx] process/collect/speed-up handlers around the modal. */
const FishMarketModalHost: React.FC<{
  buildingId: string;
  onClose: () => void;
}> = ({ buildingId, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const entry = state.buildings["Fish Market"]?.find(
    (b) => b.id === buildingId,
  );
  const { processing, queued, ready } = useProcessingState(entry ?? {});

  return (
    <FishMarketModal
      isOpen
      buildingId={buildingId}
      onClose={onClose}
      onProcess={(item: ProcessedResource) =>
        gameService.send({
          type: "processedResource.processed",
          item,
          buildingId,
          buildingName: "Fish Market",
        })
      }
      onCollect={() =>
        gameService.send({
          type: "processedResource.collected",
          buildingId,
          buildingName: "Fish Market",
        })
      }
      onInstantProcess={(_cost, paymentMethod = "gems") =>
        gameService.send({
          type: "processing.spedUp",
          buildingId,
          buildingName: "Fish Market",
          paymentMethod,
        })
      }
      processing={processing}
      queue={queued ?? []}
      ready={ready}
    />
  );
};

/** [CropMachine.tsx] the local crop machine interpreter, modal-scoped. */
const CropMachineModalHost: React.FC<{
  buildingId: string;
  onClose: () => void;
}> = ({ buildingId, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const cropMachine = state.buildings["Crop Machine"]?.find(
    (machine) => machine.id === buildingId,
  ) as CropMachineBuilding | undefined;
  const queue = cropMachine?.queue ?? [];
  const now = useCropMachineLiveNow(queue);

  const cropMachineContext: CropMachineContext = {
    growingCropPackIndex: findGrowingCropPackIndex(queue, now),
    queue,
    unallocatedOilTime: cropMachine?.unallocatedOilTime ?? 0,
    canHarvest: hasReadyCrops(queue, now),
  };

  const cropMachineService = useInterpret(cropStateMachine, {
    context: cropMachineContext,
  }) as unknown as CropMachineInterpreter;

  const syncMachine = (type: "SUPPLY_MACHINE" | "HARVEST_CROPS") => {
    const machines = gameService.getSnapshot().context.state.buildings[
      "Crop Machine"
    ] as CropMachineBuilding[] | undefined;
    const updated = machines?.find((machine) => machine.id === buildingId);
    if (!updated) return;
    cropMachineService.send({
      type,
      updatedQueue: updated.queue ?? [],
      updatedUnallocatedOilTime: updated.unallocatedOilTime ?? 0,
    });
  };

  const growingCropPackIndex = findGrowingCropPackIndex(queue, now);

  return (
    <CropMachineModal
      show
      queue={queue}
      unallocatedOilTime={cropMachine?.unallocatedOilTime ?? 0}
      growingCropPackIndex={
        growingCropPackIndex === -1 ? undefined : growingCropPackIndex
      }
      service={cropMachineService}
      onClose={onClose}
      onAddSeeds={(seeds: AddSeedsInput) => {
        gameService.send({
          type: "cropMachine.supplied",
          seeds,
          machineId: buildingId,
        });
        syncMachine("SUPPLY_MACHINE");
      }}
      onHarvestPack={(packIndex: number) => {
        gameService.send({
          type: "cropMachine.harvested",
          packIndex,
          machineId: buildingId,
        });
        syncMachine("HARVEST_CROPS");
      }}
      onRemovePack={(packIndex: number) => {
        gameService.send({
          type: "cropMachine.packRemoved",
          packIndex,
          machineId: buildingId,
        });
        syncMachine("SUPPLY_MACHINE");
      }}
      onAddOil={(oil: number) => {
        gameService.send({
          type: "cropMachine.oilSupplied",
          oil,
          machineId: buildingId,
        });
        syncMachine("SUPPLY_MACHINE");
      }}
    />
  );
};

/** [Building.tsx InProgressBuilding] the constructing panel + speed-up. */
const ConstructingModalHost: React.FC<{
  name: BuildingName;
  id: string;
  onClose: () => void;
}> = ({ name, id, onClose }) => {
  const { gameService, showAnimations } = useContext(Context);
  const state = useSelector(gameService, _state);
  const building = state.buildings[name]?.find((b) => b.id === id);

  const isUpgradable =
    isBuildingUpgradable(name) &&
    state[makeUpgradableBuildingKey(name)].level > 1;

  const onSpeedUp = (
    cost: number,
    paymentMethod: "gems" | "coins" = "gems",
  ) => {
    if (isUpgradable) {
      gameService.send("upgrade.spedUp", { name, paymentMethod });
    } else {
      gameService.send("building.spedUp", { name, id, paymentMethod });
    }
    gameAnalytics.trackSink({
      currency: paymentMethod === "coins" ? "Coins" : "Gem",
      amount: cost,
      item: "Instant Build",
      type: "Fee",
    });
    onClose();
    if (showAnimations) {
      void import("canvas-confetti").then((confetti) => confetti.default());
    }
  };

  if (!building) return null;

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>
        <Constructing
          name={name}
          createdAt={building.createdAt ?? 0}
          readyAt={building.readyAt ?? 0}
          onClose={onClose}
          onInstantBuilt={onSpeedUp}
          state={state}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

/** [Collectible.tsx InProgressCollectible] speed-up panel for placing SFTs. */
const CollectibleConstructingHost: React.FC<{
  name: CollectibleName;
  id: string;
  onClose: () => void;
}> = ({ name, id, onClose }) => {
  const { gameService, showAnimations } = useContext(Context);
  const state = useSelector(gameService, _state);
  const item = state.collectibles[name]?.find((placed) => placed.id === id);

  const onSpeedUp = (
    cost: number,
    paymentMethod: "gems" | "coins" = "gems",
  ) => {
    gameService.send("collectible.spedUp", { name, id, paymentMethod });
    gameAnalytics.trackSink({
      currency: paymentMethod === "coins" ? "Coins" : "Gem",
      amount: cost,
      item: "Instant Build",
      type: "Fee",
    });
    onClose();
    if (showAnimations) {
      void import("canvas-confetti").then((confetti) => confetti.default());
    }
  };

  if (!item) return null;

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>
        <CollectibleConstructingPanel
          name={name}
          createdAt={item.createdAt ?? 0}
          readyAt={item.readyAt ?? 0}
          onClose={onClose}
          onInstantBuilt={onSpeedUp}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
