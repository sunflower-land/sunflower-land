import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
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

const BaitSelection: React.FC = () => {
  return (
    <>
      <div className="p-2">
        <div className="flex items-center">
          <Label type="default" className="mr-2">
            Dusk Tide
          </Label>
          <Label type="danger">Fish Frenzy</Label>
        </div>
      </div>
      <div>
        <span className="text-sm">Bait</span>
        <div className="flex flex-wrap">
          <Box isSelected />
          <Box />
          <Box />
        </div>
      </div>
      <div className="mb-2">
        <span className="text-xs">
          No chum selected. Attract fish by throwing resources into the water.
        </span>
      </div>
      <Button>
        <div className="flex items-center">
          <span className="text-sm mr-1">Cast</span>
          <img src={SUNNYSIDE.tools.fishing_rod} className="h-5" />
        </div>
      </Button>
    </>
  );
};

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

  return <BaitSelection />;
};
