import React, { useState } from "react";

import ocean from "assets/decorations/ocean.webp";
import sandIslandOne from "assets/brand/sand_island_one.webp";
import sandIslandOneShore from "assets/brand/sand_island_one_shore.webp";
import sandIslandTwo from "assets/brand/sand_island_two.webp";
import sandIslandTwoShore from "assets/brand/sand_island_two_shore.webp";
import sunflowerIslandOne from "assets/brand/sunflower_island_one.webp";
import cossies from "assets/decorations/cossies.png";
import goblinSwimming from "assets/npcs/goblin_farting.gif";
import shadow from "assets/npcs/shadow.png";

import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel, Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import i18n from "lib/i18n";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { GameState } from "features/game/types/game";

const releaseVersion = CONFIG.RELEASE_VERSION as string;

const Languages = () => {
  // Determine the initial language from localStorage or default to 'en'
  const initialLanguage = localStorage.getItem("language") || "en";
  const [language, setLanguage] = useState(initialLanguage);

  const toggleLanguage = () => {
    const newLanguage =
      language === "en" ? "pt" : language === "pt" ? "fr" : "en";
    localStorage.setItem("language", newLanguage);
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const flagImage =
    language === "en"
      ? ITEM_DETAILS["American Flag"].image
      : language === "pt"
      ? ITEM_DETAILS["Brazilian Flag"].image
      : language === "fr"
      ? ITEM_DETAILS["French Flag"].image
      : null;

  const languageLabel =
    language === "en"
      ? "English"
      : language === "pt"
      ? "Português Brasileiro"
      : language === "fr"
      ? "Français"
      : null;

  return (
    <Button className="mb-2 py-1 text-xs relative" onClick={toggleLanguage}>
      <div className="px-8 pr-1">
        <img
          src={flagImage}
          alt={languageLabel || ""}
          className="h-5 mobile:h-4 ml-2.5 mr-4 absolute left-0 rounded-sm"
        />
        {languageLabel}
      </div>
    </Button>
  );
};

export const Splash: React.FC = ({ children }) => {
  return (
    <div
      className="bg-blue-600 w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundImage: `url(${ocean})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",
      }}
    >
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
      <div
        className="absolute bottom-0 right-auto m-1 pointer-events-auto"
        style={{ zIndex: 1100, margin: `${PIXEL_SCALE * 1}px` }}
      >
        {hasFeatureAccess({} as GameState, "LOCALISATION") && <Languages />}
      </div>
      <div
        className="absolute bottom-0 right-0 m-1 pointer-events-auto"
        style={{ zIndex: 1100, margin: `${PIXEL_SCALE * 1}px` }}
      >
        <InnerPanel>
          <div className="flex items-center justify-center">
            <a
              className="underline text-xxs text-white hover:text-blue-500 p-1"
              href="https://github.com/sunflower-land/sunflower-land/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              {releaseVersion?.split("-")[0]}
            </a>
          </div>
        </InnerPanel>
      </div>
    </div>
  );
};
