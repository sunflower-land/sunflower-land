import React, { useState } from "react";

import firePit from "assets/buildings/fire_pit.png";
import { FirePitModal } from "./firePit/FirePitModal";

export const FirePit: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <FirePitModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <img
        src={firePit}
        className="w-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      />
    </>
  );
};
