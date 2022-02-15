import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";
import { OuterPanel, Panel } from "components/ui/Panel";

import { Section, useScrollIntoView } from "lib/utils/useScrollIntoView";
import * as Auth from "features/auth/lib/Provider";
import { sync } from "features/game/actions/sync";
import { Context } from "features/game/GameProvider";

import { Withdraw } from "./Withdraw";
import { Modal } from "react-bootstrap";

import mobileMenu from "assets/icons/hamburger_menu.png";
import questionMark from "assets/icons/expression_confused.png";
import radish from "assets/icons/radish.png";
import water from "assets/icons/expression_working.png";
import token from "assets/icons/token.png";
import timer from "assets/icons/timer.png";

const NETWORK = import.meta.env.VITE_NETWORK;

export const Menu = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);
  const [gameState] = useActor(gameService);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);
  const [showComingSoon, setShowComingSoon] = React.useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigationClick = (section: Section) => {
    scrollIntoView(section);

    setMenuOpen(false);
  };

  const handleAboutClick = () => {
    window.open("https://docs.sunflower-land.com/", "_blank");
    setMenuOpen(false);
  };

  const handleClick = (e: Event) => {
    // inside click
    if (ref?.current?.contains(e.target as Node)) return;
    // outside click
    setMenuOpen(false);
  };

  const withdraw = () => {
    setShowWithdrawModal(true);
    setMenuOpen(false);
  };

  // TODO - Remove function when withdraw and Sync on Chain functionalities are implemnented
  const handleComingSoonModal = () => {
    setShowComingSoon(true);
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

  const syncOnChain = async () => {
    if (NETWORK === "mainnet") {
      setShowComingSoon(true);
      setMenuOpen(false);
      return;
    }

    gameService.send("SYNC");
  };

  const autosave = async () => {
    gameService.send("SAVE");
  };

  const goBack = () => {
    authService.send("RETURN");
  };

  return (
    <div ref={ref} className="fixed top-2 left-2 z-50 shadow-lg">
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
          {!gameState.matches("readonly") && (
            <Button onClick={autosave}>
              {gameState.matches("autosaving") ? (
                <img src={timer} className="animate-pulsate" alt="saving" />
              ) : (
                <span>Save</span>
              )}
            </Button>
          )}
          {gameState.matches("readonly") && (
            <Button onClick={goBack}><span>Back</span></Button>
          )}
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
            {!gameState.matches("readonly") && (
              <>
                <li className="p-1">
                  <Button onClick={syncOnChain}>
                    <span className="text-sm">Sync on chain</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={withdraw}>
                    <span className="text-sm">Withdraw</span>
                    <img src={token} className="w-4 ml-2" alt="token" />
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </OuterPanel>

      <Withdraw
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />

      {/* TODO - To be deleted when withdraw and "Sync on chain" are implemented */}
      <Modal
        show={showComingSoon}
        onHide={() => setShowComingSoon(false)}
        centered
      >
        <Panel>Coming soon!</Panel>
      </Modal>
    </div>
  );
};
