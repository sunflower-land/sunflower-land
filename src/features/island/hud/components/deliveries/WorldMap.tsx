import React, { useContext, useEffect } from "react";

import worldMap from "assets/map/world_map.png";

import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNavigate } from "react-router-dom";
import { OuterPanel } from "components/ui/Panel";

const showDebugBorders = false;

export const WorldMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    gameService.send("SAVE");
  }, []);

  return (
    <OuterPanel className="w-full relative shadow-xl">
      <img src={worldMap} className="w-full" />

      <img
        src={SUNNYSIDE.icons.close}
        className="w-8 absolute top-2 right-2 cursor-pointer"
        onClick={onClose}
      />

      <div
        style={{
          width: "27%",
          height: "34%",
          border: showDebugBorders ? "2px solid red" : "",
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
          style={
            {
              "-webkit-text-stroke": "1px black",
            } as any
          }
        >
          {t("world.home")}
        </span>
      </div>

      <div
        style={{
          width: "18%",
          height: "24%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "35%",
          bottom: "20%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("/world/plaza");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={
            {
              "-webkit-text-stroke": "1px black",
            } as any
          }
        >
          {t("world.plaza")}
        </span>
      </div>

      <div
        style={{
          width: "12%",
          height: "38%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "22%",
          bottom: "27%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("/world/beach");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={
            {
              "-webkit-text-stroke": "1px black",
            } as any
          }
        >
          {t("world.beach")}
        </span>
      </div>

      <div
        style={{
          width: "15%",
          height: "15%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          right: "34%",
          bottom: "33%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("/world/woodlands");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={
            {
              "-webkit-text-stroke": "1px black",
            } as any
          }
        >
          {t("world.woodlands")}
        </span>
      </div>

      {/* <div
        style={{
          width: "18%",
          height: "24%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "35%",
          bottom: "50%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("...");
          onClose();
        }}
        >
        <span
          className="text-xs sm:text-sm"
          style={
            {
              "-webkit-text-stroke": "1px black",
            } as any
          }
        >
          {t("world.kingdom")}

        </span>
      </div> */}

      <div
        style={{
          width: "35%",
          height: "34%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          right: "0%",
          bottom: "0%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("/world/retreat");
          onClose();
        }}
      >
        <span
          className="text-xs sm:text-sm"
          style={
            {
              "-webkit-text-stroke": "1px black",
            } as any
          }
        >
          {t("world.retreat")}
        </span>
      </div>
    </OuterPanel>
  );
};
