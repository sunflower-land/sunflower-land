import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { CONFIG } from "lib/config";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { useImagePreloader } from "../useImagePreloader";
import { Loading } from "./Loading";

export const StartFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);
  const { imagesPreloaded } = useImagePreloader();

  const start = () => {
    send("START_GAME");
  };

  const explore = async () => {
    send("EXPLORE");
  };

  const releaseVersion = CONFIG.RELEASE_VERSION as string;

  // We can only ever show this state if the address is not undefin
  const farmId = authState.context.farmId!;

  return (
    <>
      {imagesPreloaded ? (
        <>
          <p className="text-shadow text-small mb-2 px-1">Farm ID: {farmId}</p>
          <Button onClick={start} className="overflow-hidden mb-2">
            Lets farm!
          </Button>
          <Button onClick={explore} className="overflow-hidden">
            {`Explore a friend's farm`}
          </Button>

          <p className="text-center text-xs sm:text-sm text-shadow mt-3">
            Release:
            <a
              className="underline"
              href="https://github.com/sunflower-land/sunflower-land/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              {releaseVersion}
            </a>
          </p>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};
