import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import React, { useState } from "react";
import { PetEgg } from "./PetEgg";
import { Label } from "components/ui/Label";
import { Feed } from "./Feed";
import { Fetch } from "./Fetch";
import { PetMaintenance } from "./PetMaintenance";
import { PetLevelsAndPerks } from "./PetLevelsAndPerks";
import { PetCategories } from "./PetCategories";
import { Shrines } from "./Shrines";
import { Social } from "./Social";

type PetGuideView =
  | "Pet Egg"
  | "Feed"
  | "Fetch"
  | "Pet Maintenance"
  | "Pet Categories"
  | "Levels & Perks"
  | "Shrines"
  | "Social";

export const PetGuide: React.FC = () => {
  const [view, setView] = useState<PetGuideView>();

  const setToDefault = () => setView(undefined);

  if (view === "Pet Egg") {
    return <PetEgg onBack={setToDefault} />;
  }
  if (view === "Feed") {
    return <Feed onBack={setToDefault} />;
  }
  if (view === "Fetch") {
    return <Fetch onBack={setToDefault} />;
  }
  if (view === "Pet Maintenance") {
    return <PetMaintenance onBack={setToDefault} />;
  }
  if (view === "Pet Categories") {
    return <PetCategories onBack={setToDefault} />;
  }
  if (view === "Levels & Perks") {
    return <PetLevelsAndPerks onBack={setToDefault} />;
  }
  if (view === "Shrines") {
    return <Shrines onBack={setToDefault} />;
  }
  if (view === "Social") {
    return <Social onBack={setToDefault} />;
  }

  return (
    <InnerPanel>
      <Label type="default">{`Pet Guide`}</Label>
      <p className="text-xs p-1">{`Learn about pets and how to care for them.`}</p>
      <div id="Buttons" className="grid grid-cols-2 gap-1">
        <Button onClick={() => setView("Pet Egg")}>{`Pet Egg`}</Button>
        <Button onClick={() => setView("Feed")}>{`Feed`}</Button>
        <Button onClick={() => setView("Fetch")}>{`Fetch`}</Button>
        <Button onClick={() => setView("Pet Maintenance")}>
          {`Pet Maintenance`}
        </Button>
        <Button onClick={() => setView("Pet Categories")}>
          {`Pet Categories`}
        </Button>
        <Button onClick={() => setView("Levels & Perks")}>
          {`Levels & Perks`}
        </Button>
        <Button onClick={() => setView("Shrines")}>{`Shrines`}</Button>
        <Button onClick={() => setView("Social")}>{`Social`}</Button>
      </div>
    </InnerPanel>
  );
};
