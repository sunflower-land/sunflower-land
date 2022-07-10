import React, { useState } from "react";
import bumpkin from "assets/npcs/bumpkin.gif";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { BumpkinBuilder } from "./components/BumpkinBuilder";
import { BumpkinNPC } from "./components/BumpkinNPC";

export const Bumpkin: React.FC = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  return (
    <div className="w-full">
      <BumpkinNPC
        body="Farmer Potion 2"
        wig="Rancher Wig"
        pants="Lumberjack Overalls"
        //shirt="Farmer Shirt"
        onClick={() => setShowBuilder(true)}
      />
      <Modal show={showBuilder} centered onHide={() => setShowBuilder(false)}>
        <Panel>
          <BumpkinBuilder />
        </Panel>
      </Modal>
    </div>
  );
};
