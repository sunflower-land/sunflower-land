import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import React, { useContext, useState } from "react";

import { MachineState } from "features/game/lib/gameMachine";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { acknowledgeVIP } from "features/announcements/announcementsStorage";
import { SEASONS, getSeasonalBanner } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import blockBuck from "assets/icons/block_buck.png";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { BB_TO_GEM_RATIO } from "features/game/types/game";

const isPromoting = (state: MachineState) => state.matches("specialOffer");
const _inventory = (state: MachineState) => state.context.state.inventory;

export const SpecialOffer: React.FC = () => {
  const { gameService } = useContext(Context);
  const specialOffer = useSelector(gameService, isPromoting);
  const inventory = useSelector(gameService, _inventory);
  const hasPreviousSeasonBanner = !!inventory[getSeasonalBanner()];

  return (
    <PromotingModal
      isOpen={specialOffer}
      hasDiscount={hasPreviousSeasonBanner}
      hasPurchased={!!inventory["Spring Blossom Banner"]}
      onClose={() => {
        acknowledgeVIP();
        gameService.send("ACKNOWLEDGE");
      }}
    />
  );
};

interface Props {
  hasPurchased?: boolean;
  hasDiscount: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const PromotingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hasPurchased,
  hasDiscount,
}) => {
  const { t } = useAppTranslation();

  const { openModal } = useContext(ModalContext);

  const isPreSeason =
    Date.now() < SEASONS["Spring Blossom"].startDate.getTime();

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInsufficientBlockBuck, setShowInsufficientBlockBuck] =
    useState(false);

  const [showPurchased, setShowPurchased] = useState(hasPurchased);

  let price = hasDiscount ? 35 * BB_TO_GEM_RATIO : 50 * BB_TO_GEM_RATIO;

  if (!isPreSeason) {
    price = 65 * BB_TO_GEM_RATIO;
  }

  const onCloseConfirmation = () => {
    onClose();
    setShowConfirmation(false);
  };

  const onCloseInsufficientBlockBucks = () => {
    setShowInsufficientBlockBuck(false);
  };

  const buyBlockBucks = () => {
    openModal("BUY_GEMS");
  };

  const Content = () => {
    if (showConfirmation) {
      return (
        <>
          <p className="text-sm my-2">{`Are you sure you want to purchase the banner for ${price} Gems?`}</p>
          <div className="flex">
            <Button className="mr-1" onClick={onCloseConfirmation}>
              {t("no.thanks")}
            </Button>
            <Button
              onClick={() => {
                gameService.send("banner.purchased", {
                  name: "Spring Blossom Banner",
                });
                setShowConfirmation(false);
                setShowPurchased(true);
              }}
            >
              {t("season.buyNow")}
            </Button>
          </div>
        </>
      );
    }
    if (showInsufficientBlockBuck) {
      return (
        <>
          <div className="p-2">
            <Label icon={SUNNYSIDE.icons.lock} type="danger" className="my-2">
              {t("transaction.buy.gems")}
            </Label>
            <p className="text-sm my-2">{t("offer.not.enough.gems")}</p>
          </div>
          <div className="flex">
            <Button className="mr-1" onClick={onCloseInsufficientBlockBucks}>
              {t("no.thanks")}
            </Button>
            <Button onClick={buyBlockBucks}>{t("transaction.buy.gems")}</Button>
          </div>
        </>
      );
    }
    if (showPurchased) {
      return (
        <>
          <div className="flex flex-col p-2">
            <div className="flex items-center">
              <img
                src={ITEM_DETAILS["Spring Blossom Banner"].image}
                className="rounded-md my-2 img-highlight mr-2"
                style={{
                  height: `${PIXEL_SCALE * 16}px`,
                }}
              />
              <p className="text-sm">{t("season.goodLuck")}</p>
            </div>
            <p className="text-sm">{t("season.access")}</p>
            <ul className="list-disc">
              <li className="text-xs ml-4">{t("season.discount")}</li>
              <li className="text-xs ml-4">{t("season.banner")}</li>
              <li className="text-xs ml-4">{t("season.wearableAirdrop")}</li>
              <li className="text-xs ml-4">{t("season.bonusTickets")}</li>
              <li className="text-xs ml-4">{t("season.boostXP")}</li>
            </ul>

            <Label className="my-2" type="default" icon={SUNNYSIDE.icons.drag}>
              {t("season.place.land")}
            </Label>

            <a
              href="https://docs.sunflower-land.com/player-guides/seasons/spring-blossom#spring-blossom-banner"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
            >
              {t("read.more")}
            </a>
          </div>
          <div className="flex">
            <Button className="mr-1" onClick={onCloseConfirmation}>
              {t("close")}
            </Button>
          </div>
        </>
      );
    }

    const msLeft = SEASONS["Spring Blossom"].startDate.getTime() - Date.now();
    const secondsLeft = msLeft / 1000;
    const insufficientBlockBucks = !inventory["Gem"]?.gte(price);

    return (
      <>
        <div className="flex flex-col p-2">
          <p className="text-base">{t("season.exclusiveOffer")}</p>

          <div className="flex items-center">
            <img
              src={ITEM_DETAILS["Spring Blossom Banner"].image}
              className="rounded-md my-2 img-highlight mr-2"
              style={{
                height: `${PIXEL_SCALE * 32}px`,
              }}
            />
            <div>
              <p className="text-sm">{`1 x Spring Blossom Banner`}</p>
              {secondsLeft > 0 ? (
                <>
                  <div className="flex my-1">
                    <img
                      src={blockBuck}
                      style={{
                        width: `${PIXEL_SCALE * 12}px`,
                        height: `${PIXEL_SCALE * 8}px`,
                      }}
                    />
                    <p className="line-through ml-2">{"65"}</p>
                    <p className="ml-2">{price}</p>
                  </div>
                  <Label type="danger">
                    {t("megaStore.timeRemaining", {
                      timeRemaining: secondsToString(secondsLeft, {
                        length: "medium",
                      }),
                    })}
                  </Label>
                </>
              ) : (
                <div className="flex my-1">
                  <p>{"65"}</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm">{t("season.includes")}</p>
          <ul className="list-disc">
            <li className="text-sm ml-4">{t("season.banner")}</li>
            <li className="text-sm ml-4">{t("season.wearableAirdrop")}</li>
            <li className="text-sm ml-4">{t("season.discount")}</li>
            <li className="text-sm ml-4">{t("season.boostXP")}</li>
            <li className="text-sm ml-4">{t("season.bonusTickets")}</li>
          </ul>
          {!isPreSeason && (
            <Label
              type="info"
              className="mt-2"
              icon={SUNNYSIDE.icons.timer}
              style={{
                width: "fit-content",
              }}
            >
              {t("season.limitedOffer")}
            </Label>
          )}
          {/* <Label
            type="danger"
            className="mt-2"
            style={{
              width: "fit-content",
            }}
          >
            Sold out
          </Label> */}
          <a
            href="https://docs.sunflower-land.com/player-guides/seasons/spring-blossom#spring-blossom-banner"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
          >
            {t("read.more")}
          </a>
        </div>
        <div className="flex">
          <Button className="mr-1" onClick={onCloseConfirmation}>
            {t("no.thanks")}
          </Button>
          <Button
            onClick={() => {
              if (insufficientBlockBucks) {
                setShowInsufficientBlockBuck(true);
              } else {
                setShowConfirmation(true);
              }
            }}
          >
            {t("season.buyNow")}
          </Button>
        </div>
      </>
    );
  };
  return (
    <Modal show={isOpen} onHide={onCloseConfirmation}>
      <CloseButtonPanel
        bumpkinParts={NPC_WEARABLES.grubnuk}
        onClose={onCloseConfirmation}
      >
        <Content />
      </CloseButtonPanel>
    </Modal>
  );
};
