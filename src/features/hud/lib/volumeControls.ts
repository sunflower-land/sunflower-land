import { useState } from "react";
import { useAudioContext } from "lib/utils/hooks/useAudioContext";
import { useStepper } from "lib/utils/hooks/useStepper";
import { roundToOneDecimal } from "features/auth/components";

import * as sfx from "lib/utils/sfx";

export const useVolumeControls = () => {
  const [audioContext] = useAudioContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gainNode: GainNode = audioContext.createGain();
  // {Todo: Use gainNode to manage audio controls, uses web audio api}

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
  /*const masterAudioVolume = useStepper({
    initial: 0.1,
    step: 0.1,
    max: 1.0,
    min: 0,
  });*/
  const [masterAudioVolume, setMasterAudioVolume] = useState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allAudioElements.item(0)?.volume as number | 0.6
  );

  const getMasterAudioVolume = () => masterAudioVolume;

  const MAX_AUDIO_VOLUME = 1.0;
  const MIN_AUDIO_VOLUME = 0.0;
  const VOLUME_STEP = 0.1;

  const postMasterAudioVolume = () => {
    console.log("#Audio Elements:", allAudioElements.length);
    if (
      masterAudioVolume <= MAX_AUDIO_VOLUME &&
      masterAudioVolume >= MIN_AUDIO_VOLUME
    ) {
      for (const ele of allAudioElements) {
        ele.volume = masterAudioVolume;
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

  const getMasterSfxActVolume = () => masterSfxActVolume;

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

  const getMasterSfxModalVolume = () => masterSfxModalVolume;

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
  };

  return [
    postMasterAudioVolume as () => void,
    incMasterAudioVolume as () => void,
    decMasterAudioVolume as () => void,
    muteMasterAudioVolume as () => void,
    setMasterSfxActVolume as () => void,
    incMasterSfxActVolume as () => void,
    decMasterSfxActVolume as () => void,
    muteMasterSfxActVolume as () => void,
    setMasterSfxModalVolume as () => void,
    incMasterSfxModalVolume as () => void,
    decMasterSfxModalVolume as () => void,
    muteMasterSfxModalVolume as () => void,
    getMasterAudioVolume as () => number,
    getMasterSfxActVolume as () => {
      decrease: () => void;
      increase: () => void;
      value: number;
    },
    getMasterSfxModalVolume as () => {
      decrease: () => void;
      increase: () => void;
      value: number;
    },
  ];
};
