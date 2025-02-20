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

const _nft = (state: MachineState) => state.context.state.nfts?.ronin;

export const ClaimRoninAirdrop: React.FC = () => {
  const { gameService } = useGame();
  const nft = useSelector(gameService, _nft);

  const { t } = useTranslation();

  const handleAcknowledge = () => {
    gameService.send({ type: "onChainAirdrop.acknowledged", chain: "ronin" });
    gameService.send("ACKNOWLEDGE");
  };

  const showCookingPerk = !nft?.name.includes("Bronze");

  return (
    <div className="flex flex-col space-y-2">
      <div className="p-2">
        <Label type="default" icon={vipIcon} className="mb-2">
          {nft?.name}
        </Label>
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
                <img src={ITEM_DETAILS["Pumpkin Soup"].image} className="w-6" />
                <span>{t("ronin.nft.perkTwo")}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <img src={ITEM_DETAILS.Gem.image} className="w-6" />
              <span>{t("ronin.nft.perkThree")}</span>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <img src={SUNNYSIDE.decorations.treasure_chest} className="h-6" />
              <span>{t("ronin.nft.perkFour")}</span>
            </div>
          </div>
          <p>{t("ronin.nft.expires")}</p>
          <Label
            type="info"
            icon={SUNNYSIDE.icons.stopwatch}
          >{`Expires in ${getTimeUntil(new Date(nft?.expiresAt as number))}`}</Label>
        </div>
      </div>
      <Button onClick={handleAcknowledge}>{t("lets.go")}</Button>
    </div>
  );
};
