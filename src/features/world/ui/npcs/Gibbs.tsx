import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import {
  COMMUNITY_SHOP_ITEMS,
  CommunityShopItemName,
} from "features/game/types/collectibles";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

interface Props {
  onClose: () => void;
}

export const Gibbs: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const dialogue = [
    "Welcome to my shop! I'm Gibbs, ready to trade amazing items for your community coins. Let's find you something special!",
    "Hi there! I'm Gibbs, your friendly goblin shopkeeper. Exchange your community coins here for exclusive packs and unique items!",
  ];
  const intro = useRandomItem(dialogue);

  const handleConfirm = (tab: number) => {
    setConfirmAction(true);
    setTab(tab);
  };

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.gibbs}
        message={[
          {
            text: intro,
            actions: [
              {
                text: "Craft",
                cb: () => handleConfirm(0),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.gibbs}
      tabs={[{ icon: SUNNYSIDE.icons.hammer, name: "Packs" }]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <Shop />}
    </CloseButtonPanel>
  );
};

export const Shop: React.FC = () => {
  const [selectedName, setSelectedName] =
    useState<CommunityShopItemName>("Fishing Pack");
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = COMMUNITY_SHOP_ITEMS[selectedName]!;

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const craft = () => {
    gameService.send("communityShop.crafted", {
      name: selectedName,
    });
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            communityItem: selectedName,
            from: selectedItem.from,
            to: selectedItem.to,
          }}
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
            sfl: selectedItem.sfl,
          }}
          actionView={
            <Button disabled={lessIngredients()} onClick={craft}>
              Craft
            </Button>
          }
        />
      }
      content={
        <>
          {getKeys(COMMUNITY_SHOP_ITEMS).map((name: CommunityShopItemName) => {
            return (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ITEM_DETAILS["Block Buck"].image}
                // count={inventory[name]}
                overlayIcon={
                  <img
                    src={SUNNYSIDE.icons.stopwatch}
                    id="confirm"
                    alt="confirm"
                    className="object-contain absolute"
                    style={{
                      width: `${PIXEL_SCALE * 8}px`,
                      top: `${PIXEL_SCALE * -4}px`,
                      right: `${PIXEL_SCALE * -4}px`,
                    }}
                  />
                }
              />
            );
          })}
        </>
      }
    />
  );
};
