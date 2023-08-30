import React, { useState } from "react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import HaloIcon from "assets/sfts/halo.png";

type Props = {
  scene?: any;
  players: Player[];
};

type PopUpProps = {
  player: Player | null;
  show: boolean;
  onClose: () => void;
};

type MuteDuration =
  | 5
  | 15
  | 30
  | 60
  | 120
  | 240
  | 480
  | 720
  | 1440
  | 4320
  | 10080
  | 43200
  | 129600
  | 259200
  | 525600
  | 0;

const MUTE_DURATIONS: { value: MuteDuration; label: string }[] = [
  { value: 5, label: "5 mins" },
  { value: 15, label: "15 mins" },
  { value: 30, label: "30 mins" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 480, label: "8 hours" },
  { value: 720, label: "12 hours" },
  { value: 1440, label: "1 day" },
  { value: 4320, label: "3 days" },
  { value: 10080, label: "1 week" },
  { value: 43200, label: "1 month" },
  { value: 129600, label: "3 months" },
  { value: 259200, label: "6 months" },
  { value: 525600, label: "1 year" },
  { value: 0, label: "Forever" },
];

const KickPopUp: React.FC<PopUpProps> = ({ player, show, onClose }) => {
  const [reason, setReason] = useState("");

  const handleKickAction = () => {
    console.log("Kick player", player?.playerId);
    onClose();
  };

  return (
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
            <Button onClick={handleKickAction} disabled={reason.length === 0}>
              Confirm
            </Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};

const MutePopUp: React.FC<PopUpProps> = ({ player, show, onClose }) => {
  const [duration, setDuration] = useState<MuteDuration>(5);
  const [reason, setReason] = useState("");

  const handleMuteAction = () => {
    console.log("Mute player", player?.playerId, "for", duration, "minutes");
    onClose();
  };

  return (
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
            <Button onClick={handleMuteAction} disabled={reason.length === 0}>
              Confirm
            </Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};

export const PlayerList: React.FC<Props> = ({ scene, players }) => {
  const [showKickPopUp, setShowKickPopUp] = useState(false);
  const [showMutePopUp, setShowMutePopUp] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const toggleKickPopUp = (player: Player) => {
    setSelectedPlayer(player);
    setShowKickPopUp(!showKickPopUp);
  };

  const toggleMutePopUp = (player: Player) => {
    setSelectedPlayer(player);
    setShowMutePopUp(!showMutePopUp);
  };

  const isModerator = (player: Player) => {
    if (player.clothing.hat === "Halo") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <KickPopUp
        show={showKickPopUp}
        onClose={() => setShowKickPopUp(false)}
        player={selectedPlayer}
      />
      <MutePopUp
        show={showMutePopUp}
        onClose={() => setShowMutePopUp(false)}
        player={selectedPlayer}
      />

      <div className="flex items-start gap-2 ml-1 mt-2 h-96 overflow-y-scroll scrollable">
        <table className="w-full text-xs table-fixed">
          <thead className="text-sm">
            <tr>
              <th className="w-1/4">Player ID</th>
              <th className="w-1/4">Farm ID</th>
              <th className="w-1/4">Status</th>
              <th className="w-1/2">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              return (
                <tr key={player.playerId}>
                  <td className="w-1/4">
                    <div className="flex items-center gap-1">
                      <span>{player.playerId}</span>
                      {isModerator(player) && (
                        <img src={HaloIcon} className="h-4" />
                      )}
                    </div>
                  </td>
                  <td className="w-1/4">{player.farmId}</td>
                  <td className="w-1/4">Not Muted</td>
                  {/* TODO: Once Mute is out, display if a player in the is muted and their time left */}
                  <td className="w-1/2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          scene.teleportModerator(player.x, player.y);
                        }}
                      >
                        TP
                      </Button>
                      <Button
                        disabled={isModerator(player)}
                        onClick={() => {
                          toggleKickPopUp(player);
                        }}
                      >
                        Kick
                      </Button>
                      <Button
                        disabled={isModerator(player)}
                        onClick={() => {
                          toggleMutePopUp(player);
                        }}
                      >
                        Mute
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end m-1">
        <span className="text-xs">{players.length}/150 Players Connected</span>
      </div>
    </>
  );
};
