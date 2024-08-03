import React, { useContext, useEffect } from "react";

import worldMap from "assets/map/world_map.png";
import lockIcon from "assets/icons/lock.png";

import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNavigate } from "react-router-dom";
import { OuterPanel } from "components/ui/Panel";
import { useSound } from "lib/utils/hooks/useSound";
import { getBumpkinLevel } from "features/game/lib/level";
import { Label } from "components/ui/Label";

const showDebugBorders = false;

export const WorldMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const travel = useSound("travel");

  useEffect(() => {
    gameService.send("SAVE");
  }, []);

  const level = getBumpkinLevel(
    gameService.state.context.state.bumpkin?.experience ?? 0,
  );
  const hasFaction = gameService.state.context.state.faction;
  const canTeleportToFactionHouse = level >= 7 && hasFaction;

  const getFactionHouseRoute = () => {
    switch (hasFaction?.name) {
      case "bumpkins":
        return "/world/bumpkin_house";
      case "goblins":
        return "/world/goblin_house";
      case "nightshades":
        return "/world/nightshade_house";
      case "sunflorians":
        return "/world/sunflorian_house";
      default:
        return "";
    }
  };

  return (
    <OuterPanel className="w-full relative shadow-xl">
      <img src={worldMap} className="w-full" />

      {level < 2 && (
        <Label
          type="danger"
          className="absolute bottom-2"
          icon={lockIcon}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {t("world.intro.levelUpToTravel")}
        </Label>
      )}

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
          travel.play();
          navigate("/");
          onClose();
        }}
      >
        <span className="map-text text-xxs sm:text-sm">{t("world.home")}</span>
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
          if (level < 2) return;
          travel.play();
          navigate("/world/plaza");
          onClose();
        }}
      >
        {level < 2 ? (
          <img src={lockIcon} className="h-6 ml-1 img-highlight-heavy" />
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.plaza")}
          </span>
        )}
      </div>

      <div
        style={{
          width: "18%",
          height: "15%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "35%",
          bottom: "61%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          if (level < 7) return;
          travel.play();
          navigate("/world/kingdom");
          onClose();
        }}
      >
        {level < 7 ? (
          <img src={lockIcon} className="h-6 ml-1 img-highlight-heavy" />
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.kingdom")}
          </span>
        )}
      </div>

      <div
        style={{
          width: "18%",
          height: "15%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "35%",
          bottom: "46%",
        }}
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          if (!canTeleportToFactionHouse) return;
          travel.play();
          navigate(getFactionHouseRoute());
          onClose();
        }}
      >
        {!canTeleportToFactionHouse ? (
          <img src={lockIcon} className="h-6 ml-1 img-highlight-heavy" />
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.faction")}
          </span>
        )}
      </div>

      <div
        style={{
          width: "12%",
          height: "18%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "24%",
          bottom: "42%",
        }}
      >
        <Label className="shadow-md" type="vibrant">
          {t("world.newArea")}
        </Label>
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
          if (level < 4) return;
          travel.play();
          navigate("/world/beach");
          onClose();
        }}
      >
        {level < 4 ? (
          <img src={lockIcon} className="h-6 ml-1 img-highlight-heavy" />
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.beach")}
          </span>
        )}
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
          if (level < 6) return;
          travel.play();
          navigate("/world/woodlands");
          onClose();
        }}
      >
        {level < 6 ? (
          <img src={lockIcon} className="h-6 ml-1 img-highlight-heavy" />
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.woodlands")}
          </span>
        )}
      </div>

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
          if (level < 5) return;
          travel.play();
          navigate("/world/retreat");
          onClose();
        }}
      >
        {level < 5 ? (
          <img src={lockIcon} className="h-6 ml-1 img-highlight-heavy" />
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.retreat")}
          </span>
        )}
      </div>
    </OuterPanel>
  );
};
