import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import useSWR from "swr";

import { Panel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

import { getGiveaways } from "../actions/getGiveaways";
import { CreateGiveaway } from "./CreateGiveaway";
import { GiveawayAreaBackground } from "./GiveawayAreaBackground";

/**
 * The creator "area" — a full screen an admin travels to (from the lobby or
 * `/giveaway/create`) to set up a giveaway and to end running ones. Once
 * created, the giveaway is picked up by players polling in the lobby.
 */
export const GiveawayCreatorArea: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const token = authService.getSnapshot().context.user.rawToken as string;

  const { isEnding, endSettled } = useSelector(gameService, (state) => ({
    isEnding: state.matches("endingGiveaway"),
    endSettled:
      state.matches("endingGiveawaySuccess") ||
      state.matches("endingGiveawayFailed"),
  }));

  const { data: feed, mutate } = useSWR(
    token || !CONFIG.API_URL ? ["giveaways"] : null,
    () => getGiveaways({ token }),
    { refreshInterval: 5000 },
  );

  useEffect(() => {
    if (endSettled) {
      gameService.send("CONTINUE");
      mutate();
    }
  }, [endSettled, gameService, mutate]);

  const end = (id: string) => {
    gameService.send("giveaway.ended", {
      effect: { type: "giveaway.ended", giveawayId: id },
      authToken: token,
    });
  };

  return (
    <GiveawayAreaBackground>
      <Panel>
        <div className="flex flex-col gap-2 p-1">
          <Label type="default">{t("giveaway.creatorArea")}</Label>

          <CreateGiveaway onBack={() => navigate("/world/stream")} />

          {!!feed?.active.length && (
            <InnerPanel className="flex flex-col gap-2 p-2">
              <Label type="warning">{t("giveaway.manage")}</Label>
              {feed.active.map((giveaway) => (
                <div
                  key={giveaway.id}
                  className="flex justify-between items-center gap-2"
                >
                  <span className="text-xs flex-1 truncate">
                    {giveaway.title}
                  </span>
                  <Label
                    type={giveaway.status === "live" ? "success" : "warning"}
                  >
                    {giveaway.status === "live"
                      ? t("giveaway.live")
                      : t("giveaway.upcoming")}
                  </Label>
                  <Button
                    className="w-auto text-xxs"
                    disabled={isEnding}
                    onClick={() => end(giveaway.id)}
                  >
                    {t("giveaway.end")}
                  </Button>
                </div>
              ))}
            </InnerPanel>
          )}
        </div>
      </Panel>
    </GiveawayAreaBackground>
  );
};
