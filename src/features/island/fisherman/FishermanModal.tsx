import { SpeakingText } from "features/game/components/SpeakingModal";
import React from "react";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `fisherman-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

export const FishermanModal: React.FC = () => {
  const [showIntro, setShowIntro] = React.useState(!hasRead());

  if (showIntro) {
    return (
      <SpeakingText
        message={[
          {
            text: "Howdy, I'm Reelin Roy!",
          },
          {
            text: "Here you can fish.",
          },
        ]}
        onClose={() => {
          acknowledgeRead();
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <div className="p-2">
      <p className="text-sm mb-2">TODO</p>
    </div>
  );
};
