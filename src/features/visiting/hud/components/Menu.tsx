import React, { useContext, useEffect, useRef, useState } from "react";

import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import * as Auth from "features/auth/lib/Provider";

import mobileMenu from "assets/icons/hamburger_menu.png";
import radish from "assets/icons/radish.png";
import town from "assets/icons/town.png";
import water from "assets/icons/expression_working.png";
import wood from "assets/resources/wood.png";
import leftArrow from "assets/icons/arrow_left.png";
import { Share } from "components/Share";

/**
 * TODO:
 * create menu level parent mapping if more than 2 levels.
 * currently only 1 level deep so setMenuLevel("ROOT") satisfies
 */

enum MENU_LEVELS {
  ROOT = "root",
  MAP = "map",
  VIEW = "view",
}

export const Menu = () => {
  const { authService } = useContext(Auth.Context);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const [showShareModal, setShowShareModal] = useState(false);
  const [farmURL, setFarmURL] = useState("");
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);

  const ref = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigationClick = (section: Section) => {
    scrollIntoView(section);
    setMenuOpen(false);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    setMenuOpen(false);
  };

  const handleClick = (e: Event) => {
    // inside click
    if (ref?.current?.contains(e.target as Node)) return;
    // outside click
    setMenuOpen(false);
  };

  const goBack = () => {
    authService.send("RETURN");
  };

  // Handles closing the menu if someone clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    const _farmURL = window.location.href.replace("/farm", "/visit");

    setFarmURL(_farmURL);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    <div ref={ref} className="w-5/12 sm:w-60 fixed top-2 left-2 z-50 shadow-lg">
      <OuterPanel>
        <div className="flex justify-center p-1">
          <Button
            className="mr-2 bg-brown-200 active:bg-brown-200"
            onClick={handleMenuClick}
          >
            <img
              className="md:hidden w-6"
              src={mobileMenu}
              alt="hamburger-menu"
            />
            <span className="hidden md:flex">Menu</span>
          </Button>
          <Button onClick={goBack}>
            <span>Back</span>
          </Button>
        </div>
        <div
          className={`transition-all ease duration-200 ${
            menuOpen ? "max-h-100" : "max-h-0"
          }`}
        >
          <ul
            className={`list-none pt-1 transition-all ease duration-200 origin-top ${
              menuOpen ? "scale-y-1" : "scale-y-0"
            }`}
          >
            {/* Root menu */}
            {menuLevel === MENU_LEVELS.ROOT && (
              <>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => setMenuLevel(MENU_LEVELS.MAP)}
                  >
                    <span className="sm:text-sm flex-1">Map</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleShareClick}>
                    <span className="sm:text-sm">Share</span>
                  </Button>
                </li>
              </>
            )}

            {/* Back button when not Root */}
            {menuLevel !== MENU_LEVELS.ROOT && (
              <li className="p-1">
                <Button onClick={() => setMenuLevel(MENU_LEVELS.ROOT)}>
                  <img src={leftArrow} className="w-4 mr-2" alt="left" />
                </Button>
              </li>
            )}

            {/* Map menu */}
            {menuLevel === MENU_LEVELS.MAP && (
              <>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Town)}
                  >
                    <span className="sm:text-sm flex-1">Town</span>
                    <img src={town} className="w-6 ml-2" alt="town" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Crops)}
                  >
                    <span className="sm:text-sm flex-1">Crops</span>
                    <img src={radish} className="w-4 ml-2" alt="crop" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Water)}
                  >
                    <span className="sm:text-sm flex-1">Water</span>
                    <img src={water} className="w-4 ml-2" alt="water" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Forest)}
                  >
                    <span className="sm:text-sm flex-1">Forest</span>
                    <img src={wood} className="w-4 ml-2" alt="wood" />
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </OuterPanel>

      <Share
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        farmURL={farmURL}
      />
    </div>
  );
};
