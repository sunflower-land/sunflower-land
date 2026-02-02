import Decimal from "decimal.js-light";
import { getAnimalLevel } from "features/game/lib/animals";
import { getKeys } from "features/game/types/decorations";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { Animal, BountyRequest, GameState } from "features/game/types/game";
import {
  getChapterTicket,
  getCurrentChapter,
  CHAPTERS,
} from "features/game/types/chapters";
import { produce } from "immer";
import { generateBountyTicket, generateBountyCoins } from "./sellBounty";
import {
  CHAPTER_TRACKS,
  getChapterTaskPoints,
  getTrackMilestonesCrossed,
} from "features/game/types/tracks";
import { gameAnalytics } from "lib/gameAnalytics";

export function isValidDeal({
  animal,
  deal,
}: {
  animal: Animal;
  deal: BountyRequest;
}) {
  if (animal.type !== deal.name) {
    return false;
  }

  /**
   * If animal is ready, it would normally show its previous level until they claim yield.
   * Hence we should check their effective level to be the previous level.
   */
  if (
    animal.state === "ready" &&
    getAnimalLevel(animal.experience, animal.type) - 1 < deal.level
  ) {
    return false;
  }

  if (getAnimalLevel(animal.experience, animal.type) < deal.level) {
    return false;
  }

  if (animal.awakeAt && animal.awakeAt > Date.now()) {
    return false;
  }

  return true;
}

export type SellAnimalAction = {
  type: "animal.sold";
  requestId: string;
  animalId: string;
};

type Options = {
  state: GameState;
  action: SellAnimalAction;
  createdAt?: number;
};

export const SICK_ANIMAL_REWARD_MULTIPLIER = 0.75;

export function getSickAnimalRewardAmount(amount: number) {
  return Math.floor(amount * SICK_ANIMAL_REWARD_MULTIPLIER);
}

export function sellAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const request = game.bounties.requests.find(
      (deal) => deal.id === action.requestId,
    );

    if (!request) {
      throw new Error("Bounty does not exist");
    }

    const completed = game.bounties.completed.find(
      (c) => c.id === action.requestId,
    );
    if (completed) {
      throw new Error("Bounty already completed");
    }

    const { animals } = request.name === "Chicken" ? game.henHouse : game.barn;

    const animal = animals[action.animalId];
    if (!animal) {
      throw new Error("Animal does not exist");
    }

    if (!isValidDeal({ animal, deal: request })) {
      throw new Error("Animal does not meet requirements");
    }

    const isSick = animal.state === "sick";

    delete animals[action.animalId];

    if (request.coins) {
      const { coins } = generateBountyCoins({
        game: state,
        bounty: request,
      });
      game.coins += isSick ? getSickAnimalRewardAmount(coins) : coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      let amount = request.items?.[name] ?? 0;

      if (name === getChapterTicket(createdAt)) {
        amount = generateBountyTicket({
          game,
          bounty: request,
          now: createdAt,
        });
        const chapter = getCurrentChapter(createdAt);
        const pointsAwarded = getChapterTaskPoints({
          task: "bounty",
          points: amount ?? 0,
        });
        const previousPoints =
          game.farmActivity[`${chapter} Points Earned`] ?? 0;
        const nextPoints = previousPoints + pointsAwarded;
        const chapterTrack = CHAPTER_TRACKS[chapter];

        if (chapterTrack) {
          const daysSinceStart =
            (createdAt - CHAPTERS[chapter].startDate.getTime()) /
            (24 * 60 * 60 * 1000);

          gameAnalytics.trackTracksPoints({
            chapter,
            source: "bounty",
            points: pointsAwarded,
          });

          if (previousPoints === 0 && nextPoints > 0) {
            gameAnalytics.trackTracksActivated({
              chapter,
              source: "bounty",
            });
          }

          const crossed = getTrackMilestonesCrossed({
            chapterTrack,
            previousPoints,
            nextPoints,
          });

          crossed.forEach((milestone) => {
            gameAnalytics.trackTracksMilestoneReached({
              chapter,
              milestone,
              daysSinceStart,
            });
          });

          const finalPoints =
            chapterTrack.milestones[chapterTrack.milestones.length - 1]
              ?.points ?? 0;

          if (previousPoints < finalPoints && nextPoints >= finalPoints) {
            gameAnalytics.trackTracksComplete({
              chapter,
              daysSinceStart,
            });
          }
        }

        game.farmActivity = trackFarmActivity(
          `${getChapterTicket(createdAt)} Collected`,
          game.farmActivity,
          new Decimal(amount ?? 0),
        );
        game.farmActivity = trackFarmActivity(
          `${chapter} Points Earned`,
          game.farmActivity,
          new Decimal(pointsAwarded),
        );
      }

      game.inventory[name] = previous.add(
        isSick ? getSickAnimalRewardAmount(amount) : amount,
      );
    });

    game.bounties.completed = [
      ...game.bounties.completed,
      {
        id: request.id,
        soldAt: createdAt,
      },
    ];

    game.farmActivity = trackFarmActivity(
      `${animal.type} Bountied`,
      game.farmActivity,
    );

    return game;
  });
}
