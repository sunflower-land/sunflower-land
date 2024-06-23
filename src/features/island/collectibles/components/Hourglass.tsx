import React, { useContext, useState } from "react";

import gourmetHourglassFull from "src/assets/factions/boosts/cooking_boost_full.webp";
import gourmetHourglassHalf from "src/assets/factions/boosts/cooking_boost_half.webp";
import gourmetHourglassDone from "src/assets/factions/boosts/cooking_boost_done.webp";
import harvestHourglassFull from "src/assets/factions/boosts/crop_boost_full.webp";
import harvestHourglassHalf from "src/assets/factions/boosts/crop_boost_half.webp";
import harvestHourglassDone from "src/assets/factions/boosts/crop_boost_done.webp";
import timberHourglassFull from "src/assets/factions/boosts/wood_boost_full.webp";
import timberHourglassHalf from "src/assets/factions/boosts/wood_boost_half.webp";
import timberHourglassDone from "src/assets/factions/boosts/wood_boost_done.webp";
import oreHourglassFull from "src/assets/factions/boosts/mineral_boost_full.webp";
import oreHourglassHalf from "src/assets/factions/boosts/mineral_boost_half.webp";
import oreHourglassDone from "src/assets/factions/boosts/mineral_boost_done.webp";
import orchardHourglassFull from "src/assets/factions/boosts/fruit_boost_full.webp";
import orchardHourglassHalf from "src/assets/factions/boosts/fruit_boost_half.webp";
import orchardHourglassDone from "src/assets/factions/boosts/fruit_boost_done.webp";
import blossomHourglassFull from "src/assets/factions/boosts/flower_boost_full.webp";
import blossomHourglassHalf from "src/assets/factions/boosts/flower_boost_half.webp";
import blossomHourglassDone from "src/assets/factions/boosts/flower_boost_done.webp";
import fisherHourglassFull from "src/assets/factions/boosts/fish_boost_full.webp";
import fisherHourglassHalf from "src/assets/factions/boosts/fish_boost_half.webp";
import fisherHourglassDone from "src/assets/factions/boosts/fish_boost_done.webp";

import shadow from "src/assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { LiveProgressBar } from "components/ui/ProgressBar";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { InventoryItemName } from "features/game/types/game";

type HourglassType =
  | "Gourmet Hourglass"
  | "Harvest Hourglass"
  | "Timber Hourglass"
  | "Orchard Hourglass"
  | "Blossom Hourglass"
  | "Fisher's Hourglass"
  | "Ore Hourglass";

type InformationModalProps = {
  boostEndAt: number;
  show: boolean;
  expiresAt: number;
  hasExpired: boolean;
  name: string;
  onClose: () => void;
  onRemove: () => void;
};

const HourglassInfoModal: React.FC<InformationModalProps> = ({
  show,
  name,
  boostEndAt,
  hasExpired,
  onClose,
  onRemove,
}) => {
  const { t } = useAppTranslation();

  const remainingSeconds = (boostEndAt - Date.now()) / 1000;
  const boostDescription = COLLECTIBLE_BUFF_LABELS[name as InventoryItemName]
    ?.shortDescription as string;

  return (
    <Modal show={show}>
      <CloseButtonPanel>
        {hasExpired && (
          <>
            <div className="p-2">
              <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
                {t("expired")}
              </Label>
              <p className="text-sm my-2">
                {t("description.hourglass.expired", { hourglass: name })}
              </p>
            </div>
            <Button onClick={onRemove}>{t("remove")}</Button>
          </>
        )}
        {!hasExpired && (
          <>
            <div className="p-2">
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {t("time.remaining", {
                  time: secondsToString(remainingSeconds, {
                    length: "medium",
                    isShortFormat: true,
                    removeTrailingZeros: true,
                  }),
                })}
              </Label>
              <p className="text-sm my-2">
                {t("description.hourglass.running", {
                  boost: boostDescription,
                  hourglass: name,
                })}
              </p>
            </div>
            <Button onClick={onClose}>{t("gotIt")}</Button>
          </>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};

type HourglassDetail = {
  fullImage: string;
  halfImage: string;
  doneImage: string;
  boostMillis: number;
};

const HOURGLASS_DETAILS: Record<HourglassType, HourglassDetail> = {
  "Gourmet Hourglass": {
    fullImage: gourmetHourglassFull,
    halfImage: gourmetHourglassHalf,
    doneImage: gourmetHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Harvest Hourglass": {
    fullImage: harvestHourglassFull,
    halfImage: harvestHourglassHalf,
    doneImage: harvestHourglassDone,
    boostMillis: 6 * 60 * 60 * 1000,
  },
  "Timber Hourglass": {
    fullImage: timberHourglassFull,
    halfImage: timberHourglassHalf,
    doneImage: timberHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Orchard Hourglass": {
    fullImage: orchardHourglassFull,
    halfImage: orchardHourglassHalf,
    doneImage: orchardHourglassDone,
    boostMillis: 6 * 60 * 60 * 1000,
  },
  "Blossom Hourglass": {
    fullImage: blossomHourglassFull,
    halfImage: blossomHourglassHalf,
    doneImage: blossomHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Fisher's Hourglass": {
    fullImage: fisherHourglassFull,
    halfImage: fisherHourglassHalf,
    doneImage: fisherHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Ore Hourglass": {
    fullImage: oreHourglassFull,
    halfImage: oreHourglassHalf,
    doneImage: oreHourglassDone,
    boostMillis: 3 * 60 * 60 * 1000,
  },
};

interface HourglassProps extends CollectibleProps {
  hourglass: HourglassType;
}

export const Hourglass: React.FC<HourglassProps> = ({
  createdAt,
  id,
  location,
  hourglass,
}) => {
  const { gameService, showTimers } = useContext(Context);
  const [_, setRender] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const expiresAt = createdAt + HOURGLASS_DETAILS[hourglass].boostMillis;
  const hasExpired = Date.now() > expiresAt;

  useUiRefresher({ active: !hasExpired });

  const getHourglassImage = () => {
    if (hasExpired) {
      return HOURGLASS_DETAILS[hourglass].doneImage;
    }

    if (Date.now() - createdAt < HOURGLASS_DETAILS[hourglass].boostMillis / 2) {
      return HOURGLASS_DETAILS[hourglass].halfImage;
    }

    return HOURGLASS_DETAILS[hourglass].fullImage;
  };

  const handleRemove = () => {
    gameService.send("collectible.burned", {
      name: hourglass,
      location,
      id,
    });
  };

  return (
    <>
      <HourglassInfoModal
        show={showModal}
        name={hourglass}
        hasExpired={hasExpired}
        expiresAt={expiresAt}
        boostEndAt={createdAt + HOURGLASS_DETAILS[hourglass].boostMillis}
        onClose={() => setShowModal(false)}
        onRemove={handleRemove}
      />
      {hasExpired && (
        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30"
          src={SUNNYSIDE.icons.dig_icon}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -8}px`,
          }}
          onClick={() => setShowModal(true)}
        />
      )}
      {showTimers && (
        <div className="absolute bottom-0 left-0">
          <LiveProgressBar
            startAt={createdAt}
            endAt={expiresAt}
            formatLength="medium"
            type="buff"
            onComplete={() => setRender((r) => r + 1)}
          />
        </div>
      )}

      <img
        src={shadow}
        alt="shadow"
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          bottom: `-${PIXEL_SCALE * 1.6}px`,
        }}
        className="absolute cursor-pointer left-1/2 -translate-x-1/2 hover:img-highlight"
      />
      <img
        src={getHourglassImage()}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute cursor-pointer left-1/2 -translate-x-1/2 hover:img-highlight"
        alt={hourglass}
        onClick={() => setShowModal(true)}
      />
    </>
  );
};
