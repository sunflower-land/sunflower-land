import { useState } from "react";
import { useStepper } from "lib/utils/hooks/useStepper";
import { roundToOneDecimal } from "features/auth/components";

import * as sfx from "lib/utils/sfx";
import { getSettings } from "./settings";

export const useVolumeControls = () => {
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
  const masterAudioVolume = useStepper({
    initial: getSettings().bgMusicMuted ? 0 : 0.6,
    step: 0.1,
    max: 1.0,
    min: 0,
  });
  const MAX_AUDIO_VOLUME = 1.0;
  const MIN_AUDIO_VOLUME = 0.0;
  const VOLUME_STEP = 0.1;
  const DEFAULT_AUDIO_VOLUME = 0.6;
  /* const [masterAudioVolume, setMasterAudioVolume] = useState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allAudioElements.item(0)?.volume as number | 0.6
  ); */

  const getMasterAudioVolume = (): number => masterAudioVolume.value;

  const postMasterAudioVolume = (): void => {
    if (
      masterAudioVolume.value <= MAX_AUDIO_VOLUME &&
      masterAudioVolume.value >= MIN_AUDIO_VOLUME
    ) {
      for (const ele of allAudioElements) {
        ele.volume = masterAudioVolume.value;
      }
    }
    console.log("Master Audio Volume:", masterAudioVolume);
  };
  const incMasterAudioVolume = (): void => {
    /* ? setMasterAudioVolume((prevState) => {
        const tmp = roundToOneDecimal(prevState + VOLUME_STEP);
        return tmp;
      }) */
    masterAudioVolume.value < MAX_AUDIO_VOLUME
      ? masterAudioVolume.increase()
      : console.log("Warning: Maximum Volume (1) Already Set!");
    postMasterAudioVolume();
  };
  const decMasterAudioVolume = (): void => {
    /* ? setMasterAudioVolume((prevState) =>
        roundToOneDecimal(prevState - VOLUME_STEP)
      ) */
    masterAudioVolume.value > MIN_AUDIO_VOLUME
      ? masterAudioVolume.decrease()
      : console.log("Warning: Minimum Volume (0) Already Set!");
    postMasterAudioVolume();
  };
  const muteMasterAudioVolume = (): void => {
    // ? setMasterAudioVolume(MIN_AUDIO_VOLUME)
    masterAudioVolume.value > MIN_AUDIO_VOLUME
      ? (masterAudioVolume.value = MIN_AUDIO_VOLUME)
      : console.log("Warning: Volume Already Muted!");
    postMasterAudioVolume();
  };
  const toggleAllBgMusic = (_isMuted: boolean): void => {
    console.log("-->in toggleAllBgMusic _isMuted:", _isMuted);
    /* if (masterAudioVolume === undefined || isNaN(masterAudioVolume.value)) {
      setMasterAudioVolume(DEFAULT_AUDIO_VOLUME);
      console.log("default value set!!", masterAudioVolume);
    } */
    console.log("-->in toggleAllBgMusic masterAudioVolume:", masterAudioVolume);
    if (!_isMuted) {
      for (const ele of allAudioElements) {
        ele.volume = masterAudioVolume.value;
      }
      // should postMasterAudioVolume be called => ig no
    } else {
      for (const ele of allAudioElements) {
        ele.muted = true;
      }
      // should postMasterAudioVolume be called => ig no
    }
  };

  // object to control master SFX volume for in-game Actions
  const masterSfxActVolume = useStepper({
    initial: sfxActions[0].volume() as number,
    step: 0.1,
    //temporarily max is set to 0.7 to avoid extra loud SFX
    max: 0.7,
    min: 0,
  });

  const getMasterSfxActVolume = (): {
    decrease: () => void;
    increase: () => void;
    value: number;
  } => masterSfxActVolume;

  const setMasterSfxActVolume = (): void => {
    sfxActions.forEach((ele) => {
      ele.volume(masterSfxActVolume.value as number);
    });
  };
  const incMasterSfxActVolume = (): void => {
    masterSfxActVolume.increase();
    setMasterSfxActVolume();
  };
  const decMasterSfxActVolume = (): void => {
    masterSfxActVolume.decrease();
    setMasterSfxActVolume();
  };
  const muteMasterSfxActVolume = (): void => {
    masterSfxActVolume.value = 0;
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

  const getMasterSfxModalVolume = (): {
    decrease: () => void;
    increase: () => void;
    value: number;
  } => masterSfxModalVolume;

  const toggleAllSFX = (_isMuted: boolean): void => {
    console.log("--> in toggleAllSFX _isMuted:", _isMuted);
    if (!_isMuted) {
      sfxActions.forEach((ele) => {
        ele.volume(0.6); // 0.6 is the default
      });
      sfxModals.forEach((ele) => {
        ele.volume(0.6); // 0.6 is the default
      });
      // should setMasterSfxModalVolume be called
    } else {
      sfxActions.forEach((ele) => {
        ele.mute(); //not working oO
        ele.volume(0);
      });
      sfxModals.forEach((ele) => {
        ele.mute(); // not working oO
        ele.volume(0);
      });
      // should setMasterSfxModalVolume be called
    }
  };

  const setMasterSfxModalVolume = (): void => {
    sfxModals.forEach((ele) => {
      ele.volume(masterSfxModalVolume.value as number);
    });
  };
  const incMasterSfxModalVolume = (): void => {
    masterSfxModalVolume.increase();
    setMasterSfxModalVolume();
  };
  const decMasterSfxModalVolume = (): void => {
    masterSfxModalVolume.decrease();
    setMasterSfxModalVolume();
  };
  const muteMasterSfxModalVolume = (): void => {
    masterSfxModalVolume.value = 0.0;
    setMasterSfxModalVolume();
  };

  /**
   * Init the master volume from cached settings.
   * TODO: refactor
   */
  const initMasterVolume = (): void => {
    const cached = getSettings();
    /* setMasterAudioVolume(cached.bgMusicMuted ? 0.0 : masterAudioVolume);
    masterSfxActVolume.value = cached.sfxMuted ? 0.0 : masterSfxActVolume.value;
    masterSfxModalVolume.value = cached.sfxMuted
      ? 0.0
      : masterSfxModalVolume.value; */
    console.log("initMasterVolume was called..");
    toggleAllBgMusic(cached.bgMusicMuted);
    toggleAllSFX(cached.sfxMuted);
  };

  return [
    initMasterVolume,
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
    toggleAllBgMusic,
    toggleAllSFX,
    getMasterSfxActVolume,
    getMasterSfxModalVolume,
  ];
};
