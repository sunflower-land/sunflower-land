import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Hud } from "features/farming/hud/Hud";
import { Crops } from "features/farming/crops/Crops";
import { Water } from "features/farming/water/Water";
import { Loading } from "features/auth/components";
import { Animals } from "features/farming/animals/Animals";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Context } from "./GameProvider";
import { Panel } from "components/ui/Panel";
import { ToastManager } from "./toast/ToastManager";
import { Decorations } from "./components/Decorations";
import { Success } from "./components/Success";
import { Syncing } from "./components/Syncing";

import { Quarry } from "features/farming/quarry/Quarry";
import { TeamDonation } from "features/farming/teamDonation/TeamDonation";
import { Forest } from "features/farming/forest/Forest";

import { StateValues } from "./lib/gameMachine";
import { Town } from "features/farming/town/Town";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { House } from "features/farming/house/House";
import { Lore } from "./components/Lore";
import { ClockIssue } from "./components/ClockIssue";
import { screenTracker } from "lib/utils/screen";
import { Refreshing } from "features/auth/components/Refreshing";
import { GoblinShovel } from "features/farming/crops/components/GoblinShovel";
import { Announcements } from "features/announcements/Announcement";
import { Notifications } from "./components/Notifications";
import { Hoarding } from "./components/Hoarding";
import { Captcha } from "components/ui/Captcha";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  notifying: true,
  announcing: true,
  playing: false,
  autosaving: false,
  syncing: true,
  synced: true,
  error: true,
  levelling: false,
  refreshing: true,
  expanded: false,
  expanding: false,
  hoarding: true,
};

export const Game: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  useInterval(() => send("SAVE"), AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (gameState.context.actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameState]);

  useEffect(() => {
    const save = () => {
      send("SAVE");
    };

    window.addEventListener("blur", save);

    screenTracker.start(authService);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("blur", save);
      screenTracker.pause();
    };
  }, []);

  return (
    <>
      <ToastManager />

      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel className="text-shadow">
          {gameState.matches("loading") && <Loading />}

          {gameState.matches("announcing") && <Announcements />}
          {gameState.matches("notifying") && <Notifications />}

          {gameState.matches("refreshing") && <Refreshing />}
          {gameState.matches("error") && (
            <ErrorMessage
              errorCode={gameState.context.errorCode as ErrorCode}
            />
          )}
          {gameState.matches("synced") && <Success />}
          {gameState.matches("syncing") && <Syncing />}
          {gameState.matches("hoarding") && <Hoarding />}
        </Panel>
      </Modal>
      {/* <Modal show centered>
        <Panel>
          <Captcha
            onAnswer={(code) => console.log(code)}
            image="https://hannigan-bumpkin-assets.s3.amazonaws.com/captcha/generated/Lk%252FDsDMflNyDkvhYMTa1cNigrdH7fJ3m7Sb34d8TomhljN5eTFn0oaICWxIFOPqTjWygyA%253D%253D?AWSAccessKeyId=ASIAYUP5SWLVKT4AZVCM&Expires=1659110109&Signature=P%2Bcrd%2Bp%2Fipk1K15m7cP3QPZ1y0Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDDfr23w3K%2FOgeSb8jLpUS%2B7Jw%2BUrS%2BECCAW7xl7%2Fp2DAIgda%2B28t2b110JhVDU6Y7bT92nIdlpgoaeglaS5XW30kQq3AMI%2Ff%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw1OTM3NzQxNjI2NjYiDN4T68vqdw%2BfJ8kbyiqwA7sE2UKZLxVTiP3pXaDdBYIFNem%2Fd%2BOVHHomhv46oASikL7YcxTPC3YX2GeK9tjg16HvyPyoAoCPcMwmWfbvHNaWzfd0bj18DZQMnIs51ZxSU7Vju%2Frd21%2Fj1It5uKbvMNzgwwRobFqN40NhkyDcBaEFf3Bazz%2FuHMd9lopClVkEX0saGymv2NEvvcYb0memabrtaChBWMAZyloF%2FxsZFtdJW09ZNksiktj22rWDAkzj3TkVNDXdgPlSh2M0SftQ5Br4KBc%2B7ZXHAVAcedOoTXue6HvaeTV5XoKRwU1sy8NaYEu2qMvBhMPy92lhIle7m1S8EGbUbfCdSMrSuYHGi2Y6b6cDbYPX1Z%2BaNXb%2B%2Bh4PY%2FIrbVfzRgh8hMZfKMCznIm8ssw05lFcaw93wY%2FVLqjn8zO8ZmsL1K3axhfZ%2BxsFuiazcHABqqXAUpA9%2By2uGXkjZOEEaVhO29d51GYCfW0kl%2BjM%2FnEtLjLNP6g1GSaEAfiB0r8RgGnBN147GuuNq4Rfg2YSZ3PT7RLFxyVMR20EjBnB2RG2%2FBx2Ww%2FzOOcPohLxWNEFWteKq9lwXviDnjCNr42XBjqeASF1eRk54bgkzd03YS5XLau0xAROw3fpHKkwlsBZv1XZ%2FZTLvvRbYRjpO70SVYLZnus8DGFzX%2Fny1YsTe3bbULKl%2BTefEgV1hyZbf8gJBK56hJqU2LmX%2B379uLlRDbKs0MmkpmGLyjfqKJTS86N1JfMc0YgQ%2Fg%2FRqVSAOnrg8TbU2DMjZT8qbWF91Phoaf5ibgx%2BbNooAhxFZqXmAwjN"
          />
        </Panel>
      </Modal> */}
      {/* check local storage and show modal if not read */}

      <ClockIssue show={gameState.context.offset > 0} />
      <Hud />
      <TeamDonation />
      <Crops />
      <Water />
      <Animals />
      <Decorations state={gameState.context.state} />
      <Forest />
      <Quarry />
      <Town />
      <House
        state={gameState.context.state}
        playerCanLevelUp={gameState.matches("levelling")}
        isFarming
      />
      <Lore />
      <GoblinShovel />
    </>
  );
};
