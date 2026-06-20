import clipboard from "clipboard";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import ticket from "assets/icons/ticket.png";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import type { ContentComponentProps } from "../types";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useSound } from "lib/utils/hooks/useSound";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";

// Minimum Bumpkin level required to travel to the Goblin Retreat
// (matches the gate on the world travel map).
export const GOBLIN_RETREAT_LEVEL = 5;

const _nftId = (state: MachineState) => state.context.nftId;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _experience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;
const _ascensionLevel = (state: MachineState) =>
  state.context.state.island.ascensionLevel ?? 0;

export const BlockchainSettings: React.FC<ContentComponentProps> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const travel = useSound("travel");

  const { gameService } = useContext(GameContext);
  const nftId = useSelector(gameService, _nftId);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const experience = useSelector(gameService, _experience);
  const ascensionLevel = useSelector(gameService, _ascensionLevel);
  const farmAddress = useSelector(gameService, _farmAddress);

  // Only full (NFT-farm) users have the transfer option, so only they see
  // "transfer" mentioned in the moved-to-bank notice.
  const isFullUser = farmAddress !== "";
  const canAccessRetreat = meetsLevelRequirement(
    getAscensionLevel({ experience, ascensionLevel }),
    { ascension: 0, level: GOBLIN_RETREAT_LEVEL },
  );

  const goToGoblinRetreat = () => {
    travel.play();
    navigate("/world/retreat");
    onClose();
  };

  const [showNftId, setShowNftId] = useState(false);
  const copypaste = useSound("copypaste");

  return (
    <>
      <div className="flex flex-col gap-2 p-1 mt-1">
        <div className="flex justify-between">
          {nftId !== undefined && (
            <Label
              type="default"
              icon={ticket}
              popup={showNftId}
              className="mb-1 mr-4 ml-2"
              onClick={() => {
                setShowNftId(true);
                setTimeout(() => {
                  setShowNftId(false);
                }, 2000);
                copypaste.play();
                clipboard.copy(String(nftId));
              }}
            >
              {`NFT ID #${nftId}`}
            </Label>
          )}
          {linkedWallet && (
            <WalletAddressLabel
              walletAddress={linkedWallet}
              showLabelTitle={false}
            />
          )}
        </div>

        <p className="text-sm">
          {t(
            isFullUser
              ? "gameOptions.blockchainSettings.movedToBank.fullUsers"
              : "gameOptions.blockchainSettings.movedToBank",
          )}
        </p>
      </div>
      <Button onClick={goToGoblinRetreat} disabled={!canAccessRetreat}>
        <div className="flex items-center justify-center">
          {!canAccessRetreat && (
            <img src={SUNNYSIDE.icons.lock} className="h-4 mr-1" />
          )}
          {canAccessRetreat
            ? t("gameOptions.blockchainSettings.goToBank")
            : t("world.lvl.requirement", { lvl: GOBLIN_RETREAT_LEVEL })}
        </div>
      </Button>
    </>
  );
};
