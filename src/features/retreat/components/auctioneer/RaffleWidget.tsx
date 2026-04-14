import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";

import { ButtonPanel, Panel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";

import { AuthMachineState } from "features/auth/lib/authMachine";
import {
  loadRaffleResults,
  RaffleResults,
} from "features/world/ui/chapterRaffles/actions/loadRaffleResults";
import { randomID } from "lib/utils/random";
import { MachineState } from "features/game/lib/gameMachine";
import trophyIcon from "assets/icons/trophy.png";
import { ChapterRaffleResult } from "features/world/ui/chapterRaffles/ChapterRaffleResult";
import { Modal } from "components/ui/Modal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

const _raffleId = (state: MachineState) => {
  // Check for a completed raffle (endAt < now)
  const now = new Date().getTime();
  const activeRaffles = state.context.state.raffle?.active;
  if (!activeRaffles) {
    return null;
  }
  const finsihedRaffleID = Object.keys(activeRaffles).find(
    (raffle) =>
      activeRaffles[raffle].endAt && activeRaffles[raffle].endAt < now,
  );
  if (!finsihedRaffleID) {
    return null;
  }
  return finsihedRaffleID;
};

export const RaffleWidget: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [showResults, setShowResults] = useState(false);

  const token = useSelector(authService, _token);

  const [raffleResults, setRaffleResults] = useState<
    RaffleResults | undefined
  >();
  const raffleId = useSelector(gameService, _raffleId);

  useEffect(() => {
    const load = async () => {
      const upcoming = await loadRaffleResults({
        token,
        transactionId: randomID(),
        id: raffleId!,
      });
      setRaffleResults(upcoming);
    };

    if (raffleId) {
      load();
    }
  }, [token, raffleId]);

  if (!raffleId || !raffleResults || raffleResults.status !== "complete") {
    return null;
  }

  return (
    <>
      <ButtonPanel
        className="flex "
        id="test-auction"
        onClick={() => setShowResults(true)}
      >
        <div className="flex items-center">
          <img src={trophyIcon} className="h-6 mr-1" />
          <div>
            <p className="text-xs">{t("auction.raffle.finished")}</p>
            <p className="text-xxs underline">
              {t("auction.raffle.viewResults")}
            </p>
          </div>
        </div>
      </ButtonPanel>
      <Modal
        show={showResults && !!raffleId}
        onHide={() => setShowResults(false)}
      >
        <Panel>
          <ChapterRaffleResult id={raffleId!} />
        </Panel>
      </Modal>
    </>
  );
};
