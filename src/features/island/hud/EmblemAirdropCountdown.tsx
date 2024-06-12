import React, { useContext, useEffect, useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import confetti from "canvas-confetti";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { FACTION_POINT_ICONS } from "features/world/ui/factions/FactionDonationPanel";
import { MachineState } from "features/game/lib/gameMachine";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { NPC_WEARABLES } from "lib/npcs";
import { formatDateTime } from "lib/utils/time";
import { FACTION_EMBLEM_ICONS } from "features/world/ui/factions/components/ClaimEmblems";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "lib/utils/capitalize";
import { FACTION_RECRUITERS } from "features/world/ui/factions/JoinFaction";

export const EMBLEM_AIRDROP_DATE = new Date("2024-06-14T00:00:00Z");
export const EMBLEM_AIRDROP_CLOSES = new Date("2024-07-31T00:00:00Z");

const KINGDOM_ROUTE = "/world/kingdom";

const _faction = (state: MachineState) => state.context.state.faction;

const Countdown: React.FC<{ time: Date; onComplete: () => void }> = ({
  time,
  onComplete,
}) => {
  const start = useCountdown(time.getTime());

  useEffect(() => {
    if (time.getTime() < Date.now()) {
      onComplete();
    }
  }, [start]);

  return <TimerDisplay time={start} />;
};

export const EmblemAirdropCountdown: React.FC = () => {
  const { showAnimations, gameService } = useContext(Context);
  const faction = useSelector(gameService, _faction);

  const [isClosed, setIsClosed] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!showConfetti) return;

    if (showAnimations) confetti();
  }, [showConfetti]);

  const travel = () => {
    navigate(KINGDOM_ROUTE);
    setIsClosed(true);
  };

  const now = Date.now();

  const isKingdom = location.pathname === KINGDOM_ROUTE;
  const hasEmblemsToClaim = !!faction?.points && !faction?.emblemsClaimedAt;
  const isCountingDown = EMBLEM_AIRDROP_DATE.getTime() > now;
  const hasEnded = EMBLEM_AIRDROP_CLOSES.getTime() < now;

  const showClaim = hasEmblemsToClaim || isCountingDown;

  if (isClosed || hasEnded) return null;
  if (!showClaim) return null;

  return (
    <InnerPanel className="flex justify-center" id="emblem-airdrop">
      <div>
        <div className="h-6 flex justify-center">
          <Label
            type="info"
            icon={SUNNYSIDE.icons.stopwatch}
            className={classNames("ml-1", { "mr-1": !!faction })}
            secondaryIcon={
              faction ? FACTION_POINT_ICONS[faction.name] : undefined
            }
          >
            {t("faction.emblemAirdrop")}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer ml-2"
            onClick={() => setIsClosed(true)}
          />
        </div>
        {isCountingDown && (
          <Countdown
            time={EMBLEM_AIRDROP_DATE}
            onComplete={() => setShowConfetti(true)}
          />
        )}
        {!isCountingDown && (
          <Button className="mt-1 p-0" onClick={() => setShowClaimModal(true)}>
            {t("claim")}
          </Button>
        )}
      </div>
      {faction && (
        <Modal show={showClaimModal} onHide={() => setShowClaimModal(false)}>
          <CloseButtonPanel
            bumpkinParts={NPC_WEARABLES[FACTION_RECRUITERS[faction.name]]}
          >
            <div className="flex justify-between p-1">
              <Label type="default" className="capitalize">
                {FACTION_RECRUITERS[faction.name]}
              </Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {t("faction.emblemAirdrop.closes", {
                  date: formatDateTime(EMBLEM_AIRDROP_CLOSES.toISOString()),
                })}
              </Label>
            </div>
            <div className="p-2 text-xs">
              {t("faction.claimEmblems.visitMe", {
                recruiterName: capitalize(FACTION_RECRUITERS[faction.name]),
              })}
            </div>
            <div className="flex items-center justify-between py-2 pr-1">
              <Label
                className="ml-2"
                type="success"
                icon={FACTION_EMBLEM_ICONS[faction.name]}
              >
                {t("faction.claimEmblems.emblemsEarned")}
              </Label>

              <div className="flex items-center">
                <img
                  src={FACTION_EMBLEM_ICONS[faction.name]}
                  className="w-4 h-auto"
                />
                <Label type="transparent">{faction.points}</Label>
              </div>
            </div>
            {isKingdom && (
              <Button onClick={() => setShowClaimModal(false)}>
                {t("close")}
              </Button>
            )}
            {!isKingdom && (
              <Button onClick={travel}>
                {t("faction.claimEmblems.travelNow")}
              </Button>
            )}
          </CloseButtonPanel>
        </Modal>
      )}
    </InnerPanel>
  );
};
