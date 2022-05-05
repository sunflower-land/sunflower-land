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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full h-96 overflow-scroll">
      <img src={logo} className="w-1/2" />
      <p className="text-sm text-center pt-4">
        Sunflower Land is a community project and we are so grateful to the
        contributors who have helped out get closer to our vision.
      </p>
      <p className="text-sm text-center pt-4">
        If you like their work, visit their farm and buy them a coffee!
      </p>
      {CONTRIBUTORS.map((contributor) => (
        <div
          key={contributor.name}
          className="flex w-full mt-8"
          id={contributor.name}
        >
          <div className="w-10 mr-4 flex justify-center">
            <img src={AVATARS[contributor.avatar]} className="h-8" />
          </div>
          <div>
            <p className="text-sm capitalize">
              {contributor.name}{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  navigate(`/visit/${contributor.farmId}`);
                  onClose();
                }}
              >
                #{contributor.farmId}
              </span>
            </p>
            <p className="text-sm">
              {contributor.role.map((role) => (
                <span key={role} className="capitalize flex items-center py-1">
                  {role}
                  <img src={ROLE_BADGES[role]} className="h-5 ml-1" />
                </span>
              ))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
