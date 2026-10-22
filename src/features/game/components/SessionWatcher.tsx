import type React from "react";
import { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "../GameProvider";
import type { MachineState } from "../lib/gameMachine";
import { useSocial } from "features/social/hooks/useSocial";
import { hashString } from "lib/stateHash";

// The logged-in player's own farm, even mid-visit (where `farmId` is the
// farm being visited). Sessions are pushed to the owner's room, not the host's.
const _ownFarmId = (state: MachineState) =>
  state.context.visitorId ?? state.context.farmId;

// `hashString` tags its output; the API sends the bare hex digest.
const HASH_PREFIX = "sha256:";

/**
 * Shows the multiple-devices screen the moment another tab or device loads a
 * session for this farm, instead of waiting for the next autosave to be
 * refused. Renders nothing; it only keeps the social-room subscription alive
 * so idle tabs hear about it too.
 */
export const SessionWatcher: React.FC = () => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _ownFarmId);

  useSocial({
    farmId,
    callbacks: {
      onSessionStarted: async ({ sessionHash }) => {
        // Read at message time, not render time: the tracker changes on
        // every session load and the subscription outlives those renders.
        const { deviceTrackerId } = gameService.getSnapshot().context;
        if (!deviceTrackerId) return;

        const hashed = await hashString(deviceTrackerId);
        // Our own session's push (or its replay on rejoin): nothing to do.
        if (hashed.slice(HASH_PREFIX.length) === sessionHash) return;

        gameService.send({
          type: "SESSION_REPLACED",
          comparedTrackerId: deviceTrackerId,
        });
      },
    },
  });

  return null;
};
