import { CONFIG } from "lib/config";
import { CAPTCHA_CONTAINER, CAPTCHA_ELEMENT } from "../components/Captcha";
import { SellAction } from "../events/sell";
import { PastAction } from "../lib/gameMachine";
import { makeGame } from "../lib/transforms";
import { CraftAction } from "../types/craftables";

type Request = {
  actions: PastAction[];
  farmId: number;
  sessionId: string;
  token: string;
  offset: number;
  captcha?: string;
};

const API_URL = CONFIG.API_URL;

function squashEvents(events: PastAction[]): PastAction[] {
  return events.reduce((items, event, index) => {
    if (index > 0) {
      const previous = items[items.length - 1];

      const isShopEvent =
        (event.type === "item.crafted" && previous.type === "item.crafted") ||
        (event.type === "item.sell" && previous.type === "item.sell");

      // We can combine the amounts when buying/selling the same item
      if (isShopEvent && event.item === previous.item) {
        return [
          ...items.slice(0, -1),
          {
            ...event,
            amount:
              (previous as SellAction | CraftAction).amount + event.amount,
          } as PastAction,
        ];
      }
    }

    return [...items, event];
  }, [] as PastAction[]);
}

function serialize(events: PastAction[], offset: number) {
  return events.map((action) => ({
    ...action,
    createdAt: new Date(action.createdAt.getTime() + offset).toISOString(),
  }));
}

export async function autosave(request: Request) {
  if (!API_URL) return { verified: true };

  // Shorten the payload
  const events = squashEvents(request.actions);

  // Serialize values before sending
  const actions = serialize(events, request.offset);

  const response = await window.fetch(`${API_URL}/autosave`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      farmId: request.farmId,
      sessionId: request.sessionId,
      actions,
      captcha: request.captcha,
    }),
  });

  if (response.status === 429) {
    return { verified: false };
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not save game");
  }

  const data = await response.json();

  const farm = makeGame(data.farm);

  return { verified: true, farm };
}

declare const grecaptcha: any;

let captchaId: number;
let captchaToken = "";

/**
 * Programatically renders a captcha to solve
 */
export async function solveCaptcha() {
  try {
    console.log("TIME TO SOLVE!");
    // Captcha takes a little while to mount
    await new Promise((res) => setTimeout(res, 50));
    if (!captchaId) {
      captchaId = grecaptcha.render(CAPTCHA_ELEMENT, {
        sitekey: "6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s",
        callback: (token: string) => {
          captchaToken = token;
        },
      });
    } else {
      grecaptcha.reset(captchaId);
    }

    // Poll until the token changes
    const previousToken = captchaToken;
    const token: string = await new Promise((res) => {
      const interval = setInterval(() => {
        if (captchaToken !== previousToken) {
          res(captchaToken);
          clearInterval(interval);
        }
      });
    });

    await new Promise((res) => setTimeout(res, 1000));

    return token;
  } catch (e) {
    console.log({ e });
    throw e;
  }
}
