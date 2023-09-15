import React, { useState } from "react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import { mutePlayer } from "features/world/lib/moderationAction";
import { SuccessAction, ErrorAction, LoadingAction } from "./ActionStatus";

type Props = {
  scene: any;
  authState: any;
  player: Player | null;
  show: boolean;
  onClose: () => void;
};

type MuteDuration = 1 | 5 | 10 | 60 | 720 | 1440 | 10080;

const MUTE_DURATIONS: { value: MuteDuration; label: string }[] = [
  { value: 5, label: "5 mins" },
  { value: 10, label: "10 mins" },
  { value: 60, label: "1 hour" },
  { value: 720, label: "12 hours" },
  { value: 1440, label: "1 day" },
  { value: 10080, label: "1 week" },
];

export const MutePopUp: React.FC<Props> = ({
  scene,
  authState,
  player,
  show,
  onClose,
}) => {
  const [duration, setDuration] = useState<MuteDuration>(5);
  const [reason, setReason] = useState("");

  const [actionStatus, setActionStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);

  const handleMuteAction = async () => {
    if (!authState || !player) return;
    setActionStatus("loading");

    const until = new Date().getTime() + duration * 60 * 1000;

    await mutePlayer({
      token: authState.rawToken as string,
      farmId: authState.farmId as number,
      mutedId: player.farmId as number,
      reason: reason,
      mutedUntil: until,
    })
      .then((r) => {
        r.success ? setActionStatus("success") : setActionStatus("error");

        scene.mmoService.state.context.server?.send("moderation_event", {
          type: "mute",
          farmId: player.farmId as number,
          reason: reason,
          mutedUntil: until,
        });
      })
      .catch((e) => setActionStatus("error"));
  };

  const closeAction = () => {
    setActionStatus(null);
  };

  return (
    <>
      {actionStatus === "success" && (
        <SuccessAction action="mute" player={player} onClose={closeAction} />
      )}
      {actionStatus === "error" && (
        <ErrorAction action="mute" player={player} onClose={closeAction} />
      )}
      {actionStatus === "loading" && <LoadingAction action="mute" />}
      {actionStatus === null && (
        <Modal show={show} onHide={onClose} centered>
          <Panel>
            <div className="flex flex-col">
              <span className="text-sm text-center">
                Mute Player {player?.playerId} of Farm {player?.farmId}
              </span>
              <span className="text-xs text-center">
                Are you sure you want to mute this player?
              </span>
              <span className="text-xxs text-left mt-2 mb-1">
                Mute Duration (Please note that the player will see this)
              </span>
              <select
                className="w-full text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
                onChange={(e) =>
                  setDuration(Number(e.target.value) as MuteDuration)
                }
                value={duration}
              >
                {MUTE_DURATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="text-xxs text-left mt-2 mb-1">
                Mute Reason (Please note that the player will see this)
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
                  onClick={handleMuteAction}
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
