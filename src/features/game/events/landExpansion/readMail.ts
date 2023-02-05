import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ReadMailAction = {
  type: "mail.read";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ReadMailAction;
};

export function readMail({ state, action }: Options): GameState {
  const game = cloneDeep(state);
  const { mail, bumpkin } = game;
  const letter = mail.letters.find((l) => l.id === action.id);

  if (!letter) {
    throw new Error("No letter exists");
  }

  if (letter.gift?.sfl) {
    game.balance = game.balance.add(letter.gift?.sfl);
  }

  if (letter.gift?.items) {
    getKeys(letter.gift?.items).forEach((name) => {
      const previousAmount = game.inventory[name] || new Decimal(0);

      game.inventory[name] = previousAmount.add(letter.gift?.items[name] || 0);
    });
  }

  console.log({ inve: game.inventory });
  // Remove the letter
  game.mail.letters = game.mail.letters.filter((l) => l.id !== action.id);

  bumpkin.activity = trackActivity("Mail Read", bumpkin?.activity);

  return game;
}
