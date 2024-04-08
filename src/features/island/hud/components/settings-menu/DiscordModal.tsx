import React, { useContext, useState } from "react";

import { redirectOAuth } from "features/auth/actions/oauth";
import * as Auth from "features/auth/lib/Provider";
import budIcon from "src/assets/icons/bud.png";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { InventoryItemName } from "features/game/types/game";
import { addDiscordRole, DiscordRole } from "features/game/actions/discordRole";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Discord: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [state, setState] = useState<
    "idle" | "noDiscord" | "joining" | "joined" | "error"
  >(authState.context.user.token?.discordId ? "idle" : "noDiscord");

  const inventory = gameState.context.state.inventory;
  const buds = gameState.context.state.buds;
  const oauth = () => {
    redirectOAuth();
  };

  const addRole = async (role: DiscordRole) => {
    if (!authState.context.user.token?.discordId) {
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

  const getContent = (): JSX.Element => {
    if (state === "error") {
      return <span className="text-shadow">{t("getContent.error")}</span>;
    }

    if (state === "joining") {
      return (
        <span className="text-shadow loading">{t("getContent.joining")}</span>
      );
    }

    if (state === "joined") {
      return (
        <>
          <span className="text-shadow mt-2 block text-center">
            {t("congrats")}
          </span>
          <span className="text-shadow my-2 block text-center">
            {t("getContent.accessGranted")}
          </span>
        </>
      );
    }

    if (state === "noDiscord") {
      return (
        <>
          <span className="text-shadow my-2 block text-sm p-2">
            {t("getContent.connectToDiscord")}
          </span>
          <Button onClick={oauth}>{t("getContent.connect")}</Button>
        </>
      );
    }

    return (
      <span className="text-shadow my-2 block text-sm">
        {t("getContent.getAccess")}
        {GROUPS.map((group) => (
          <div key={group.channel} className="flex justify-between w-full mt-4">
            <div>
              <span className="flex-1">{group.channel}</span>
              <div className="flex items-center flex-wrap">
                <span className="text-xs mr-2">
                  {t("getContent.requires")}{" "}
                </span>
                {group.items.map((name) => (
                  <img
                    key={name}
                    src={ITEM_DETAILS[name].image}
                    className="h-6 mr-2"
                  />
                ))}
              </div>
            </div>
            <Button
              className="text-xs h-8 w-20"
              onClick={() => addRole(group.role)}
              disabled={!group.items.some((name) => inventory[name])}
            >
              {t("getContent.join")}
            </Button>
          </div>
        ))}
        <div key="buds" className="flex justify-between w-full mt-4">
          <div>
            <span className="flex-1">{"#bud-clubhouse"}</span>
            <div className="flex items-center flex-wrap">
              <span className="text-xs mr-2">{t("getContent.requires")}</span>
              <img src={budIcon} className="h-6 mr-2" />
            </div>
          </div>
          <Button
            className="text-xs h-8 w-20"
            onClick={() => addRole("bud-clubhouse")}
            disabled={Object.keys(buds ?? {}).length === 0}
          >
            {t("getContent.join")}
          </Button>
        </div>
      </span>
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel title="Discord" onClose={onClose}>
        {getContent()}
      </CloseButtonPanel>
    </Modal>
  );
};
