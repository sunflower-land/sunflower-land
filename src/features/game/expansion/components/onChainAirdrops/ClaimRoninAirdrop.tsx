import React from "react";
import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import vipIcon from "assets/icons/vip.webp";
import { useTranslation } from "react-i18next";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { getTimeUntil } from "lib/utils/time";
import { RONIN_FARM_CREATION_CUTOFF } from "features/game/lib/vipAccess";

const _nft = (state: MachineState) => state.context.state.nfts?.ronin;
const _createdAt = (state: MachineState) => state.context.state.createdAt;

export const ClaimRoninAirdrop: React.FC = () => {
  const { gameService } = useGame();
  const nft = useSelector(gameService, _nft);
  const farmCreatedAt = useSelector(gameService, _createdAt);

  const { t } = useTranslation();

  const handleAcknowledge = () => {
    gameService.send({ type: "onChainAirdrop.acknowledged", chain: "ronin" });
    gameService.send("ACKNOWLEDGE");
  };

  const showCookingPerk = !nft?.name.includes("Bronze");

  const isRoninFarmCreatedBeforeCutoff =
    farmCreatedAt < RONIN_FARM_CREATION_CUTOFF;

  return (
    <div className="flex flex-col space-y-2">
      <div className="p-2">
        <Label type="default" icon={vipIcon} className="mb-2">
          {nft?.name}
        </Label>
        {isRoninFarmCreatedBeforeCutoff ? (
          <div className="flex flex-col space-y-2 -mb-2">
            <p className="text-sm">
              {`Your farm was created before the Ronin Campaign was announced.`}
            </p>
            <p className="text-sm">
              {`You can still claim the Jin collectible in the next screen, but you won't be able to access the Ronin VIP features.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 -mb-2">
            <p className="text-base">
              {t("ronin.nft.welcome", { nftName: nft?.name })}
            </p>
            <p className="pb-1">
              {t("ronin.nft.description", { nftName: nft?.name })}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src={vipIcon} className="w-6" />
                <span>{t("ronin.nft.perkOne")}</span>
              </div>
              {showCookingPerk && (
                <div className="flex items-center gap-2">
                  <img
                    src={ITEM_DETAILS["Pumpkin Soup"].image}
                    className="w-6"
                  />
                  <span>{t("ronin.nft.perkTwo")}</span>
                </div>
              )}
            </div>
            <p>{t("ronin.nft.expires")}</p>
            <Label type="info" className="my-1">
              {t("ronin.nft.activates")}
            </Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`Expires in ${getTimeUntil(new Date(nft?.expiresAt as number))}`}
            </Label>
          </div>
        )}
      </div>
      <Button onClick={handleAcknowledge}>{t("lets.go")}</Button>
    </div>
  );
};
