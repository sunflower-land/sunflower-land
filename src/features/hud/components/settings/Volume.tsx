import React, { useEffect } from "react";
import { useAudioContext } from "lib/utils/hooks/useAudioContext";
import { useStepper } from "lib/utils/hooks/useStepper";

import * as sfx from "lib/utils/sfx";

import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import volume_up from "assets/ui/music_player/volume-up.png";
import volume_down from "assets/ui/music_player/volume-down.png";
import pause from "assets/ui/music_player/pause.png";

export default function Volume() {
  const [audioContext] = useAudioContext();
  const gainNode: GainNode = audioContext.createGain();

  const allAudioElements = document.getElementsByTagName("audio");

  const sfxActions = [
    sfx.harvestAudio,
    sfx.plantAudio,
    sfx.miningAudio,
    sfx.miningFallAudio,
    sfx.chopAudio,
    sfx.treeFallAudio,
  ];
  const sfxModals = [
    sfx.homeDoorAudio,
    sfx.bakeryAudio,
    sfx.bankAudio,
    sfx.barnAudio,
    sfx.beggarAudio,
    sfx.blacksmithAudio,
    sfx.frogAudio,
    sfx.marketAudio,
    sfx.tailorAudio,
    sfx.wishingWellAudio,
  ];

  // object to control master audio volume
  const masterAudioVolume = useStepper({
    initial: 0.1, //gainNode.connect(),
    step: 0.1,
    max: 1.0,
    min: 0.0,
  });
  const setMasterAudioVolume = () => {
    for (const ele of allAudioElements) {
      ele.volume = masterAudioVolume.value;
    }
    console.log("Master Audio Volume:", masterAudioVolume.value);
  };
  const incMasterAudioVolume = () => {
    masterAudioVolume.increase();
    setMasterAudioVolume();
  };
  const decMasterAudioVolume = () => {
    masterAudioVolume.decrease();
    setMasterAudioVolume();
  };
  const muteMasterAudioVolume = () => {
    masterAudioVolume.value = 0.0;
    setMasterAudioVolume();
  };

  // object to control master SFX volume for in-game Actions
  const masterSfxActVolume = useStepper({
    initial: sfxActions[0].volume(),
    step: 0.1,
    //max is set to 0.7 to avoid extra loud SFX
    max: 0.7,
    min: 0.0,
  });

  const setMasterSfxActVolume = () => {
    console.log("Master SFX in-game Actions Volume:", masterSfxActVolume.value);
    sfxActions.forEach((ele) => {
      ele.volume(masterSfxActVolume.value);
    });
  };
  const incMasterSfxActVolume = () => {
    masterSfxActVolume.increase();
    setMasterSfxActVolume();
  };
  const decMasterSfxActVolume = () => {
    masterSfxActVolume.decrease();
    setMasterSfxActVolume();
  };
  const muteMasterSfxActVolume = () => {
    masterSfxActVolume.value = 0.0;
    setMasterSfxActVolume();
  };

  // object to control master SFX volume for Modals
  const masterSfxModalVolume = useStepper({
    initial: sfxModals[0].volume(),
    step: 0.1,
    //max is set to 0.6 to avoid extra loud SFX
    max: 0.6,
    min: 0.0,
  });

  const setMasterSfxModalVolume = () => {
    console.log(
      "Master SFX in-game Modals Volume:",
      masterSfxModalVolume.value
    );
    sfxModals.forEach((ele) => {
      ele.volume(masterSfxModalVolume.value);
    });
  };
  const incMasterSfxModalVolume = () => {
    masterSfxModalVolume.increase();
    setMasterSfxModalVolume();
  };
  const decMasterSfxModalVolume = () => {
    masterSfxModalVolume.decrease();
    setMasterSfxModalVolume();
  };
  const muteMasterSfxModalVolume = () => {
    masterSfxModalVolume.value = 0.0;
    setMasterSfxModalVolume();
  };

  useEffect(() => {
    // setMasterAudioVolume();
    // setMasterSfxActVolume();
    // setMasterSfxModalVolume();
    console.log("Master Audio Volume:", masterAudioVolume.value);
    console.log("Master SFX Actions Volume:", masterSfxActVolume.value);
    console.log("Master SFX Modals Volume:", masterSfxModalVolume.value);
  }, []); /*[masterAudioVolume, masterSfxActVolume, masterSfxModalVolume]);*/

  return (
    <>
      <div className="text-sm mb-2 text-center">Master Volume Controls</div>
      <InnerPanel className="mb-2">
        <div className="text-sm mb-1">
          <p>All Audio</p>
          <p>
            <small>(Music Player)</small>
          </p>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="flex row justify-center mb-1">
              <Button
                onClick={decMasterAudioVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_down} alt="Increase Volume Button" />-
              </Button>
              <Button
                onClick={incMasterAudioVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_up} alt="Decrease Volume Button" />+
              </Button>
              <Button
                onClick={muteMasterAudioVolume}
                className="w-auto h-10 sm:flex"
              >
                <img src={pause} alt="Mute Volume Button" />/
              </Button>
            </div>
          </div>
          <span className="col-4 object-contain sm:flex d-contents mx-0 items-center">
            <p>
              {masterAudioVolume.value * 100}
              {"%"}
            </p>
          </span>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-2">
        <div className="text-sm mb-1">
          <p>Actions SFX</p>
          <p>
            <small>(Plant, Harvest, Craft, etc.)</small>
          </p>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="flex row justify-center mb-1">
              <Button
                onClick={decMasterSfxActVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_down} alt="Increase Volume Button" />-
              </Button>
              <Button
                onClick={incMasterSfxActVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_up} alt="Decrease Volume Button" />+
              </Button>
              <Button
                onClick={muteMasterSfxActVolume}
                className="w-auto h-10 sm:flex"
              >
                <img src={pause} alt="Mute Volume Button" />/
              </Button>
            </div>
          </div>
          <span className="col-4 object-contain sm:flex d-contents mx-0 items-center">
            <p>
              {masterSfxActVolume.value * 100}
              {"%"}
            </p>
          </span>
        </div>
        <div className="text-sm mb-1">
          <p>Modals SFX </p>
          <p>
            <small>(Modals - Door, Bank, etc.)</small>
          </p>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="flex row justify-center mb-1">
              <Button
                onClick={decMasterSfxModalVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_down} alt="Increase Volume Button" />-
              </Button>
              <Button
                onClick={incMasterSfxModalVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_up} alt="Decrease Volume Button" />+
              </Button>
              <Button
                onClick={muteMasterSfxModalVolume}
                className="w-auto h-10 sm:flex"
              >
                <img src={pause} alt="Mute Volume Button" />/
              </Button>
            </div>
          </div>
          <span className="col-4 object-contain sm:flex d-contents mx-0 items-center">
            <p>
              {masterSfxModalVolume.value * 100}
              {"%"}
            </p>
          </span>
        </div>
      </InnerPanel>
    </>
  );
}
