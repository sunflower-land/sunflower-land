import React, { useEffect, useRef } from "react";

import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";

import mobileMenu from "assets/icons/hamburger_menu.png";
import questionMark from "assets/icons/expression_confused.png";
import radish from "assets/icons/radish.png";
import water from "assets/icons/expression_working.png";
import token from "assets/icons/token.png";

import { Section, useScrollIntoView } from "lib/utils/useScrollIntoView";

export const Menu = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrollIntoView] = useScrollIntoView();
  const ref = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigationClick = (section: Section) => {
    scrollIntoView(section);

    setMenuOpen(false);
  };

  const handleAboutClick = () => {
    window.open("https://docs.sunflower-farmers.com/");
    setMenuOpen(false);
  };

  const handleClick = (e: Event) => {
    // inside click
    if (ref?.current?.contains(e.target as Node)) return;
    // outside click
    setMenuOpen(false);
  };

  // Handles closing the menu if someone clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    <div ref={ref} className="fixed top-2 left-2 z-50  shadow-lg">
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
          <Button onClick={() => {}}>
            {/* <img className="md:hidden w-6" src={mobileSave} alt="save" /> */}
            <span>Save</span>
          </Button>
        </div>
        <div
          className={`transition-all ease duration-200 ${
            menuOpen ? "max-h-80" : "max-h-0"
          }`}
        >
          <ul
            className={`list-none pt-1 transition-all ease duration-200 origin-top ${
              menuOpen ? "scale-y-1" : "scale-y-0"
            }`}
          >
            <li className="p-1">
              <Button onClick={handleAboutClick}>
                <span className="text-sm">About</span>
                <img
                  src={questionMark}
                  className="w-3 ml-2"
                  alt="question-mark"
                />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => handleNavigationClick(Section.Crops)}>
                <span className="text-sm">Crops</span>
                <img src={radish} className="w-4 ml-2" alt="crop" />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => handleNavigationClick(Section.Water)}>
                <span className="text-sm">Water</span>
                <img src={water} className="w-4 ml-2" alt="water" />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => {}}>
                <span className="text-sm">Withdraw</span>
                <img src={token} className="w-4 ml-2" alt="token" />
              </Button>
            </li>
          </ul>
        </div>
      </OuterPanel>
    </div>
  );
};
