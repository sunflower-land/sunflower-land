import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { ButtonPanel, OuterPanel } from "components/ui/Panel";
import { ACHIEVEMENTS } from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { GUIDE_PATHS, GuidePath } from "../lib/guide";
import { GuideTask } from "./Task";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  selected?: GuidePath;
  onSelect: (guide?: GuidePath) => void;
}
export const Guide: React.FC<Props> = ({ selected, onSelect }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const state = gameState.context.state;

  const Content = () => {
    if (selected) {
      return (
        <div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="h-6 mr-2 cursor-pointer"
                onClick={() => onSelect(undefined)}
              />
              <span className="text-xs capitalize">{selected}</span>
            </div>
            {GUIDE_PATHS[selected].docs && (
              <a
                href={GUIDE_PATHS[selected].docs}
                className="text-xs underline pr-2"
              >
                {t("docs")}
              </a>
            )}
          </div>
          {GUIDE_PATHS[selected].description.map(({ text, image }, index) => (
            <div className="p-2" key={index}>
              {image && <img src={image} className="w-full rounded-md mb-1" />}
              <p className="text-xs whitespace-pre-line">{text}</p>
            </div>
          ))}

          {GUIDE_PATHS[selected].achievements.map((name) => (
            <OuterPanel className="mt-2 !p-1" key={name}>
              <GuideTask state={state} task={name} />
            </OuterPanel>
          ))}
        </div>
      );
    }

    return (
      <>
        <div className="p-1 mb-2">
          <div className="flex">
            <p className="text-xs flex-1 pr-2">{t("guide.intro")}</p>
            <a
              href="https://youtu.be/L9yCxAUCYhI"
              target="_blank"
              className="cursor-pointer relative w-16 flex justify-center items-center"
              rel="noreferrer"
            >
              <img
                src={SUNNYSIDE.tutorial.videoThumbnail}
                className="absolute w-full img-highlight-heavy rounded-md"
              />
              <img src={SUNNYSIDE.icons.playIcon} className="h-5 z-20" />
            </a>
          </div>
        </div>
        {getKeys(GUIDE_PATHS).map((path) => {
          const achievements = GUIDE_PATHS[path].achievements;

          const activeAchievement = achievements.find((name) => {
            const achievement = ACHIEVEMENTS()[name];
            const progress = achievement.progress(state);
            const isComplete = progress >= achievement.requirement;

            return !isComplete;
          });

          return (
            <ButtonPanel
              className="flex mb-1 !p-1 w-full cursor-pointer  hover:bg-brown-200"
              key={path}
              onClick={() => onSelect(path)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex">
                    <p className="text-xs  mr-1 capitalize ">{path}</p>
                    <img src={GUIDE_PATHS[path].icon} className="h-5 mr-1" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {achievements.map((name) => {
                      const achievement = ACHIEVEMENTS()[name];
                      const progress = achievement.progress(state);
                      const isComplete = progress >= achievement.requirement;
                      if (isComplete) {
                        return (
                          <img
                            src={SUNNYSIDE.icons.confirm}
                            className="h-3 mr-1"
                            key={name}
                          />
                        );
                      }

                      return (
                        <img
                          src={SUNNYSIDE.ui.dot}
                          className="h-3 mr-1"
                          key={name}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs  mr-1  ">{t("read.more")}</p>
                    <img src={SUNNYSIDE.icons.chevron_right} className="h-4" />
                  </div>
                </div>

                {/* 
              {activeAchievement && (
                <Progress
                  achievement={ACHIEVEMENTS()[activeAchievement]}
                  state={state}
                  onClaim={console.log}
                />
              )}
              {!activeAchievement && (
                <div className="flex-1">
                  <p className="text-xs my-1">
                    {`You have mastered the ${path} profession!`}
                  </p>
                </div>
              )} */}
              </div>
            </ButtonPanel>
          );
        })}
      </>
    );
  };
  return (
    <div className="h-full pt-1.5 pr-0.5">
      <Content />
    </div>
  );
};
