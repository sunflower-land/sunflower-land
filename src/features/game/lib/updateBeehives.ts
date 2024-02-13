/* eslint-disable no-console */
import cloneDeep from "lodash.clonedeep";
import { Beehive, Beehives, FlowerBeds, GameState } from "../types/game";
import { isCollectibleBuilt } from "./collectibleBuilt";
import { getKeys } from "../types/craftables";
import { FLOWERS, FLOWER_SEEDS } from "../types/flowers";

/**
 * updateBeehives runs on any event that changes the state for bees or flowers
 * e.g.
 * flower.planted, flower.harvested
 * beehive.placed, beehive.harvested, beehive.removed
 *
 * The update forecasts and allocates flowers to beehives so that bees are able to
 * autonomously switch beehives and continue producing while the player is offline.
 */

const getFlowerProductionRate = (game: GameState) => {
  if (isCollectibleBuilt({ name: "Queen Bee", game })) {
    return 2;
  }
  return 1;
};

export const DEFAULT_HONEY_PRODUCTION_TIME = 24 * 60 * 60 * 1000;

export const getHoneyProductionTime = (game: GameState) => {
  return DEFAULT_HONEY_PRODUCTION_TIME / getFlowerProductionRate(game);
};

interface GetFlowerDetail {
  flowerId: string;
  beehives: Beehives;
  flowerBeds: FlowerBeds;
  createdAt: number;
}

interface GetBeehiveDetail {
  game: GameState;
  beehive: Beehive;
  createdAt: number;
}

interface CalculateFlowerDetails {
  beehives: Beehives;
  flowerBeds: FlowerBeds;
  createdAt: number;
}

interface CalculateHiveDetails {
  game: GameState;
  createdAt: number;
}

interface RemoveInactiveFlowers {
  beehives: Beehives;
  createdAt: number;
}

interface AttachFlowers {
  game: GameState;
  createdAt: number;
}

interface UpdateBeehives {
  game: GameState;
  createdAt: number;
}

type BeehiveDetail = {
  beehiveAvailableAt: number;
  availableTime: number;
};

type FlowerDetail = {
  flowerAvailableAt: number;
  availableTime: number;
};

const getFlowerReadyAt = (flowerId: string, flowerBeds: FlowerBeds) => {
  const plantedFlower = flowerBeds[flowerId].flower;

  if (!plantedFlower) {
    console.error(
      `Unexpected! Flower ${flowerId} does not exist when calculating ready time.`
    );
    return 0;
  }

  const plantMilliseconds =
    FLOWER_SEEDS()[FLOWERS[plantedFlower.name].seed].plantSeconds * 1000;

  return plantedFlower.plantedAt + plantMilliseconds;
};

const updateProducedHoney = ({ game, createdAt }: UpdateBeehives) => {
  const stateCopy = cloneDeep(game);
  const { beehives, flowers } = stateCopy;

  getKeys(beehives).forEach((hiveId) => {
    const hive = beehives[hiveId];
    const attachedFlowers = hive.flowers.sort(
      (a, b) => a.attachedAt - b.attachedAt
    );

    attachedFlowers.forEach((attachedFlower) => {
      const plantedFlower = flowers.flowerBeds[attachedFlower.id].flower;

      if (!plantedFlower) {
        console.error(
          `Unexpected! Flower ${attachedFlower.id} does not exist, but is attached to a beehive ${hiveId}.`
        );
        return;
      }

      const start = Math.max(hive.honey.updatedAt, attachedFlower.attachedAt);
      const end = Math.min(createdAt, attachedFlower.attachedUntil);

      // Prevent future dates
      const honey = Math.max(end - start, 0);

      const rate = attachedFlower.rate ?? 1;

      const totalHoney = honey * rate;
      hive.honey.produced += totalHoney;
    });

    hive.honey.updatedAt = createdAt;
  });

  return beehives;
};

const removeInactiveFlowers = ({
  beehives,
  createdAt,
}: RemoveInactiveFlowers) => {
  const beehivesCopy = cloneDeep(beehives);

  getKeys(beehivesCopy).forEach((hiveId) => {
    const hive = beehivesCopy[hiveId];
    hive.flowers = hive.flowers.filter(
      (flower) =>
        flower.attachedAt <= createdAt && flower.attachedUntil > createdAt
    );
  });

  return beehivesCopy;
};

const getFlowerDetail = ({
  flowerId,
  flowerBeds,
  beehives,
  createdAt,
}: GetFlowerDetail): FlowerDetail => {
  const attachments = getKeys(beehives).flatMap((beehiveId) =>
    beehives[beehiveId].flowers.map((flower) => ({
      beehiveId,
      flowerId: flower.id,
      attachedAt: flower.attachedAt,
      attachedUntil: flower.attachedUntil,
    }))
  );

  const flowerAttachment = attachments
    .filter((attachment) => attachment.flowerId === flowerId)
    .sort((a, b) => b.attachedAt - a.attachedAt)[0];

  const flowerReadyAt = getFlowerReadyAt(flowerId, flowerBeds);

  if (!flowerAttachment) {
    return {
      flowerAvailableAt: createdAt,
      availableTime: Math.max(0, flowerReadyAt - createdAt),
    };
  }

  return {
    flowerAvailableAt: flowerAttachment.attachedUntil,
    availableTime: Math.max(0, flowerReadyAt - flowerAttachment.attachedUntil),
  };
};

const calculateFlowerDetails = ({
  flowerBeds,
  beehives,
  createdAt,
}: CalculateFlowerDetails): Record<string, FlowerDetail> => {
  return getKeys(flowerBeds).reduce(
    (flowerDetails, flowerId) => ({
      ...flowerDetails,
      [flowerId]: getFlowerDetail({
        flowerId,
        flowerBeds,
        beehives,
        createdAt,
      }),
    }),
    {}
  );
};

const getBeehiveDetail = ({
  game,
  beehive,
  createdAt,
}: GetBeehiveDetail): BeehiveDetail => {
  const produced = beehive.flowers.reduce(
    (honey, flower) => honey + flower.attachedUntil - flower.attachedAt,
    beehive.honey.produced
  );
  const lastAttachment = beehive.flowers.sort(
    (a, b) => b.attachedUntil - a.attachedUntil
  )[0];

  return {
    beehiveAvailableAt: lastAttachment
      ? lastAttachment.attachedUntil
      : createdAt,
    availableTime: getHoneyProductionTime(game) - produced,
  };
};

const calculateHiveDetails = ({
  game,
  createdAt,
}: CalculateHiveDetails): Record<string, BeehiveDetail> => {
  return getKeys(game.beehives).reduce(
    (hiveDetails, beeHiveId) => ({
      ...hiveDetails,
      [beeHiveId]: getBeehiveDetail({
        game,
        beehive: game.beehives[beeHiveId],
        createdAt,
      }),
    }),
    {}
  );
};

const attachFlowers = ({ game, createdAt }: AttachFlowers) => {
  const stateCopy = cloneDeep(game);
  const { flowers, beehives } = stateCopy;

  let flowerDetails = calculateFlowerDetails({
    beehives,
    flowerBeds: flowers.flowerBeds,
    createdAt,
  });
  let hiveDetails = calculateHiveDetails({
    game: stateCopy,
    createdAt,
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    flowerDetails = Object.fromEntries(
      Object.entries(flowerDetails).filter(
        ([, flowerDetail]) => flowerDetail.availableTime > 0
      )
    );
    hiveDetails = Object.fromEntries(
      Object.entries(hiveDetails).filter(
        ([, hiveDetail]) => hiveDetail.availableTime > 0
      )
    );

    const flower = Object.entries(flowerDetails).sort(
      (a, b) => a[1].flowerAvailableAt - b[1].flowerAvailableAt
    )[0];

    const hive = Object.entries(hiveDetails).sort(
      (a, b) => a[1].beehiveAvailableAt - b[1].beehiveAvailableAt
    )[0];

    // Nothing more to be done
    if (!flower || !hive) break;

    const [flowerId, flowerDetail] = flower;
    const [hiveId, hiveDetail] = hive;

    const attachedAt = Math.max(
      hiveDetail.beehiveAvailableAt,
      flowerDetail.flowerAvailableAt
    );
    const attachedUntil =
      attachedAt +
      Math.min(hiveDetail.availableTime, flowerDetail.availableTime);

    // Attach to hive
    beehives[hiveId].flowers.push({
      attachedAt,
      attachedUntil,
      id: flowerId,
      rate: getFlowerProductionRate(stateCopy),
    });

    // Update flowerDetails
    flowerDetails[flowerId].availableTime -= attachedUntil - attachedAt;
    flowerDetails[flowerId].flowerAvailableAt = attachedUntil;
    hiveDetails[hiveId].availableTime -= attachedUntil - attachedAt;
    hiveDetails[hiveId].beehiveAvailableAt = attachedUntil;
  }

  return beehives;
};

export function updateBeehives({ game, createdAt }: UpdateBeehives) {
  let beehivesCopy = updateProducedHoney({ game, createdAt });

  beehivesCopy = removeInactiveFlowers({
    beehives: beehivesCopy,
    createdAt,
  });

  beehivesCopy = attachFlowers({
    game: { ...game, beehives: beehivesCopy },
    createdAt,
  });

  return beehivesCopy;
}
