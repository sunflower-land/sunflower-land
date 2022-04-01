import React from "react";
import { useAudioContext } from "lib/utils/hooks/useAudioContext";
import { useStepper } from "lib/utils/hooks/useStepper";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import volume_up from "assets/ui/music_player/volume-up.png";
import volume_down from "assets/ui/music_player/volume-down.png";
import pause from "assets/ui/music_player/pause.png";

export default function Volume() {
  const [audioContext] = useAudioContext();
  const masterVolume = useStepper({ initial: 0.1, step: 0.1, max: 1, min: 0 });

  // console.log("Audio Context initiated by useAudioContext hook :)");

  const gainNode: GainNode = audioContext.createGain();
  const allSFX = document.getElementsByTagName("audio");
  const setMasterVolume = () => {
    for (const ele of allSFX) {
      ele.volume = masterVolume.value;
    }
  };
  const IncMasterVolume = () => {
    masterVolume.increase();
    setMasterVolume();
  };
  const DecMasterVolume = () => {
    masterVolume.decrease();
    setMasterVolume();
  };
  const MuteMasterVolume = () => {
    masterVolume.value = 0.0;
    setMasterVolume();
  };

  return (
    <>
      <div className="text-sm mb-2 text-center">Master Volume Controls</div>
      <InnerPanel className="mb-2">
        <div className="text-sm mb-1">All Audio</div>
        <div className="flex row justify-center mb-1">
          <Button onClick={DecMasterVolume} className="w-1/4 h-10 sm:flex mr-1">
            <img src={volume_down} alt="Increase Volume Button" />-
          </Button>
          <Button onClick={IncMasterVolume} className="w-1/4 h-10 sm:flex mr-1">
            <img src={volume_up} alt="Decrease Volume Button" />+
          </Button>
          <Button onClick={MuteMasterVolume} className="w-1/4 h-10 sm:flex">
            <img src={pause} alt="Mute Volume Button" />/
          </Button>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-2">
        <div className="text-sm mb-1">All SFX (Plant, Harvest)</div>
        <div className="flex row justify-center mb-1">
          <Button onClick={DecMasterVolume} className="w-1/4 h-10 sm:flex mr-1">
            <img src={volume_down} alt="Increase Volume Button" />-
          </Button>
          <Button onClick={IncMasterVolume} className="w-1/4 h-10 sm:flex mr-1">
            <img src={volume_up} alt="Decrease Volume Button" />+
          </Button>
          <Button onClick={MuteMasterVolume} className="w-1/4 h-10 sm:flex">
            <img src={pause} alt="Mute Volume Button" />/
          </Button>
        </div>
      </InnerPanel>
    </>
  );
}
