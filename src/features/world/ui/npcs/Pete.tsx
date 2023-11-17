import React from "react";
import { DeliveryPanel } from "../deliveries/DeliveryPanel";
import { acknowledgeNPC } from "lib/npcs";

interface Props {
  onClose: () => void;
}
export const Pete: React.FC<Props> = ({ onClose }) => {
  return (
    <DeliveryPanel
      npc={"pumpkin' pete"}
      onClose={() => {
        onClose();
        acknowledgeNPC("pumpkin' pete");
      }}
    />
  );
};
