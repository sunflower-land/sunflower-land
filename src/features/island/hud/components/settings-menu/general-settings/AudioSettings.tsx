import React from "react";
import { AudioMenuContent } from "features/game/components/AudioMenu";
import { useAudioControls } from "features/game/components/AudioControlsContext";

export const AudioSettings: React.FC = () => {
  // Null on the login screen - the panel then renders without the
  // now-playing display and transport controls
  const controls = useAudioControls();

  return (
    <AudioMenuContent
      song={controls?.song}
      handlePreviousSong={controls?.handlePreviousSong}
      handleNextSong={controls?.handleNextSong}
      handlePlaySong={controls?.handlePlaySong}
    />
  );
};
