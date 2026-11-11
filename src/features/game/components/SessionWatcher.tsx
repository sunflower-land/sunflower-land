import type React from "react";
import { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { Context } from "../GameProvider";
import type { MachineState } from "../lib/gameMachine";
import { announceSession, useSocial } from "features/social/hooks/useSocial";
import { hashString } from "lib/stateHash";

// The farm from the JWT: known before the session loads (the game context's
// farmId is not: on testnet it is random until then), and the player's own
// farm even mid-visit. Sessions belong to the owner's room, not the host's.
const _tokenFarmId = (state: AuthMachineState) =>
  state.context.user.token?.farmId;

const _ownFarmId = (state: MachineState) =>
  state.context.visitorId ?? state.context.farmId;

const _deviceTrackerId = (state: MachineState) => state.context.deviceTrackerId;

/**
 * Shows the multiple-devices screen the moment another tab or device loads a
 * session for this farm, instead of waiting for the next autosave to be
 * refused.
 *
 * Each tab tells the social room which session it holds (a hash of its device
 * tracker, which changes on every session load). The room decides: a hash it
 * has not seen replaces the live session and every other tab is told; a hash
 * it has seen but already replaced belongs to a stale tab reconnecting, and
 * only that tab is told.
 *
 * Mounted while the session is still loading, so the socket is already open
 * when the tracker arrives and the announce costs one round trip, the same as
 * a refresh from the error screen. Renders nothing.
 */
export const SessionWatcher: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const tokenFarmId = useSelector(authService, _tokenFarmId);
  const ownFarmId = useSelector(gameService, _ownFarmId);
  const deviceTrackerId = useSelector(gameService, _deviceTrackerId);

  useEffect(() => {
    if (!deviceTrackerId) return;

    // Only the hash leaves the tab: room joins are unauthenticated, so the
    // token itself must never be on the wire.
    let cancelled = false;
    hashString(deviceTrackerId).then((hash) => {
      if (!cancelled) announceSession(hash);
    });

    return () => {
      cancelled = true;
    };
  }, [deviceTrackerId]);

  useSocial({
    farmId: tokenFarmId ?? ownFarmId,
    callbacks: {
      onSessionReplaced: () => gameService.send({ type: "SESSION_REPLACED" }),
    },
  });

  return null;
};
