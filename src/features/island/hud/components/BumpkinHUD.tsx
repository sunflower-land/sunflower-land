import React, { useContext, useState } from "react";

import brownDisc from "assets/icons/empty_disc.png";
import staminaIcon from "assets/icons/lightning.png";
import heart from "assets/icons/heart.png";
import progressBar from "assets/ui/progress/transparent_bar.png";
import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { BumpkinParts } from "features/game/types/bumpkin";

export const BumpkinHUD: React.FC = () => {
  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  // TODO
  const level = 2;
  const experience = 30;
  const level2Experience = 50;

  const stamina = 3;
  const staminaCapacity = 12;

  return (
    <>
      <Modal
        show={showBumpkinModal}
        centered
        onHide={() => setShowBumpkinModal(false)}
      >
        <Panel>
          <BumpkinModal onClose={() => setShowBumpkinModal(false)} />
        </Panel>
      </Modal>
      <div className="fixed top-2 left-2 z-50 flex">
        <div
          className="w-16 h-16 relative cursor-pointer hover:img-highlight"
          onClick={() => setShowBumpkinModal(true)}
        >
          <img
            src={brownDisc}
            className="absolute inset-0 w-full h-full z-10 z-20"
          />
          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: "#bfcbda",
              width: "90%",
              height: "90%",
              position: "relative",
              top: "5%",
              left: "5%",
              borderRadius: "40%",
            }}
          >
            {/* <img
              src={head}
              style={{
                width: "200%",
                left: "13%",
                position: "relative",
                top: "10%",
              }}
            /> */}
            <div
              className="z-10"
              style={{
                width: "200%",
                left: "-41%",
                position: "relative",
                top: "-8%",
              }}
            >
              <DynamicNFT
                bumpkinParts={state.bumpkin?.equipped as BumpkinParts}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex ml-2 mb-2 items-center relative">
            <img
              src={heart}
              className="h-9 object-contain mr-1 absolute"
              style={{
                width: "30px",
                left: "-10px",
              }}
            />
            <img src={progressBarSmall} className="w-28" />
            <div
              className="w-full h-full bg-[#193c3e] absolute -z-20"
              style={{
                borderRadius: "10px",
              }}
            />
            <div
              className="h-full bg-[#63c74d] absolute -z-10 "
              style={{
                borderRadius: "10px 0 0 10px",
                width: `${(experience / level2Experience) * 100}%`,
              }}
            />
            <span className="text-xs absolute left-0 text-white">{level}</span>
          </div>

          <div className="flex ml-2 items-center justify-center relative w-28 h-6">
            <img
              src={staminaIcon}
              className="h-9 object-contain mr-1 absolute z-10"
              style={{
                width: "30px",
                left: "-12px",
              }}
            />
            <img src={progressBar} className="absolute w-full" />
            <div
              className="w-full h-full bg-[#322107] absolute -z-20"
              style={{
                borderRadius: "10px",
              }}
            />
            <div
              className="h-full bg-[#f3a632] absolute -z-10 left-0"
              style={{
                borderRadius: "10px 0 0 10px",
                width: `${(stamina / staminaCapacity) * 100}%`,
                borderRight: "3px solid #ec7122",
              }}
            />
            <span className="text-xxs text-white">
              {`${stamina}/${staminaCapacity}`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
