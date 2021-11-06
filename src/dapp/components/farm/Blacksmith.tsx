import React from "react";
import Modal from "react-bootstrap/Modal";

import { Panel } from "../ui/Panel";

import disc from "../../images/ui/disc.png";
import hammer from "../../images/ui/hammer.png";
import blacksmith from "../../images/decorations/blacksmith.png";
import basket from "../../images/ui/basket.png";
import { CraftingMenu } from "../ui/CraftingMenu";

export const Blacksmith: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <CraftingMenu onClose={() => setShowModal(false)} />
        </Panel>
      </Modal>
      <div
        style={{ gridColumn: "4/5", gridRow: "9/10" }}
        id="minter"
        onClick={() => setShowModal(true)}
      >
        <img id="blacksmith" src={blacksmith} />

        <div className="mint">
          <div className="disc">
            <img src={disc} className="discBackground" />
            <img src={hammer} className="pickaxe" />
          </div>
          <Panel hasOuter={false}>
            <span id="upgrade">Craft</span>
          </Panel>
        </div>
      </div>
    </>
  );
};
