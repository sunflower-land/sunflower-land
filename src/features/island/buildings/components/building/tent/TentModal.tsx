import React, { useContext, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { BumpkinParts, interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { BumpkinBox } from "./BumpkinBox";
import { getBumpkinUrl } from "./lib/getBumpkinUrl";
import { CONFIG } from "lib/config";
import { BuildingName } from "features/game/types/buildings";
import { PlacedItem } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import { OnChainBumpkin } from "lib/blockchain/BumpkinDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  defaultSelectedIndex?: number;
  onClose: () => void;
  bumpkins: OnChainBumpkin[];
}

const baseUrl =
  CONFIG.NETWORK === "mainnet"
    ? `https://bumpkins.io/#/bumpkins`
    : `https://testnet.bumpkins.io/#/bumpkins`;

const selectBuildings = (state: MachineState) => state.context.state.buildings;

const compareBuildings = (
  prev: Partial<Record<BuildingName, PlacedItem[]>>,
  next: Partial<Record<BuildingName, PlacedItem[]>>,
) => {
  return prev.Tent?.length === next.Tent?.length;
};

export const TentModal: React.FC<Props> = ({
  defaultSelectedIndex,
  onClose,
  bumpkins,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const buildings = useSelector(gameService, selectBuildings, compareBuildings);

  const [selectedBumpkin, setSelectedBumpkin] = useState<{
    equipped: BumpkinParts;
    tokenId: number;
  }>(interpretTokenUri(bumpkins[defaultSelectedIndex ?? 0].tokenURI));

  const placedTents = (buildings.Tent || []).length;
  const allowedBumpkins = placedTents;

  const farmingBumpkins = bumpkins.slice(0, allowedBumpkins);
  const nonFarmingBumpkins = bumpkins.slice(allowedBumpkins);

  const MainContent = () => (
    <div className="flex flex-col space-y-4">
      <div>
        <p className="text-sm mb-1">{t("showing.farm")}</p>
        <div className="flex flex-wrap">
          {farmingBumpkins
            .map((bumpkin) => interpretTokenUri(bumpkin.tokenURI))
            .map(({ tokenId, equipped }) => (
              <BumpkinBox
                key={tokenId}
                bumpkin={{ equipped, id: tokenId }}
                selectedId={
                  selectedBumpkin ? Number(selectedBumpkin.tokenId) : 0
                }
                onSelect={(tokenId: number) =>
                  setSelectedBumpkin({ tokenId, equipped })
                }
              />
            ))}
        </div>
      </div>
      {nonFarmingBumpkins.length > 0 && (
        <div>
          <p className="text-sm mb-1">{t("showing.wallet")}</p>
          <div className="flex flex-wrap">
            {nonFarmingBumpkins
              .map((bumpkin) => interpretTokenUri(bumpkin.tokenURI))
              .map(({ tokenId, equipped }) => (
                <BumpkinBox
                  key={tokenId}
                  bumpkin={{ equipped, id: tokenId }}
                  selectedId={selectedBumpkin.tokenId}
                  onSelect={(tokenId: number) =>
                    setSelectedBumpkin({ tokenId, equipped })
                  }
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const PanelContent = () => (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2 sm:flex-col sm:space-x-0">
        <div className="rounded overflow-hidden w-32 sm:w-full relative">
          <img
            src={getBumpkinUrl(selectedBumpkin.equipped)}
            alt="Selected bumpkin"
            className="w-full"
          />
        </div>
        <div className="flex justify-center w-full my-2 text-sm">
          <a
            href={`${baseUrl}/${selectedBumpkin.tokenId}`}
            className="underline hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Bumpkin #${selectedBumpkin.tokenId}`}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <CloseButtonPanel
      tabs={[{ name: "Bumpkins", icon: SUNNYSIDE.icons.player }]}
      currentTab={0}
      onClose={onClose}
    >
      <SplitScreenView content={MainContent()} panel={PanelContent()} />
    </CloseButtonPanel>
  );
};
