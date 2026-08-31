import loveIslandJSON from "assets/map/love_island_map.json";
import loveIslandTileset from "assets/map/love_island_tileset.json";
import loveCharmSmall from "assets/icons/love_charm_small.webp";

import type { SceneId } from "../mmoMachine";
import { BaseScene, type NPCBumpkin } from "./BaseScene";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { translate } from "lib/i18n/translate";
import { interactableModalManager } from "../ui/InteractableModals";
import type { TemperateSeasonName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { hasReadLoveIslandNotice } from "../ui/loveRewardShop/LoveIslandNoticeboard";
import type { BumpkinContainer } from "../containers/BumpkinContainer";
import { Label } from "../containers/Label";
import {
  LOVE_BOULDER_HIT_COOLDOWN_MS,
  LOVE_BOULDER_PRIZE,
  LOVE_DILEMMA_CHOOSE_MS,
  LOVE_DILEMMA_PLATFORMS,
  canClaimLoveBoulder,
  createLoveBoulderLocalRound,
  getLoveBoulderPayout,
  getLoveDilemmaAttemptsLeft,
  getLoveDilemmaBotChoices,
  getLoveDilemmaPayout,
  getLoveDilemmaPlatformPrizes,
  getLoveDilemmaRound,
  getLoveDilemmaTiers,
  hasClaimedLoveBoulderRound,
  hasClaimedLoveBoulderToday,
  isLoveBoulderRewardOpen,
  isLoveDilemmaRevealReady,
  isLoveDilemmaWinner,
  resolveLoveDilemma,
  tickLoveBoulderLocalRound,
  type LoveBoulderLocalRound,
  type LoveBoulderRound,
  type LoveDilemmaChoices,
  type LoveDilemmaRound,
} from "../lib/loveIsland";

const BUMPKINS: NPCBumpkin[] = [];

const GUARDIAN_MAP: Record<TemperateSeasonName, string> = {
  autumn: "autumn_guardian",
  spring: "spring_guardian",
  summer: "summer_guardian",
  winter: "winter_guardian",
};

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
 * The boulder sits at the very top of the island, at the foot of the cliff
 * where the path dead-ends. Art is 26x25; its base rests on the dirt.
 */
const BOULDER_SPOT = { x: 620, y: 362 };
const BOULDER_WIDTH = 26;
const BOULDER_HEIGHT = 25;
/** How close a player has to stand to land a hit. */
const BOULDER_REACH = 40;
/** Rubble colours pulled from the boulder art. */
const RUBBLE_COLOURS = [0x9a9aa8, 0x6b6b7a, 0xc8c8d4];
/** Clickable area of the prize label (icon + "+5"), generous for thumbs. */
const REWARD_HIT_WIDTH = 36;
const REWARD_HIT_HEIGHT = 16;
/** The hit counter's label sits just above the boulder. */
const BOULDER_LABEL_Y = BOULDER_SPOT.y - BOULDER_HEIGHT / 2 - 14;
/** Nine-patch label metrics, matching `containers/Label.ts`. */
const LABEL_HEIGHT = 11;
const LABEL_PADDING = 6;
const LABEL_CHAR_WIDTH = 4;

const FONT = "Teeny Tiny Pixls";
const TEXT_TINT = 0x3e2731;
const SELECT_COLOUR = 0xffffff;
const WIN_COLOUR = 0x7ee07e;
const LOSE_COLOUR = 0xe57373;

/**
 * Love Island - home of the Love Dilemma.
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
 * taps down from 50,000 hits. When it cracks, a Love Charm prize sits on
 * the rubble for 5 seconds - anyone who landed a hit can click it for 5
 * Love Charms (once a day) - then a fresh boulder appears. The room
 * publishes `state.loveBoulder`; until it does, a simulated crowd chips
 * away locally. The only HUD is the hit count in a label above the boulder.
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
  /** Love Charm prize shown on the rubble while it can be claimed. */
  private boulderReward?: Phaser.GameObjects.Container;
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
    this.load.spritesheet("portal", "world/love_charm_portal_sheet.png", {
      frameWidth: 20,
      frameHeight: 34,
    });

    const guardian = GUARDIAN_MAP[this.gameState.season.season];

    this.load.image("guardian", `world/${guardian}.webp`);
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
        this.currentPlayer?.speak(translate("base.iam.far.away"));
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
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    // Decorative seasonal guardian sprite (no interaction).
    this.add.sprite(310, 556, "guardian");

    this.createLoveDilemma();
    this.createLoveBoulder();

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

    this.updateLoveDilemma();
    this.updateLoveBoulder();
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
      this.currentPlayer?.speak(translate("loveDilemma.waitForNextRound"));
      return;
    }

    if (getLoveDilemmaAttemptsLeft({ state: this.freshState, now }) <= 0) {
      this.currentPlayer?.speak(translate("loveDilemma.noAttemptsLeft"));
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
      this.currentPlayer?.speak(translate("loveDilemma.notEnoughPlayers"));
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
      this.currentPlayer?.speak(translate("loveDilemma.lost"));
    }
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

    // Solid - you mine it from around it, not through it
    const collider = this.add.rectangle(
      x,
      y + 4,
      BOULDER_WIDTH - 4,
      BOULDER_HEIGHT - 10,
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

    // The prize, sitting on the rubble for a few seconds once it cracks -
    // the same label style as the Dilemma platforms, but clickable
    const reward = new Label(
      this,
      `+${LOVE_BOULDER_PRIZE}`,
      "grey",
      "love_charm_small",
    );
    reward
      .setPosition(x, y - 4)
      .setDepth(Number.MAX_SAFE_INTEGER)
      .setVisible(false)
      .setSize(REWARD_HIT_WIDTH, REWARD_HIT_HEIGHT)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.claimBoulderReward());
    this.add.existing(reward);
    this.boulderReward = reward;
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
        // Hits we've sent come off straight away; the room catches up
        hitsRemaining: broken
          ? 0
          : Math.max(1, remote.hitsRemaining - this.pendingBoulderHits),
        broken,
        ...(broken
          ? { brokenAt: remote.brokenAt, respawnAt: remote.respawnAt }
          : {}),
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
      player.speak(translate("base.iam.far.away"));
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

    // The prize sits there until the window closes or we've taken it
    const rewardOpen =
      isLoveBoulderRewardOpen({ round, now }) &&
      this.claimedBoulderRoundId !== round.roundId &&
      !hasClaimedLoveBoulderRound({
        state: this.freshState,
        roundId: round.roundId,
        now,
      });

    if (this.boulderReward && this.boulderReward.visible !== rewardOpen) {
      this.boulderReward.setVisible(rewardOpen);
      this.tweens.killTweensOf(this.boulderReward);
      this.boulderReward.setY(BOULDER_SPOT.y - 4);

      if (rewardOpen) {
        this.tweens.add({
          targets: this.boulderReward,
          y: BOULDER_SPOT.y - 8,
          duration: 400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
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
      player.speak(translate("base.iam.far.away"));
      return;
    }

    const state = this.freshState;
    const myHits = this.getMyBoulderHits(round.roundId);

    if (myHits <= 0) {
      player.speak(translate("loveBoulder.didNotHelp"));
      return;
    }

    if (!canClaimLoveBoulder({ state, myHits, roundId: round.roundId, now })) {
      if (hasClaimedLoveBoulderToday({ state, now })) {
        player.speak(translate("loveBoulder.alreadyClaimed"));
      }
      return;
    }

    // Capped to what's still claimable today so the event never rejects it
    const amount = getLoveBoulderPayout({ state, now });

    // The roundId makes a reload mid-window a no-op instead of a second claim
    this.gameService?.send({
      type: "floatingIslandPrize.claimed",
      amount,
      game: "love_boulder",
      roundId: round.roundId,
    });

    this.claimedBoulderRoundId = round.roundId;

    if (amount > 0) {
      player.cheer();
      this.showWinnings(amount);
    } else {
      player.speak(translate("loveBoulder.dailyLimit"));
    }
  }
}
