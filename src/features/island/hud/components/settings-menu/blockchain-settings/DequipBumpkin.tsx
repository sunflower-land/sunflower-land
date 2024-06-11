import React, { useEffect, useState } from "react";

import walletIcon from "assets/icons/wallet.png";
import lockIcon from "assets/skills/lock.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { OnChainBumpkin, loadBumpkins } from "lib/blockchain/BumpkinDetails";
import { wallet } from "lib/blockchain/wallet";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { dequipBumpkin } from "lib/blockchain/Dequipper";
import { loadWearablesBalanceBatch } from "lib/blockchain/BumpkinItems";
import { shortAddress } from "lib/utils/shortAddress";
import { Loading } from "features/auth/components";

export const DequipBumpkin: React.FC = () => {
  const { t } = useAppTranslation();

  const [selectedBumpkinId, setSelectedBumpkinId] = useState<number>();

  const [walletBumpkins, setWalletBumpkins] = useState<OnChainBumpkin[]>();

  const [isLoading, setIsLoading] = useState(true);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const walletBumpkins = await loadBumpkins(
        wallet.web3Provider,
        wallet.myAccount as string
      );

      setWalletBumpkins(walletBumpkins);

      setIsLoading(false);
    };

    load();
  }, []);

  const dequip = async () => {
    const bumpkin = (walletBumpkins ?? []).find(
      (b) => Number(b.tokenId) === selectedBumpkinId
    );

    if (!bumpkin) {
      return;
    }

    setIsLoading(true);

    // Get all the IDs + Amounts currently on the Bumpkin
    const wearables = await loadWearablesBalanceBatch(
      wallet.web3Provider,
      bumpkin.wardrobe // Bumpkin wallet address
    );

    await dequipBumpkin({
      web3: wallet.web3Provider,
      account: wallet.myAccount as string,
      bumpkinId: selectedBumpkinId as number,
      ids: Object.keys(wearables).map(Number),
      amounts: Object.values(wearables),
    });

    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="p-2">
        <Label
          icon={SUNNYSIDE.icons.confirm}
          type="success"
          className="mb-2 capitalize"
        >
          {t("success")}
        </Label>
        <span className="text-sm">{t("dequipper.success")}</span>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (walletBumpkins?.length === 0) {
    return (
      <>
        <div className="p-2">
          <Label icon={SUNNYSIDE.icons.player} type="danger" className="my-2">
            {t("dequipper.noBumpkins")}
          </Label>
          <span className="text-sm">{t("dequipper.missingBumpkins")}</span>
        </div>
      </>
    );
  }

  const selected = (walletBumpkins ?? []).find(
    (b) => Number(b.tokenId) === selectedBumpkinId
  );

  const equipped = interpretTokenUri(selected?.tokenURI ?? "0_0").equipped;

  const missingWearables =
    selected && Object.values(equipped ?? {}).filter(Boolean).length === 0;

  return (
    <>
      <div className="p-2">
        <Label className="my-2 font-secondary" type="default" icon={walletIcon}>
          {shortAddress(wallet.myAccount as string)}
        </Label>
        <p className="mb-3 text-sm">{t("dequipper.intro")}</p>
        <div className="flex flex-wrap max-h-48 overflow-y-scroll">
          {(walletBumpkins ?? []).map((bumpkin) => {
            const parts = interpretTokenUri(bumpkin.tokenURI).equipped;
            return (
              <OuterPanel
                key={bumpkin.tokenId}
                onClick={() => setSelectedBumpkinId(Number(bumpkin.tokenId))}
                className="flex flex-col relative cursor-pointer hover:bg-brown-200 h-20 w-20 items-center justify-center mr-2 mb-2"
              >
                {selectedBumpkinId === Number(bumpkin.tokenId) && (
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    className="absolute z-10"
                    style={{
                      width: `${PIXEL_SCALE * 8}px`,
                      top: `${PIXEL_SCALE * 0}px`,
                      right: `${PIXEL_SCALE * 0}px`,
                    }}
                  />
                )}

                <div className="h-14 rounded-md overflow-hidden">
                  <DynamicNFT showBackground bumpkinParts={parts} />
                </div>
                <p className="text-xxs">{`ID: ${bumpkin.tokenId}`}</p>
              </OuterPanel>
            );
          })}
        </div>

        {missingWearables && (
          <Label type="danger" icon={lockIcon} className="my-2">
            {t("dequipper.nude")}
          </Label>
        )}

        <Label type="danger" className="capitalize my-1">
          {t("warning")}
        </Label>
        <span className="text-xs mb-2"> {t("dequipper.warning")}</span>
      </div>
      <Button
        disabled={!selectedBumpkinId || missingWearables}
        onClick={dequip}
      >
        {t("dequipper.dequip")}
      </Button>
    </>
  );
};
