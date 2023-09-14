import React from "react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

type SuccessAction = {
  action: "kick" | "mute";
  player: Player | null;
  onClose: () => void;
};

type ErrorAction = {
  action: "kick" | "mute";
  player: Player | null;
  onClose: () => void;
};

export const SuccessAction: React.FC<SuccessAction> = ({
  action,
  player,
  onClose,
}) => {
  return (
    <Modal
      show={true}
      onHide={() => {
        onClose;
      }}
      centered
    >
      <Panel>
        <div className="flex flex-col">
          <span className="text-sm text-center">
            {action === "kick" ? "Kick" : "Mute"} Player {player?.playerId} of
            Farm {player?.farmId}
          </span>
          <span className="text-xs text-center">
            {action === "kick"
              ? "Player has been kicked"
              : "Player has been muted"}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};

export const ErrorAction: React.FC<ErrorAction> = ({
  action,
  player,
  onClose,
}) => {
  return (
    <Modal
      show={true}
      onHide={() => {
        onClose;
      }}
      centered
    >
      <Panel>
        <div className="flex flex-col">
          <span className="text-sm text-center">
            {action === "kick" ? "Kick" : "Mute"} Player {player?.playerId} of
            Farm {player?.farmId}
          </span>
          <span className="text-xs text-center">
            {action === "kick"
              ? "Failed to kick player"
              : "Failed to mute player"}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};

export const LoadingAction: React.FC<{ action: "kick" | "mute" }> = ({
  action,
}) => {
  return (
    <Modal show={true} centered>
      <Panel>
        <div className="flex flex-col">
          <span className="text-lg text-center">
            {action === "kick" ? "Kicking" : "Muting"} Player...
          </span>
          <span className="text-xs text-center mt-2">Please wait</span>
        </div>
      </Panel>
    </Modal>
  );
};
