import React, { useState } from "react";

import sandIslandOne from "assets/brand/sand_island_one.webp";
import sandIslandOneShore from "assets/brand/sand_island_one_shore.webp";
import sandIslandTwo from "assets/brand/sand_island_two.webp";
import sandIslandTwoShore from "assets/brand/sand_island_two_shore.webp";
import sunflowerIslandOne from "assets/brand/sunflower_island_one.webp";
import cossies from "assets/decorations/cossies.png";
import goblinSwimming from "assets/npcs/goblin_farting.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import i18n from "lib/i18n";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Ocean } from "features/world/ui/Ocean";

const Languages = () => {
  // Determine the initial language from localStorage or default to 'en'
  const initialLanguage = localStorage.getItem("language") || "en";
  const [language, setLanguage] = useState(initialLanguage);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "pt" : "en";
    localStorage.setItem("language", newLanguage);
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const flagImage =
    language === "en"
      ? ITEM_DETAILS["American Flag"].image
      : ITEM_DETAILS["Brazilian Flag"].image;
  const languageLabel = language === "en" ? "English" : "Português Brasileiro";

  return (
    <Button className="mb-2 py-1 text-xs relative" onClick={toggleLanguage}>
      <div className="px-8 pr-1">
        <img
          src={flagImage}
          alt={languageLabel}
          className="h-5 mobile:h-4 ml-2.5 mr-4 absolute left-0 rounded-sm"
        />
        {languageLabel}
      </div>
    </Button>
  );
};

export const Splash: React.FC = ({ children }) => {
  return (
    <Ocean>
      <img
        src={sunflowerIslandOne}
        style={{
          width: `${144 * PIXEL_SCALE}px`,
          top: 0,
        }}
        className="absolute"
      />
      <img
        src={goblinSwimming}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          transform: "scaleX(-1)",
          bottom: `${40 * PIXEL_SCALE}px`,
          right: `${45 * PIXEL_SCALE}px`,
        }}
      />
      <img
        src={SUNNYSIDE.npcs.swimmer}
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          left: `${40 * PIXEL_SCALE}px`,
          bottom: `${80 * PIXEL_SCALE}px`,
        }}
        className="absolute"
      />
      <img
        src={cossies}
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          left: `${20 * PIXEL_SCALE}px`,
          bottom: `${80 * PIXEL_SCALE}px`,
        }}
        className="absolute"
      />
      <img
        src={sandIslandOneShore}
        style={{
          width: `${87 * PIXEL_SCALE}px`,
          left: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={sandIslandTwoShore}
        style={{
          width: `${71 * PIXEL_SCALE}px`,
          right: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={sandIslandOne}
        style={{
          width: `${87 * PIXEL_SCALE}px`,
          left: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={sandIslandTwo}
        style={{
          width: `${71 * PIXEL_SCALE}px`,
          right: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={SUNNYSIDE.npcs.watering}
        style={{
          width: `${33 * PIXEL_SCALE}px`,
          top: `${10 * PIXEL_SCALE}px`,
          bottom: 0,
          marginLeft: "168px",
        }}
        className="absolute"
      />
      <img
        src={shadow}
        style={{
          width: `${15 * PIXEL_SCALE}px`,
          top: `${22 * PIXEL_SCALE}px`,
          bottom: 0,
          marginLeft: "138px",
        }}
        className="absolute"
      />
      {children && (
        <Modal show={!!children} centered>
          <Panel>{children}</Panel>
        </Modal>
      )}
    </Ocean>
  );
};
