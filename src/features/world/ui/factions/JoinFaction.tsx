import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import sflIcon from "assets/icons/sfl.webp";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { FactionName } from "features/game/types/game";
import { FACTION_BANNERS } from "features/game/events/landExpansion/pledgeFaction";
import {
  EMBLEM_QTY,
  FACTION_EMBLEMS,
  SFL_COST,
} from "features/game/events/landExpansion/joinFaction";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useSound } from "lib/utils/hooks/useSound";
import { InlineDialogue } from "../TypingMessage";
import { ClaimEmblems } from "./components/ClaimEmblems";
import { NPCName } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { EMBLEM_AIRDROP_CLOSES } from "features/island/hud/EmblemAirdropCountdown";
import { formatDateTime } from "lib/utils/time";

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
const _username = (state: MachineState) => state.context.state.username;
const _farmId = (state: MachineState) => state.context.farmId;

export const JoinFaction: React.FC<Props> = ({ faction, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const username = useSelector(gameService, _username);
  const joinedFaction = useSelector(gameService, _joinedFaction);
  const farmId = useSelector(gameService, _farmId);

  // Cheap way to memoize this value
  const [emblemsClaimed] = useState(!!joinedFaction?.emblemsClaimedAt);

  const recruiterVoice = useSound(FACTION_RECRUITERS[faction] as any);

  const sameFaction = joinedFaction && joinedFaction.name === faction;
  const hasSFL = gameService.state.context.state.balance.gte(SFL_COST);

  useEffect(() => {
    if (sameFaction) {
      recruiterVoice.play();
    }
  }, [joinedFaction]);

  const handlePledge = () => {
    gameService.send("faction.joined", { faction });
    recruiterVoice.play();
  };

  const intro = `${t("faction.restrited.area", {
    faction: capitalize(faction),
  })} ${t("faction.not.pledged", {
    faction: capitalize(faction),
  })}`;

  const confirmFaction = `${t("faction.cost", {
    cost: 10,
    faction: capitalize(faction),
  })} ${t("faction.pledge.reward", {
    emblems: EMBLEM_QTY,
    banner: FACTION_BANNERS[faction],
  })}`;

  // If joined a different faction, show a message that they can't change
  if (joinedFaction && joinedFaction.name !== faction) {
    return (
      <>
        <div className="flex flex-col p-2 pt-1 space-y-2">
          <div className="flex justify-between">
            <Label type="default">{capitalize(faction)}</Label>
            <Label type="danger">{`No Access`}</Label>
          </div>
          <span className="text-xs sm:text-sm">
            {t("faction.restrited.area", { faction: capitalize(faction) })}
          </span>
        </div>
      </>
    );
  }

  if (
    joinedFaction &&
    !emblemsClaimed &&
    !!joinedFaction.points &&
    EMBLEM_AIRDROP_CLOSES.getTime() > Date.now()
  ) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between px-1 pt-1">
          <Label type="default" className="capitalize">
            {FACTION_RECRUITERS[faction]}
          </Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {t("faction.emblemAirdrop.closes", {
              date: formatDateTime(EMBLEM_AIRDROP_CLOSES.toISOString()),
            })}
          </Label>
        </div>
        <ClaimEmblems
          faction={joinedFaction}
          farmId={farmId}
          playerName={username}
          onClose={onClose}
          onClaim={() => gameService.send("emblems.claimed")}
        />
      </div>
    );
  }

  return (
    <>
      {!showConfirm && !joinedFaction && (
        <>
          <div className="flex flex-col px-2 py-1 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{capitalize(faction)}</Label>
              <Label type="danger">{`No Access`}</Label>
            </div>
            <span className="text-xs sm:text-sm">
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
                {`${SFL_COST} SFL`}
              </Label>
            </div>
            <span className="text-xs sm:text-sm mb-2">
              <InlineDialogue message={confirmFaction} />
            </span>

            {/* <span className="text-xs sm:text-sm ">
              <InlineDialogue
                message=
              />
            </span> */}
          </div>
          <Label type="danger" className="mb-2">
            {t("faction.cannot.change")}
          </Label>
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
              items: {
                [FACTION_BANNERS[faction]]: 1,
                [FACTION_EMBLEMS[faction]]: EMBLEM_QTY,
              },
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
