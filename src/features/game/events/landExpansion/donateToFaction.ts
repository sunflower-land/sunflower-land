import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { FactionName, GameState } from "features/game/types/game";
import { getDayOfYear } from "lib/utils/time";

const DAILY_SFL_DONATION_LIMIT = 500;

type DonationType = "resources" | "sfl";

const POINTS_PER_TYPE: Record<DonationType, number> = {
  resources: 5,
  sfl: 20,
};

export type DonateToFactionAction = {
  type: "faction.donated";
  faction: FactionName;
  donation: {
    sfl?: number;
    resources?: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: DonateToFactionAction;
  createdAt?: number;
};

export function donateToFaction({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game: GameState = cloneDeep(state);
  const today = getDayOfYear(new Date(createdAt));

  if (game.faction?.name !== action.faction) {
    throw new Error("You are not a member of the this faction");
  }

  if (!action.donation.resources && !action.donation.sfl) {
    throw new Error("Invalid donation");
  }

  // Resources donation
  if (action.donation.resources) {
    const request = game.dailyFactionDonationRequest;

    if (!request) {
      throw new Error("No donation request found for the faction");
    }

    const playerBalance = game.inventory[request.resource] ?? new Decimal(0);

    if (playerBalance.lt(action.donation.resources)) {
      throw new Error("You do not have enough resources to donate");
    }

    const requestedAmount = new Decimal(request.amount);
    const totalPointsReward =
      (action.donation.resources / requestedAmount.toNumber()) *
      POINTS_PER_TYPE["resources"];

    game.inventory[request.resource] = playerBalance.minus(
      action.donation.resources
    );
    game.faction.points = game.faction.points + totalPointsReward;

    // Update total items donated
    game.faction.donated.totalItems[request.resource] =
      (game.faction.donated.totalItems[request.resource] ?? 0) +
      request.amount.toNumber();

    const donatedResourcesToday =
      game.faction.donated?.daily.resources.day === today;

    if (donatedResourcesToday) {
      // Today's Donation record
      const alreadyDonated = game.faction.donated?.daily.resources.amount ?? 0;
      game.faction.donated.daily.resources.amount =
        alreadyDonated + request.amount.toNumber();
    } else {
      // New day, reset the daily donation record
      game.faction.donated.daily.resources.day = today;
      game.faction.donated.daily.resources.amount = request.amount.toNumber();
    }
  }

  // SFL donation
  if (action.donation.sfl) {
    if (action.donation.sfl % 10 !== 0) {
      throw new Error("SFL donation amount must be a multiple of 10");
    }

    if (game.balance.lt(action.donation.sfl)) {
      throw new Error("You do not have enough SFL to donate");
    }

    const donatedSFLToday = game.faction.donated?.daily.sfl.day === today;
    const points = (action.donation.sfl / 10) * POINTS_PER_TYPE.sfl;

    if (donatedSFLToday) {
      // Today's Donation record
      const alreadyDonated = game.faction.donated?.daily.sfl.amount ?? 0;
      const exceedsLimit =
        alreadyDonated + action.donation.sfl > DAILY_SFL_DONATION_LIMIT;

      if (exceedsLimit) {
        throw new Error("You have reached the daily donation limit");
      }

      game.faction.donated.daily.sfl.amount =
        alreadyDonated + action.donation.sfl;
    } else {
      // New day, reset the daily donation record
      game.faction.donated.daily.sfl.day = today;
      game.faction.donated.daily.sfl.amount = action.donation.sfl;
    }

    game.faction.donated.totalItems.sfl =
      (game.faction.donated.totalItems.sfl ?? 0) + action.donation.sfl;
    game.balance = game.balance.minus(action.donation.sfl);
    game.faction.points = game.faction.points + points;
  }

  return game;
}
