import React from "react";
import { AudioMenuContent } from "features/game/components/AudioMenu";
import { useAudioControls } from "features/game/components/AudioControlsContext";

export const AudioSettings: React.FC = () => {
  const { song, handlePreviousSong, handleNextSong } = useAudioControls();
  return (
    <AudioMenuContent
      song={song}
      handlePreviousSong={handlePreviousSong}
      handleNextSong={handleNextSong}
    />
  );
};
