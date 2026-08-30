import type { MachineInterpreter } from "features/game/lib/gameMachine";
import type { MachineInterpreter as LandscapingInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import type {
  InventoryItemName,
  Reward,
  AnimalBounty,
} from "features/game/types/game";
import type { GlobalModal } from "features/game/components/modal/ModalProvider";
import {
  subscribeSelector,
  type EqualityFn,
  type StateSelector,
  type Unsubscribe,
} from "./subscriptions";
import { AnchorRegistry } from "./anchors";

/**
 * The UI preferences the DOM farm reads from GameProvider's React context.
 * FarmPhaser pushes them into this store on change so canvas code can read and
 * subscribe without touching React.
 */
export type UiPrefs = {
  selectedItem?: InventoryItemName;
  showTimers: boolean;
  showAnimations: boolean;
  showActualTime: boolean;
  enableQuickSelect: boolean;
};

export type UiPrefsBridge = {
  get(): UiPrefs;
  subscribe(listener: (prefs: UiPrefs) => void): Unsubscribe;
};

export type LandscapingBridge = {
  /** The landscaping child machine, present only while gameMachine is in the `landscaping` state. */
  get(): LandscapingInterpreter | undefined;
  send: (...args: Parameters<LandscapingInterpreter["send"]>) => void;
};

/**
 * In-world modals: Phaser renders the sprite and detects the click; the modal
 * itself is UI and stays React. FarmModals.tsx hosts one modal per name.
 * Add a name here + a case there when a new in-world interaction needs a modal.
 */
export type FarmModalName =
  | "snorkler"
  | "sharkBumpkin"
  | "travelTeaser"
  | "restockBoat"
  | "laTomatina"
  | "islandUpgrader"
  | "pontoon"
  | "expansionRequirements"
  | "seasonalSeed"
  | "nonFertilePlot"
  | "lavaPit"
  | "boulder"
  | "flowerBed"
  | "flowerInstaGrow"
  | "flowerCongratulations"
  | "beehiveLevel"
  | "beehiveSwarm"
  | "upgradeSaltFarm"
  | "fisherman"
  | "waterTrap"
  | "crustaceanCaught"
  // Buildings (Phase 5). "cooking" covers the five Recipes-flow buildings.
  | "cooking"
  | "market"
  | "workbench"
  | "waterWell"
  | "composter"
  | "craftingBox"
  | "fishMarket"
  | "agingShed"
  | "cropMachine"
  | "buildingConstructing"
  | "buildingDestroyed"
  | "buildingLevelLocked"
  // Collectibles (Phase 6)
  | "collectibleConstructing"
  | "renewCollectible"
  | "letterBox"
  | "saltSculpture"
  | "genieLamp"
  | "manekiNekoReveal"
  | "festiveTreeReveal"
  | "festiveTreeGifted"
  | "weatherPlot"
  | "renewPetShrine"
  | "obsidianShrine"
  | "removeWarning"
  | "fishingChallenge"
  | "bedFarmhand"
  | "projectComplete"
  | "renewWeather"
  | "bumpkinPainting"
  | "animalDetails"
  | "animalLocked"
  | "mutantAnimal"
  | "greenhouseOil"
  // Characters (Phase 7)
  | "bumpkinPlayer"
  | "farmHandEquip"
  | "pet"
  | "airdrop"
  // Visiting (Phase 9)
  | "farmHelped";

export type FarmModalRequest = { name: FarmModalName; data?: unknown };

/**
 * Pixel-perfect nudging for the selected placement [MovableComponent's
 * pixel-perfect disc + arrows]. The controller owns the state and the commit;
 * this is the handle the React disc row drives it through.
 */
export type LandscapingControls = {
  pixelPerfect: boolean;
  togglePixelPerfect(): void;
  /** One source pixel per press; the controller clamps to the DOM's +/-8. */
  nudge(dx: number, dy: number): void;
  /** False once an axis is maxed, so the UI hides that arrow like the DOM. */
  canNudge: { up: boolean; down: boolean; left: boolean; right: boolean };
};

/** [worker/BumpkinWorker.ts] the bumpkin's selection + job queue. */
export type WorkerState = {
  active: boolean;
  jobs: string[];
  busy: boolean;
};

export type AnimalDealState = {
  deal: AnimalBounty;
  selectedId?: string;
} | null;

export type FarmModalBridge = {
  open(modal: FarmModalName, data?: unknown): void;
  subscribe(listener: (request: FarmModalRequest) => void): Unsubscribe;
};

/** Resource node kinds the ResourcesUI overlay knows how to describe. */
export type ResourceHoverKind =
  | "tree"
  | "stone"
  | "iron"
  | "gold"
  | "crimstone"
  | "sunstone"
  | "ascensionCrystal"
  | "oil"
  | "fruitPatch"
  | "flowerBed"
  | "beehive"
  | "salt"
  | "waterTrap";

/** The in-world entity the pointer is over (drives React popovers). */
export type HoveredEntity =
  | { type: "crop"; id: string }
  | { type: "resource"; kind: ResourceHoverKind; id: string }
  | null;

/**
 * A chest reward awaiting collection (crops, trees): Phaser detected the
 * click, React runs the chest/captcha flow at `anchorId` and reports back
 * through onResult so the renderer can complete (or abandon) the collect.
 */
export type PendingChestReward = {
  anchorId: string;
  reward: Reward;
  collectedItem?: InventoryItemName;
  onResult: (success: boolean) => void;
} | null;

/**
 * A quick-select seed picker request (fruit patches): Phaser detected an
 * empty-patch click without a plantable seed, React shows the DOM QuickSelect
 * disc row at the patch anchor [FruitPatch.tsx].
 */
export type QuickSelectRequest = {
  anchorId: string;
  patchId: string;
} | null;

/**
 * A clicked SFT's detail popover [SFTDetailPopover.tsx / Bud.tsx]: Phaser
 * detects the click and registers the shared anchor; React renders the
 * name/buffs/trade panel beside it.
 */
/**
 * Overlap disambiguation [MovableComponent]: several placeables share the
 * clicked origin tile — React shows a picker; the choice sends MOVE.
 */
export type OverlapMenuRequest = {
  anchorId: string;
  choices: { id: string; name: string }[];
} | null;

export type SftPopoverRequest = {
  anchorId: string;
  name?: string;
  budId?: number;
  /** Expiring boosts show a time-remaining label [PetShrine.tsx]. */
  expiresAt?: number;
  /** Monuments show cheer progress [Monument.tsx]. */
  cheersProgress?: string;
} | null;

export type ValueStore<T> = {
  get(): T;
  set(value: T): void;
  subscribe(listener: (value: T) => void): Unsubscribe;
};

function createValueStore<T>(initial: T): ValueStore<T> {
  let value = initial;
  const listeners = new Set<(value: T) => void>();
  return {
    get: () => value,
    set: (next) => {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener(value));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * The single crossing point between the engine and the rest of the app. One
 * instance per mounted farm; handed to the scene via its constructor — never
 * via game.registry or module globals.
 *
 * - dispatch: Phaser -> machine. Same events, same payloads React sends today.
 * - select/subscribe: machine -> Phaser, always through a fine-grained
 *   selector with an equality fn. See subscriptions.ts.
 * - ui: GameProvider's context prefs (selected item, timers, animations).
 * - anchors: world-position -> screen-rect registry for React overlay UI.
 * - openModal: screen-centred global modals stay React; this is the typed
 *   route to them.
 */
export interface GameBridge {
  dispatch: MachineInterpreter["send"];
  select<S>(selector: StateSelector<S>): S;
  subscribe<S>(
    selector: StateSelector<S>,
    onChange: (slice: S) => void,
    equals?: EqualityFn<S>,
  ): Unsubscribe;
  ui: UiPrefsBridge;
  landscaping: LandscapingBridge;
  anchors: AnchorRegistry;
  openModal: (modal: GlobalModal) => void;
  farmModal: FarmModalBridge;
  /** Pointer-over entity, for React popovers/tooltips. */
  hover: ValueStore<HoveredEntity>;
  quickSelect: ValueStore<QuickSelectRequest>;
  sftPopover: ValueStore<SftPopoverRequest>;
  overlapMenu: ValueStore<OverlapMenuRequest>;
  /**
   * Listen to every event sent to the game machine (xstate onEvent) — for
   * transient reactions like the home building's collect heart.
   */
  onGameEvent: (listener: (event: { type: string }) => void) => Unsubscribe;
  /** Chest-reward handoff: Phaser click -> React chest/captcha -> back. */
  chestReward: ValueStore<PendingChestReward>;
  /**
   * Animal-bounty exchange mode [BarnInside.tsx `deal`]: React (the shop
   * modal's sell tab) sets the deal; Phaser dims invalid animals and reports
   * the clicked one back via `selectedId`; React shows the AnimalDeal modal.
   */
  animalDeal: ValueStore<AnimalDealState>;
  /**
   * The placement being moved in landscaping. Renderers hide their copy of it
   * so the drag preview is the only one on screen — otherwise the original
   * (and anything anchored to it, like a building's NPC) lingers behind.
   */
  landscapingMoving: ValueStore<{ id: string; name: string } | null>;
  /** Present while a placement is selected in landscaping. */
  landscapingControls: ValueStore<LandscapingControls | null>;
  /**
   * EXPERIMENT [worker/BumpkinWorker.ts]: the bumpkin job queue. Null when
   * the bumpkin has never been selected.
   */
  worker: ValueStore<WorkerState | null>;
  /** Set by the scene so the React readout can end job mode. */
  workerStop: () => void;
  /**
   * Select an inventory item (GameProvider's shortcutItem) — resources
   * auto-select their tool on strike, exactly like the DOM components.
   */
  selectItem: (item: InventoryItemName) => void;
  /**
   * Route navigation for buildings that leave the farm (barn, hen house,
   * home interiors...). Wired to react-router's navigate by the overlay.
   */
  navigateTo: (path: string) => void;
  /** Tear down everything the bridge owns. FarmPhaser calls this on unmount. */
  dispose(): void;
}

const DEFAULT_UI_PREFS: UiPrefs = {
  selectedItem: undefined,
  showTimers: true,
  showAnimations: true,
  showActualTime: false,
  enableQuickSelect: false,
};

const prefsEqual = (a: UiPrefs, b: UiPrefs) =>
  a.selectedItem === b.selectedItem &&
  a.showTimers === b.showTimers &&
  a.showAnimations === b.showAnimations &&
  a.showActualTime === b.showActualTime &&
  a.enableQuickSelect === b.enableQuickSelect;

export function createGameBridge({
  gameService,
}: {
  gameService: MachineInterpreter;
}): {
  bridge: GameBridge;
  setUiPrefs: (prefs: UiPrefs) => void;
  /** FarmPhaser wires ModalProvider's openModal in an effect after mount. */
  setOpenModal: (openModal: (modal: GlobalModal) => void) => void;
  /** FarmPhaser wires GameProvider's shortcutItem in an effect after mount. */
  setSelectItem: (selectItem: (item: InventoryItemName) => void) => void;
  /** The overlay wires react-router's navigate in an effect after mount. */
  setNavigate: (navigate: (path: string) => void) => void;
} {
  const subscriptions = new Set<Unsubscribe>();
  const anchors = new AnchorRegistry();

  let prefs = DEFAULT_UI_PREFS;
  const prefsListeners = new Set<(prefs: UiPrefs) => void>();

  let openModalImpl: (modal: GlobalModal) => void = () => {
    // wired by setOpenModal; a modal request before mount completes is dropped
  };
  let selectItemImpl: (item: InventoryItemName) => void = () => {
    // wired by setSelectItem
  };
  let navigateImpl: (path: string) => void = () => {
    // wired by setNavigate
  };

  const farmModalListeners = new Set<(request: FarmModalRequest) => void>();

  const bridge: GameBridge = {
    dispatch: ((...args: Parameters<MachineInterpreter["send"]>) =>
      gameService.send(...args)) as MachineInterpreter["send"],

    select: (selector) => selector(gameService.getSnapshot()),

    subscribe: (selector, onChange, equals) => {
      const unsubscribe = subscribeSelector(
        gameService,
        selector,
        onChange,
        equals,
      );
      subscriptions.add(unsubscribe);
      return () => {
        subscriptions.delete(unsubscribe);
        unsubscribe();
      };
    },

    ui: {
      get: () => prefs,
      subscribe: (listener) => {
        prefsListeners.add(listener);
        return () => prefsListeners.delete(listener);
      },
    },

    landscaping: {
      get: () =>
        gameService.getSnapshot().children.landscaping as
          | LandscapingInterpreter
          | undefined,
      send: (...args) => {
        const landscaping = gameService.getSnapshot().children.landscaping as
          | LandscapingInterpreter
          | undefined;
        landscaping?.send(...args);
      },
    },

    anchors,

    openModal: (modal) => openModalImpl(modal),

    farmModal: {
      open: (modal, data) =>
        farmModalListeners.forEach((listener) =>
          listener({ name: modal, data }),
        ),
      subscribe: (listener) => {
        farmModalListeners.add(listener);
        return () => farmModalListeners.delete(listener);
      },
    },

    hover: createValueStore<HoveredEntity>(null),
    quickSelect: createValueStore<QuickSelectRequest>(null),
    animalDeal: createValueStore<AnimalDealState>(null),
    landscapingMoving: createValueStore<{ id: string; name: string } | null>(
      null,
    ),
    landscapingControls: createValueStore<LandscapingControls | null>(null),
    worker: createValueStore<WorkerState | null>(null),
    // Replaced by the scene's worker when the farm surface mounts.
    workerStop: () => undefined,
    sftPopover: createValueStore<SftPopoverRequest>(null),
    overlapMenu: createValueStore<OverlapMenuRequest>(null),
    onGameEvent: (listener) => {
      gameService.onEvent(listener);
      return () => {
        gameService.off(listener);
      };
    },
    chestReward: createValueStore<PendingChestReward>(null),
    selectItem: (item) => selectItemImpl(item),
    navigateTo: (path) => navigateImpl(path),

    dispose: () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      subscriptions.clear();
      prefsListeners.clear();
      farmModalListeners.clear();
      anchors.dispose();
    },
  };

  const setUiPrefs = (next: UiPrefs) => {
    if (prefsEqual(prefs, next)) return;
    prefs = next;
    prefsListeners.forEach((listener) => listener(prefs));
  };

  const setOpenModal = (openModal: (modal: GlobalModal) => void) => {
    openModalImpl = openModal;
  };

  const setSelectItem = (selectItem: (item: InventoryItemName) => void) => {
    selectItemImpl = selectItem;
  };

  const setNavigate = (navigate: (path: string) => void) => {
    navigateImpl = navigate;
  };

  return { bridge, setUiPrefs, setOpenModal, setSelectItem, setNavigate };
}
