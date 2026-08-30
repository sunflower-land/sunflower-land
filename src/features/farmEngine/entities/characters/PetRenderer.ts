import type Phaser from "phaser";
import petEgg from "assets/icons/pet_nft_egg.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import type { PetName, PetNFT, Pet } from "features/game/types/pets";
import {
  isPetNapping,
  isPetNeglected,
  isPetOfTypeFed,
  isPetNFTRevealed,
} from "features/game/types/pets";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  getPetImage,
  petImageDomain,
  PETS_STYLES,
  PET_STATE_IMAGES,
} from "features/island/pets/lib/petShared";
import { isHelpComplete } from "features/game/types/monuments";
import { addHelpDisc, queueHelpDiscAssets } from "../../components/HelpDisc";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
import { collectiblesAt } from "../collectibles/CollectibleRenderer";
import { makeClickable } from "../../core/clickable";
import { gridRectToWorld } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";

/**
 * Pets [island/pets/*]: NFT pets from state.pets.nfts (placement + data in
 * one), and common pets whose PLACEMENT is a collectible entry but whose
 * behaviour data lives in state.pets.common. CollectibleRenderer skips pet
 * names — this renderer owns both kinds so the napping/neglected art +
 * click logic is shared.
 *
 * NFT art: CDN 44×44 sheets (idle 0-8 @8fps) when awake; sleeping webp
 * (first frame) when napping/neglected/type-fed; the egg before reveal.
 * Common art: PET_STATE_IMAGES happy/asleep + PET_PIXEL_STYLES offsets.
 *
 * Clicks port LandPetNFT/LandPet: neglected -> pet.neglected, napping ->
 * pet.pet, else the PetModal via the bridge. DEFERRED: XP floats, visiting
 * help flow, walking anim.
 */

type Slice = {
  nfts: NonNullable<NonNullable<GameState["pets"]>["nfts"]>;
  common: NonNullable<NonNullable<GameState["pets"]>["common"]>;
  collectibles: GameState["collectibles"];
};

const NFT_FRAME = 44;
const NFT_SHEET_STEPS = 26;

/** [PetSprite.tsx NFT_ICON_POSITIONS] tailwind raw-CSS-px -> src px (÷2.625). */
const NFT_ICON_POSITIONS: Record<
  string,
  {
    nap: { top: number; left: number };
    neglected: { top: number; left: number };
  }
> = {
  Dragon: { nap: { top: 8, left: 8 }, neglected: { top: 4, left: 16 } },
  Phoenix: { nap: { top: 16, left: 16 }, neglected: { top: 4, left: 16 } },
  Griffin: { nap: { top: 20, left: 16 }, neglected: { top: 4, left: 16 } },
  Ram: { nap: { top: 6, left: 6 }, neglected: { top: 6, left: 6 } },
  Warthog: { nap: { top: 20, left: 16 }, neglected: { top: 4, left: 8 } },
  Wolf: { nap: { top: 20, left: 8 }, neglected: { top: 6, left: 6 } },
  Bear: { nap: { top: 20, left: 12 }, neglected: { top: 4, left: 8 } },
};

export const isCommonPetName = (name: string): name is PetName =>
  name in PET_STATE_IMAGES;

type Entry = {
  art?: Phaser.GameObjects.Image;
  sheet?: Phaser.GameObjects.Sprite;
  icon?: Phaser.GameObjects.Image;
  discs?: Phaser.GameObjects.Image[];
  zone: Phaser.GameObjects.Zone;
};

export class PetRenderer extends EntityRenderer<Slice> {
  private entries = new Map<string, Entry>();
  private tickMs = 0;

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      nfts: game.pets?.nfts ?? {},
      common: game.pets?.common ?? {},
      collectibles: collectiblesAt(game, this.scene.location),
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.nfts === b.nfts &&
    a.common === b.common &&
    a.collectibles === b.collectibles;

  private nftSheetUrl(id: number) {
    return `https://${petImageDomain}.sunflower-land.com/sheets/${id}.webp`;
  }

  private placedNfts(slice: Slice) {
    return Object.entries(slice.nfts).filter(
      ([, pet]) =>
        !!pet.coordinates &&
        (this.scene.location === "farm"
          ? !pet.location || pet.location === "farm"
          : pet.location === this.scene.location),
    ) as [string, PetNFT][];
  }

  private placedCommons(slice: Slice) {
    const out: {
      name: PetName;
      id: string;
      coordinates: { x: number; y: number };
    }[] = [];
    for (const [name, items] of Object.entries(slice.collectibles)) {
      if (!isCommonPetName(name)) continue;
      (items ?? []).forEach((item) => {
        if (item.coordinates) {
          out.push({ name, id: item.id, coordinates: item.coordinates });
        }
      });
    }
    return out;
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    const now = Date.now();
    const nfts = this.placedNfts(slice);
    const commons = this.placedCommons(slice);

    queueImage(this.scene, petEgg);
    queueImage(this.scene, SUNNYSIDE.icons.expression_stress);
    queueImage(this.scene, SUNNYSIDE.icons.sleeping);
    queueHelpDiscAssets(this.scene);
    for (const [id] of nfts) {
      const numeric = Number(id);
      if (!isPetNFTRevealed(numeric, now)) continue;
      queueSpritesheet(this.scene, this.nftSheetUrl(numeric), {
        frameWidth: NFT_FRAME,
        frameHeight: NFT_FRAME,
      });
      queueImage(this.scene, getPetImage("asleep", numeric));
    }
    for (const { name } of commons) {
      queueImage(this.scene, PET_STATE_IMAGES[name].happy);
      queueImage(this.scene, PET_STATE_IMAGES[name].asleep);
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const liveKeys = new Set([
      ...nfts.map(([id]) => `nft#${id}`),
      ...commons.map(({ name, id }) => `common#${name}#${id}`),
    ]);
    for (const [key, entry] of this.entries) {
      if (liveKeys.has(key)) continue;
      this.destroyEntry(entry);
      this.entries.delete(key);
    }

    for (const [id, pet] of nfts) this.renderNft(id, pet, now);
    for (const placement of commons) {
      this.renderCommon(placement, slice.common[placement.name], now);
    }
  }

  /** [LandPetNFT.tsx + PetSprite.tsx] 44×44 sprite centred in the 2×2 box. */
  private renderNft(id: string, pet: PetNFT, now: number) {
    const key = `nft#${id}`;
    const numeric = Number(id);
    const box = gridRectToWorld(pet.coordinates!, { width: 2, height: 2 });
    const depth = DEPTHS.ENTITY_BASE + box.y;

    const entry = this.ensureEntry(key, box, () => this.onNftClick(id));

    const revealed = isPetNFTRevealed(numeric, now);
    const napping = isPetNapping(pet, now);
    const neglected = isPetNeglected(pet, now);
    const typeFed = pet.traits
      ? isPetOfTypeFed({
          nftPets: this.game().pets?.nfts ?? {},
          petType: pet.traits.type,
          id: numeric,
          now,
        })
      : false;
    const asleep = neglected || napping || typeFed;

    const spriteX = box.x + box.width / 2 - NFT_FRAME / 2;
    const spriteY = box.y + box.height + 3.05; // bottom -8 css px

    entry.sheet?.setVisible(false);
    entry.art?.setVisible(false);

    if (
      revealed &&
      !asleep &&
      this.scene.textures.exists(this.nftSheetUrl(numeric))
    ) {
      if (!entry.sheet) {
        const url = this.nftSheetUrl(numeric);
        const animKey = `${url}-idle`;
        if (!this.scene.anims.exists(animKey)) {
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(url, {
              start: 0,
              end: Math.min(8, NFT_SHEET_STEPS - 1),
            }),
            frameRate: 8,
            repeat: -1,
          });
        }
        entry.sheet = this.scene.add.sprite(0, 0, url).setOrigin(0, 1);
        entry.sheet.play(animKey);
      }
      entry.sheet.setVisible(true);
      entry.sheet.setPosition(spriteX, spriteY);
      entry.sheet.setDepth(depth);
    } else {
      const texture = revealed ? getPetImage("asleep", numeric) : petEgg;
      if (!this.scene.textures.exists(texture)) return;
      if (!entry.art) {
        entry.art = this.scene.add.image(0, 0, texture).setOrigin(0, 1);
      }
      entry.art.setVisible(true);
      entry.art.setTexture(texture);
      entry.art.setScale(NFT_FRAME / entry.art.width);
      entry.art.setPosition(spriteX, spriteY);
      entry.art.setDepth(depth);
    }

    this.refreshIcon(entry, {
      neglected: neglected || typeFed,
      napping: napping && !typeFed,
      x: spriteX,
      y: spriteY - NFT_FRAME,
      positions: pet.traits ? NFT_ICON_POSITIONS[pet.traits.type] : undefined,
      depth: depth + 1,
    });
    this.refreshHelpDisc(entry, box, depth, !pet.visitedAt);
  }

  /** [VisitingPet.tsx] disc while this pet still needs help on a visit. */
  private refreshHelpDisc(
    entry: Entry,
    box: { x: number; y: number; width: number },
    depth: number,
    needsHelp: boolean,
  ) {
    entry.discs?.forEach((disc) => disc.destroy());
    entry.discs = undefined;
    const visiting = this.bridge.select(
      (state) => state.context.visitorId !== undefined,
    );
    if (!visiting || !needsHelp) return;
    entry.discs = addHelpDisc(this.scene, box, depth + 2);
  }

  /** [LandPet.tsx + PetSprite.tsx PET_PIXEL_STYLES] */
  private renderCommon(
    placement: {
      name: PetName;
      id: string;
      coordinates: { x: number; y: number };
    },
    pet: Pet | undefined,
    now: number,
  ) {
    const key = `common#${placement.name}#${placement.id}`;
    const dims = COLLECTIBLES_DIMENSIONS[placement.name] ?? {
      width: 1,
      height: 1,
    };
    const box = gridRectToWorld(placement.coordinates, dims);
    const depth = DEPTHS.ENTITY_BASE + box.y;

    const entry = this.ensureEntry(key, box, () =>
      this.onCommonClick(placement.name),
    );

    const napping = isPetNapping(pet, now);
    const neglected = isPetNeglected(pet, now);
    const asleep = napping || neglected;
    const texture = asleep
      ? PET_STATE_IMAGES[placement.name].asleep
      : PET_STATE_IMAGES[placement.name].happy;
    if (!this.scene.textures.exists(texture)) return;

    const style = PETS_STYLES[placement.name];
    if (!entry.art) {
      entry.art = this.scene.add.image(0, 0, texture).setOrigin(0, 0);
    }
    entry.art.setVisible(true);
    entry.art.setTexture(texture);
    entry.art.setScale((style?.width ?? 16) / entry.art.width);
    entry.art.setPosition(
      box.x + (style?.left ?? 0),
      box.y + box.height - (style?.bottom ?? 16),
    );
    entry.art.setDepth(depth);

    this.refreshIcon(entry, {
      neglected,
      napping: napping && !neglected,
      x: entry.art.x,
      y: entry.art.y,
      positions: undefined, // commons: -8 css px both axes
      depth: depth + 1,
    });
    this.refreshHelpDisc(entry, box, depth, !pet?.visitedAt);
  }

  private refreshIcon(
    entry: Entry,
    options: {
      neglected: boolean;
      napping: boolean;
      x: number;
      y: number;
      positions?: {
        nap: { top: number; left: number };
        neglected: { top: number; left: number };
      };
      depth: number;
    },
  ) {
    entry.icon?.destroy();
    entry.icon = undefined;
    const { neglected, napping } = options;
    if (!neglected && !napping) return;

    const texture = neglected
      ? SUNNYSIDE.icons.expression_stress
      : SUNNYSIDE.icons.sleeping;
    if (!this.scene.textures.exists(texture)) return;
    const width = neglected ? 6.86 : 9.14;
    const cssPos = options.positions
      ? neglected
        ? options.positions.neglected
        : options.positions.nap
      : { top: -8, left: -8 };
    const icon = this.scene.add
      .image(
        options.x + cssPos.left / 2.625,
        options.y + cssPos.top / 2.625,
        texture,
      )
      .setOrigin(0, 0)
      .setDepth(options.depth);
    icon.setScale(width / icon.width);
    entry.icon = icon;
  }

  private ensureEntry(
    key: string,
    box: { x: number; y: number; width: number; height: number },
    onClick: () => void,
  ): Entry {
    let entry = this.entries.get(key);
    if (!entry) {
      const zone = this.scene.add
        .zone(0, 0, box.width, box.height)
        .setOrigin(0, 0);
      makeClickable(this.scene, zone, onClick, { visitClickable: true });
      entry = { zone };
      this.entries.set(key, entry);
    }
    entry.zone.setPosition(box.x, box.y);
    entry.zone.setSize(box.width, box.height);
    // Depth-parity rule: input follows depth — an unset (0) zone depth
    // swallows clicks for every entity placed below row 0.
    entry.zone.setDepth(DEPTHS.ENTITY_BASE + box.y);
    return entry;
  }

  /** [VisitingPetNFT.tsx / VisitingPet.tsx] */
  private visitingHelp(petId: PetName | number) {
    const machine = this.bridge.select((state) => state);
    this.bridge.dispatch({
      type: "pet.visitingPets",
      pet: petId,
      totalHelpedToday: machine.context.totalHelpedToday ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (isHelpComplete({ game: this.game() })) {
      this.bridge.farmModal.open("farmHelped");
    }
  }

  /** [LandPetNFT.tsx handleClick] */
  private onNftClick(id: string) {
    const now = Date.now();
    const game = this.game();
    const pet = game.pets?.nfts?.[Number(id)];
    if (!pet) return;
    if (this.bridge.select((state) => state.context.visitorId !== undefined)) {
      if (!pet.visitedAt) this.visitingHelp(Number(id));
      return;
    }
    const typeFed = pet.traits
      ? isPetOfTypeFed({
          nftPets: game.pets?.nfts ?? {},
          petType: pet.traits.type,
          id: Number(id),
          now,
        })
      : false;
    if (isPetNeglected(pet, now) && !typeFed) {
      this.bridge.dispatch("pet.neglected", { petId: Number(id) });
      return;
    }
    if (isPetNapping(pet, now) && !typeFed) {
      this.bridge.dispatch("pet.pet", { petId: Number(id) });
      return;
    }
    if (isPetNFTRevealed(Number(id), now) && pet.traits) {
      this.bridge.farmModal.open("pet", { nftId: Number(id) });
    }
  }

  /** [LandPet.tsx handleClick] */
  private onCommonClick(name: PetName) {
    const now = Date.now();
    const pet = this.game().pets?.common?.[name];
    if (this.bridge.select((state) => state.context.visitorId !== undefined)) {
      if (!pet?.visitedAt) this.visitingHelp(name);
      return;
    }
    if (isPetNeglected(pet, now)) {
      this.bridge.dispatch("pet.neglected", { petId: name });
      return;
    }
    if (isPetNapping(pet, now)) {
      this.bridge.dispatch("pet.pet", { petId: name });
      return;
    }
    this.bridge.farmModal.open("pet", { commonName: name });
  }

  private game() {
    return this.bridge.select((state) => state.context.state);
  }

  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < 10_000) return; // nap/neglect states move slowly
    this.tickMs = 0;
    void this.sync(this.bridge.select((state) => this.selector(state)));
  }

  private destroyEntry(entry: Entry) {
    entry.zone.destroy();
    entry.art?.destroy();
    entry.sheet?.destroy();
    entry.icon?.destroy();
    entry.discs?.forEach((disc) => disc.destroy());
  }

  protected onDestroy() {
    this.entries.forEach((entry) => this.destroyEntry(entry));
    this.entries.clear();
  }
}
