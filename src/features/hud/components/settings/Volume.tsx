import React, { useEffect } from "react";

import { useVolumeControls } from "../../lib/volumeControls";

import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import volume_up from "assets/ui/music_player/volume-up.png";
import volume_down from "assets/ui/music_player/volume-down.png";
import mute from "assets/ui/music_player/mute.png";

export default function Volume() {
  /* const [audioContext] = useAudioContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // object to control master (audio) bg music volume
  // const getM= useStepper({
  //   initial: 0.1,
  //   step: 0.1,
  //   max: 1.0,
  //   min: 0,
  // });
  const [getM setMasterAudioVolume] = useState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allAudioElements.item(0)?.volume as number | 0.6
  );

  const MAX_AUDIO_VOLUME = 1.0;
  const MIN_AUDIO_VOLUME = 0.0;
  const VOLUME_STEP = 0.1;

  const postMasterAudioVolume = () => {
    console.log("#Audio Elements:", allAudioElements.length);
    if (
      getM<= MAX_AUDIO_VOLUME &&
      getM>= MIN_AUDIO_VOLUME
    ) {
      for (const ele of allAudioElements) {
        ele.volume = getM
      }
    }
    console.log("Master Audio Volume:", masterAudioVolume);
  };
  const incMasterAudioVolume = () => {
    console.log("Master Audio Volume before inc:", masterAudioVolume);
    masterAudioVolume < MAX_AUDIO_VOLUME
      ? setMasterAudioVolume((prevState) => {
          const tmp = roundToOneDecimal(prevState + VOLUME_STEP);
          console.log("Rounded Vol:", tmp);
          return tmp;
        })
      : console.log("Warning: Maximum Volume Already Set!");
    console.log("Master Audio Volume after inc:", masterAudioVolume);
    postMasterAudioVolume();
  };
  const decMasterAudioVolume = () => {
    masterAudioVolume > MIN_AUDIO_VOLUME
      ? setMasterAudioVolume((prevState) =>
          roundToOneDecimal(prevState - VOLUME_STEP)
        )
      : console.log("Warning: Minimum Volume Already Set (Muted)!");
    postMasterAudioVolume();
  };
  const muteMasterAudioVolume = () => {
    masterAudioVolume > MIN_AUDIO_VOLUME
      ? setMasterAudioVolume(MIN_AUDIO_VOLUME)
      : console.log("Warning: Volume Already Muted!");
    postMasterAudioVolume();
  };

  // object to control master SFX volume for in-game Actions
  const masterSfxActVolume = useStepper({
    initial: sfxActions[0].volume() as number,
    step: 0.1,
    //temporarily max is set to 0.7 to avoid extra loud SFX
    max: 0.7,
    min: 0,
  });

  const setMasterSfxActVolume = () => {
    console.log("Master SFX in-game Actions Volume:", masterSfxActVolume.value);
    sfxActions.forEach((ele) => {
      ele.volume(masterSfxActVolume.value as number);
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
    initial: sfxModals[0].volume() as number,
    step: 0.1,
    //temporarily max is set to 0.6 to avoid extra loud SFX
    max: 0.6,
    min: 0,
  });

  const setMasterSfxModalVolume = () => {
    console.log(
      "Master SFX in-game Modals Volume:",
      masterSfxModalVolume.value
    );
    sfxModals.forEach((ele) => {
      ele.volume(masterSfxModalVolume.value as number);
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
  }; */

  // new approach
  const [
    postMasterAudioVolume,
    incMasterAudioVolume,
    decMasterAudioVolume,
    muteMasterAudioVolume,
    setMasterSfxActVolume,
    incMasterSfxActVolume,
    decMasterSfxActVolume,
    muteMasterSfxActVolume,
    setMasterSfxModalVolume,
    incMasterSfxModalVolume,
    decMasterSfxModalVolume,
    muteMasterSfxModalVolume,
    getMasterAudioVolume,
    getMasterSfxActVolume,
    getMasterSfxModalVolume,
  ] = useVolumeControls();

  useEffect(() => {
    postMasterAudioVolume();
    setMasterSfxActVolume();
    setMasterSfxModalVolume();
    // console.log("Master Audio Volume:", masterAudioVolume);
    // console.log("Master SFX Actions Volume:", masterSfxActVolume.value);
    // console.log("Master SFX Modals Volume:", masterSfxModalVolume.value);
  }, []);

  return (
    <>
      <div className="text-sm mb-2 text-center">Master Volume Controls</div>
      <InnerPanel className="mb-2">
        <div className="text-sm mb-1">
          <p>Background Music</p>
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
                <img src={volume_down} alt="Increase Volume Button" />
              </Button>
              <Button
                onClick={incMasterAudioVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_up} alt="Decrease Volume Button" />
              </Button>
              <Button
                onClick={muteMasterAudioVolume}
                className="w-auto h-10 sm:flex"
              >
                <img src={mute} alt="Mute Volume Button" />
              </Button>
            </div>
          </div>
          <span className="col-4 object-contain sm:flex d-contents mx-0 items-center">
            <p>
              {(100 * (getMasterAudioVolume as () => number)()).toFixed(0)}
              {"%"}
            </p>
          </span>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-2">
        <p className="text-sm mb-2">SFX</p>
        <div className="text-sm mb-1">
          <p>
            <small>(Actions - Plant, Harvest, Craft, etc.)</small>
          </p>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="flex row justify-center mb-1">
              <Button
                onClick={decMasterSfxActVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_down} alt="Increase Volume Button" />
              </Button>
              <Button
                onClick={incMasterSfxActVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_up} alt="Decrease Volume Button" />
              </Button>
              <Button
                onClick={muteMasterSfxActVolume}
                className="w-auto h-10 sm:flex"
              >
                <img src={mute} alt="Mute Volume Button" />
              </Button>
            </div>
          </div>
          <span className="col-4 object-contain sm:flex d-contents mx-0 items-center">
            <p>
              {(
                100 *
                (
                  getMasterSfxActVolume as () => {
                    decrease: () => void;
                    increase: () => void;
                    value: number;
                  }
                )().value
              ).toFixed(0)}
              {"%"}
            </p>
          </span>
        </div>
        <div className="text-sm mb-2">
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
                <img src={volume_down} alt="Increase Volume Button" />
              </Button>
              <Button
                onClick={incMasterSfxModalVolume}
                className="w-auto h-10 sm:flex mr-1"
              >
                <img src={volume_up} alt="Decrease Volume Button" />
              </Button>
              <Button
                onClick={muteMasterSfxModalVolume}
                className="w-auto h-10 sm:flex"
              >
                <img src={mute} alt="Mute Volume Button" />
              </Button>
            </div>
          </div>
          <span className="col-4 object-contain sm:flex d-contents mx-0 items-center">
            <p>
              {(
                100 *
                (
                  getMasterSfxModalVolume as () => {
                    decrease: () => void;
                    increase: () => void;
                    value: number;
                  }
                )().value
              ).toFixed(0)}
              {"%"}
            </p>
          </span>
        </div>
      </InnerPanel>
    </>
  );
}
