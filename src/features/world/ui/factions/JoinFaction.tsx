import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import sflIcon from "assets/icons/flower_token.webp";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { FactionName } from "features/game/types/game";
import {
  FACTION_BOOST_COOLDOWN,
  SFL_COST,
} from "features/game/events/landExpansion/joinFaction";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useSound } from "lib/utils/hooks/useSound";
import { InlineDialogue } from "../TypingMessage";
import { NPCName } from "lib/npcs";
import { FACTION_BANNERS, getPreviousWeek } from "features/game/lib/factions";
import {
  getChampionsLeaderboard,
  KingdomLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { getKeys } from "features/game/types/decorations";
import { Loading } from "features/auth/components";
import { useNow } from "lib/utils/hooks/useNow";

export const FACTION_RECRUITERS: Record<FactionName, NPCName> = {
  goblins: "graxle",
  bumpkins: "barlow",
  sunflorians: "reginald",
  nightshades: "nyx",
};

interface Props {
  faction: FactionName;
  onClose: () => void;
}

const _joinedFaction = (state: MachineState) => state.context.state.faction;
const _farmId = (state: MachineState) => state.context.farmId;

export const JoinFaction: React.FC<Props> = ({ faction, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [cost, setCost] = useState(10000000);
  const [isLoading, setIsLoading] = useState(true);

  const now = useNow();

  const joinedFaction = useSelector(gameService, _joinedFaction);
  const farmId = useSelector(gameService, _farmId);

  const recruiterVoice = useSound(FACTION_RECRUITERS[faction] as any);

  const sameFaction = joinedFaction && joinedFaction.name === faction;
  const hasSFL = gameService.getSnapshot().context.state.balance.gte(cost);
  const previousFaction =
    gameService.getSnapshot().context.state.previousFaction;
  const hasRecentlyLeftFaction =
    previousFaction &&
    now - previousFaction.leftAt < FACTION_BOOST_COOLDOWN &&
    previousFaction.name !== faction;

  useEffect(() => {
    const load = async () => {
      let champions: KingdomLeaderboard | undefined = undefined;

      try {
        champions = await getChampionsLeaderboard({
          farmId,
          date: getPreviousWeek(),
        });
      } catch {
        setCost(10);
        setIsLoading(false);
      }

      // Error occurred - let them join for 10
      if (!champions) {
        setCost(10);
        setIsLoading(false);
        return;
      }

      // Order the faction names by their rank
      const totals = getKeys(champions.marks.totalTickets).sort((a, b) => {
        return (
          (champions.marks.totalTickets[b] as number) -
          (champions.marks.totalTickets[a] as number)
        );
      });

      const position = totals.indexOf(faction);
      const fee = [...SFL_COST].reverse()[position] ?? 10;
      setCost(fee);
      setIsLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    if (sameFaction) {
      recruiterVoice.play();
    }
  }, [joinedFaction]);

  const handlePledge = () => {
    gameService.send({ type: "faction.joined", faction, sfl: cost });
    recruiterVoice.play();
  };

  const intro = `${t("faction.restrited.area", {
    faction: capitalize(faction),
  })} ${t("faction.not.pledged", { faction: capitalize(faction) })}`;

  const cooldownMessage = hasRecentlyLeftFaction
    ? `You recently left the ${capitalize(
        previousFaction.name,
      )} faction. XP boosts are disabled until ${new Date(
        previousFaction.leftAt + FACTION_BOOST_COOLDOWN,
      ).toLocaleDateString()} if you join the ${capitalize(faction)} faction.`
    : null;

  const confirmFaction = `${t("faction.cost", {
    cost,
    faction: capitalize(faction),
  })} ${t("faction.pledge.reward", { banner: FACTION_BANNERS[faction] })}`;

  // If joined a different faction, show a message that they can't change
  if (joinedFaction && joinedFaction.name !== faction) {
    return (
      <>
        <div className="flex flex-col p-2 pt-1 space-y-2">
          <div className="flex justify-between">
            <Label type="default">{capitalize(faction)}</Label>
            <Label type="danger">{t("faction.noAccess")}</Label>
          </div>
          <span className="text-xs sm:text-sm">
            {t("faction.restrited.area", { faction: capitalize(faction) })}
          </span>
        </div>
      </>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {!showConfirm && !joinedFaction && (
        <>
          <div className="flex flex-col px-2 py-1 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{capitalize(faction)}</Label>
              <Label type="danger">{t("faction.noAccess")}</Label>
            </div>
            <span className="text-xs sm:text-sm space-y-2">
              {cooldownMessage && (
                <Label type="warning">{cooldownMessage}</Label>
              )}
              <InlineDialogue message={intro} />
            </span>
          </div>
          <Button className="mt-2" onClick={() => setShowConfirm(true)}>
            {t("faction.join", { faction: capitalize(faction) })}
          </Button>
        </>
      )}
      {showConfirm && !joinedFaction && !confirmed && (
        <>
          <div className="flex flex-col p-2 pt-1 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{capitalize(faction)}</Label>
              <Label type={hasSFL ? "warning" : "danger"} icon={sflIcon}>
                {`${cost} FLOWER`}
              </Label>
            </div>
            <span className="text-xs sm:text-sm mb-2">
              <InlineDialogue message={confirmFaction} />
            </span>
          </div>
          <div className="flex space-x-1">
            <Button onClick={onClose}>{t("cancel")}</Button>
            <Button disabled={!hasSFL} onClick={() => setConfirmed(true)}>
              {t("continue")}
            </Button>
          </div>
        </>
      )}

      {confirmed && !joinedFaction && (
        <>
          <ClaimReward
            reward={{
              sfl: 0,
              factionPoints: 0,
              items: { [FACTION_BANNERS[faction]]: 1 },
              coins: 0,
              createdAt: new Date().getTime(),
              id: `${new Date().getTime()}`,
              wearables: {},
            }}
            onClaim={handlePledge}
            onClose={onClose}
          />
        </>
      )}

      {joinedFaction && (
        <>
          <div className="flex flex-col p-2 pt-1 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{capitalize(faction)}</Label>
            </div>
            <span className="text-xs sm:text-sm">
              <InlineDialogue message={t(`faction.greeting.${faction}`)} />
            </span>
          </div>
        </>
      )}
    </>
  );
};
