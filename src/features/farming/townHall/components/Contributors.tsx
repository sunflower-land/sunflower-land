import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "assets/brand/logo.png";
import bumpkin from "assets/npcs/bumpkin.png";
import goblin from "assets/npcs/goblin.gif";
import man from "assets/npcs/idle.gif";

import {
  Contributor,
  ContributorRole,
  CONTRIBUTORS,
} from "../constants/contributors";
import { ITEM_DETAILS } from "features/game/types/images";

import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import classNames from "classnames";
import { CONFIG } from "lib/config";

const TAB_CONTENT_HEIGHT = 340;

const AVATARS: Record<Contributor["avatar"], string> = {
  bumpkin,
  goblin,
  man,
  // TODO!
  woman: man,
};

const ROLE_BADGES: Record<ContributorRole, string> = {
  artist: ITEM_DETAILS["Artist"].image,
  coder: ITEM_DETAILS["Coder"].image,
  moderator: ITEM_DETAILS["Discord Mod"].image,
};

interface Props {
  onClose: () => void;
}

export const Contributors: React.FC<Props> = ({ onClose }) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);
  const navigate = useNavigate();

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
          {CONTRIBUTORS.map((contributor, index) => (
            <div key={index} className="flex w-full mb-6" id={contributor.name}>
              <div className="w-10 mr-4 flex justify-center">
                <img src={AVATARS[contributor.avatar]} className="h-8" />
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
                  {contributor.role.map((role, index) => (
                    <span
                      key={index}
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
