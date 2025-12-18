import React, { useContext, useState } from "react";

import worldMap from "public/world/holiday_island_assets/event_world_map.png";
//import worldMap from "assets/map/world_map.png";

import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNavigate } from "react-router";
import { OuterPanel } from "components/ui/Panel";
import { useSound } from "lib/utils/hooks/useSound";
import { getBumpkinLevel } from "features/game/lib/level";
import { Label } from "components/ui/Label";
import { isMobile } from "mobile-device-detect";
import { hasFeatureAccess } from "lib/flags";

const showDebugBorders = false;

export const WorldMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const travel = useSound("travel");

  const [showPopup, setShowPopup] = useState(false);

  const [reqLvl, setReqLvl] = useState(1);

  const level = getBumpkinLevel(
    gameService.getSnapshot().context.state.bumpkin?.experience ?? 0,
  );
  const hasFaction = gameService.getSnapshot().context.state.faction;
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
          icon={SUNNYSIDE.icons.lock}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <span className="text-xxs sm:text-sm">
            {t("world.intro.levelUpToTravel")}
          </span>
        </Label>
      )}

      <img
        src={SUNNYSIDE.icons.close}
        className="w-8 absolute top-2 right-2 cursor-pointer"
        onClick={onClose}
      />

      {/* Infernos */}
      <div
        style={{
          width: "18%",
          height: "24%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "3%",
          bottom: "62%",
        }}
        className={`flex justify-center items-center cursor-pointer ${
          level >= 30 ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => {
          if (level < 30) return;
          travel.play();
          navigate("/world/infernos");
          onClose();
        }}
      >
        {level < 30 ? (
          isMobile ? (
            <img
              src={SUNNYSIDE.icons.lock}
              className="h-4 sm:h-6 ml-1 img-highlight"
              onClick={() => {
                setShowPopup(true);
                setReqLvl(30);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1300);
              }}
            />
          ) : (
            <Label
              type="default"
              icon={SUNNYSIDE.icons.lock}
              className="text-sm"
            >
              {t("world.lvl.requirement", { lvl: 30 })}
            </Label>
          )
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.infernos")}
          </span>
        )}
      </div>
      <div
        style={{
          width: "18%",
          height: "24%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "78.5%",
          bottom: "52%",
        }}
        className="flex justify-center items-center"
      >
        <img
          src={SUNNYSIDE.icons.lock}
          className="h-4 sm:h-6 ml-1 img-highlight"
        />
      </div>

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
        className={`flex justify-center items-center ${
          level >= 2 ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => {
          if (level < 2) return;
          travel.play();
          navigate("/world/plaza");
          onClose();
        }}
      >
        {level < 2 ? (
          isMobile ? (
            <img
              src={SUNNYSIDE.icons.lock}
              className="h-4 sm:h-6 ml-1 img-highlight"
              onClick={() => {
                setShowPopup(true);
                setReqLvl(2);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1300);
              }}
            />
          ) : (
            <Label
              type="default"
              icon={SUNNYSIDE.icons.lock}
              className="text-sm"
            >
              {t("world.lvl.requirement", { lvl: 2 })}
            </Label>
          )
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
        className={`flex justify-center items-center ${
          level >= 7 ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => {
          if (level < 7) return;
          travel.play();
          navigate("/world/kingdom");
          onClose();
        }}
      >
        {level < 7 ? (
          isMobile ? (
            <img
              src={SUNNYSIDE.icons.lock}
              className="h-4 sm:h-6 ml-1 img-highlight"
              onClick={() => {
                setShowPopup(true);
                setReqLvl(7);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1300);
              }}
            />
          ) : (
            <Label
              type="default"
              icon={SUNNYSIDE.icons.lock}
              className="text-sm"
            >
              {t("world.lvl.requirement", { lvl: 7 })}
            </Label>
          )
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
        className={`flex justify-center items-center ${
          canTeleportToFactionHouse ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => {
          if (!canTeleportToFactionHouse) return;
          travel.play();
          navigate(getFactionHouseRoute());
          onClose();
        }}
      >
        {!canTeleportToFactionHouse ? (
          !isMobile && level < 7 ? (
            <Label
              type="default"
              icon={SUNNYSIDE.icons.lock}
              className="text-sm"
            >
              {t("world.lvl.requirement", { lvl: 7 })}
            </Label>
          ) : (
            <img
              src={SUNNYSIDE.icons.lock}
              className="h-4 sm:h-6 ml-1 img-highlight"
              onClick={() => {
                setShowPopup(true);
                setReqLvl(7);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1300);
              }}
            />
          )
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.faction")}
          </span>
        )}
      </div>

      <div
        style={{
          width: "12%",
          height: "38%",
          border: showDebugBorders ? "2px solid red" : "",
          position: "absolute",
          left: "22%",
          bottom: "24%",
        }}
        className={`flex justify-center items-center ${
          level >= 4 ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => {
          if (level < 4) return;
          travel.play();
          navigate("/world/beach");
          onClose();
        }}
      >
        {level < 4 ? (
          isMobile ? (
            <img
              src={SUNNYSIDE.icons.lock}
              className="h-4 sm:h-6 ml-1 img-highlight"
              onClick={() => {
                setShowPopup(true);
                setReqLvl(4);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1300);
              }}
            />
          ) : (
            <Label
              type="default"
              icon={SUNNYSIDE.icons.lock}
              className="text-sm"
            >
              {t("world.lvl.requirement", { lvl: 4 })}
            </Label>
          )
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.beach")}
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
        className={`flex justify-center items-center ${
          level >= 5 ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => {
          if (level < 5) return;
          travel.play();
          navigate("/world/retreat");
          onClose();
        }}
      >
        {level < 5 ? (
          isMobile ? (
            <img
              src={SUNNYSIDE.icons.lock}
              className="h-4 sm:h-6 ml-1 img-highlight"
              onClick={() => {
                setShowPopup(true);
                setReqLvl(5);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1300);
              }}
            />
          ) : (
            <Label
              type="default"
              icon={SUNNYSIDE.icons.lock}
              className="text-sm"
            >
              {t("world.lvl.requirement", { lvl: 5 })}
            </Label>
          )
        ) : (
          <span className="map-text text-xxs sm:text-sm">
            {t("world.retreat")}
          </span>
        )}
      </div>

      {hasFeatureAccess(
        gameService.getSnapshot().context.state,
        "HOLIDAYS_EVENT_FLAG",
      ) && (
        <div
          style={{
            width: "35%",
            height: "14%",
            border: showDebugBorders ? "2px solid red" : "",
            position: "absolute",
            right: "35%",
            bottom: "0%",
          }}
          className={`flex justify-center items-center ${
            level >= 2 ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          onClick={() => {
            if (level < 2) return;
            travel.play();
            navigate("/world/holidays_island");
            onClose();
          }}
        >
          {level < 2 ? (
            isMobile ? (
              <img
                src={SUNNYSIDE.icons.lock}
                className="h-4 sm:h-6 ml-1 img-highlight"
                onClick={() => {
                  setShowPopup(true);
                  setReqLvl(2);
                  setTimeout(() => {
                    setShowPopup(false);
                  }, 1300);
                }}
              />
            ) : (
              <Label
                type="default"
                icon={SUNNYSIDE.icons.lock}
                className="text-sm"
              >
                {t("world.lvl.requirement", { lvl: 2 })}
              </Label>
            )
          ) : (
            <span className="map-text text-xxs sm:text-sm">
              {"Holidays Event"}
            </span>
          )}
        </div>
      )}

      {showPopup && (
        <Label
          type="default"
          icon={SUNNYSIDE.icons.lock}
          style={{
            position: "absolute",
            left: "50%",
            top: "3%",
            transform: "translateX(-50%)",
            width: "max-content",
          }}
          className="transition duration-400 pointer-events-none"
        >
          <span className="text-xxs sm:text-sm">
            {reqLvl === 7 && level >= 7 && !hasFaction
              ? t("world.factionMembersOnly")
              : t("warning.level.required", { lvl: reqLvl })}
          </span>
        </Label>
      )}
    </OuterPanel>
  );
};
