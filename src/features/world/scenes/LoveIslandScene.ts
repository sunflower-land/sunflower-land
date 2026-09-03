import loveIslandJSON from "assets/map/love_island_map.json";
import loveIslandTileset from "assets/map/love_island_tileset.json";

import type { SceneId } from "../mmoMachine";
import { BaseScene, type NPCBumpkin } from "./BaseScene";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { translate, translateForBubble } from "lib/i18n/translate";
import { interactableModalManager } from "../ui/InteractableModals";
import type { TemperateSeasonName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { hasReadLoveIslandNotice } from "../ui/loveRewardShop/LoveIslandNoticeboard";
import type { BumpkinContainer } from "../containers/BumpkinContainer";
import {
  LOVE_DILEMMA_CHOOSE_MS,
  LOVE_DILEMMA_PLATFORMS,
  getLoveDilemmaAttemptsLeft,
  getLoveDilemmaBotChoices,
  getLoveDilemmaPayout,
  getLoveDilemmaPlatformPrizes,
  getLoveDilemmaRound,
  getLoveDilemmaTiers,
  isLoveDilemmaRevealReady,
  isLoveDilemmaWinner,
  resolveLoveDilemma,
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
/** Countdown and status sit above the row. */
const HUD_Y = CENTRE.y - 60;
/** Love Charm icon is 20px wide - keep a clear gap before the number. */
const PRIZE_ICON_WIDTH = 20;
const PRIZE_GAP = 3;

/** Key for the local player's choice while the room has no dilemma state. */
const LOCAL_PLAYER_KEY = "me";
/** Simulated players while the room has no dilemma state. */
const LOCAL_BOT_COUNT = 6;

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
  /** Icon + number, centred on each platform. */
  private platformPrizes: {
    group: Phaser.GameObjects.Container;
    icon: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.BitmapText;
  }[] = [];
  private countdownText?: Phaser.GameObjects.BitmapText;
  private statusText?: Phaser.GameObjects.BitmapText;
  private attemptsText?: Phaser.GameObjects.BitmapText;
  private selectBox?: Phaser.GameObjects.Rectangle;
  private labelledRoundId?: number;
  private selectedRoundId?: number;
  private revealedRoundId?: number;
  /** roundId -> platform, the local player's picks (local mode only). */
  private localChoices: Record<number, number> = {};

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
    this.load.image("love_charm", ITEM_DETAILS["Love Charm"].image);
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

    // Decorative seasonal guardian sprite (no interaction).
    this.add.sprite(310, 556, "guardian");

    this.createLoveDilemma();

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

      // Prize sits centred on the platform itself, under anyone standing on it
      const icon = this.add.sprite(0, 0, "love_charm");
      const text = this.add
        .bitmapText(0, 0, FONT, "", 6)
        .setOrigin(0, 0.5)
        .setTint(TEXT_TINT);
      const group = this.add
        .container(spot.x, spot.y, [icon, text])
        .setDepth(spot.y - PLATFORM_HEIGHT + 2);

      this.platformPrizes.push({ group, icon, text });
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
      const label = this.platformPrizes[platform];
      if (!label) return;

      label.text.setText(`${prize}`);

      // Centre the icon + number as one group on the platform
      const width = PRIZE_ICON_WIDTH + PRIZE_GAP + label.text.width;
      label.icon.setX(-width / 2 + PRIZE_ICON_WIDTH / 2);
      label.text.setX(-width / 2 + PRIZE_ICON_WIDTH + PRIZE_GAP);
    });
  }

  /** Back to neutral platforms for a fresh round. */
  private clearPlatformResults() {
    this.platforms.forEach((platform) => platform.clearTint());
    this.platformFrames.forEach((frame) => frame.setVisible(false));
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
    this.attemptsText?.setText(
      translate("loveDilemma.attemptsLeft", { count: attemptsLeft }),
    );

    if (round.phase === "choose") {
      this.statusText?.setText(
        attemptsLeft > 0
          ? translate("loveDilemma.choose")
          : translate("loveDilemma.noAttemptsLeft"),
      );
    } else {
      this.statusText?.setText(translate("loveDilemma.reveal"));

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

    const mine = choices[myKey];
    if (mine === undefined) return;

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
}
