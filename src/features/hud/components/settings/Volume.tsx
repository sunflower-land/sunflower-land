import React from "react";
import { useAudioContext } from "lib/utils/hooks/useAudioContext";

export default function Volume() {
  const audioContext = useAudioContext();

  console.log("Audio Context initiated by useAudioContext hook :)");

  return <div>Master Volume (SFX) Controls</div>;
}
