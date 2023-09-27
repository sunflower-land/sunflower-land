import React, { useState } from "react";
import { Player } from "../../ModerationTools";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import { kickPlayer } from "features/world/lib/moderationAction";
import { SuccessAction, ErrorAction, LoadingAction } from "./ActionStatus";

type Props = {
  scene: any;
  authState: any;
  player: Player | null;
  show: boolean;
  onClose: () => void;
};

export const KickPopUp: React.FC<Props> = ({
  scene,
  authState,
  player,
  show,
  onClose,
}) => {
  const [reason, setReason] = useState("");
  const [actionStatus, setActionStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);

  const handleKickAction = async () => {
    if (!authState || !player) return;
    setActionStatus("loading");

    await kickPlayer({
      token: authState.rawToken as string,
      farmId: authState.farmId as number,
      kickedId: player.farmId as number,
      reason: reason,
    })
      .then((r) => {
        r.success ? setActionStatus("success") : setActionStatus("error");

        scene.mmoService.state.context.server?.send("moderation_event", {
          type: "kick",
          farmId: player.farmId as number,
          reason: reason,
        });
      })
      .catch((e) => setActionStatus("error"));
  };

  const closeAction = () => {
    setActionStatus(null);
    setReason("");
  };

  return (
    <>
      {actionStatus === "success" && (
        <SuccessAction action="kick" player={player} onClose={closeAction} />
      )}
      {actionStatus === "error" && (
        <ErrorAction action="kick" player={player} onClose={closeAction} />
      )}
      {actionStatus === "loading" && <LoadingAction action="kick" />}
      {actionStatus === null && (
        <Modal show={show} onHide={onClose} centered>
          <Panel>
            <div className="flex flex-col">
              <span className="text-sm text-center">
                Kick Player {player?.playerId} of Farm {player?.farmId}
              </span>
              <span className="text-xs text-center">
                Are you sure you want to kick this player?
              </span>
              <span className="text-xxs text-left mt-2 mb-1">
                Kick Reason (Please note that the player will see this)
              </span>
              <textarea
                className="w-full h-20 text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2 w-full mt-2">
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={handleKickAction}
                  disabled={reason.length === 0}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Panel>
        </Modal>
      )}
    </>
  );
};
