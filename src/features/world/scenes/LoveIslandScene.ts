import loveIslandJSON from "assets/map/love_island_map.json";
import loveIslandTileset from "assets/map/love_island_tileset.json";
import loveCharmSmall from "assets/icons/love_charm_small.webp";
import krakenHead from "assets/sfts/kraken_head.webp";
import krakenTentacle from "assets/sfts/kraken_tentacle.webp";

import type { SceneId } from "../mmoMachine";
import { BaseScene, type NPCBumpkin } from "./BaseScene";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { translate, translateForBubble } from "lib/i18n/translate";
import { interactableModalManager } from "../ui/InteractableModals";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { hasReadLoveIslandNotice } from "../ui/loveRewardShop/LoveIslandNoticeboard";
import type { BumpkinContainer } from "../containers/BumpkinContainer";
import { Label } from "../containers/Label";
import type { ArraySchema } from "@colyseus/schema";
import { LOVE_ISLAND_TILE_PX } from "../lib/loveIslandTiles";
import {
  LOVE_BOULDER_BUFFER,
  LOVE_BOULDER_HEIGHT,
  LOVE_BOULDER_SPOT,
  LOVE_BOULDER_WIDTH,
} from "../lib/loveIslandFixtures";
import {
  LOVE_BOULDER_HIT_COOLDOWN_MS,
  LOVE_BOULDER_COINS_PRIZE,
  LOVE_BOULDER_PRIZE,
  LOVE_BOULDER_PRIZE_ITEMS,
  type LoveBoulderPrize,
  LOVE_DILEMMA_CHOOSE_MS,
  LOVE_DILEMMA_PLATFORMS,
  LOVE_ISLAND_CENTRE_PUZZLE,
  LOVE_PUSH_BOULDERS,
  LOVE_PUSH_DELTAS,
  LOVE_PUSH_DIRECTIONS,
  LOVE_PUSH_TARGETS,
  LOVE_PUSH_MOVE_MS,
  LOVE_PUSH_PUSHERS_NEEDED,
  canClaimLoveBoulder,
  canClaimLovePush,
  createLoveBoulderLocalRound,
  createLovePushLocalRound,
  fromLovePushTileIndex,
  fromLoveBoulderRoomPrize,
  getLoveBoulderPrizeKey,
  getLoveDilemmaAttemptsLeft,
  getLoveDilemmaBotChoices,
  getLoveDilemmaPayout,
  getLoveDilemmaPlatformPrizes,
  getLoveDilemmaRound,
  getLoveDilemmaTiers,
  getLovePushSunkCount,
  getLovePushTileCentre,
  hasClaimedLoveBoulderRound,
  hasClaimedLoveBoulderToday,
  hasClaimedLovePushToday,
  pushLovePushLocalRound,
  isLoveBoulderRewardOpen,
  isLoveDilemmaRevealReady,
  isLoveDilemmaWinner,
  resolveLoveDilemma,
  tickLoveBoulderLocalRound,
  tickLovePushLocalRound,
  toLovePushTileIndex,
  type LoveBoulderLocalRound,
  type LoveBoulderRound,
  type LoveDilemmaChoices,
  type LoveDilemmaRound,
  type LovePushBoulderPushes,
  type LovePushDirection,
  type LovePushLocalRound,
  type LovePushRound,
  type LovePushTile,
} from "../lib/loveIsland";
import {
  LOVE_KRAKEN_COINS_PRIZE,
  LOVE_KRAKEN_PRIZE,
  LOVE_KRAKEN_PRIZE_ITEMS,
  LOVE_KRAKEN_REACH,
  getLoveKrakenBarShare,
  getLoveKrakenReelCooldownMs,
  getLoveKrakenReelKick,
  getLoveKrakenRing,
  pullLoveKrakenRod,
  LOVE_KRAKEN_AUTO_CLAIM_MS,
  LOVE_KRAKEN_FRESH_ANGLER,
  type LoveKrakenAngler,
  LOVE_KRAKEN_SPOT,
  LOVE_KRAKEN_ZONE_HALF_DEG,
  canClaimLoveKraken,
  createLoveKrakenLocalRound,
  fromLoveKrakenRoomPrize,
  getLoveKrakenPrizeKey,
  hasClaimedLoveKrakenToday,
  isLoveKrakenReelOnTarget,
  isLoveKrakenRewardOpen,
  reelLoveKrakenLocalRound,
  tickLoveKrakenLocalRound,
  type LoveKrakenLocalRound,
  type LoveKrakenPrize,
  type LoveKrakenRound,
} from "../lib/loveKraken";

const BUMPKINS: NPCBumpkin[] = [];

/** Centre of the island clearing where the daily puzzle lives. */
const CENTRE = { x: 615, y: 566 };

/** Platform art is 40x46. */
const PLATFORM_WIDTH = 40;
const PLATFORM_HEIGHT = 46;
/** Gap between platform centres in the row (10px between edges). */
const PLATFORM_SPACING = PLATFORM_WIDTH + 10;
/** Platforms in a row across the centre of the island. */
const PLATFORM_SPOTS: Coordinates[] = Array.from(
  { length: LOVE_DILEMMA_PLATFORMS },
  (_, i) => ({
    x: CENTRE.x + (i - (LOVE_DILEMMA_PLATFORMS - 1) / 2) * PLATFORM_SPACING,
    y: CENTRE.y + 10,
  }),
);
/** Countdown and status sit above the row, clear of the prize labels. */
const HUD_Y = CENTRE.y - 66;
/**
 * Prize labels float above each platform, higher than the name tag of
 * anyone standing on it, so the prize (and result) is never covered.
 */
const PRIZE_LABEL_Y = -(PLATFORM_HEIGHT / 2) - 22;

/** Key for the local player's choice while the room has no dilemma state. */
const LOCAL_PLAYER_KEY = "me";
/** Simulated players while the room has no dilemma state. */
const LOCAL_BOT_COUNT = 6;

/**
 * Where the Love Boulder sits and how much clear ground it keeps - shared
 * with the walkable-tile generator so Lover's Push hearts steer clear of it.
 */
const BOULDER_SPOT = LOVE_BOULDER_SPOT;
const BOULDER_WIDTH = LOVE_BOULDER_WIDTH;
const BOULDER_HEIGHT = LOVE_BOULDER_HEIGHT;
const BOULDER_BUFFER = LOVE_BOULDER_BUFFER;
/**
 * How close a player has to stand to land a hit - far enough to reach from
 * the buffer's corners (a body's width past the collider).
 */
const BOULDER_REACH = 50;
/** Health bar below the boulder, in the HUD bars' red-on-dark palette. */
const HEALTH_BAR_WIDTH = 30;
const HEALTH_BAR_HEIGHT = 5;
const HEALTH_BAR_INNER_WIDTH = HEALTH_BAR_WIDTH - 2;
const HEALTH_BAR_Y = BOULDER_SPOT.y + BOULDER_HEIGHT / 2 + 4;
const HEALTH_BAR_TRACK = 0x3e2731;
const HEALTH_BAR_FILL = 0xe43b44;
/** The fill flashes this colour for a moment on every tap you land. */
const HEALTH_BAR_FLASH = 0xff8e8e;
const HEALTH_BAR_FLASH_MS = 80;
/** Rubble colours pulled from the boulder art. */
const RUBBLE_COLOURS = [0x9a9aa8, 0x6b6b7a, 0xc8c8d4];
/** Texture key for a boulder prize's icon - an item name or "Coins". */
const boulderPrizeTexture = (prize: string) => `boulder_prize_${prize}`;

/** Clickable area of the prize label (icon + "+1"), generous for thumbs. */
const REWARD_HIT_WIDTH = 36;
const REWARD_HIT_HEIGHT = 16;
/** The hit counter's label sits just above the boulder. */
const BOULDER_LABEL_Y = BOULDER_SPOT.y - BOULDER_HEIGHT / 2 - 14;
/** Nine-patch label metrics, matching `containers/Label.ts`. */
const LABEL_HEIGHT = 11;
const LABEL_PADDING = 6;
const LABEL_CHAR_WIDTH = 4;

/**
 * Lover's Push plays out across the island's own 16px tiles: boulders start
 * out toward the edges and roll into four squares in the centre of the
 * clearing. The "boulders" are love rocks (`world/love_rock.png`, 18x17).
 */
const PUSH_BOULDER_WIDTH = 18;
const PUSH_BOULDER_HEIGHT = 17;
/**
 * Clear ground kept around a rock. A crowd pushing it stands right up
 * against the collider, and with no buffer the players in front hide the
 * rock completely; the collider is the art plus this on every side, so the
 * crowd gathers around its edge and the rock stays visible.
 */
const PUSH_COLLIDER_BUFFER = 6;
const PUSH_COLLIDER_WIDTH = PUSH_BOULDER_WIDTH + PUSH_COLLIDER_BUFFER * 2;
const PUSH_COLLIDER_HEIGHT = PUSH_BOULDER_HEIGHT + PUSH_COLLIDER_BUFFER * 2;
/** What a love rock bursts into. */
const PUSH_BURST_COLOURS = [0xe43b44, 0xff8e8e, 0xffffff];
/** Above the ground tiles (depth 0), below anyone walking on it. */
const PUSH_GROUND_DEPTH = 1;
/** The four squares in the centre, drawn on the ground. */
const PUSH_SQUARE_COLOUR = 0x3e2731;
const PUSH_SQUARE_FILL = 0x000000;
/** A taken square fills green under its boulder. */
const PUSH_SQUARE_TAKEN = 0x3e8948;
/** A faint ring marks where each boulder started from. */
const PUSH_START_COLOUR = 0x3e2731;
/** The "n/4" tally floats this far above the top of the squares. */
const PUSH_SUNK_LABEL_Y = -14;
/** A boulder that hits something bursts: a flash and chips of rock. */
const PUSH_EXPLOSION_COLOUR = 0xffe08a;
const PUSH_EXPLOSION_CHIPS = 10;
/** Don't nag every frame while leaning on a solved puzzle. */
const PUSH_BUBBLE_COOLDOWN_MS = 3000;
/**
 * How long before a push the room already has is sent again. A push is a
 * standing vote - sending the same one twice changes nothing - so this is
 * only a retry in case the first was lost, while the player keeps leaning
 * on the boulder.
 */
const PUSH_RESEND_MS = 2000;
/** The arrow icon shown at a boulder's edge, per direction it's being pushed. */
const PUSH_ARROW_TEXTURE: Record<LovePushDirection, string> = {
  north: "push_arrow_north",
  east: "push_arrow_east",
  south: "push_arrow_south",
  west: "push_arrow_west",
};
/** The bars beside the arrows fill with this as the crowd behind a rock grows. */
const PUSH_PROGRESS_COLOUR = 0xf09a3c;
const PUSH_PROGRESS_WIDTH = 10;
const PUSH_PROGRESS_HEIGHT = 3;
const PUSH_PROGRESS_TRACK = 0x3e2731;
/** The bar sits this far past the arrow's centre (the icons are ~12px tall). */
const PUSH_PROGRESS_Y = 8;
/**
 * An arrow sits this far from the centre of the boulder's tile, on the side
 * it would roll toward - hugging the boulder's edge rather than sitting in
 * the middle of the next tile, so arrows from two boulders aiming at the
 * same tile don't land on top of each other.
 */
const PUSH_ARROW_OFFSET = PUSH_BOULDER_WIDTH / 2 + 3;
/**
 * An arrow starts at half size on the first push and grows to full size as
 * the crowd behind that direction fills up, so the way the boulder is most
 * likely to go is the biggest arrow.
 */
const PUSH_ARROW_MIN_SCALE = 0.5;

/**
 * The Love Marvel in the lake, off the end of the wharf. Its head and
 * tentacles break the surface, a ring sweeps around it, and the island's
 * progress bar sits under it.
 *
 * The art is drawn at **native size** (the SFT sprites are 11x12 and 8x16,
 * each with its own ripple) and never scaled, rotated or tweened, so every
 * pixel lines up with the map tiles behind it. Everything below is placed by
 * its integer top-left corner for the same reason.
 */
const KRAKEN_SPOT = LOVE_KRAKEN_SPOT;
const KRAKEN_HEAD_WIDTH = 11;
const KRAKEN_HEAD_HEIGHT = 12;
/** Tentacles are 8 wide; only the height is needed, for their depth. */
const KRAKEN_TENTACLE_HEIGHT = 16;
/** Top-left of the head, in world px. */
const KRAKEN_HEAD = { x: 300, y: 557 };
/**
 * Top-left of each tentacle, in world px. The art carries its own ripple, so
 * they sit far enough out to read as separate things surfacing rather than
 * the head's legs, while staying inside the ring.
 */
const KRAKEN_TENTACLES = [
  { x: 288, y: 553 },
  { x: 316, y: 555 },
  { x: 294, y: 566 },
  { x: 312, y: 568 },
];
/** The ring the marker sweeps around, clear of the tentacles. */
const KRAKEN_RING_RADIUS = 22;
const KRAKEN_RING_WIDTH = 3;
/** Kept light - the ring is a HUD over the lake, not a hole in it. */
const KRAKEN_RING_TRACK = 0x193c3e;
const KRAKEN_RING_TRACK_ALPHA = 0.6;
/** The zone is what everyone is aiming at, so it is the heaviest stroke. */
const KRAKEN_ZONE_WIDTH = 5;
const KRAKEN_RING_ZONE = 0x63c74d;
/**
 * A dot in the beast's own purple is left where each landed reel scored,
 * just as the zone jumps away from it - so a hit is never in doubt, and you
 * can see where you have just come from.
 */
const KRAKEN_HIT_DOT_COLOUR = 0xb55088;
const KRAKEN_HIT_DOT_RADIUS = 3;
const KRAKEN_HIT_DOT_MS = 900;
const KRAKEN_MARKER_RADIUS = 3;
const KRAKEN_MARKER_COLOUR = 0xffffff;
/** The marker flashes green on a landed reel, red on a missed one. */
const KRAKEN_MARKER_HIT = 0x63c74d;
const KRAKEN_MARKER_MISS = 0xf6757a;
const KRAKEN_MARKER_FLASH_MS = 180;
/** The fishing disc marking the spot sits above the ring. */
const KRAKEN_DISC_Y = KRAKEN_SPOT.y - KRAKEN_RING_RADIUS - 12;
/**
 * The island's progress bar under the ring - wider than the boulder's, since
 * it is the one thing the whole bank is watching.
 */
const KRAKEN_BAR_WIDTH = 40;
const KRAKEN_BAR_HEIGHT = 6;
const KRAKEN_BAR_INNER_WIDTH = KRAKEN_BAR_WIDTH - 2;
const KRAKEN_BAR_Y = KRAKEN_SPOT.y + KRAKEN_RING_RADIUS + 4;
const KRAKEN_BAR_TRACK = 0x3e2731;
/** Green while the bank is winning the tug of war, red while the Marvel is. */
const KRAKEN_BAR_RISING = 0x63c74d;
const KRAKEN_BAR_FALLING = 0xe43b44;
/** Splash colours, pulled from the lake tiles. */
const KRAKEN_SPLASH_COLOURS = [0xffffff, 0x8ff8e2, 0x50c5e8];
/** Texture key for a Marvel prize's icon - an item name or "Coins". */
const krakenPrizeTexture = (prize: string) => `kraken_prize_${prize}`;

const FONT = "Teeny Tiny Pixls";
const TEXT_TINT = 0x3e2731;
const SELECT_COLOUR = 0xffffff;
const WIN_COLOUR = 0x7ee07e;
const LOSE_COLOUR = 0xe57373;

/**
 * Love Island - home of the Love Dilemma and Lover's Push (one at a time,
 * picked by `LOVE_ISLAND_CENTRE_PUZZLE`), plus the Love Boulder.
 *
 * Lover's Push: four boulders start out toward the corners of the island
 * and have to be rolled into four squares in the middle of the clearing -
 * one boulder to a square, the first one in takes it. One
 * player can't budge a boulder - walking into one adds your push to it: an
 * arrow appears at its edge and a bar beside it fills as the crowd grows; once enough players (five on mainnet,
 * two off it) are pushing it the same way it rolls a tile and everyone sees
 * it go. Pushing another side moves your push. A boulder that rolls into
 * the water, a rock, a tree or another boulder bursts, and a fresh one
 * appears somewhere new on the same side of the island (a ring marks the
 * spot), so the island has to plan the route. Hub and spoke: there is
 * always one boulder at the top, one on the right, one at the bottom and
 * one on the left. A boulder rolled onto a free square parks there (the
 * square turns green) and is done - and is something the others can crash into; a tally
 * above the squares counts them. When all four are in
 * everyone who helped roll one is handed a Bronze Love Box automatically
 * (once a day) - the prize the petal puzzle used to pay for this same
 * clearing - then fresh boulders appear, each always somewhere a crowd can
 * roll it home from. The room publishes `state.lovePush`; until it does a
 * simulated crowd joins your pushes and rolls boulders toward the squares.
 *
 * Three platforms in a row, each showing a Love Charm prize. Every 30s
 * players click the platform they want (a select box marks your pick; only
 * the server knows it). The platforms are solid, so clicking is the only
 * way to pick one. When the countdown ends everyone is moved onto their
 * platform: the most crowded platform turns red and pays nothing, the others
 * turn green and pay their prize. Ties for most crowded all lose, a round
 * with fewer than 5 players is void, and there are three attempts per day.
 * Prizes are claimed automatically - no modal.
 *
 * The MMO room publishes `state.loveDilemma` when it runs the puzzle. Until
 * it does, rounds run off the shared clock with simulated players so the
 * game is playable locally.
 *
 * Love Boulder: a boulder at the top of the island that the whole island
 * taps down from 10,000 hits. When it cracks, a Love Charm prize sits on
 * the rubble for 5 seconds - anyone who landed a hit can click it for 5
 * Love Charms (once a day) - then a fresh boulder appears. The room
 * publishes `state.loveBoulder`; until it does, a simulated crowd chips
 * away locally. The HUD is the hit count in a label above the boulder and a
 * health bar below it that drains with every tap.
 */
export class LoveIslandScene extends BaseScene {
  sceneId: SceneId = "love_island";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };

  private platforms: Phaser.GameObjects.Sprite[] = [];
  /** Invisible solid boxes - you pick a platform by clicking, not walking. */
  private platformColliders: Phaser.GameObjects.Rectangle[] = [];
  private platformFrames: Phaser.GameObjects.Rectangle[] = [];
  /** Prize label above each platform, rebuilt whenever the amount changes. */
  private platformLabels: (Label | undefined)[] = [];
  private countdownText?: Phaser.GameObjects.BitmapText;
  private statusText?: Phaser.GameObjects.BitmapText;
  private attemptsText?: Phaser.GameObjects.BitmapText;
  private selectBox?: Phaser.GameObjects.Rectangle;
  private labelledRoundId?: number;
  private selectedRoundId?: number;
  private revealedRoundId?: number;
  /** Last HUD values rendered - the strings only change once a round. */
  private renderedAttemptsLeft?: number;
  private renderedStatus?: string;
  /** roundId -> platform, the local player's picks (local mode only). */
  private localChoices: Record<number, number> = {};

  private boulder?: Phaser.GameObjects.Sprite;
  private boulderHitsText?: Phaser.GameObjects.BitmapText;
  /** Nine-patch behind the hit count, resized to fit the number. */
  private boulderHitsLabel?: Phaser.GameObjects.Container;
  private boulderHitsPatch?: { resize: (w: number, h: number) => void };
  /** Health bar under the boulder, redrawn when its fill width changes. */
  private boulderHealthBar?: Phaser.GameObjects.Graphics;
  private boulderHealthFill?: number;
  private boulderHealthFlashing = false;
  /** Epoch ms the health bar's tap flash ends. */
  private boulderHealthFlashUntil = 0;
  /** Love Charm prize shown on the rubble while it can be claimed. */
  private boulderReward?: Phaser.GameObjects.Container;
  /** Prize the label was built for (see `getLoveBoulderPrizeKey`), so it's only rebuilt on change. */
  private boulderRewardPrize?: string;
  /** Round whose prize the local player has clicked. */
  private claimedBoulderRoundId?: number;
  /** Simulated boulder while the room has no boulder state. */
  private localBoulder?: LoveBoulderLocalRound;
  /** Boulder round the visuals are synced to. */
  private boulderRoundId?: number;
  /** Boulder round whose break has been handled (claimed/animated). */
  private brokenBoulderRoundId?: number;
  /** Whether we've seen this round's boulder standing - only then animate the break. */
  private sawBoulderStanding = false;
  private lastBoulderHitAt = 0;
  /** roundId -> hits the local player has landed. */
  private boulderHits: Record<number, number> = {};
  /** Hits sent to the room that its count hasn't reflected yet. */
  private pendingBoulderHits = 0;
  private lastRemoteBoulderHits?: number;

  private pushBoulders: Phaser.GameObjects.Sprite[] = [];
  /** Solid - walking into one pushes it. */
  private pushColliders: Phaser.GameObjects.Rectangle[] = [];
  /** The four squares in the centre the boulders roll into. */
  private pushSquares?: Phaser.GameObjects.Graphics;
  /** A ring where each boulder started, indexed by boulder. */
  private pushStartMarkers: Phaser.GameObjects.Graphics[] = [];
  /** "n/4" above the squares - how many are taken. */
  private pushSunkLabel?: Label;
  private renderedSunkCount?: number;
  /**
   * An arrow per direction in the tile each boulder would slide into, shown
   * while someone is pushing it that way. Indexed by boulder.
   */
  private pushArrows: Record<LovePushDirection, Phaser.GameObjects.Image>[] =
    [];
  /** A bar beneath each arrow that fills as that direction's crowd grows. Indexed by boulder. */
  private pushProgressBars: Record<
    LovePushDirection,
    Phaser.GameObjects.Graphics
  >[] = [];
  /** Simulated puzzle while the room has no push state. */
  private localPush?: LovePushLocalRound;
  /** Round the boulder sprites are synced to. */
  private pushRoundId?: number;
  /** Tile index each boulder sprite is drawn at, indexed by boulder. */
  private renderedPushTiles: number[] = [];
  /** Tile index each boulder started on this round, indexed by boulder. */
  private renderedPushStarts: number[] = [];
  /** Pushes shown on each boulder, indexed by boulder. */
  private renderedPushes: LovePushBoulderPushes[] = [];
  /** Which boulders have been sunk on screen, indexed by boulder. */
  private renderedSunk: boolean[] = [];
  /** Resets shown for each boulder, indexed by boulder. */
  private renderedResets: number[] = [];
  /** Round whose solve has been celebrated (and claimed). */
  private solvedPushRoundId?: number;
  /** Whether we've seen this round unsolved - only then animate the solve. */
  private sawPushUnsolved = false;
  /** boulder -> when the local player last sent a push on it. */
  private lastPushAt: Record<number, number> = {};
  /** boulder -> the way the local player is pushing it, until it rolls. */
  private myPushes: Record<number, LovePushDirection> = {};
  private lastPushBubbleAt = 0;
  /** roundId -> boulders the local player has helped roll. */
  private pushMoves: Record<number, number> = {};

  private kraken?: Phaser.GameObjects.Sprite;
  private krakenTentacles: Phaser.GameObjects.Sprite[] = [];
  private krakenDisc?: Phaser.GameObjects.Sprite;
  /** The sweeping ring: a static track and the marker going round it. */
  private krakenRing?: Phaser.GameObjects.Graphics;
  /** The catch zone, redrawn whenever it jumps to a new angle. */
  private krakenZone?: Phaser.GameObjects.Graphics;
  private drawnKrakenZoneAngle?: number;
  private krakenMarker?: Phaser.GameObjects.Arc;
  private krakenMarkerFlashUntil = 0;
  private krakenMarkerFlashColour = KRAKEN_MARKER_COLOUR;
  /** The island's progress bar, redrawn only when its fill width changes. */
  private krakenBar?: Phaser.GameObjects.Graphics;
  private krakenBarFill?: number;
  private krakenBarRising?: boolean;
  private krakenReward?: Label;
  /** Prize the label was built for, so it's only rebuilt on change. */
  private krakenRewardPrize?: string;
  private claimedKrakenRoundId?: number;
  /** Simulated Marvel while the room has no state for it. */
  private localKraken?: LoveKrakenLocalRound;
  /** Marvel round the visuals are synced to. */
  private krakenRoundId?: number;
  /** Marvel round whose catch has been animated. */
  private caughtKrakenRoundId?: number;
  /** Whether we've seen this round's Marvel fighting - only then animate the catch. */
  private sawKrakenFighting = false;
  private lastKrakenReelAt = 0;
  /**
   * roundId -> the local player's pulls, reels and the leg their marker is
   * on. Everything their ring does follows from it.
   */
  private krakenAnglers: Record<number, LoveKrakenAngler> = {};
  /** Whether the local player's line is in the water. */
  private krakenCasting = false;
  /** Progress last seen, to colour the bar by which way it is going. */
  private lastKrakenProgress?: number;
  /** When the local player last landed a reel - drives the bar's kick. */
  private krakenKickAt?: number;
  /** farmId -> reels last seen, so the rest of the bank can be animated. */
  private seenAnglerReels: Record<string, number> = {};

  constructor() {
    super({
      name: "love_island",
      map: {
        json: loveIslandJSON,
        imageKey: "floating-tileset",
        defaultTilesetConfig: loveIslandTileset,
      },
    });
  }

  preload() {
    super.preload();
    this.load.image("shop_icon", "world/shop_disc.png");
    this.load.image("petal_clue", "world/petal_clue.png");
    this.load.image("platform", "world/platform.webp");
    this.load.image("love_charm_small", loveCharmSmall);
    this.load.image("boulder", SUNNYSIDE.resource.boulder);
    // Icons for whatever the boulder can pay today
    this.load.image(
      boulderPrizeTexture(LOVE_BOULDER_COINS_PRIZE),
      SUNNYSIDE.ui.coins,
    );
    LOVE_BOULDER_PRIZE_ITEMS.forEach((item) => {
      this.load.image(boulderPrizeTexture(item), ITEM_DETAILS[item].image);
    });
    this.load.image("kraken_head", krakenHead);
    this.load.image("kraken_tentacle", krakenTentacle);
    this.load.image("fishing_disc", "world/fishing_disc.png");
    // Icons for whatever the Marvel can pay today - the boulder's roll
    this.load.image(
      krakenPrizeTexture(LOVE_KRAKEN_COINS_PRIZE),
      SUNNYSIDE.ui.coins,
    );
    LOVE_KRAKEN_PRIZE_ITEMS.forEach((item) => {
      this.load.image(krakenPrizeTexture(item), ITEM_DETAILS[item].image);
    });

    this.load.image("push_boulder", "world/love_rock.png");
    this.load.image(PUSH_ARROW_TEXTURE.north, SUNNYSIDE.icons.arrow_up);
    this.load.image(PUSH_ARROW_TEXTURE.east, SUNNYSIDE.icons.arrow_right);
    this.load.image(PUSH_ARROW_TEXTURE.south, SUNNYSIDE.icons.arrow_down);
    this.load.image(PUSH_ARROW_TEXTURE.west, SUNNYSIDE.icons.arrow_left);
    this.load.spritesheet("portal", "world/love_charm_portal_sheet.png", {
      frameWidth: 20,
      frameHeight: 34,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "love_island",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const shop = this.add.sprite(900, 490, "shop_icon");

    // On click open shop
    shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(shop, 75)) {
        interactableModalManager.open("floating_island_shop");
      } else {
        this.currentPlayer?.speak(translateForBubble("base.iam.far.away"));
      }
    });

    const clue = this.add.sprite(651, 671, "petal_clue").setDepth(671);
    clue.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("petal_clue");
    });

    const portal = this.add.sprite(568, 674, "portal");
    this.anims.create({
      key: "portal_anim",
      frames: this.anims.generateFrameNumbers("portal", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 7,
    });
    portal.play("portal_anim", true);
    portal.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(portal, 40)) {
        interactableModalManager.open("flower_exchange");
      } else {
        this.currentPlayer?.speak(translateForBubble("base.iam.far.away"));
      }
    });

    if (LOVE_ISLAND_CENTRE_PUZZLE === "push") {
      this.createLovePush();
    } else {
      this.createLoveDilemma();
    }
    this.createLoveBoulder();
    this.createLoveKraken();

    this.setupPopup();
  }

  setupPopup = () => {
    if (!hasReadLoveIslandNotice()) {
      interactableModalManager.open("petal_clue");
    }
  };

  /** Latest game state - the registry copy can lag behind claims. */
  private get freshState() {
    return this.gameService?.getSnapshot().context.state ?? this.gameState;
  }

  update() {
    super.update();

    if (LOVE_ISLAND_CENTRE_PUZZLE === "push") {
      this.updateLovePush();
    } else {
      this.updateLoveDilemma();
    }
    this.updateLoveBoulder();
    this.updateLoveKraken();
  }

  createLoveDilemma() {
    PLATFORM_SPOTS.forEach((spot, platform) => {
      const sprite = this.add
        .sprite(spot.x, spot.y, "platform")
        .setDepth(spot.y - PLATFORM_HEIGHT);

      sprite
        .setInteractive({ cursor: "pointer" })
        .on("pointerdown", () => this.choosePlatform(platform));

      this.platforms.push(sprite);

      // Solid, so the only way onto a platform is being placed at the reveal
      const collider = this.add.rectangle(
        spot.x,
        spot.y,
        PLATFORM_WIDTH,
        PLATFORM_HEIGHT,
        0x000000,
        0,
      );
      this.physics.world.enable(collider);
      (collider.body as Phaser.Physics.Arcade.Body).setImmovable(true);
      this.colliders?.add(collider);
      this.platformColliders.push(collider);

      // Green/red outline shown at the reveal
      const frame = this.add
        .rectangle(spot.x, spot.y, PLATFORM_WIDTH + 6, PLATFORM_HEIGHT + 6)
        .setStrokeStyle(2, WIN_COLOUR)
        .setVisible(false)
        .setDepth(spot.y - PLATFORM_HEIGHT + 1);

      this.platformFrames.push(frame);
    });

    this.selectBox = this.add
      .rectangle(0, 0, PLATFORM_WIDTH + 4, PLATFORM_HEIGHT + 4)
      .setStrokeStyle(1, SELECT_COLOUR)
      .setVisible(false)
      .setDepth(Number.MAX_SAFE_INTEGER);

    this.countdownText = this.add
      .bitmapText(CENTRE.x, HUD_Y, FONT, "", 10)
      .setOrigin(0.5)
      .setTint(TEXT_TINT)
      .setDepth(Number.MAX_SAFE_INTEGER);

    this.statusText = this.add
      .bitmapText(CENTRE.x, HUD_Y + 11, FONT, "", 5)
      .setOrigin(0.5)
      .setTint(TEXT_TINT)
      .setDepth(Number.MAX_SAFE_INTEGER);

    this.attemptsText = this.add
      .bitmapText(CENTRE.x, HUD_Y + 19, FONT, "", 5)
      .setOrigin(0.5)
      .setTint(TEXT_TINT)
      .setDepth(Number.MAX_SAFE_INTEGER);
  }

  /** Does the room run the dilemma, or are we simulating it locally? */
  private get remoteDilemma() {
    return this.mmoServer?.state?.loveDilemma;
  }

  /** The current round, from the room when it has one, else the shared clock. */
  private getRound(now: number): LoveDilemmaRound {
    const remote = this.remoteDilemma;

    if (remote && remote.revealEndsAt > 0) {
      const tiers = Array.from(remote.tiers ?? []).filter(
        (tier): tier is number => typeof tier === "number",
      );

      return {
        roundId: remote.roundId,
        phase: now < remote.chooseEndsAt ? "choose" : "reveal",
        startAt: remote.chooseEndsAt - LOVE_DILEMMA_CHOOSE_MS,
        chooseEndsAt: remote.chooseEndsAt,
        revealEndsAt: remote.revealEndsAt,
        tiers:
          tiers.length === LOVE_DILEMMA_PLATFORMS
            ? tiers
            : getLoveDilemmaTiers(remote.roundId),
      };
    }

    return getLoveDilemmaRound(now);
  }

  /**
   * The room publishes `choices` about 1s after `chooseEndsAt`, so the local
   * clock flips to "reveal" before they exist. Scoring then would call a
   * real round void and never revisit it - wait for the picks to land (or
   * for the grace period to run out) before resolving.
   */
  private hasAuthoritativeChoices(
    round: LoveDilemmaRound,
    now: number,
  ): boolean {
    const remote = this.remoteDilemma;
    if (!remote || remote.roundId !== round.roundId) return true;

    return isLoveDilemmaRevealReady({
      now,
      chooseEndsAt: round.chooseEndsAt,
      choicesCount: remote.choices?.size ?? 0,
      chosenCount: remote.chosenCount ?? 0,
    });
  }

  /** Key the local player's choice is stored under. */
  private get myChoiceKey() {
    return this.remoteDilemma ? this.mmoServer.sessionId : LOCAL_PLAYER_KEY;
  }

  /** Everyone's choices for a round - only meaningful once revealed. */
  private getChoices(round: LoveDilemmaRound): LoveDilemmaChoices {
    const remote = this.remoteDilemma;

    if (remote) {
      const choices: LoveDilemmaChoices = {};
      remote.choices?.forEach((platform, sessionId) => {
        choices[sessionId] = platform;
      });

      return choices;
    }

    const choices = getLoveDilemmaBotChoices(round.roundId, LOCAL_BOT_COUNT);
    const mine = this.localChoices[round.roundId];
    if (mine !== undefined) {
      choices[LOCAL_PLAYER_KEY] = mine;
    }

    return choices;
  }

  private choosePlatform(platform: number) {
    const now = Date.now();
    const round = this.getRound(now);

    if (round.phase !== "choose") {
      this.currentPlayer?.speak(
        translateForBubble("loveDilemma.waitForNextRound"),
      );
      return;
    }

    if (getLoveDilemmaAttemptsLeft({ state: this.freshState, now }) <= 0) {
      this.currentPlayer?.speak(
        translateForBubble("loveDilemma.noAttemptsLeft"),
      );
      return;
    }

    this.selectedRoundId = round.roundId;
    this.localChoices[round.roundId] = platform;

    const spot = PLATFORM_SPOTS[platform];
    this.selectBox?.setPosition(spot.x, spot.y).setVisible(true);

    // Only the server learns the pick - nobody else sees it until the reveal
    this.mmoServer?.send("loveDilemma.choose", {
      roundId: round.roundId,
      platform,
    });
  }

  /** What each platform would pay this player right now, indexed by platform. */
  private getPayouts(round: LoveDilemmaRound): number[] {
    const now = Date.now();
    const state = this.freshState;
    const isVip = hasVipAccess({ game: state, now });

    return getLoveDilemmaPlatformPrizes({ tiers: round.tiers, isVip }).map(
      (prize) => getLoveDilemmaPayout({ state, prize, now }),
    );
  }

  private refreshPlatformPrizes(round: LoveDilemmaRound) {
    // Shown amounts are what the player can actually still earn today
    const prizes = this.getPayouts(round);

    prizes.forEach((prize, platform) => {
      const spot = PLATFORM_SPOTS[platform];
      if (!spot) return;

      // A label's width is fixed at creation, so swap it for a fresh one
      this.platformLabels[platform]?.destroy();

      const label = new Label(this, `${prize}`, "grey", "love_charm_small");
      label
        .setPosition(spot.x, spot.y + PRIZE_LABEL_Y)
        .setDepth(Number.MAX_SAFE_INTEGER);
      this.add.existing(label);

      this.platformLabels[platform] = label;
    });
  }

  /** Back to neutral platforms for a fresh round. */
  private clearPlatformResults() {
    this.platforms.forEach((platform) => platform.clearTint());
    this.platformFrames.forEach((frame) => frame.setVisible(false));
    this.platformLabels.forEach((label) => label?.setTextTint());
  }

  /**
   * Platforms are solid while choosing and walkable only during the reveal,
   * when everyone is placed on them. Re-enabling nudges the local player off
   * so they aren't trapped inside a collider.
   */
  private setPlatformsSolid(solid: boolean) {
    this.platformColliders.forEach((collider, index) => {
      const body = collider.body as Phaser.Physics.Arcade.Body | undefined;
      if (!body || body.enable === solid) return;

      body.enable = solid;

      const player = this.currentPlayer;
      if (
        solid &&
        player &&
        Phaser.Geom.Rectangle.Contains(collider.getBounds(), player.x, player.y)
      ) {
        const spot = PLATFORM_SPOTS[index];
        this.placeOnPlatform(
          player,
          player.x,
          spot.y + PLATFORM_HEIGHT / 2 + 16,
        );
      }
    });
  }

  updateLoveDilemma() {
    const now = Date.now();
    const round = this.getRound(now);

    // New round - fresh prizes, clear any stale selection and results
    if (this.labelledRoundId !== round.roundId) {
      this.labelledRoundId = round.roundId;
      this.refreshPlatformPrizes(round);
      this.clearPlatformResults();
      this.setPlatformsSolid(true);

      if (this.selectedRoundId !== round.roundId) {
        this.selectBox?.setVisible(false);
      }
    }

    const endsAt =
      round.phase === "choose" ? round.chooseEndsAt : round.revealEndsAt;
    const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));
    this.countdownText?.setText(`${secondsLeft}`);

    const attemptsLeft = getLoveDilemmaAttemptsLeft({
      state: this.freshState,
      now,
    });

    // Only touch the text (and the i18n lookups) when a value changes
    if (attemptsLeft !== this.renderedAttemptsLeft) {
      this.renderedAttemptsLeft = attemptsLeft;
      this.attemptsText?.setText(
        attemptsLeft === 1
          ? translate("loveDilemma.oneAttemptLeft")
          : translate("loveDilemma.attemptsLeft", { count: attemptsLeft }),
      );
    }

    const status =
      round.phase === "reveal"
        ? "loveDilemma.reveal"
        : attemptsLeft > 0
          ? "loveDilemma.choose"
          : "loveDilemma.noAttemptsLeft";

    if (status !== this.renderedStatus) {
      this.renderedStatus = status;
      this.statusText?.setText(translate(status));
    }

    if (round.phase === "reveal") {
      if (
        this.revealedRoundId !== round.roundId &&
        this.hasAuthoritativeChoices(round, now)
      ) {
        this.revealedRoundId = round.roundId;
        this.revealRound(round);
      }
    }
  }

  /** Spread players standing on the same platform so they don't stack. */
  private slotOffset(slot: number): Coordinates {
    if (slot === 0) return { x: 0, y: 0 };

    const ring = Math.ceil(slot / 5);
    const angle = slot * 2.4;
    const radius = 8 * ring;

    return {
      x: Math.round(Math.cos(angle) * radius * 1.2),
      y: Math.round(Math.sin(angle) * radius * 0.6),
    };
  }

  private placeOnPlatform(entity: BumpkinContainer, x: number, y: number) {
    entity.setPosition(x, y);

    const body = entity.body as Phaser.Physics.Arcade.Body | undefined;
    body?.reset(x, y);

    entity.setDepth(y);
  }

  /** Celebratory hop for winners. */
  private celebrate(entity: BumpkinContainer) {
    entity.cheer();

    this.tweens.add({
      targets: entity,
      y: entity.y - 10,
      duration: 220,
      yoyo: true,
      repeat: 2,
      ease: "Quad.easeOut",
    });
  }

  /** Floating "+N" above the local player when they win. */
  private showWinnings(amount: number) {
    const player = this.currentPlayer;
    if (!player) return;

    const text = this.add
      .bitmapText(player.x, player.y - 30, FONT, `+${amount}`, 8)
      .setTint(WIN_COLOUR)
      .setOrigin(0.5)
      .setDepth(Number.MAX_SAFE_INTEGER);

    this.tweens.add({
      targets: text,
      y: text.y - 16,
      alpha: 0,
      duration: 1200,
      ease: "Sine.easeOut",
      onComplete: () => text.destroy(),
    });
  }

  /** Colour every platform by the round's outcome. */
  private showPlatformResults(losingPlatforms: number[]) {
    this.platforms.forEach((platform, index) => {
      const lost = losingPlatforms.includes(index);
      const colour = lost ? LOSE_COLOUR : WIN_COLOUR;

      platform.setTint(colour);
      this.platformFrames[index]?.setStrokeStyle(2, colour).setVisible(true);
      // The label is the one thing players can't stand in front of
      this.platformLabels[index]?.setTextTint(colour);
    });
  }

  /** The choose phase just ended - move everyone and settle up. */
  private revealRound(round: LoveDilemmaRound) {
    const choices = this.getChoices(round);
    const result = resolveLoveDilemma(choices);
    const myKey = this.myChoiceKey;

    const filled = Array.from({ length: LOVE_DILEMMA_PLATFORMS }, () => 0);

    this.setPlatformsSolid(false);

    Object.entries(choices).forEach(([key, platform]) => {
      const spot = PLATFORM_SPOTS[platform];
      if (!spot) return;

      const entity =
        key === myKey ? this.currentPlayer : this.playerEntities[key];

      // Simulated players have no Bumpkin to move
      if (!entity) return;

      const offset = this.slotOffset(filled[platform]);
      filled[platform] += 1;

      this.placeOnPlatform(entity, spot.x + offset.x, spot.y + offset.y);

      if (isLoveDilemmaWinner({ platform, result })) {
        this.celebrate(entity);
      }
    });

    this.selectBox?.setVisible(false);

    if (!result.isVoid) {
      this.showPlatformResults(result.losingPlatforms);
    }

    // Ignore a pick outside 0..platforms-1 - the room is the only source of
    // `mine`, and an out-of-range value would otherwise read as a "win"
    const mine = choices[myKey];
    if (mine === undefined || !PLATFORM_SPOTS[mine]) return;

    if (result.isVoid) {
      this.currentPlayer?.speak(
        translateForBubble("loveDilemma.notEnoughPlayers"),
      );
      return;
    }

    const payouts = this.getPayouts(round);
    const won = isLoveDilemmaWinner({ platform: mine, result });
    // Capped to what's still claimable today so the event never rejects it
    const amount = won ? payouts[mine] : 0;

    // Every resolved round is recorded as a claim (0 on a loss) so the
    // attempts used today live in game state. The roundId makes a reload
    // during the reveal a no-op instead of a second claim.
    this.gameService?.send({
      type: "floatingIslandPrize.claimed",
      amount,
      game: "love_dilemma",
      roundId: round.roundId,
    });

    if (won) {
      this.showWinnings(amount);
    } else {
      this.currentPlayer?.speak(translateForBubble("loveDilemma.lost"));
    }
  }

  // ---------------------------------------------------------------------
  // Lover's Push
  // ---------------------------------------------------------------------

  createLovePush() {
    // The four squares in the middle of the clearing, on the ground under
    // everyone, with the tally floating above them
    this.pushSquares = this.add.graphics().setDepth(PUSH_GROUND_DEPTH);
    this.drawPushSquares([]);

    const top = Math.min(...LOVE_PUSH_TARGETS.map((t) => t.y));
    const centreX =
      (Math.min(...LOVE_PUSH_TARGETS.map((t) => t.x)) +
        Math.max(...LOVE_PUSH_TARGETS.map((t) => t.x)) +
        1) *
      (LOVE_ISLAND_TILE_PX / 2);
    this.pushSunkLabel = new Label(this, `0/${LOVE_PUSH_BOULDERS}`, "brown");
    this.add.existing(this.pushSunkLabel);
    this.pushSunkLabel
      .setPosition(centreX, top * LOVE_ISLAND_TILE_PX + PUSH_SUNK_LABEL_Y)
      .setDepth(Number.MAX_SAFE_INTEGER);

    // The squares are for the boulders: nobody gets to stand on them, so the
    // crowd can't block a square or hide the rocks sitting in it
    const squares = this.pushSquaresBounds();
    const squaresBlock = this.add.rectangle(
      squares.centerX,
      squares.centerY,
      squares.width,
      squares.height,
      0x000000,
      0,
    );
    this.physics.world.enable(squaresBlock);
    (squaresBlock.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    this.colliders?.add(squaresBlock);

    // Solid boulders in their own group so walking into one can push it
    const boulderGroup = this.add.group();

    for (let boulder = 0; boulder < LOVE_PUSH_BOULDERS; boulder++) {
      // Its base sits on the tile; depth is the base so players above it
      // are drawn behind and players below in front
      const sprite = this.add.sprite(0, 0, "push_boulder").setOrigin(0.5, 1);
      this.pushBoulders.push(sprite);

      const collider = this.add.rectangle(
        0,
        0,
        PUSH_COLLIDER_WIDTH,
        PUSH_COLLIDER_HEIGHT,
        0x000000,
        0,
      );
      collider.setData("boulder", boulder);
      this.physics.world.enable(collider);
      (collider.body as Phaser.Physics.Arcade.Body).setImmovable(true);
      boulderGroup.add(collider);
      this.pushColliders.push(collider);

      // Where it goes back to if it hits something
      this.pushStartMarkers.push(
        this.add.graphics().setDepth(PUSH_GROUND_DEPTH),
      );

      // An arrow per direction at the boulder's edge, shown while someone is
      // pushing it that way - the crowd may be split - each with a bar
      // beside it that fills as that direction's crowd grows
      const arrows = {} as Record<LovePushDirection, Phaser.GameObjects.Image>;
      const bars = {} as Record<LovePushDirection, Phaser.GameObjects.Graphics>;
      LOVE_PUSH_DIRECTIONS.forEach((direction) => {
        arrows[direction] = this.add
          .image(0, 0, PUSH_ARROW_TEXTURE[direction])
          .setVisible(false);
        bars[direction] = this.add.graphics().setVisible(false);
      });
      this.pushArrows.push(arrows);
      this.pushProgressBars.push(bars);
    }

    if (this.currentPlayer) {
      this.physics.add.collider(
        this.currentPlayer,
        boulderGroup,
        (_, collider) =>
          this.walkIntoBoulder(collider as Phaser.GameObjects.Rectangle),
      );
    }
  }

  /** Does the room run the puzzle, or are we simulating it locally? */
  private get remotePush() {
    const remote = this.mmoServer?.state?.lovePush;

    return remote && remote.boulders?.length === LOVE_PUSH_BOULDERS
      ? remote
      : undefined;
  }

  /** The current round, from the room when it has one, else simulated. */
  private getPushRound(now: number): LovePushRound {
    const remote = this.remotePush;

    if (remote) {
      const pushers: Record<string, number> = {};
      remote.pushers?.forEach((moves, farmId) => {
        pushers[farmId] = moves;
      });

      const solved = remote.solvedAt > 0;
      const tiles = (list: ArraySchema<number> | undefined) =>
        Array.from(list ?? [])
          .filter((index): index is number => typeof index === "number")
          .map(fromLovePushTileIndex);
      const boulders = tiles(remote.boulders);
      const starts = tiles(remote.starts);

      return {
        roundId: remote.roundId,
        boulders,
        // A room that doesn't publish starts: wherever we first saw them
        starts: boulders.map(
          (tile, index) =>
            starts[index] ??
            (this.renderedPushStarts[index]
              ? fromLovePushTileIndex(this.renderedPushStarts[index])
              : tile),
        ),
        sunk: boulders.map((_, index) => !!remote.sunk?.at(index)),
        resets: boulders.map((_, index) => remote.resets?.at(index) ?? 0),
        // Counts are published flat: boulder * 4 + direction
        pushes: boulders.map((_, index) => {
          const pushes: LovePushBoulderPushes = {};
          LOVE_PUSH_DIRECTIONS.forEach((direction, d) => {
            const count =
              remote.pushCounts?.at(index * LOVE_PUSH_DIRECTIONS.length + d) ??
              0;
            if (count > 0) pushes[direction] = count;
          });

          return pushes;
        }),
        pushers,
        solved,
        ...(solved
          ? { solvedAt: remote.solvedAt, nextRoundAt: remote.nextRoundAt }
          : {}),
      };
    }

    this.localPush = tickLovePushLocalRound({
      round: this.localPush ?? createLovePushLocalRound(now),
      now,
    });

    return this.localPush;
  }

  /** Boulders the local player has helped roll - local count or the room's. */
  private getMyPushMoves(round: LovePushRound): number {
    return Math.max(
      this.pushMoves[round.roundId] ?? 0,
      round.pushers[`${this.id}`] ?? 0,
    );
  }

  /**
   * The local player is pressing against a boulder. If they're walking
   * into it (not just standing there) their push goes on it the way
   * they're heading. The push stands until the boulder rolls, so it's only
   * sent again when they change sides - or now and then as a retry.
   */
  private walkIntoBoulder(collider: Phaser.GameObjects.Rectangle) {
    const player = this.currentPlayer;
    const body = player?.body as Phaser.Physics.Arcade.Body | undefined;
    const boulder = collider.getData("boulder") as number | undefined;

    if (!player || !body || boulder === undefined) return;
    if (this.movementAngle === undefined) return;

    const now = Date.now();
    const sincePush = now - (this.lastPushAt[boulder] ?? 0);
    if (sincePush < LOVE_PUSH_MOVE_MS) return;

    // Which side are we on? The bigger offset from the boulder decides
    const dx = collider.x - body.center.x;
    const dy = collider.y - body.center.y;
    const direction: LovePushDirection =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "east"
          : "west"
        : dy > 0
          ? "south"
          : "north";

    // ...and we have to be heading that way, not sliding past
    const delta = LOVE_PUSH_DELTAS[direction];
    const radians = (this.movementAngle * Math.PI) / 180;
    if (Math.cos(radians) * delta.x + Math.sin(radians) * delta.y <= 0) return;

    const round = this.getPushRound(now);

    if (round.solved) {
      if (now - this.lastPushBubbleAt > PUSH_BUBBLE_COOLDOWN_MS) {
        this.lastPushBubbleAt = now;
        player.speak(translateForBubble("lovePush.waitForNextPuzzle"));
      }
      return;
    }

    if (round.sunk[boulder]) return;

    // The room already has this push - only repeat it as a retry
    if (this.myPushes[boulder] === direction && sincePush < PUSH_RESEND_MS) {
      return;
    }

    this.lastPushAt[boulder] = now;
    // Remember which way we're pushing so we can credit ourselves when it goes
    this.myPushes[boulder] = direction;

    if (this.remotePush) {
      this.mmoServer?.send("lovePush.push", {
        roundId: round.roundId,
        boulder,
        direction,
      });
    } else if (this.localPush) {
      this.localPush = pushLovePushLocalRound({
        round: this.localPush,
        boulder,
        direction,
        farmId: `${this.id}`,
        now,
      });
    }
  }

  /** The world position a boulder's collider takes on a tile. */
  private pushColliderSpot(tile: LovePushTile): Coordinates {
    const centre = getLovePushTileCentre(tile);

    return { x: centre.x, y: centre.y + 1 };
  }

  /** The ground the four squares cover, in world px. */
  private pushSquaresBounds(): Phaser.Geom.Rectangle {
    const xs = LOVE_PUSH_TARGETS.map((t) => t.x);
    const ys = LOVE_PUSH_TARGETS.map((t) => t.y);
    const left = Math.min(...xs) * LOVE_ISLAND_TILE_PX;
    const top = Math.min(...ys) * LOVE_ISLAND_TILE_PX;

    return new Phaser.Geom.Rectangle(
      left,
      top,
      (Math.max(...xs) + 1) * LOVE_ISLAND_TILE_PX - left,
      (Math.max(...ys) + 1) * LOVE_ISLAND_TILE_PX - top,
    );
  }

  /**
   * A boulder's collider just landed on the local player. Arcade physics
   * won't separate two bodies that aren't moving, so nudge them out the
   * shortest way - never onto the squares, which are solid too.
   */
  private shoveOutOfBoulder(collider: Phaser.GameObjects.Rectangle) {
    const player = this.currentPlayer;
    const body = player?.body as Phaser.Physics.Arcade.Body | undefined;
    if (!player || !body) return;

    const bounds = collider.getBounds();
    const halfWidth = body.width / 2;
    const halfHeight = body.height / 2;
    // The body (the feet) sits below the middle of the bumpkin
    const feet = { x: body.center.x - player.x, y: body.center.y - player.y };
    const footprint = (centre: Coordinates) =>
      new Phaser.Geom.Rectangle(
        centre.x - halfWidth,
        centre.y - halfHeight,
        body.width,
        body.height,
      );
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(
        bounds,
        footprint(body.center),
      )
    ) {
      return;
    }

    // Where the feet would end up nudged out each side, nearest first
    const spots: Coordinates[] = [
      { x: bounds.left - halfWidth - 1, y: body.center.y },
      { x: bounds.right + halfWidth + 1, y: body.center.y },
      { x: body.center.x, y: bounds.top - halfHeight - 1 },
      { x: body.center.x, y: bounds.bottom + halfHeight + 1 },
    ].sort(
      (a, b) =>
        Phaser.Math.Distance.Between(body.center.x, body.center.y, a.x, a.y) -
        Phaser.Math.Distance.Between(body.center.x, body.center.y, b.x, b.y),
    );
    const squares = this.pushSquaresBounds();
    const spot =
      spots.find(
        (candidate) =>
          !Phaser.Geom.Intersects.RectangleToRectangle(
            squares,
            footprint(candidate),
          ),
      ) ?? spots[0];
    if (!spot) return;

    this.placeOnPlatform(player, spot.x - feet.x, spot.y - feet.y);
  }

  /** Put a boulder (and its collider) straight onto a tile, in play. */
  private placeBoulder(boulder: number, tile: LovePushTile) {
    const sprite = this.pushBoulders[boulder];
    const collider = this.pushColliders[boulder];
    if (!sprite || !collider) return;

    const centre = getLovePushTileCentre(tile);
    const base = centre.y + LOVE_ISLAND_TILE_PX / 2 - 1;

    this.tweens.killTweensOf(sprite);
    sprite
      .setPosition(centre.x, base)
      .setDepth(base)
      .setScale(1)
      .setAlpha(1)
      .setVisible(true);

    const spot = this.pushColliderSpot(tile);
    collider.setPosition(spot.x, spot.y);
    const body = collider.body as Phaser.Physics.Arcade.Body | undefined;
    body?.reset(spot.x, spot.y);
    if (body) body.enable = true;

    this.shoveOutOfBoulder(collider);
  }

  /** Roll a boulder to its new tile, shoving the local player out if they're in the way. */
  private slideBoulder(boulder: number, to: LovePushTile) {
    const sprite = this.pushBoulders[boulder];
    const collider = this.pushColliders[boulder];
    if (!sprite || !collider) return;

    const centre = getLovePushTileCentre(to);
    const base = centre.y + LOVE_ISLAND_TILE_PX / 2 - 1;

    this.tweens.killTweensOf(sprite);
    this.tweens.add({
      targets: sprite,
      x: centre.x,
      y: base,
      duration: LOVE_PUSH_MOVE_MS,
      ease: "Quad.easeOut",
      // Keep the depth in step with the base as it rolls, so a player
      // walking into the vacated tile isn't drawn beneath the boulder.
      onUpdate: () => sprite.setDepth(sprite.y),
      onComplete: () => sprite.setDepth(base),
    });
    this.sound.play("dig", { volume: 0.05 });

    const spot = this.pushColliderSpot(to);
    collider.setPosition(spot.x, spot.y);
    (collider.body as Phaser.Physics.Arcade.Body | undefined)?.reset(
      spot.x,
      spot.y,
    );

    this.shoveOutOfBoulder(collider);
  }

  /**
   * The boulder hit something: it bursts where it was - a flash and a spray
   * of rubble - then a fresh one appears at its new start with a bounce.
   */
  private resetBoulder(boulder: number, start: LovePushTile) {
    const sprite = this.pushBoulders[boulder];
    if (!sprite) return;

    this.sound.play("dig", { volume: 0.1 });
    this.tweens.killTweensOf(sprite);
    this.explode(sprite.x, sprite.y - LOVE_ISLAND_TILE_PX / 2);
    sprite.setTint(LOSE_COLOUR);

    this.tweens.add({
      targets: sprite,
      alpha: 0,
      scale: 1.3,
      duration: 120,
      ease: "Quad.easeOut",
      onComplete: () => {
        sprite.clearTint();
        this.placeBoulder(boulder, start);
        sprite.setScale(0.4);
        this.tweens.add({
          targets: sprite,
          scale: 1,
          duration: 300,
          delay: 200,
          ease: "Back.easeOut",
        });
      },
    });
  }

  /** A little explosion: a flash ring and chips of rock flying out. */
  private explode(x: number, y: number) {
    const depth = y + LOVE_ISLAND_TILE_PX + 1;

    const flash = this.add
      .circle(x, y, 4, PUSH_EXPLOSION_COLOUR, 0.9)
      .setDepth(depth);
    this.tweens.add({
      targets: flash,
      scale: 4,
      alpha: 0,
      duration: 260,
      ease: "Quad.easeOut",
      onComplete: () => flash.destroy(),
    });

    for (let i = 0; i < PUSH_EXPLOSION_CHIPS; i++) {
      const angle = (i / PUSH_EXPLOSION_CHIPS) * Math.PI * 2;
      const distance = Phaser.Math.Between(10, 22);
      const colour =
        i % 3 === 0
          ? PUSH_EXPLOSION_COLOUR
          : PUSH_BURST_COLOURS[i % PUSH_BURST_COLOURS.length];
      const chip = this.add
        .rectangle(x, y, i % 2 === 0 ? 3 : 2, i % 2 === 0 ? 3 : 2, colour)
        .setDepth(depth);

      this.tweens.add({
        targets: chip,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance * 0.7 + Phaser.Math.Between(0, 6),
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(320, 520),
        ease: "Quad.easeOut",
        onComplete: () => chip.destroy(),
      });
    }
  }

  /** The rock just parked in a square: it settles with a bounce; the square turns green. */
  private parkBoulder(boulder: number) {
    const sprite = this.pushBoulders[boulder];
    if (!sprite) return;

    this.sound.play("reveal", { volume: 0.06 });
    this.time.delayedCall(LOVE_PUSH_MOVE_MS, () => {
      sprite.setScale(1.3);
      this.tweens.add({
        targets: sprite,
        scale: 1,
        duration: 260,
        ease: "Back.easeOut",
      });
    });
  }

  /** The four squares, the taken ones filled green. */
  private drawPushSquares(taken: LovePushTile[]) {
    const squares = this.pushSquares;
    if (!squares) return;

    squares.clear();
    LOVE_PUSH_TARGETS.forEach((target) => {
      const isTaken = taken.some(
        (tile) => tile.x === target.x && tile.y === target.y,
      );
      const x = target.x * LOVE_ISLAND_TILE_PX;
      const y = target.y * LOVE_ISLAND_TILE_PX;

      squares.fillStyle(
        isTaken ? PUSH_SQUARE_TAKEN : PUSH_SQUARE_FILL,
        isTaken ? 0.35 : 0.15,
      );
      squares.fillRect(
        x + 1,
        y + 1,
        LOVE_ISLAND_TILE_PX - 2,
        LOVE_ISLAND_TILE_PX - 2,
      );
      squares.lineStyle(
        1,
        isTaken ? PUSH_SQUARE_TAKEN : PUSH_SQUARE_COLOUR,
        0.8,
      );
      squares.strokeRect(
        x + 0.5,
        y + 0.5,
        LOVE_ISLAND_TILE_PX - 1,
        LOVE_ISLAND_TILE_PX - 1,
      );
    });
  }

  /** Mark where a boulder started from. */
  private drawPushStartMarker(boulder: number, tile: LovePushTile) {
    const marker = this.pushStartMarkers[boulder];
    if (!marker) return;

    const centre = getLovePushTileCentre(tile);
    marker.clear();
    marker.lineStyle(1, PUSH_START_COLOUR, 0.6);
    marker.strokeEllipse(centre.x, centre.y + 2, 12, 7);
  }

  private drawPushStartMarkers(starts: LovePushTile[]) {
    starts.forEach((tile, boulder) => this.drawPushStartMarker(boulder, tile));
  }

  /** The tally at the pit - pops when another boulder drops in. */
  private setSunkCount(count: number, grew: boolean) {
    const label = this.pushSunkLabel;
    if (!label) return;

    label.setText(`${count}/${LOVE_PUSH_BOULDERS}`);

    if (grew) {
      this.tweens.killTweensOf(label);
      label.setScale(1.5);
      this.tweens.add({
        targets: label,
        scale: 1,
        duration: 220,
        ease: "Back.easeOut",
      });
    }
  }

  updateLovePush() {
    const now = Date.now();
    const round = this.getPushRound(now);

    // Fresh boulders - snap everything into place
    if (this.pushRoundId !== round.roundId) {
      this.pushRoundId = round.roundId;
      this.sawPushUnsolved = false;
      this.myPushes = {};
      this.lastPushAt = {};
      this.renderedPushes = [];
      this.renderedSunk = [];
      this.renderedResets = [];
      // Pushes left standing on other boulders when the round was solved
      // don't carry over - nor do their arrows
      this.hidePushProgress();
      round.boulders.forEach((tile, boulder) => {
        this.pushBoulders[boulder]?.clearTint();
        this.placeBoulder(boulder, tile);
      });
      this.renderedPushTiles = round.boulders.map(toLovePushTileIndex);
      this.renderedPushStarts = round.starts.map(toLovePushTileIndex);
      this.drawPushStartMarkers(round.starts);
    } else {
      round.boulders.forEach((tile, boulder) => {
        const index = toLovePushTileIndex(tile);
        const rendered = this.renderedPushTiles[boulder];
        const resets = round.resets[boulder] ?? 0;
        const wasReset = resets > (this.renderedResets[boulder] ?? 0);
        const justSunk = !!round.sunk[boulder] && !this.renderedSunk[boulder];

        if (rendered === index && !wasReset && !justSunk) return;

        this.renderedPushTiles[boulder] = index;
        this.renderedResets[boulder] = resets;
        const from = fromLovePushTileIndex(rendered);
        const mine = this.myPushes[boulder];

        if (wasReset) {
          // It hit something and comes back somewhere new. Nobody is
          // credited, and a push of ours on it is spent
          this.resetBoulder(boulder, round.starts[boulder] ?? tile);
          if (mine && now - this.lastPushBubbleAt > PUSH_BUBBLE_COOLDOWN_MS) {
            this.lastPushBubbleAt = now;
            this.currentPlayer?.speak(translateForBubble("lovePush.reset"));
          }
        } else {
          if (rendered !== index) this.slideBoulder(boulder, tile);
          if (justSunk) {
            this.renderedSunk[boulder] = true;
            this.parkBoulder(boulder);
          }
        }

        // It rolled, so every push on it is spent. Credit ourselves if it
        // went the way we were pushing (the room's `pushers` is the
        // authority - this covers the gap until it lands)
        if (mine) {
          const delta = LOVE_PUSH_DELTAS[mine];
          if (
            !wasReset &&
            tile.x - from.x === delta.x &&
            tile.y - from.y === delta.y
          ) {
            this.pushMoves[round.roundId] =
              (this.pushMoves[round.roundId] ?? 0) + 1;
          }
          delete this.myPushes[boulder];
        }
      });
    }

    // A crash hands a boulder a fresh start - move its ring
    round.starts.forEach((start, boulder) => {
      const index = toLovePushTileIndex(start);
      if (this.renderedPushStarts[boulder] === index) return;

      this.renderedPushStarts[boulder] = index;
      this.drawPushStartMarker(boulder, start);
    });

    const sunkCount = getLovePushSunkCount(round.sunk);
    if (this.renderedSunkCount !== sunkCount) {
      const grew = (this.renderedSunkCount ?? 0) < sunkCount;
      this.renderedSunkCount = sunkCount;
      this.setSunkCount(sunkCount, grew);
      this.drawPushSquares(
        round.boulders.filter((_, boulder) => round.sunk[boulder]),
      );
    }

    round.pushes.forEach((pushes, boulder) => {
      const rendered = this.renderedPushes[boulder] ?? {};
      if (
        LOVE_PUSH_DIRECTIONS.every(
          (direction) =>
            (rendered[direction] ?? 0) === (pushes[direction] ?? 0),
        )
      ) {
        return;
      }

      this.renderedPushes[boulder] = pushes;
      this.tintPushBoulder(boulder);
      this.setPushProgress(boulder, pushes, round.boulders[boulder], rendered);
    });

    if (!round.solved) {
      this.sawPushUnsolved = true;
    } else if (this.solvedPushRoundId !== round.roundId) {
      this.solvedPushRoundId = round.roundId;
      this.solvePush(round, this.sawPushUnsolved);
    }
  }

  /**
   * A love rock keeps its colour: the arrows and bars show the crowd, and a
   * green square shows it's parked. Only a crash tints it, for a moment.
   */
  private tintPushBoulder(boulder: number) {
    this.pushBoulders[boulder]?.clearTint();
  }

  /** Take every arrow and bar off the island. */
  private hidePushProgress() {
    this.pushArrows.forEach((arrows, boulder) => {
      LOVE_PUSH_DIRECTIONS.forEach((direction) => {
        const arrow = arrows[direction];
        this.tweens.killTweensOf(arrow);
        arrow.setVisible(false);
        this.pushProgressBars[boulder]?.[direction].setVisible(false);
      });
    });
  }

  /**
   * Show which ways a boulder is being pushed - an arrow per direction just
   * past the boulder's edge on that side, half size on the first push and
   * growing as that crowd fills up - and how close each is, as a bar on the
   * far side of the arrow. An arrow goes away once nobody is pushing that
   * way (or the boulder has rolled).
   */
  private setPushProgress(
    boulder: number,
    pushes: LovePushBoulderPushes,
    tile: LovePushTile,
    previous: LovePushBoulderPushes,
  ) {
    const arrows = this.pushArrows[boulder];
    const bars = this.pushProgressBars[boulder];
    if (!arrows || !bars) return;

    LOVE_PUSH_DIRECTIONS.forEach((direction) => {
      const arrow = arrows[direction];
      const bar = bars[direction];
      const count = pushes[direction] ?? 0;

      if (count <= 0) {
        this.tweens.killTweensOf(arrow);
        arrow.setVisible(false);
        bar.setVisible(false);
        return;
      }

      const delta = LOVE_PUSH_DELTAS[direction];
      const centre = getLovePushTileCentre(tile);
      const at = {
        x: centre.x + delta.x * PUSH_ARROW_OFFSET,
        y: centre.y + delta.y * PUSH_ARROW_OFFSET,
      };
      const progress = Math.min(1, count / LOVE_PUSH_PUSHERS_NEEDED);
      // Half size for one push, full size for the whole crowd
      const scale =
        LOVE_PUSH_PUSHERS_NEEDED > 1
          ? PUSH_ARROW_MIN_SCALE +
            ((1 - PUSH_ARROW_MIN_SCALE) * (count - 1)) /
              (LOVE_PUSH_PUSHERS_NEEDED - 1)
          : 1;

      arrow
        .setPosition(at.x, at.y)
        // Just above the boulder it belongs to, so it reads over the rock's edge
        .setDepth(centre.y + LOVE_ISLAND_TILE_PX / 2 + 1)
        .setVisible(true);

      // Pop when someone joins this way
      this.tweens.killTweensOf(arrow);
      if (count > (previous[direction] ?? 0)) {
        arrow.setScale(scale * 1.4);
        this.tweens.add({
          targets: arrow,
          scale,
          duration: 180,
          ease: "Back.easeOut",
        });
      } else {
        arrow.setScale(scale);
      }

      const fill = Math.round((PUSH_PROGRESS_WIDTH - 2) * progress);
      bar.clear();
      bar.fillStyle(PUSH_PROGRESS_TRACK, 1);
      bar.fillRect(0, 0, PUSH_PROGRESS_WIDTH, PUSH_PROGRESS_HEIGHT);
      bar.fillStyle(PUSH_PROGRESS_COLOUR, 1);
      bar.fillRect(1, 1, fill, PUSH_PROGRESS_HEIGHT - 2);
      // Under the arrow - except a north arrow, whose underside is the
      // boulder, so its bar goes above
      const barY =
        direction === "north"
          ? at.y - PUSH_PROGRESS_Y - PUSH_PROGRESS_HEIGHT
          : at.y + PUSH_PROGRESS_Y;
      bar
        .setPosition(at.x - PUSH_PROGRESS_WIDTH / 2, barY)
        .setDepth(arrow.depth)
        .setVisible(true);
    });
  }

  /** The last square was just taken - celebrate and settle up. */
  private solvePush(round: LovePushRound, animate: boolean) {
    const now = Date.now();
    const player = this.currentPlayer;

    if (animate) {
      this.sound.play("reveal", { volume: 0.1 });
      this.tweens.add({
        targets: this.pushBoulders,
        alpha: 0.3,
        duration: 200,
        yoyo: true,
        repeat: 3,
      });
    }

    if (!player) return;

    // Only those who helped roll a boulder are paid - and only once a day
    const myMoves = this.getMyPushMoves(round);
    if (myMoves <= 0) return;

    const state = this.freshState;

    if (!canClaimLovePush({ state, myMoves, roundId: round.roundId, now })) {
      if (hasClaimedLovePushToday({ state, now })) {
        player.speak(translateForBubble("lovePush.alreadyClaimed"));
      }
      return;
    }

    // The prize is an item, not Love Charms - the event pays the box and
    // records the claim as worth 0, so the day's Love Charm budget is
    // untouched. The roundId makes a reload mid-celebration a no-op rather
    // than a second claim.
    this.gameService?.send({
      type: "floatingIslandPrize.claimed",
      amount: 0,
      game: "love_push",
      roundId: round.roundId,
    });

    this.celebrate(player);
    player.speak(translateForBubble("lovePush.prize"));
  }

  // ---------------------------------------------------------------------
  // Love Boulder
  // ---------------------------------------------------------------------

  createLoveBoulder() {
    const { x, y } = BOULDER_SPOT;

    // Depth is its base so players walking below it are drawn in front
    this.boulder = this.add
      .sprite(x, y, "boulder")
      .setDepth(y + BOULDER_HEIGHT / 2);

    this.boulder
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.hitBoulder());

    // Solid, with clear ground around it - you mine it from its edge, so the
    // crowd can't pile onto the rock and hide it
    const collider = this.add.rectangle(
      x,
      y,
      BOULDER_WIDTH + BOULDER_BUFFER * 2,
      BOULDER_HEIGHT + BOULDER_BUFFER * 2,
      0x000000,
      0,
    );
    this.physics.world.enable(collider);
    (collider.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    this.colliders?.add(collider);

    // Just the number, on a label so it reads over the cliff art
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch = (this.add as any).rexNinePatch2({
      x: 0,
      y: LABEL_HEIGHT / 2 - 2,
      width: LABEL_PADDING,
      height: LABEL_HEIGHT,
      key: "label",
      columns: [3, 3, 3],
      rows: [3, 3, 3],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });
    this.boulderHitsPatch = patch;
    this.boulderHitsText = this.add.bitmapText(0, 1, FONT, "", 5);
    this.boulderHitsLabel = this.add
      .container(x, BOULDER_LABEL_Y, [patch, this.boulderHitsText])
      .setDepth(Number.MAX_SAFE_INTEGER);

    // Health bar under the rock, always drawn over the crowd
    this.boulderHealthBar = this.add
      .graphics({ x: x - HEALTH_BAR_WIDTH / 2, y: HEALTH_BAR_Y })
      .setDepth(Number.MAX_SAFE_INTEGER);

    // The prize, sitting on the rubble for a few seconds once it cracks -
    // the same label style as the Dilemma platforms, but clickable. Built
    // with the floor; the room's roll for the day replaces it on sync.
    this.refreshBoulderReward(LOVE_BOULDER_PRIZE);
  }

  /**
   * The prize label on the rubble - the day's box or coin purse with its
   * icon - rebuilt whenever the prize changes (a label's width and icon are
   * fixed at creation, and "+500" is wider than "+1"). Hidden until the
   * boulder cracks; `updateLoveBoulder` shows it.
   */
  private refreshBoulderReward(prize: LoveBoulderPrize) {
    const key = getLoveBoulderPrizeKey(prize);
    if (this.boulderRewardPrize === key && this.boulderReward) return;

    const { x, y } = BOULDER_SPOT;
    const previous = this.boulderReward;
    const visible = previous?.visible ?? false;
    const rewardY = previous?.y ?? y - 4;

    if (previous) {
      this.tweens.killTweensOf(previous);
      previous.destroy();
    }

    const icon = boulderPrizeTexture(
      prize.type === "coins" ? LOVE_BOULDER_COINS_PRIZE : prize.item,
    );
    const reward = new Label(this, `+${prize.amount}`, "grey", icon);
    reward
      .setPosition(x, rewardY)
      .setDepth(Number.MAX_SAFE_INTEGER)
      .setVisible(visible)
      .setSize(REWARD_HIT_WIDTH, REWARD_HIT_HEIGHT)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.claimBoulderReward());
    this.add.existing(reward);

    this.boulderReward = reward;
    this.boulderRewardPrize = key;

    // Keep bobbing if the prize was already on show when it changed
    if (visible) this.bobBoulderReward();
  }

  /** The prize label's idle bob while it waits to be clicked. */
  private bobBoulderReward() {
    if (!this.boulderReward) return;

    this.tweens.killTweensOf(this.boulderReward);
    this.boulderReward.setY(BOULDER_SPOT.y - 4);
    this.tweens.add({
      targets: this.boulderReward,
      y: BOULDER_SPOT.y - 8,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  /** Does the room run the boulder, or are we simulating it locally? */
  private get remoteBoulder() {
    const remote = this.mmoServer?.state?.loveBoulder;

    return remote && remote.hits > 0 ? remote : undefined;
  }

  /** The current boulder, from the room when it has one, else simulated. */
  private getBoulderRound(now: number): LoveBoulderRound {
    const remote = this.remoteBoulder;

    if (remote) {
      const broken = remote.brokenAt > 0;

      return {
        roundId: remote.roundId,
        hits: remote.hits,
        // Hits we've sent come off straight away; the room catches up
        hitsRemaining: broken
          ? 0
          : Math.max(1, remote.hitsRemaining - this.pendingBoulderHits),
        broken,
        ...(broken
          ? { brokenAt: remote.brokenAt, respawnAt: remote.respawnAt }
          : {}),
        // A room that predates the daily roll publishes nothing - the stand-in then
        prize: fromLoveBoulderRoomPrize({
          prize: remote.prize,
          amount: remote.prizeAmount,
        }),
      };
    }

    this.localBoulder = tickLoveBoulderLocalRound({
      round: this.localBoulder ?? createLoveBoulderLocalRound(now),
      now,
    });

    return this.localBoulder;
  }

  /** Hits the local player landed on this boulder - local count or the room's. */
  private getMyBoulderHits(roundId: number): number {
    const local = this.boulderHits[roundId] ?? 0;
    const remote = this.remoteBoulder?.miners?.get(`${this.id}`) ?? 0;

    return Math.max(local, remote);
  }

  private hitBoulder() {
    const now = Date.now();
    const round = this.getBoulderRound(now);
    const player = this.currentPlayer;

    if (!this.boulder || !player || round.broken) return;

    if (!this.checkDistanceToSprite(this.boulder, BOULDER_REACH)) {
      player.speak(translateForBubble("base.iam.far.away"));
      return;
    }

    if (now - this.lastBoulderHitAt < LOVE_BOULDER_HIT_COOLDOWN_MS) return;
    this.lastBoulderHitAt = now;

    this.boulderHits[round.roundId] =
      (this.boulderHits[round.roundId] ?? 0) + 1;

    if (this.remoteBoulder) {
      this.pendingBoulderHits += 1;
      this.mmoServer?.send("loveBoulder.hit", { roundId: round.roundId });
    } else if (this.localBoulder) {
      this.localBoulder = {
        ...this.localBoulder,
        hitsRemaining: this.localBoulder.hitsRemaining - 1,
      };
    }

    if (player.x < BOULDER_SPOT.x) {
      player.faceRight();
    } else {
      player.faceLeft();
    }

    this.playBoulderHit();
  }

  /** Shake, a few chips of rubble and a clink for every hit. */
  private playBoulderHit() {
    const boulder = this.boulder;
    if (!boulder) return;

    this.tweens.killTweensOf(boulder);
    boulder.setPosition(BOULDER_SPOT.x, BOULDER_SPOT.y);
    this.tweens.add({
      targets: boulder,
      x: BOULDER_SPOT.x + 1,
      duration: 40,
      yoyo: true,
      repeat: 1,
      onComplete: () => boulder.setX(BOULDER_SPOT.x),
    });

    this.spawnRubble(3, 10);
    this.boulderHealthFlashUntil = Date.now() + HEALTH_BAR_FLASH_MS;
    this.sound.play("dig", { volume: 0.05 });
  }

  /** Pixel chips flying off the boulder. */
  private spawnRubble(count: number, spread: number) {
    for (let i = 0; i < count; i++) {
      const colour = RUBBLE_COLOURS[i % RUBBLE_COLOURS.length];
      const chip = this.add
        .rectangle(
          BOULDER_SPOT.x + Phaser.Math.Between(-4, 4),
          BOULDER_SPOT.y + Phaser.Math.Between(-4, 4),
          2,
          2,
          colour,
        )
        .setDepth(BOULDER_SPOT.y + BOULDER_HEIGHT);

      this.tweens.add({
        targets: chip,
        x: chip.x + Phaser.Math.Between(-spread, spread),
        y: chip.y + Phaser.Math.Between(-spread, spread / 2),
        alpha: 0,
        duration: Phaser.Math.Between(250, 450),
        ease: "Quad.easeOut",
        onComplete: () => chip.destroy(),
      });
    }
  }

  updateLoveBoulder() {
    const now = Date.now();
    const remote = this.remoteBoulder;

    // Hits we sent count as pending until the room's count moves
    if (remote && remote.hitsRemaining !== this.lastRemoteBoulderHits) {
      const previous = this.lastRemoteBoulderHits;
      this.lastRemoteBoulderHits = remote.hitsRemaining;

      if (previous !== undefined) {
        this.pendingBoulderHits = Math.max(
          0,
          this.pendingBoulderHits - (previous - remote.hitsRemaining),
        );
      }
    }

    const round = this.getBoulderRound(now);

    // Fresh boulder
    if (this.boulderRoundId !== round.roundId) {
      this.boulderRoundId = round.roundId;
      this.pendingBoulderHits = 0;
      this.sawBoulderStanding = false;
      this.tweens.killTweensOf(this.boulder ?? []);
      this.boulder?.setPosition(BOULDER_SPOT.x, BOULDER_SPOT.y);
      this.boulder?.setAlpha(1).setVisible(true);
    }

    if (!round.broken) {
      this.sawBoulderStanding = true;
    } else if (this.brokenBoulderRoundId !== round.roundId) {
      this.brokenBoulderRoundId = round.roundId;
      this.breakBoulder(this.sawBoulderStanding);
    }

    this.setBoulderHits(round.broken ? undefined : round.hitsRemaining);
    this.setBoulderHealth(round, now);

    // The prize sits there until the window closes or we've taken it
    const rewardOpen =
      isLoveBoulderRewardOpen({ round, now }) &&
      this.claimedBoulderRoundId !== round.roundId &&
      !hasClaimedLoveBoulderRound({
        state: this.freshState,
        roundId: round.roundId,
        now,
      });

    // The day's roll, as the room publishes it
    this.refreshBoulderReward(round.prize);

    if (this.boulderReward && this.boulderReward.visible !== rewardOpen) {
      this.boulderReward.setVisible(rewardOpen);
      this.tweens.killTweensOf(this.boulderReward);
      this.boulderReward.setY(BOULDER_SPOT.y - 4);

      if (rewardOpen) this.bobBoulderReward();
    }
  }

  /** Hit count in its label, hidden while the boulder is broken. */
  private setBoulderHits(hits?: number) {
    const label = this.boulderHitsLabel;
    const text = this.boulderHitsText;
    if (!label || !text) return;

    if (hits === undefined) {
      label.setVisible(false);
      return;
    }

    const value = hits.toLocaleString("en-US");
    if (text.text !== value) {
      text.setText(value);
      // Same fit as `containers/Label.ts`
      const textWidth = value.length * LABEL_CHAR_WIDTH - 1;
      text.setX(-textWidth / 2);
      this.boulderHitsPatch?.resize(textWidth + LABEL_PADDING, LABEL_HEIGHT);
    }

    label.setVisible(true);
  }

  /**
   * Health bar under the boulder, hidden while it's broken. The fill is whole
   * pixels, and stays at least one wide until the room says it has cracked.
   * Each of your own taps flashes the fill so every hit registers, even when
   * it isn't enough to move the bar a pixel.
   */
  private setBoulderHealth(round: LoveBoulderRound, now: number) {
    const bar = this.boulderHealthBar;
    if (!bar) return;

    if (round.broken) {
      bar.setVisible(false);
      this.boulderHealthFill = undefined;
      return;
    }

    const fill = Math.max(
      1,
      Math.min(
        HEALTH_BAR_INNER_WIDTH,
        Math.ceil(
          (HEALTH_BAR_INNER_WIDTH * round.hitsRemaining) /
            Math.max(1, round.hits),
        ),
      ),
    );
    const flashing = now < this.boulderHealthFlashUntil;

    if (
      fill !== this.boulderHealthFill ||
      flashing !== this.boulderHealthFlashing
    ) {
      this.boulderHealthFill = fill;
      this.boulderHealthFlashing = flashing;
      bar.clear();
      bar.fillStyle(HEALTH_BAR_TRACK, 1);
      bar.fillRect(0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
      bar.fillStyle(flashing ? HEALTH_BAR_FLASH : HEALTH_BAR_FILL, 1);
      bar.fillRect(1, 1, fill, HEALTH_BAR_HEIGHT - 2);
    }

    bar.setVisible(true);
  }

  /** The boulder just cracked - shatter it and leave the prize on the rubble. */
  private breakBoulder(animate: boolean) {
    const boulder = this.boulder;

    if (boulder && animate) {
      this.spawnRubble(14, 22);
      this.sound.play("reveal", { volume: 0.1 });
      this.tweens.add({
        targets: boulder,
        alpha: 0,
        duration: 300,
        onComplete: () => boulder.setVisible(false),
      });
    } else {
      boulder?.setVisible(false);
    }
  }

  /** The local player clicked the prize on the rubble. */
  private claimBoulderReward() {
    const now = Date.now();
    const round = this.getBoulderRound(now);
    const player = this.currentPlayer;

    if (!this.boulder || !player) return;
    if (!isLoveBoulderRewardOpen({ round, now })) return;

    if (!this.checkDistanceToSprite(this.boulder, BOULDER_REACH)) {
      player.speak(translateForBubble("base.iam.far.away"));
      return;
    }

    const state = this.freshState;
    const myHits = this.getMyBoulderHits(round.roundId);

    if (myHits <= 0) {
      player.speak(translateForBubble("loveBoulder.didNotHelp"));
      return;
    }

    if (!canClaimLoveBoulder({ state, myHits, roundId: round.roundId, now })) {
      if (hasClaimedLoveBoulderToday({ state, now })) {
        player.speak(translateForBubble("loveBoulder.alreadyClaimed"));
      }
      return;
    }

    // The prize is a box or coins, never Love Charms - the server rolls it
    // for the day and pays it, recording the claim as worth 0 so the day's
    // Love Charm budget is untouched. The roundId makes a reload mid-window a
    // no-op instead of a second claim.
    this.gameService?.send({
      type: "floatingIslandPrize.claimed",
      amount: 0,
      game: "love_boulder",
      roundId: round.roundId,
    });

    this.claimedBoulderRoundId = round.roundId;

    const { prize } = round;
    player.cheer();
    player.speak(
      prize.type === "coins"
        ? translateForBubble("loveBoulder.prizeCoins", { amount: prize.amount })
        : translateForBubble("loveBoulder.prizeItem", { item: prize.item }),
    );
  }

  // ---------------------------------------------------------------------
  // Love Marvel (the lake)
  // ---------------------------------------------------------------------

  createLoveKraken() {
    const { x, y } = KRAKEN_SPOT;

    // Placed by their top-left corner at native size, so every pixel sits on
    // a map pixel. Nothing here is scaled, rotated or tweened - the beast is
    // part of the scenery, and the ring is the only thing that moves.
    // Tentacles first, so the head sits in front of them.
    this.krakenTentacles = KRAKEN_TENTACLES.map((spot) =>
      this.add
        .sprite(spot.x, spot.y, "kraken_tentacle")
        .setOrigin(0, 0)
        .setDepth(spot.y + KRAKEN_TENTACLE_HEIGHT),
    );

    this.kraken = this.add
      .sprite(KRAKEN_HEAD.x, KRAKEN_HEAD.y, "kraken_head")
      .setOrigin(0, 0)
      .setDepth(KRAKEN_HEAD.y + KRAKEN_HEAD_HEIGHT + 1);

    // The ring's track never changes, so it is drawn once here. The zone
    // moves on every reel you land, so it gets its own layer that
    // `setKrakenZone` redraws.
    const ring = this.add
      .graphics({ x, y })
      .setDepth(Number.MAX_SAFE_INTEGER - 3);

    ring.lineStyle(
      KRAKEN_RING_WIDTH,
      KRAKEN_RING_TRACK,
      KRAKEN_RING_TRACK_ALPHA,
    );
    ring.beginPath();
    ring.arc(0, 0, KRAKEN_RING_RADIUS, 0, Math.PI * 2);
    ring.strokePath();

    this.krakenRing = ring;

    this.krakenZone = this.add
      .graphics({ x, y })
      .setDepth(Number.MAX_SAFE_INTEGER - 2);

    this.krakenMarker = this.add
      .circle(
        x,
        y - KRAKEN_RING_RADIUS,
        KRAKEN_MARKER_RADIUS,
        KRAKEN_MARKER_COLOUR,
      )
      .setDepth(Number.MAX_SAFE_INTEGER - 1);

    // The island's progress bar, always drawn over the crowd
    this.krakenBar = this.add
      .graphics({ x: x - KRAKEN_BAR_WIDTH / 2, y: KRAKEN_BAR_Y })
      .setDepth(Number.MAX_SAFE_INTEGER);

    // The disc marking the spot, and the whole ring, cast and reel
    this.krakenDisc = this.add
      .sprite(x, KRAKEN_DISC_Y, "fishing_disc")
      .setDepth(Number.MAX_SAFE_INTEGER);
    this.krakenDisc
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.castOrReelKraken());

    // Clicking anywhere in the ring reels - a moving marker is no fun to
    // chase with the mouse, and the ring is where everyone is looking
    this.add
      .rectangle(
        x,
        y,
        KRAKEN_RING_RADIUS * 2 + 8,
        KRAKEN_RING_RADIUS * 2 + 8,
        0x000000,
        0,
      )
      .setDepth(Number.MAX_SAFE_INTEGER - 3)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.castOrReelKraken());

    // The prize, floating over the Marvel once it is landed. Built with the
    // stand-in's prize; the room's roll for the day replaces it on sync.
    this.refreshKrakenReward(LOVE_KRAKEN_PRIZE);
  }

  /**
   * The prize label over the landed Marvel - the day's box or coin purse
   * with its icon - rebuilt whenever the prize changes (a label's width and
   * icon are fixed at creation). Hidden until it is caught.
   */
  private refreshKrakenReward(prize: LoveKrakenPrize) {
    const key = getLoveKrakenPrizeKey(prize);
    if (this.krakenRewardPrize === key && this.krakenReward) return;

    const previous = this.krakenReward;
    const visible = previous?.visible ?? false;

    if (previous) {
      this.tweens.killTweensOf(previous);
      previous.destroy();
    }

    const icon = krakenPrizeTexture(
      prize.type === "coins" ? LOVE_KRAKEN_COINS_PRIZE : prize.item,
    );
    const reward = new Label(this, `+${prize.amount}`, "grey", icon);
    reward
      .setPosition(KRAKEN_SPOT.x, this.krakenRewardY)
      .setDepth(Number.MAX_SAFE_INTEGER)
      .setVisible(visible)
      .setSize(REWARD_HIT_WIDTH, REWARD_HIT_HEIGHT)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.claimKrakenReward({ automatic: false }));
    this.add.existing(reward);

    this.krakenReward = reward;
    this.krakenRewardPrize = key;

    if (visible) this.bobKrakenReward();
  }

  /** Where the prize floats - above the head, clear of the ring. */
  private get krakenRewardY() {
    return KRAKEN_SPOT.y - KRAKEN_RING_RADIUS - 2;
  }

  /** The prize label's idle bob while it waits to be clicked. */
  private bobKrakenReward() {
    if (!this.krakenReward) return;

    this.tweens.killTweensOf(this.krakenReward);
    this.krakenReward.setY(this.krakenRewardY);
    this.tweens.add({
      targets: this.krakenReward,
      y: this.krakenRewardY - 4,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  /** Does the room run the Marvel, or are we simulating it locally? */
  private get remoteKraken() {
    const remote = this.mmoServer?.state?.loveKraken;

    return remote && remote.health > 0 ? remote : undefined;
  }

  /** The current Marvel, from the room when it has one, else simulated. */
  private getKrakenRound(now: number): LoveKrakenRound {
    const remote = this.remoteKraken;

    if (remote) {
      const caught = remote.caughtAt > 0;

      return {
        roundId: remote.roundId,
        health: remote.health,
        // The bar is the room's - a reel of ours flashes it, never moves it
        progress: Math.max(0, Math.min(remote.health, remote.progress)),
        caught,
        ...(caught
          ? { caughtAt: remote.caughtAt, respawnAt: remote.respawnAt }
          : {}),
        // A room that predates the daily roll publishes nothing - the stand-in then
        prize: fromLoveKrakenRoomPrize({
          prize: remote.prize,
          amount: remote.prizeAmount,
        }),
      };
    }

    this.localKraken = tickLoveKrakenLocalRound({
      round: this.localKraken ?? createLoveKrakenLocalRound(now),
      now,
    });

    return this.localKraken;
  }

  /** The local player's pulls and reels on this Marvel. */
  private getMyKrakenAngler(roundId: number): LoveKrakenAngler {
    return this.krakenAnglers[roundId] ?? LOVE_KRAKEN_FRESH_ANGLER;
  }

  /** Reels the local player landed on this Marvel - local count or the room's. */
  private getMyKrakenReels(roundId: number): number {
    const local = this.getMyKrakenAngler(roundId).reels;
    const remote = this.remoteKraken?.anglers?.get(`${this.id}`) ?? 0;

    return Math.max(local, remote);
  }

  /**
   * The local player's ring right now - where the marker is, where their
   * zone is, and which way and how fast it is going.
   */
  private getKrakenRing(round: LoveKrakenRound, now: number) {
    return getLoveKrakenRing({
      roundId: round.roundId,
      angler: this.getMyKrakenAngler(round.roundId),
      now,
    });
  }

  /**
   * The fishing button. The first click casts the line and leaves it in the
   * water; every click after that is a pull on the rod. A pull only counts
   * when the marker is inside your catch zone - a miss still plays, it just
   * doesn't move the bar. Landing one leaves a purple dot behind and throws
   * the zone somewhere else, so nobody settles into a rhythm.
   */
  private castOrReelKraken() {
    const now = Date.now();
    const player = this.currentPlayer;
    if (!this.kraken || !player) return;

    if (!this.checkDistanceToSprite(this.kraken, LOVE_KRAKEN_REACH)) {
      player.speak(translateForBubble("base.iam.far.away"));
      return;
    }

    const round = this.getKrakenRound(now);

    // Nothing to reel in while the prize is floating there
    if (round.caught) return;

    // Face the water
    if (player.x < KRAKEN_SPOT.x) {
      player.faceRight();
    } else {
      player.faceLeft();
    }

    if (!this.krakenCasting || !player.isFishing) {
      this.krakenCasting = true;
      player.castRod();
      return;
    }

    player.reelRod();

    const ring = this.getKrakenRing(round, now);
    if (
      now - this.lastKrakenReelAt <
      getLoveKrakenReelCooldownMs(ring.ringMs)
    ) {
      return;
    }

    this.lastKrakenReelAt = now;

    const landed = isLoveKrakenReelOnTarget({ ring });

    // The pull counts either way, and the zone moves either way - that is
    // what stops the button being held down until the marker wanders into a
    // zone that never moves. Only a hit re-anchors the marker's leg, so a
    // miss costs the angler their aim but never interrupts the sweep.
    this.krakenAnglers[round.roundId] = pullLoveKrakenRod({
      angler: this.getMyKrakenAngler(round.roundId),
      ring,
      landed,
      now,
    });

    if (!landed) {
      this.flashKrakenMarker(KRAKEN_MARKER_MISS);
      return;
    }

    this.markKrakenHit(ring.zoneAngle);
    // Throw the bar forward so a lone angler can see their reel land
    this.krakenKickAt = now;

    if (this.remoteKraken) {
      this.mmoServer?.send("loveKraken.reel", { roundId: round.roundId });
    } else if (this.localKraken) {
      this.localKraken = reelLoveKrakenLocalRound({
        round: this.localKraken,
        now,
      });
    }

    this.flashKrakenMarker(KRAKEN_MARKER_HIT);
    this.splashKraken(4, 12);
    // Only your own reel is heard - the bank would be a racket otherwise
    this.sound.play("dig", { volume: 0.04 });
  }

  /** The marker blinks green on a landed reel and red on a missed one. */
  private flashKrakenMarker(colour: number) {
    this.krakenMarkerFlashColour = colour;
    this.krakenMarkerFlashUntil = Date.now() + KRAKEN_MARKER_FLASH_MS;
  }

  /**
   * A purple dot pops where a reel scored and fades. The zone has already
   * jumped away from it by the time it is drawn, so it doubles as a marker
   * of where you just came from.
   */
  private markKrakenHit(zoneAngle: number) {
    const angle = Phaser.Math.DegToRad(zoneAngle);
    const dot = this.add
      .circle(
        KRAKEN_SPOT.x + Math.sin(angle) * KRAKEN_RING_RADIUS,
        KRAKEN_SPOT.y - Math.cos(angle) * KRAKEN_RING_RADIUS,
        KRAKEN_HIT_DOT_RADIUS,
        KRAKEN_HIT_DOT_COLOUR,
      )
      .setDepth(Number.MAX_SAFE_INTEGER);

    this.tweens.add({
      targets: dot,
      scale: 1.8,
      alpha: 0,
      duration: KRAKEN_HIT_DOT_MS,
      ease: "Quad.easeOut",
      onComplete: () => dot.destroy(),
    });
  }

  /** Droplets thrown up off the water, around the beast's own waterline. */
  private splashKraken(count: number, spread: number) {
    const waterline = {
      x: KRAKEN_HEAD.x + KRAKEN_HEAD_WIDTH / 2,
      y: KRAKEN_HEAD.y + KRAKEN_HEAD_HEIGHT,
    };

    for (let i = 0; i < count; i++) {
      const colour = KRAKEN_SPLASH_COLOURS[i % KRAKEN_SPLASH_COLOURS.length];
      const drop = this.add
        .rectangle(
          waterline.x + Phaser.Math.Between(-10, 10),
          waterline.y + Phaser.Math.Between(-4, 2),
          2,
          2,
          colour,
        )
        .setDepth(waterline.y + 2);

      this.tweens.add({
        targets: drop,
        x: drop.x + Phaser.Math.Between(-spread, spread),
        y: drop.y - Phaser.Math.Between(spread / 2, spread),
        alpha: 0,
        duration: Phaser.Math.Between(250, 450),
        ease: "Quad.easeOut",
        onComplete: () => drop.destroy(),
      });
    }
  }

  updateLoveKraken() {
    const now = Date.now();
    const round = this.getKrakenRound(now);

    // Fresh Marvel - a new line, so the ring starts over at the top
    if (this.krakenRoundId !== round.roundId) {
      this.krakenRoundId = round.roundId;
      this.sawKrakenFighting = false;
      this.lastKrakenProgress = undefined;
      this.seenAnglerReels = {};
      // Only this round's tally matters; the rest would pile up all session
      this.krakenAnglers = {
        [round.roundId]: this.getMyKrakenAngler(round.roundId),
      };
      this.drawnKrakenZoneAngle = undefined;
      this.krakenKickAt = undefined;
      this.surfaceKraken();
    }

    if (!round.caught) {
      this.sawKrakenFighting = true;
    } else if (this.caughtKrakenRoundId !== round.roundId) {
      this.caughtKrakenRoundId = round.roundId;
      this.landKraken(this.sawKrakenFighting);
    }

    this.setKrakenRing(round, now);
    this.setKrakenProgress(round, now);
    this.updateKrakenAnglers(round);

    // The prize floats there for the whole window - it claims itself part
    // way through rather than waiting to be clicked
    const rewardOpen = isLoveKrakenRewardOpen({ round, now });

    if (
      rewardOpen &&
      now - (round.caughtAt ?? now) >= LOVE_KRAKEN_AUTO_CLAIM_MS
    ) {
      this.claimKrakenReward({ automatic: true });
    }

    // The day's roll, as the room publishes it
    this.refreshKrakenReward(round.prize);

    if (this.krakenReward && this.krakenReward.visible !== rewardOpen) {
      this.krakenReward.setVisible(rewardOpen);
      this.tweens.killTweensOf(this.krakenReward);
      this.krakenReward.setY(this.krakenRewardY);

      if (rewardOpen) this.bobKrakenReward();
    }

    // The prize takes the disc's place above the ring while it is on show
    this.krakenDisc?.setVisible(!round.caught);
  }

  /**
   * The marker's sweep and the catch zone, both hidden while the Marvel is
   * landed. Everything the marker does follows from the reels this player
   * has landed and when the last one landed, so the room judging the reels
   * reads it exactly as the client draws it.
   */
  private setKrakenRing(round: LoveKrakenRound, now: number) {
    const marker = this.krakenMarker;
    const track = this.krakenRing;
    const zone = this.krakenZone;
    if (!marker || !track || !zone) return;

    if (round.caught) {
      marker.setVisible(false);
      track.setVisible(false);
      zone.setVisible(false);
      return;
    }

    const ring = this.getKrakenRing(round, now);
    const angle = Phaser.Math.DegToRad(ring.angle);
    marker.setPosition(
      KRAKEN_SPOT.x + Math.sin(angle) * KRAKEN_RING_RADIUS,
      KRAKEN_SPOT.y - Math.cos(angle) * KRAKEN_RING_RADIUS,
    );

    const colour =
      now < this.krakenMarkerFlashUntil
        ? this.krakenMarkerFlashColour
        : KRAKEN_MARKER_COLOUR;
    if (marker.fillColor !== colour) marker.setFillStyle(colour);

    this.setKrakenZone(ring.zoneAngle);

    marker.setVisible(true);
    track.setVisible(true);
    zone.setVisible(true);
  }

  /** Redraw the catch zone, but only when it has actually jumped. */
  private setKrakenZone(zoneAngle: number) {
    const zone = this.krakenZone;
    if (!zone || this.drawnKrakenZoneAngle === zoneAngle) return;

    this.drawnKrakenZoneAngle = zoneAngle;

    const half = Phaser.Math.DegToRad(LOVE_KRAKEN_ZONE_HALF_DEG);
    // Phaser measures from the +x axis; the ring's own zero is the top
    const centre = Phaser.Math.DegToRad(zoneAngle) - Math.PI / 2;

    zone.clear();
    zone.lineStyle(KRAKEN_ZONE_WIDTH, KRAKEN_RING_ZONE, 1);
    zone.beginPath();
    zone.arc(0, 0, KRAKEN_RING_RADIUS, centre - half, centre + half);
    zone.strokePath();
  }

  /**
   * The island's progress bar. The fill is whole pixels; it runs green while
   * the bank is dragging the Marvel up and red while the Marvel is dragging
   * it back, so a thin crowd can see at a glance that they need more hands.
   *
   * Your own reel throws it forward a visible slice that eases back - see
   * `getLoveKrakenReelKick`. That slice is worth far more than the point it
   * stands for and is only ever shown to you, but without it a lone angler
   * landing a reel sees a bar that does not move at all.
   */
  private setKrakenProgress(round: LoveKrakenRound, now: number) {
    const bar = this.krakenBar;
    if (!bar) return;

    if (round.caught) {
      bar.setVisible(false);
      this.krakenBarFill = undefined;
      this.lastKrakenProgress = undefined;
      return;
    }

    const kick = getLoveKrakenReelKick({
      landedAt: this.krakenKickAt,
      now,
    });
    const share = getLoveKrakenBarShare({
      progress: round.progress,
      health: round.health,
      landedAt: this.krakenKickAt,
      now,
    });

    const fill = Math.max(
      0,
      Math.min(
        KRAKEN_BAR_INNER_WIDTH,
        Math.round(KRAKEN_BAR_INNER_WIDTH * share),
      ),
    );

    // Which way the tug of war is going. A frame where nothing changed keeps
    // the colour it had, so the bar doesn't strobe between patches. While
    // your own kick is running the bar stays green whatever the island is
    // doing - the kick easing back is not the Marvel winning.
    const previous = this.lastKrakenProgress;
    let rising = this.krakenBarRising ?? true;
    if (previous !== undefined && round.progress !== previous) {
      rising = round.progress > previous;
    }
    if (kick > 0) rising = true;
    this.lastKrakenProgress = round.progress;

    if (fill !== this.krakenBarFill || rising !== this.krakenBarRising) {
      this.krakenBarFill = fill;
      this.krakenBarRising = rising;
      bar.clear();
      bar.fillStyle(KRAKEN_BAR_TRACK, 1);
      bar.fillRect(0, 0, KRAKEN_BAR_WIDTH, KRAKEN_BAR_HEIGHT);
      bar.fillStyle(rising ? KRAKEN_BAR_RISING : KRAKEN_BAR_FALLING, 1);
      bar.fillRect(1, 1, fill, KRAKEN_BAR_HEIGHT - 2);
    }

    bar.setVisible(true);
  }

  /**
   * Everyone else on the bank casts and reels too: any player the room lists
   * as an angler holds their rod out, and pulls it whenever their count goes
   * up. The ring is shared, so the whole bank reels in time.
   */
  private updateKrakenAnglers(round: LoveKrakenRound) {
    const anglers = this.remoteKraken?.anglers;
    if (!anglers || round.caught) return;

    Object.values(this.playerEntities).forEach((player) => {
      const farmId = player.farmId;
      if (!farmId || farmId === this.id) return;

      const reels = anglers.get(`${farmId}`);
      if (reels === undefined) return;

      // They reeled at some point this round, but have since wandered off
      if (
        Phaser.Math.Distance.Between(
          player.x,
          player.y,
          KRAKEN_SPOT.x,
          KRAKEN_SPOT.y,
        ) > LOVE_KRAKEN_REACH
      ) {
        player.stopFishing();
        return;
      }

      const seen = this.seenAnglerReels[farmId];
      this.seenAnglerReels[farmId] = reels;

      if (seen === undefined || !player.isFishing) {
        player.castRod();
      } else if (reels > seen) {
        player.reelRod();
      }
    });
  }

  /** A fresh Marvel surfaces. */
  private surfaceKraken() {
    this.claimedKrakenRoundId = undefined;

    const parts = [
      ...(this.kraken ? [this.kraken] : []),
      ...this.krakenTentacles,
    ];

    // Kill the last catch's fade first - a round that arrives while it is
    // still running would otherwise fade the new Marvel straight back out
    this.tweens.killTweensOf(parts);
    parts.forEach((part) => part.setAlpha(1).setVisible(true));
  }

  /** The bank just landed it - thrash, splash and leave the prize floating. */
  private landKraken(animate: boolean) {
    const parts = [
      ...(this.kraken ? [this.kraken] : []),
      ...this.krakenTentacles,
    ];

    if (animate) {
      this.splashKraken(18, 26);
      this.sound.play("reveal", { volume: 0.1 });
      this.tweens.add({
        targets: parts,
        alpha: 0,
        duration: 400,
        onComplete: () => parts.forEach((part) => part.setVisible(false)),
      });
    } else {
      parts.forEach((part) => part.setVisible(false));
    }

    // Everyone's line comes out of the water with it
    this.krakenCasting = false;
    this.currentPlayer?.stopFishing();
  }

  /**
   * Pay the prize to the local player.
   *
   * Nobody has to click: `updateLoveKraken` calls this a couple of seconds
   * into the window for everyone who helped haul the beast up. Clicking the
   * prize calls it too, which just takes it early - either way the round is
   * marked claimed, so the two can't both pay.
   *
   * `automatic` only decides whether to nag: an impatient click gets told
   * why nothing happened, but a player who simply never reeled shouldn't get
   * a bubble at a prize that was never theirs.
   */
  private claimKrakenReward({ automatic = false } = {}) {
    const now = Date.now();
    const round = this.getKrakenRound(now);
    const player = this.currentPlayer;

    if (!this.kraken || !player) return;
    if (!isLoveKrakenRewardOpen({ round, now })) return;
    if (this.claimedKrakenRoundId === round.roundId) return;

    if (!this.checkDistanceToSprite(this.kraken, LOVE_KRAKEN_REACH)) {
      if (!automatic) player.speak(translateForBubble("base.iam.far.away"));
      return;
    }

    const state = this.freshState;
    const myReels = this.getMyKrakenReels(round.roundId);

    if (myReels <= 0) {
      if (!automatic) player.speak(translateForBubble("loveKraken.didNotHelp"));
      return;
    }

    if (!canClaimLoveKraken({ state, myReels, roundId: round.roundId, now })) {
      if (!automatic && hasClaimedLoveKrakenToday({ state, now })) {
        player.speak(translateForBubble("loveKraken.alreadyClaimed"));
      }
      // Nothing more is coming this round either way
      this.claimedKrakenRoundId = round.roundId;
      return;
    }

    // The prize is a box or coins, never Love Charms - the server rolls it
    // for the day and pays it, recording the claim as worth 0 so the day's
    // Love Charm budget is untouched. The roundId makes a reload mid-window a
    // no-op instead of a second claim.
    this.gameService?.send({
      type: "floatingIslandPrize.claimed",
      amount: 0,
      game: "love_kraken",
      roundId: round.roundId,
    });

    this.claimedKrakenRoundId = round.roundId;

    const { prize } = round;
    player.cheer();
    player.speak(
      prize.type === "coins"
        ? translateForBubble("loveKraken.prizeCoins", { amount: prize.amount })
        : translateForBubble("loveKraken.prizeItem", { item: prize.item }),
    );
  }
}
