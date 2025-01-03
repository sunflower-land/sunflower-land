import React from "react";
import { AppearanceSettings } from "./AppearanceSettings";
import { BehaviourSettings } from "./BehaviourSettings";

const AppearanceAndBehaviour: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 m-3">
      <AppearanceSettings />
      <BehaviourSettings />
    </div>
  );
};

export default AppearanceAndBehaviour;
