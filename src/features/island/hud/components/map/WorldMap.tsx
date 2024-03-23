import React, { useContext, useEffect } from "react";

import * as Auth from "features/auth/lib/Provider";

import worldMap from "assets/map/world_map.png";

import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNavigate } from "react-router-dom";

export const WorldMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    gameService.send("SAVE");
  }, []);

  return (
    <div className="w-full relative shadow-xl">
      <img src={worldMap} className="w-full rounded-md" />

      <img
        src={SUNNYSIDE.icons.close}
        className="w-8 absolute top-2 right-2 cursor-pointer"
        onClick={onClose}
      />

      <div
        style={{
          width: "27%",
          height: "34%",
          // border: "1px solid red",
          position: "absolute",
          left: 0,
          bottom: 0,
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("/");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={{
            "-webkit-text-stroke": "1px black",
          }}
        >
          Home
        </span>
      </div>

      <div
        style={{
          width: "18%",
          height: "24%",
          // border: "1px solid red",
          position: "absolute",
          left: "35%",
          bottom: "20%",
        }}
        className="flex justify-center  cursor-pointer"
        onClick={() => {
          navigate("/world/plaza");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={{
            "-webkit-text-stroke": "1px black",
          }}
        >
          Plaza
        </span>
      </div>

      <div
        style={{
          width: "18%",
          height: "24%",
          border: "1px solid red",
          position: "absolute",
          left: "35%",
          bottom: "50%",
        }}
      />

      <div
        style={{
          width: "35%",
          height: "34%",
          // border: "1px solid red",
          position: "absolute",
          right: "0%",
          bottom: "0%",
        }}
        className="flex justify-center  cursor-pointer"
        onClick={() => {
          navigate("/world/retreat");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={{
            "-webkit-text-stroke": "1px black",
          }}
        >
          Retreat
        </span>
      </div>

      {/* <span
        className="text-xxs sm:text-xs absolute"
        style={{
          "-webkit-text-stroke": "1px black",
          left: "calc(45% - 25px)",
          bottom: "calc(56% - 50px)",
          width: "50px",
          "text-align": "center",
        }}
      >
        Plaza
      </span> */}
    </div>
  );
};
