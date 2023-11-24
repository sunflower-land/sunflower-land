import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import token from "src/assets/icons/token_2.png";
import powerup from "assets/icons/level_up.png";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { Airdrop as IAirdrop } from "features/game/types/game";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { CONSUMABLES, ConsumableName } from "features/game/types/consumables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface ClaimRewardProps {
  reward: IAirdrop;
  onClaim: () => void;
  onClose?: () => void;
}

export const ClaimReward: React.FC<ClaimRewardProps> = ({
  reward: airdrop,
  onClaim,
  onClose,
}) => {
  const itemNames = getKeys(airdrop.items);

  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1">
        <Label
          className="ml-2 mb-2 mt-1"
          type="warning"
          icon={SUNNYSIDE.decorations.treasure_chest}
        >
          Reward Discovered
        </Label>
        {airdrop.message && (
          <p className="text-xs mb-2 ml-1">{airdrop.message}</p>
        )}
        <div className="flex flex-col">
          {!!airdrop.sfl && (
            <div className="flex items-center">
              <Box image={token} />
              <div>
                <Label type="warning">{airdrop.sfl} SFL</Label>
                <p className="text-xs">Spend it wisely.</p>
              </div>
            </div>
          )}

          {itemNames.length > 0 &&
            itemNames.map((name) => (
              <div className="flex items-center" key={name}>
                <Box image={ITEM_DETAILS[name].image} />
                <div>
                  <div className="flex items-center">
                    <Label type="default" className="mr-2">
                      {`${airdrop.items[name] ?? 1} x ${name}`}
                    </Label>
                    {name in CONSUMABLES && (
                      <Label
                        type="success"
                        icon={powerup}
                        className="mr-2"
                      >{`+${
                        CONSUMABLES[name as ConsumableName].experience
                      } EXP`}</Label>
                    )}
                  </div>
                  <p className="text-xs">{ITEM_DETAILS[name].description}</p>
                </div>
              </div>
            ))}

          {getKeys(airdrop.wearables ?? {}).length > 0 &&
            getKeys(airdrop.wearables).map((name) => (
              <div className="flex items-center mb-2" key={name}>
                <Box image={getImageUrl(ITEM_IDS[name])} />
                <div>
                  <Label type="default">{`${
                    airdrop.wearables[name] ?? 1
                  } x ${name}`}</Label>
                  <p className="text-xs">A wearable for your Bumpkin</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center mt-1">
        {onClose && (
          <Button className="mr-1" onClick={onClose}>
            {t("close")}
          </Button>
        )}
        <Button onClick={onClaim}>Claim</Button>
      </div>
    </>
  );
};
export const AirdropModal: React.FC<{
  airdrop: IAirdrop;
  onClose?: () => void;
  onClaimed: () => void;
}> = ({ airdrop, onClose, onClaimed }) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const claim = () => {
    gameService.send("airdrop.claimed", {
      id: airdrop.id,
    });

    if (airdrop.id === "expansion-four-airdrop") {
      openModal("BETTY");
    }

    if (airdrop.items["Time Warp Totem"]) {
      gameService.send("LANDSCAPE", {
        placeable: "Time Warp Totem",
        action: "collectible.placed",
      });
    }

    onClaimed();
  };

  return <ClaimReward reward={airdrop} onClaim={claim} onClose={onClose} />;
};

interface Props {
  airdrop: IAirdrop;
}
export const Airdrop: React.FC<Props> = ({ airdrop }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <AirdropModal
            airdrop={airdrop}
            onClaimed={() => setShowModal(false)}
          />
        </CloseButtonPanel>
      </Modal>

      <div
        className="absolute left-0 top-0 cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <img
          src={SUNNYSIDE.decorations.treasure_chest}
          className="absolute bulge-repeat pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          className="absolute animate-float pointer-events-none"
          style={{
            left: `${PIXEL_SCALE * 6}px`,
            top: `${PIXEL_SCALE * -12}px`,
            width: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
    </>
  );
};

/**
 * Display airdrops that have no coordinates
 */
export const AirdropPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const airdrop = state.context.state.airdrops?.find(
    (airdrop) => !airdrop.coordinates
  );

  if (!airdrop) {
    return null;
  }

  return (
    <AirdropModal
      airdrop={airdrop}
      onClaimed={() => {
        gameService.send("CLOSE");
      }}
      onClose={() => {
        gameService.send("CLOSE");
      }}
    />
  );
};
