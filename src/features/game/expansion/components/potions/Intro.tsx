import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { FeedbackIcons } from "./lib/types";
import { Button } from "components/ui/Button";
import potionMasterIdleSheet from "assets/npcs/potion_master_sheet_idle.png";
import { SpringValue } from "react-spring";
import Spritesheet from "components/animation/SpriteAnimator";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface IntroProps {
  onClose: () => void;
}

export const IntroPage: React.FC<IntroProps> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <div className="p-2 pt-0 flex flex-col h-full">
        <div className="text-xs space-y-2 mb-3 -mt-2">
          <div className="relative mt-2 float-left w-1/3">
            {loaded && (
              <Spritesheet
                className="w-full h-full"
                style={{
                  imageRendering: "pixelated",
                }}
                image={potionMasterIdleSheet}
                widthFrame={100}
                heightFrame={100}
                zoomScale={new SpringValue(1)}
                startAt={0}
                steps={8}
                fps={Math.round(1000 / 240)}
                direction={`forward`}
                autoplay={true}
                loop={true}
              />
            )}
          </div>
          <p>{t("introPage.welcome")}</p>
          <p>{t("introPage.description")}</p>
          <p>{t("introPage.mission")}</p>
          <p>{t("introPage.tip")}</p>
        </div>
        <InnerPanel className="text-xxs space-y-1 p-1 mt-1">
          <p className="mb-2">{t("pay.attention.feedback")}</p>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["correct"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("statements.potionRule.five")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["almost"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("statements.potionRule.six")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["incorrect"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("statements.potionRule.seven")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["bomb"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("introPage.chaosPotion")}</span>
          </div>
        </InnerPanel>
      </div>
      <Button onClick={onClose}>{t("introPage.playButton")}</Button>
    </>
  );
};
