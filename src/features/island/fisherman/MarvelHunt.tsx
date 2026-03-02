import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { Context } from "features/game/GameProvider";
import { MarineMarvelName } from "features/game/types/fishing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { Fragment, useContext, useState } from "react";
import { Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import { Loading } from "features/auth/components";
import { SUNNYSIDE } from "assets/sunnyside";
import mapIcon from "assets/icons/map.webp";

export const MarvelHunt: React.FC<{
  onClose: () => void;
  marvel: MarineMarvelName;
}> = ({ onClose, marvel }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [showSearching, setShowSearching] = useState(false);
  const [showClaim, setShowClaim] = useState(false);

  const onSearch = async () => {
    if (showSearching) return;

    setShowSearching(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));
    setShowClaim(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setShowSearching(false);

    // Wait for fade-out to finish before showing the reward panel
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const onClaim = async () => {
    onClose();

    // Brief pause so the modal closes completely first
    await new Promise((resolve) => setTimeout(resolve, 100));

    gameService.send({ type: "marvel.caught", name: marvel });
    gameService.send({ type: "SAVE" });
  };

  if (showClaim) {
    return (
      <CloseButtonPanel onClose={onClose}>
        <ClaimReward
          label={t("marvelHunt.reward.title")}
          reward={{
            id: `marvel-hunt-${marvel}`,
            message: t("marvelHunt.reward.message", { marvel }),
            items: { [marvel]: 1 },
            wearables: {},
            sfl: 0,
            coins: 0,
          }}
          onClaim={onClaim}
        />
      </CloseButtonPanel>
    );
  }

  return (
    <>
      {createPortal(
        <Transition
          show={showSearching}
          enter="transform transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform transition-opacity duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div
            style={{
              zIndex: 9999999,
              backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="fixed inset-0 text-white flex justify-center items-center"
          >
            <div className="absolute inset-0 bg-black opacity-80" />
            <div className="relative">
              <Loading text={t("marvelHunt.searching")} />
            </div>
          </div>
        </Transition>,
        document.body,
      )}

      <CloseButtonPanel onClose={onClose}>
        <Label type="default" icon={mapIcon} className="ml-2">
          {t("marvelHunt.mapComplete.title", { marvel })}
        </Label>
        <p className="text-xs m-1 my-2">
          {t("marvelHunt.mapComplete.description", { marvel })}
        </p>
        <Button onClick={onSearch} disabled={showSearching}>
          {t("search")}
        </Button>
      </CloseButtonPanel>
    </>
  );
};
