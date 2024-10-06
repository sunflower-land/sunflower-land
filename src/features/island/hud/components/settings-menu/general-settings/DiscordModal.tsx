import React, { useContext, useState } from "react";

import { discordOAuth } from "features/auth/actions/oauth";
import * as Auth from "features/auth/lib/Provider";
import budIcon from "assets/icons/bud.png";

// faction banners
import bumpkinBanner from "assets/decorations/banners/factions/bumpkins_banner.webp";
import sunflorianBanner from "assets/decorations/banners/factions/sunflorians_banner.webp";
import goblinBanner from "assets/decorations/banners/factions/goblins_banner.webp";
import nightshadeBanner from "assets/decorations/banners/factions/nightshades_banner.webp";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { FactionName, InventoryItemName } from "features/game/types/game";
import { addDiscordRole, DiscordRole } from "features/game/actions/discordRole";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";

const GROUPS: {
  channel: string;
  role: DiscordRole;
  items: InventoryItemName[];
}[] = [
  {
    channel: "#diamond-farmers",
    role: "diamond-farmers",
    items: [
      "Foreman Beaver",
      "Kuebiko",
      "Nugget",
      "Golden Cauliflower",
      "Gold Egg",
      "Christmas Tree",
    ],
  },
];

function getFactionImage(faction: FactionName) {
  switch (faction) {
    case "bumpkins":
      return bumpkinBanner;
    case "sunflorians":
      return sunflorianBanner;
    case "goblins":
      return goblinBanner;
    case "nightshades":
      return nightshadeBanner;
    default:
      return "";
  }
}
export const Discord: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [state, setState] = useState<
    "idle" | "noDiscord" | "joining" | "joined" | "error"
  >(gameState.context.discordId ? "idle" : "noDiscord");

  const inventory = gameState.context.state.inventory;
  const faction = gameState.context.state.faction?.name;

  const buds = gameState.context.state.buds;
  const oauth = () => {
    discordOAuth({ nonce: gameState.context.oauthNonce });
  };

  const addRole = async (role: DiscordRole) => {
    if (!gameState.context.discordId) {
      setState("noDiscord");
      return;
    }

    setState("joining");

    try {
      await addDiscordRole({
        farmId: gameService.state.context.farmId,
        token: authState.context.user.rawToken as string,
        role: role,
      });
      setState("joined");
    } catch (e) {
      setState("error");
    }
  };

  // if (CONFIG.NETWORK === "amoy") {
  //   return null;
  // }

  if (state === "error") {
    return <span className="">{t("getContent.error")}</span>;
  }

  if (state === "joining") {
    return <span className=" loading">{t("getContent.joining")}</span>;
  }

  if (state === "joined") {
    return (
      <>
        <span className=" mt-2 block text-center">{t("congrats")}</span>
        <span className=" my-2 block text-center">
          {t("getContent.accessGranted")}
        </span>
      </>
    );
  }

  if (state === "noDiscord") {
    return (
      <>
        <span className=" my-2 block text-sm p-2">
          {t("getContent.connectToDiscord")}
        </span>
        <Button onClick={oauth}>{t("getContent.connect")}</Button>
      </>
    );
  }

  return (
    <span className="my-1 block text-sm">
      {t("getContent.getAccess")}
      {GROUPS.map((group) => (
        <OuterPanel key={group.channel} className="mt-2">
          <div className="flex justify-between w-full mb-1">
            <div>
              <Label type="default" className="text-sm">
                {group.channel}
              </Label>
            </div>
            <Button
              className="text-xs h-8 w-20"
              onClick={() => addRole(group.role)}
              disabled={!group.items.some((name) => inventory[name])}
            >
              {t("getContent.join")}
            </Button>
          </div>
          <div className="flex items-center flex-wrap ml-1 mb-0.5">
            <span className="text-xs mr-1">{t("getContent.requires")}</span>
            {group.items.map((name) => (
              <img
                key={name}
                src={ITEM_DETAILS[name].image}
                className="h-6 mr-1"
              />
            ))}
          </div>
        </OuterPanel>
      ))}

      <OuterPanel key="buds" className="mt-2">
        <div className="flex justify-between w-full mb-1">
          <div>
            <Label type="default" className="text-sm">
              {"#bud-clubhouse"}
            </Label>
          </div>
          <Button
            className="text-xs h-8 w-20"
            onClick={() => addRole("bud-clubhouse")}
            disabled={Object.keys(buds ?? {}).length === 0}
          >
            {t("getContent.join")}
          </Button>
        </div>
        <div className="flex items-center flex-wrap ml-1 mb-0.5">
          <span className="text-xs mr-1">{t("getContent.requires")}</span>
          <img src={budIcon} className="h-6 mr-1" />
        </div>
      </OuterPanel>

      {faction && (
        <OuterPanel key="faction" className="mt-2">
          <div className="flex justify-between w-full mb-1">
            <div>
              <Label type="default" className="text-sm">{`#${faction}`}</Label>
            </div>
            <Button
              className="text-xs h-8 w-20"
              onClick={() => addRole(faction)}
              disabled={faction === undefined}
            >
              {t("getContent.join")}
            </Button>
          </div>
          <div className="flex items-center flex-wrap ml-1 mb-0.5">
            <img src={getFactionImage(faction)} className="h-6 mr-1" />
          </div>
        </OuterPanel>
      )}
    </span>
  );
};
