import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { acknowledgeIntroduction } from "features/announcements/announcementsStorage";
import { Context } from "features/game/GameProvider";

import { SpeakingText } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { hasFeatureAccess } from "lib/flags";
import { COMPETITION_POINTS } from "features/game/types/competitions";
import { CompetitionModal } from "features/competition/CompetitionBoard";

export const Introduction: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  const showChallengesIntro = hasFeatureAccess(
    gameState.context.state,
    "ONBOARDING_REWARDS",
  );

  // TODO - change to FSL
  const competition = COMPETITION_POINTS.TESTING;

  const competitionIsActive =
    Date.now() > competition.startAt && competition.endAt > Date.now();

  return (
    <Modal show={gameState.matches("introduction")}>
      {competitionIsActive && (
        <CompetitionModal
          competitionName="FSL"
          onClose={() => {
            acknowledgeIntroduction();
            send("ACKNOWLEDGE");

            gameAnalytics.trackMilestone({
              event: "Tutorial:Intro:Completed",
            });
          }}
        />
      )}
      {!competitionIsActive && showChallengesIntro && (
        <Panel bumpkinParts={NPC_WEARABLES["richie"]}>
          <div className="h-32 flex flex-col ">
            <Label type={"default"}>{`Richie`}</Label>
            {/* <Content /> */}
            <SpeakingText
              onClose={() => {
                acknowledgeIntroduction();
                send("ACKNOWLEDGE");

                gameAnalytics.trackMilestone({
                  event: "Tutorial:Intro:Completed",
                });
              }}
              message={[
                {
                  text: t("richie.intro.one"),
                },
                {
                  text: t("richie.intro.two"),
                },
                {
                  text: t("richie.intro.three"),
                },
              ]}
            />
          </div>
        </Panel>
      )}
      {!competitionIsActive && !showChallengesIntro && (
        <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
          <div className="h-32 flex flex-col ">
            <Label type={"default"}>{`Pumpkin' Pete`}</Label>
            {/* <Content /> */}
            <SpeakingText
              onClose={() => {
                acknowledgeIntroduction();
                send("ACKNOWLEDGE");

                gameAnalytics.trackMilestone({
                  event: "Tutorial:Intro:Completed",
                });
              }}
              message={[
                {
                  text: t("pete.intro.one"),
                },
                {
                  text: t("pete.intro.two"),
                },
                {
                  text: t("pete.intro.three"),
                },
              ]}
            />
          </div>
        </Panel>
      )}
    </Modal>
  );
};
