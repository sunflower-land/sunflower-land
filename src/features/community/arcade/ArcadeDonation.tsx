import React, { useState } from "react";
import { Carousel, CarouselItem } from "react-bootstrap";

import { donationMachine } from "../merchant/lib/donationMachine";

import { Button } from "components/ui/Button";

import { roundToOneDecimal } from "features/auth/components";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ARCADE_GAMES } from "../lib/constants";
import { useMachine } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const GAMES = Object.values(ARCADE_GAMES);

export const ArcadeDonation: React.FC = () => {
  const [state, send] = useMachine(donationMachine);
  const [activeIndex, setActiveIndex] = useState(0);
  const [donation, setDonation] = useState(1);
  const { t } = useAppTranslation();
  const updateActiveIndex = (newIdx: number) => {
    setActiveIndex(newIdx % GAMES.length);
  };

  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If keyboard input "" convert to 0
    // Typed input validation will happen in onBlur
    setDonation(roundToOneDecimal(Number(e.target.value)));
  };

  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.2) {
      setDonation(0.2);
    } else if (donation < 0.2) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  const donate = () => {
    send("DONATE", {
      donation,
      to: GAMES[activeIndex].donationAddress,
    });
  };

  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col mb-1 p-2 text-sm">
          <p className="my-2">
          {t("transaction.thankYou")}
          </p>
          <Carousel
            activeIndex={activeIndex}
            interval={null}
            indicators={false}
            onSelect={updateActiveIndex}
            prevIcon={
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="absolute cursor-pointer"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            }
            nextIcon={
              <img
                src={SUNNYSIDE.icons.arrow_right}
                className="absolute cursor-pointer"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            }
          >
            {GAMES.map(({ title }) => (
              <CarouselItem key={title}>
                <div className="flex justify-center my-4">{title}</div>
              </CarouselItem>
            ))}
          </Carousel>
          <div className="flex flex-col items-center">
            <div className="flex">
              <input
                type="number"
                className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-1 text-center"
                step="0.1"
                min={0.1}
                value={donation}
                required
                onChange={onDonationChange}
                onBlur={() => {
                  if (donation < 0.1) setDonation(0.1);
                }}
              />
              <div className="flex flex-col justify-between ml-2">
                <img
                  src={SUNNYSIDE.icons.arrow_up}
                  alt="increment donation value"
                  className="cursor-pointer"
                  onClick={incrementDonation}
                />
                <img
                  src={SUNNYSIDE.icons.arrow_down}
                  alt="decrement donation value"
                  className="cursor-pointer"
                  onClick={decrementDonation}
                />
              </div>
            </div>
            <span className="text-xs text-shadow my-2">{t("transaction.maticAmount")}</span>
          </div>
          <Button
            className="w-full ml-1"
            onClick={donate}
            disabled={donation < 0.1}
          >
            <span className="text-xs whitespace-nowrap">{t("transaction.donate")}</span>
          </Button>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <p className="loading mb-4">{t("transaction.donating")}</p>
        </div>
      )}
      {state.matches("donated") && (
        <div className="flex flex-col items-center">
          <p className="mb-4">{t("statements.thankYou")}</p>
        </div>
      )}
      {state.matches("error") && (
        <div className="flex flex-col items-center">
          <p className="my-4">{t("statements.ohNo")}</p>
        </div>
      )}
    </>
  );
};
