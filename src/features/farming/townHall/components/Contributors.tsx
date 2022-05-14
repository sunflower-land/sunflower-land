import React from "react";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "lib/config";

import logo from "assets/brand/logo.png";

// Common Avatars
import goblin from "assets/npcs/goblin.gif";
import man from "assets/npcs/idle.gif";
import woman from "assets/npcs/woman.gif";

// Custom Avatars
import aestnelis from "assets/avatars/aestnelis.gif";
import andejaus from "assets/avatars/andejausfrog.gif";
import benahol from "assets/avatars/benahol.gif";
import bumpkin from "assets/avatars/bumpkin.gif";
import denlon from "assets/avatars/denlon.gif";
import dee from "assets/avatars/donatofrog.gif";
import kaiojans from "assets/avatars/kaiojans.gif";
import tiff from "assets/avatars/tifffrog.gif";
import vp from "assets/avatars/vadimofrog.gif";
import manbino from "assets/avatars/manbino.gif";
import gobleyh from "assets/avatars/gobleyh.gif";
import baalex from "assets/avatars/baalex.gif";
import minion from "assets/avatars/minion.gif";
import chicken from "assets/avatars/chicken.gif";
import inu from "assets/avatars/inu.gif";
import telknub from "assets/avatars/telknub.gif";
import littleeinst from "assets/avatars/littleeinst.gif";
import ant from "assets/avatars/ant.gif";
import complic from "assets/avatars/complic.gif";
import shykun from "assets/avatars/shykun.gif";
import tourist from "assets/avatars/tourist.gif";
import sfwhat from "assets/avatars/sfwhat.gif";
import reymar from "assets/avatars/reymar.gif";
import na66ime from "assets/avatars/na66ime.gif";
import marceline from "assets/avatars/marceline.gif";

import {
  Contributor,
  ContributorRole,
  CONTRIBUTORS,
} from "../constants/contributors";
import { ITEM_DETAILS } from "features/game/types/images";

import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import classNames from "classnames";

const TAB_CONTENT_HEIGHT = 340;

const AVATARS: Record<Contributor["avatar"], string> = {
  // common
  goblin,
  man,
  woman,
  // custom
  aestnelis,
  andejaus,
  benahol,
  bumpkin,
  denlon,
  dee,
  kaiojans,
  tiff,
  vp,
  manbino,
  gobleyh,
  baalex,
  minion,
  chicken,
  inu,
  telknub,
  littleeinst,
  ant,
  complic,
  shykun,
  tourist,
  sfwhat,
  reymar,
  na66ime,
  marceline,
};

const ROLE_BADGES: Record<ContributorRole, string> = {
  artist: ITEM_DETAILS["Artist"].image,
  coder: ITEM_DETAILS["Coder"].image,
  moderator: ITEM_DETAILS["Discord Mod"].image,
  ambassador: ITEM_DETAILS["Discord Mod"].image,
};

interface Props {
  onClose: () => void;
}

export const Contributors: React.FC<Props> = ({ onClose }) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);
  const navigate = useNavigate();

  const handleAvatarClick = (contributorUrl: string) => {
    if (contributorUrl) window.open(encodeURI(contributorUrl), "_blank");
    return;
  };

  return (
    <>
      <div className="flex flex-wrap justify-center items-center">
        <img src={logo} className="w-2/3" />
        <p className="text-xs text-center pt-2">
          Sunflower Land is a community project and we are so grateful to the
          contributors who have helped out get closer to our vision.
        </p>
        <p className="text-xs text-center pt-3 mb-2">
          If you like their work, visit their farm and buy them a coffee!
        </p>
      </div>
      <div
        ref={itemContainerRef}
        style={{
          maxHeight: TAB_CONTENT_HEIGHT,
          minHeight: (TAB_CONTENT_HEIGHT * 2) / 3,
        }}
        className={classNames("overflow-y-auto pt-1 mr-2", {
          scrollable: showScrollbar,
        })}
      >
        <div className="flex flex-wrap items-center h-fit">
          {CONTRIBUTORS.map((contributor) => (
            <div
              key={contributor.name}
              className="flex w-full mb-6"
              id={contributor.name}
            >
              <div className="w-10 mr-4 flex justify-center">
                <img
                  src={AVATARS[contributor.avatar]}
                  className="h-8"
                  onClick={() => handleAvatarClick(contributor.url)}
                />
              </div>
              <div>
                <p className="text-sm capitalize">
                  {contributor.name}{" "}
                  {CONFIG.NETWORK === "mainnet" && (
                    <span
                      className="underline cursor-pointer"
                      onClick={() => {
                        navigate(`/visit/${contributor.farmId}`);
                        onClose();
                      }}
                    >
                      #{contributor.farmId}
                    </span>
                  )}
                </p>
                <p className="text-sm">
                  {contributor.role.map((role) => (
                    <span
                      key={role}
                      className="capitalize flex items-center py-1"
                    >
                      {role}
                      <img src={ROLE_BADGES[role]} className="h-5 ml-1" />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
