import React, { useEffect, useState } from "react";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import {
  Achievement,
  getAchievement,
  getAllAchievements,
  getNameFromId,
} from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Achievement = ({ achievement }: Achievement) => {
  const name = getNameFromId(achievement.id);

  // create new cssProperty
  const cssProperty = {
    borderBottom: `1px solid #fff`,
    paddingBottom: `5px`,
  };

  return (
    <div className="flex flex-row h-full p-0.5 w-full mb-1" style={cssProperty}>
      <div className="w-1/6 flex justify-center items-center bg-brown-400 rounded">
        <img
          className="w-30 h-30 rounded-sm"
          width="40"
          src={ITEM_DETAILS[achievement.resource]?.image}
          alt={name}
        />
      </div>
      <div className="w-4/6 h-full ml-3 inline-flex flex-col space-y-4 justify-start">
        <h3 className="mt-1 text-sm font-bold text-white">{name}</h3>
        <p className="text-xs text-white">{achievement.description}</p>
      </div>
      <div className="flex flex-col justify-around items-center w-1/6">
        {achievement.unlocked ? (
          <div
            className="flex flex-col justify-center items-center mr-2 hover_bg-blue-200"
            onClick={() => console.log("reward-claimed")}
          >
            <img
              className="w-10 h-10 rounded-sm"
              src={ITEM_DETAILS[achievement.rewardItem]?.image}
              alt={achievement.rewardItem}
            />
            <p className="text-xs text-white">Unlocked</p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-bold text-white">
              {achievement.progress}/{achievement.quantity}
            </p>
            <div className="inline-flex justify-center items-center">
              <img
                className="w-5 h-5 rounded-full"
                width="10"
                height="10"
                src={ITEM_DETAILS[achievement.rewardItem]?.image}
                alt={achievement.rewardItem}
              />
              <p className="text-xs font-bold text-white ml-1">x1</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Achievements: React.FC<Props> = ({ isOpen, onClose }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(
      Object.keys(getAllAchievements()).map((key) => getAchievement(key))
    );
  }, []);

  const Content = () => {
    return (
      <div className="mt-2 flex flex-col">
        {achievements.map((achievement, idx) => {
          return <Achievement key={idx} achievement={achievement} name={idx} />;
        })}
      </div>
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel className="p-0">
        <Modal.Header>
          <h2 className="ml-2">Achievements</h2>
        </Modal.Header>
        {Content()}
      </Panel>
    </Modal>
  );
};
