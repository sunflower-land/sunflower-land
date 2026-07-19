import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import useSWR from "swr";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { CONFIG } from "lib/config";

import { getGiveaways } from "../actions/getGiveaways";
import { getGiveawayLeaderboard } from "../actions/getGiveawayLeaderboard";
import { GiveawayLeaderboard, prizeForPosition } from "./GiveawayLeaderboard";

export const GiveawayBoard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const token = authService.getSnapshot().context.user.rawToken as string;

  const playerId = useSelector(gameService, (state) => state.context.farmId);
  const gameState = useSelector(gameService, (state) => state.context.state);
  const isAdmin = hasFeatureAccess(gameState, "GIVEAWAY_ADMIN");

  // Which giveaway's results are being viewed (undefined = the list).
  const [resultsId, setResultsId] = useState<string>();
  const [joiningId, setJoiningId] = useState<string>();

  const { isJoining, joinSettled, isClaiming, claimSettled } = useSelector(
    gameService,
    (state) => ({
      isJoining: state.matches("joiningGiveaway"),
      joinSettled:
        state.matches("joiningGiveawaySuccess") ||
        state.matches("joiningGiveawayFailed"),
      isClaiming: state.matches("claimingGiveaway"),
      claimSettled:
        state.matches("claimingGiveawaySuccess") ||
        state.matches("claimingGiveawayFailed"),
    }),
  );

  // In offline / UI mode there's no token, but the actions serve mock data.
  const canFetch = !!token || !CONFIG.API_URL;

  const { data: feed } = useSWR(
    canFetch ? ["giveaways"] : null,
    () => getGiveaways({ token }),
    { refreshInterval: 10000 },
  );

  // Board for the giveaway being viewed — used to render results + gate claim.
  const { data: resultsBoard, mutate: mutateResults } = useSWR(
    canFetch && resultsId ? ["giveawayLeaderboard", resultsId] : null,
    () => getGiveawayLeaderboard({ token, id: resultsId as string }),
    { refreshInterval: 5000 },
  );

  // On a completed join effect, drop straight into the mini-game.
  useEffect(() => {
    if (joinSettled && joiningId) {
      gameService.send("CONTINUE");
      navigate(`/giveaway/play/${joiningId}`);
    }
  }, [joinSettled, joiningId, gameService, navigate]);

  useEffect(() => {
    if (claimSettled) {
      gameService.send("CONTINUE");
      mutateResults();
    }
  }, [claimSettled, gameService, mutateResults]);

  const join = (id: string) => {
    // Offline / UI mode: no backend to join — drop straight into the race.
    if (!CONFIG.API_URL) {
      navigate(`/giveaway/play/${id}`);
      return;
    }
    setJoiningId(id);
    gameService.send("giveaway.joined", {
      effect: { type: "giveaway.joined", giveawayId: id },
      authToken: token,
    });
  };

  const claim = (id: string) => {
    gameService.send("giveaway.claimed", {
      effect: { type: "giveaway.claimed", giveawayId: id },
      authToken: token,
    });
  };

  // ---- Results view -------------------------------------------------------
  if (resultsId) {
    const playerRow = resultsBoard?.leaderboard.find(
      (r) => r.farmId === playerId,
    );
    const prizeTier =
      playerRow && resultsBoard
        ? prizeForPosition(resultsBoard.prizes, playerRow.position)
        : undefined;
    const canClaim = resultsBoard?.status === "complete" && !!prizeTier;

    return (
      <CloseButtonPanel
        title={t("giveaway.results")}
        onClose={onClose}
        onBack={() => setResultsId(undefined)}
      >
        <div className="flex flex-col gap-2 p-1">
          <GiveawayLeaderboard id={resultsId} />
          {canClaim &&
            (isClaiming ? (
              <Loading text={t("claiming")} />
            ) : (
              <Button onClick={() => claim(resultsId)}>
                {t("giveaway.claimPrize")}
              </Button>
            ))}
        </div>
      </CloseButtonPanel>
    );
  }

  // ---- List view ----------------------------------------------------------
  const active = feed?.active ?? [];
  const past = feed?.recent ?? [];

  return (
    <CloseButtonPanel title={t("giveaway.title")} onClose={onClose}>
      <div className="flex flex-col gap-2 p-1">
        {isAdmin && (
          <Button
            onClick={() => {
              onClose();
              navigate("/giveaway/create");
            }}
          >
            {t("giveaway.create")}
          </Button>
        )}

        {!feed && <Loading />}

        {feed && active.length === 0 && past.length === 0 && (
          <p className="text-sm p-1">{t("giveaway.none")}</p>
        )}

        {active.map((giveaway) => (
          <InnerPanel key={giveaway.id} className="flex flex-col gap-2 p-2">
            <div className="flex justify-between items-center">
              <Label type="default">{giveaway.title}</Label>
              <Label type={giveaway.status === "live" ? "success" : "warning"}>
                {giveaway.status === "live"
                  ? t("giveaway.live")
                  : t("giveaway.upcoming")}
              </Label>
            </div>
            {giveaway.description && (
              <p className="text-xs">{giveaway.description}</p>
            )}
            {isJoining && joiningId === giveaway.id ? (
              <Loading text={t("giveaway.joining")} />
            ) : (
              <Button onClick={() => join(giveaway.id)}>
                {t("giveaway.clickToJoin")}
              </Button>
            )}
          </InnerPanel>
        ))}

        {past.length > 0 && (
          <>
            <Label type="default">{t("giveaway.pastResults")}</Label>
            {past.map((giveaway) => (
              <InnerPanel
                key={giveaway.id}
                className="flex justify-between items-center gap-2 p-2"
              >
                <span className="text-xs flex-1 truncate">
                  {giveaway.title}
                </span>
                <Button
                  className="w-auto text-xxs"
                  onClick={() => setResultsId(giveaway.id)}
                >
                  {t("giveaway.viewResults")}
                </Button>
              </InnerPanel>
            ))}
          </>
        )}
      </div>
    </CloseButtonPanel>
  );
};
