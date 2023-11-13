import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { NPC } from "features/island/bumpkin/components/NPC";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { Guide } from "./components/Guide";
import { Task } from "./components/Task";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { GuidePath, WALKTHROUGH } from "./lib/guide";
import {
  ACHIEVEMENTS,
  AchievementName,
} from "features/game/types/achievements";
import { GameState } from "features/game/types/game";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `last-task.${host}-${window.location.pathname}`;

function acknowledgeTask(task: AchievementName) {
  localStorage.setItem(LOCAL_STORAGE_KEY, task);
}

function lastAcknowledgedTask() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function getActiveTask(gameState: GameState): {
  activeTask: AchievementName;
  activeTaskIndex: number;
} {
  const lastTask = lastAcknowledgedTask();
  const lastTaskIndex = WALKTHROUGH.findIndex((name) => name === lastTask);

  const activeTaskIndex = WALKTHROUGH.findIndex((name, index) => {
    // Already completed these tasks
    if (index < lastTaskIndex) {
      return false;
    }

    const achievement = ACHIEVEMENTS()[name];
    const progress = achievement.progress(gameState);
    const isComplete = progress >= achievement.requirement;

    return !isComplete;
  });

  return { activeTask: WALKTHROUGH[activeTaskIndex], activeTaskIndex };
}

export const Otis: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [guide, setGuide] = useState<GuidePath>();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { activeTaskIndex } = getActiveTask(gameState.context.state);

  const [activeTask, setActiveTask] = useState<AchievementName>();

  useEffect(() => {
    if (activeTaskIndex >= 0) {
      const activeTaskName = WALKTHROUGH[activeTaskIndex];
      setActiveTask(activeTaskName);
    }
  }, [isOpen, activeTaskIndex]);

  const task = activeTask ? ACHIEVEMENTS()[activeTask] : undefined;

  const [showIntro, setShowIntro] = useState(!!task?.introduction);

  const handleClick = () => {
    setShowIntro(!!task?.introduction);
    setGuide(undefined);
    setIsOpen(true);

    if (activeTask) {
      acknowledgeTask(activeTask);
    }
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        className="absolute z-10"
        style={{
          right: `${PIXEL_SCALE * 4}px`,
          bottom: `${PIXEL_SCALE * 32}px`,
        }}
      >
        <div
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            transform: "scaleX(-1)",
          }}
        >
          <NPC parts={NPC_WEARABLES.otis} onClick={handleClick} />
        </div>
        {lastAcknowledgedTask() !== activeTask && (
          <img
            src={SUNNYSIDE.icons.expression_confused}
            className="absolute animate-float pointer-events-none img-highlight-heavy"
            style={{
              width: `${PIXEL_SCALE * 6}px`,
              top: `${PIXEL_SCALE * -4}px`,
              right: `${PIXEL_SCALE * 5}px`,
            }}
          />
        )}
      </div>
      <Modal centered show={isOpen} onHide={close}>
        {showIntro && task?.introduction && (
          <Panel bumpkinParts={NPC_WEARABLES["otis"]}>
            <SpeakingText
              onClose={() => {
                // eslint-disable-next-line no-console
                console.log("CLOSE");
                setShowIntro(false);
              }}
              message={task?.introduction.map((text) => ({ text }))}
            />
          </Panel>
        )}
        {!showIntro && (
          <CloseButtonPanel
            currentTab={tab}
            setCurrentTab={(tab) => {
              setGuide(undefined);
              setTab(tab);
            }}
            tabs={[
              {
                icon: SUNNYSIDE.icons.hammer,
                name: "Task",
              },
              {
                icon: SUNNYSIDE.icons.expression_confused,
                name: "Guide",
              },
            ]}
            bumpkinParts={NPC_WEARABLES.otis}
            onClose={close}
          >
            {tab === 0 && (
              <Task
                onOpenGuide={(g) => {
                  setGuide(g);
                  setTab(1);
                }}
                task={activeTask}
              />
            )}
            {tab === 1 && (
              <div
                style={{ maxHeight: "300px" }}
                className="scrollable overflow-y-auto"
              >
                <Guide selected={guide} onSelect={setGuide} />
              </div>
            )}
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
