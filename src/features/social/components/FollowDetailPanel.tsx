import React, { useCallback, useEffect, useState } from "react";
import { ButtonPanel } from "components/ui/Panel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { OnlineStatus } from "./OnlineStatus";
import { getRelativeTime } from "lib/utils/time";
import { useTranslation } from "react-i18next";
import { Equipped } from "features/game/types/bumpkin";
import { Label } from "components/ui/Label";
import socialPointsIcon from "assets/icons/social_score.webp";
import potIcon from "assets/icons/pot.png";
import helpIcon from "assets/icons/help.webp";
import helpedIcon from "assets/icons/helped.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { shortenCount } from "lib/utils/formatNumber";
import classNames from "classnames";
import { HelpInfoPopover } from "./HelpInfoPopover";

type Props = {
  loggedInFarmId: number;
  playerId: number;
  clothing: Equipped;
  username: string;
  helpedThemToday: boolean;
  helpedYouToday: boolean;
  socialPoints: number;
  lastOnlineAt: number;
  hasCookingPot: boolean;
  helpStreak: number;
  navigateToPlayer: (playerId: number) => void;
};

export const FollowDetailPanel: React.FC<Props> = ({
  loggedInFarmId,
  playerId,
  clothing,
  username,
  helpedThemToday,
  helpedYouToday,
  socialPoints,
  lastOnlineAt,
  hasCookingPot,
  navigateToPlayer,
  helpStreak,
}: Props) => {
  const { t } = useTranslation();
  const [showPopover, setShowPopover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastOnline = getRelativeTime(lastOnlineAt, "short");

  const isOnline = lastOnlineAt > Date.now() - 30 * 60 * 1000;
  const isYou = loggedInFarmId === playerId;

  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    navigateToPlayer(playerId);
  }, [navigateToPlayer, playerId]);

  useEffect(() => {
    // Set mounted after a brief delay to prevent accidental triggers during mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [playerId]);

  return (
    <div className="relative">
      <ButtonPanel
        className={classNames(
          "flex gap-3 justify-between hover:bg-brown-300 transition-colors active:bg-brown-400",
        )}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2 w-full">
          <div className="relative">
            <div className="z-10">
              <NPCIcon parts={clothing} />
            </div>
            <div className="absolute -top-1 -right-1">
              <OnlineStatus
                loggedInFarmId={loggedInFarmId}
                playerId={playerId}
                lastUpdatedAt={lastOnlineAt}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 w-full">
            <div className="flex flex-col justify-center w-full">
              <div className="flex items-center justify-between w-full mb-0.5">
                <div className="text-xs">
                  {isYou ? `${t("you")}` : username}
                </div>
                <div className="flex flex-col items-end">
                  <Label type="chill" icon={socialPointsIcon}>
                    {shortenCount(socialPoints)}
                  </Label>
                </div>
              </div>
              {!isOnline ? (
                <div className="text-xxs mb-1.5">
                  {t("social.lastOnline", { time: lastOnline })}
                </div>
              ) : (
                <div className="text-xxs mb-1.5">{t("social.farming")}</div>
              )}
              <div className="flex items-center justify-between w-full">
                {(helpedThemToday || helpedYouToday || hasCookingPot) && (
                  <div className="relative flex items-center gap-1 flex-wrap">
                    <div
                      onPointerOver={(e) => {
                        if (e.pointerType === "mouse" && mounted) {
                          setShowPopover(true);
                        }
                      }}
                      onPointerOut={(e) => {
                        if (e.pointerType === "mouse" && mounted) {
                          setShowPopover(false);
                        }
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (mounted) {
                          setShowPopover(!showPopover);
                          setTimeout(() => {
                            setShowPopover(false);
                          }, 1500);
                        }
                      }}
                      onClickCapture={(e) => {
                        // Stop the additional synthetic event from from firing
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="absolute inset-0 min-w-8 h-8 bg-transparent z-20"
                    />
                    {helpedThemToday && (
                      <img src={helpIcon} className="w-5 h-5" />
                    )}
                    {helpedYouToday && (
                      <img src={helpedIcon} className="w-5 h-5" />
                    )}
                    {hasCookingPot && <img src={potIcon} className="w-5 h-5" />}
                  </div>
                )}

                {helpStreak > 0 && (
                  <Label type="vibrant" icon={SUNNYSIDE.icons.heart}>
                    {t("friendStreak.short", {
                      days: helpStreak,
                    })}
                  </Label>
                )}
              </div>
            </div>
          </div>
        </div>
      </ButtonPanel>
      <HelpInfoPopover
        showPopover={showPopover}
        onHide={() => setShowPopover(false)}
        helpedThemToday={helpedThemToday}
        helpedYouToday={helpedYouToday}
        hasCookingPot={hasCookingPot}
      />
    </div>
  );
};
