import chest from "assets/icons/chest.png";
import sfl from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext } from "react";
import { Context } from "../lib/Provider";
import { getPromoCode } from "features/game/actions/loadSession";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const OfferItems: React.FC = () => {
  const { t } = useAppTranslation();
  const promo = getPromoCode();
  if (promo === "okx") {
    return (
      <div className="flex flex-wrap">
        <div className="flex mb-2 items-center w-1/2">
          <div className="w-8">
            <img src={ITEM_DETAILS["Block Buck"].image} className="h-5 mr-2" />
          </div>
          <p className="text-sm">10 Block Bucks</p>
        </div>
        <div className="flex mb-2 items-center w-1/2">
          <div className="w-8">
            <img src={chest} className="h-6 mr-2  animate-pulsate" />
          </div>
          <p className="text-sm">{t("onboarding.starterPack")}</p>
        </div>
        <div className="flex mb-2 items-center w-1/2">
          <div className="w-8">
            <img src={sfl} className="h-6 mr-2  animate-pulsate" />
          </div>
          <p className="text-sm">30 SFL</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap">
      <div className="flex mb-2 items-center w-1/2">
        <div className="w-8">
          <img src={SUNNYSIDE.icons.plant} className="h-6" />
        </div>
        <p className="text-sm">1 Farm NFT</p>
      </div>
      <div className="flex mb-2 items-center w-1/2">
        <div className="w-8">
          <img src={SUNNYSIDE.icons.player} className="h-6" />
        </div>
        <p className="text-sm">1 Bumpkin NFT</p>
      </div>
      <div className="flex mb-2 items-center w-1/2">
        <div className="w-8">
          <img src={ITEM_DETAILS["Block Buck"].image} className="h-5 mr-2" />
        </div>
        <p className="text-sm">5 Block Bucks</p>
      </div>
      <div className="flex mb-2 items-center w-1/2">
        <div className="w-8">
          <img src={chest} className="h-6 mr-2  animate-pulsate" />
        </div>
        <p className="text-sm">1 {t("onboarding.starterPack")}</p>
      </div>
    </div>
  );
};

export const Offer: React.FC = () => {
  const { authService } = useContext(Context);
  const promo = getPromoCode();
  if (promo === "okx") {
    return (
      <>
        <div className="p-2">
          <p className="mb-2">
            Howdy Farmer, I have an exclusive OKX offer for you!
          </p>

          <p className="mb-2">
            To begin you will need to mint a{" "}
            <span className="underline">free</span> Farm NFT. This will include:
          </p>

          <OfferItems />
        </div>
        <Button onClick={() => authService.send("CONTINUE")}>
          Get Starter Pack Now
        </Button>
      </>
    );
  }
  return (
    <>
      <div className="p-2">
        <p className="mb-2">Howdy Farmer, you look new here!</p>

        <p className="mb-3">
          To begin you will need to mint a{" "}
          <span className="underline">free</span> Farm NFT. This will include:
        </p>

        <OfferItems />
      </div>
      <Button onClick={() => authService.send("CONTINUE")}>
        Get Started Now
      </Button>
    </>
  );
};
