import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import button from "assets/ui/button/round_button.png";
import { Label } from "components/ui/Label";
import { InventoryItems } from "./InventoryItems";

export const Inventory: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInventoryClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col items-end mr-2 sm:block fixed top-16 right-0 z-50">
      <div
        className="w-16 h-16 sm:mx-8 mt-2 relative flex justify-center items-center shadow rounded-full cursor-pointer"
        onClick={handleInventoryClick}
      >
        <img
          src={button}
          className="absolute w-full h-full -z-10"
          alt="inventoryButton"
        />
        <img src={basket} className="w-8 mb-1" alt="inventory" />
        <Label className="hidden sm:block absolute -bottom-7">Items</Label>
      </div>

      <Modal centered scrollable show={isOpen} onHide={() => setIsOpen(false)}>
        <InventoryItems onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
