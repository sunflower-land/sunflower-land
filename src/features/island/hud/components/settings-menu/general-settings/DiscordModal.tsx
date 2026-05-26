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
import type { FactionName, InventoryItemName } from "features/game/types/game";
import {
  addDiscordRole,
  type DiscordRole,
} from "features/game/actions/discordRole";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";

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

  // `state.discord.connected` reflects the live OAuth link; `discordId`
  // can persist after a disconnect. See LinkedAccounts.tsx for the same
  // distinction.
  const isDiscordConnected = !!gameState.context.state.discord?.connected;

  const [state, setState] = useState<
    "idle" | "noDiscord" | "joining" | "joined" | "error"
  >(isDiscordConnected ? "idle" : "noDiscord");

  const inventory = gameState.context.state.inventory;
  const faction = gameState.context.state.faction?.name;

  const buds = gameState.context.state.buds;
  const oauth = () => {
    discordOAuth({ nonce: gameState.context.oauthNonce });
  };

  const addRole = async (role: DiscordRole) => {
    if (!isDiscordConnected) {
      setState("noDiscord");
      return;
    }

    setState("joining");

    try {
      await addDiscordRole({
        farmId: gameService.getSnapshot().context.farmId,
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
      <div className="flex flex-col gap-2">
        <p className="text-sm p-2">{t("getContent.connectToDiscord")}</p>
        <Button onClick={oauth}>{t("getContent.connect")}</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs mx-1 mb-1">{t("getContent.getAccess")}</p>

      {GROUPS.map((group) => (
        <DiscordRoleCard
          key={group.channel}
          channel={group.channel}
          onJoin={() => addRole(group.role)}
          disabled={!group.items.some((name) => inventory[name])}
        >
          <span className="text-xs mr-1">{t("getContent.requires")}</span>
          {group.items.map((name) => (
            <img
              key={name}
              src={ITEM_DETAILS[name].image}
              className="h-6 mr-1"
            />
          ))}
        </DiscordRoleCard>
      ))}

      <DiscordRoleCard
        channel="#bud-clubhouse"
        onJoin={() => addRole("bud-clubhouse")}
        disabled={Object.keys(buds ?? {}).length === 0}
      >
        <span className="text-xs mr-1">{t("getContent.requires")}</span>
        <img src={budIcon} className="h-6 mr-1" />
      </DiscordRoleCard>

      {faction && (
        <DiscordRoleCard
          channel={`#${faction}`}
          onJoin={() => addRole(faction)}
          disabled={false}
        >
          <img src={getFactionImage(faction)} className="h-6 mr-1" />
        </DiscordRoleCard>
      )}
    </div>
  );
};

const DiscordRoleCard: React.FC<{
  channel: string;
  onJoin: () => void;
  disabled: boolean;
  children: React.ReactNode;
}> = ({ channel, onJoin, disabled, children }) => {
  const { t } = useAppTranslation();

  return (
    <ButtonPanel variant="card">
      <div className="flex items-center justify-between gap-2">
        <Label type="default">{channel}</Label>
        <Button
          className="text-xs h-8 max-w-45 min-w-20"
          onClick={onJoin}
          disabled={disabled}
        >
          {t("getContent.join")}
        </Button>
      </div>
      <div className="flex items-center flex-wrap mt-2 ml-1">{children}</div>
    </ButtonPanel>
  );
};
