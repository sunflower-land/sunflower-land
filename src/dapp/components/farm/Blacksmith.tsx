import React from "react";
import Modal from "react-bootstrap/Modal";

import { Panel } from "../ui/Panel";

import close from "../../images/ui/close.png";
import disc from "../../images/ui/disc.png";
import hammer from "../../images/ui/hammer.png";
import man from "../../images/characters/bald_man.png";
import blacksmith from "../../images/decorations/blacksmith.png";
import basket from "../../images/ui/basket.png";

import leftEdgeInner from "../../images/ui/panel/lt_box_9slice_lc.png";
import rightEdgeInner from "../../images/ui/panel/lt_box_9slice_rc.png";
import topEdgeInner from "../../images/ui/panel/lt_box_9slice_tc.png";
import topLeftInner from "../../images/ui/panel/lt_box_9slice_tl.png";
import topRightInner from "../../images/ui/panel/lt_box_9slice_tr.png";

import { Tools } from "../ui/Tools";
import { NFTs } from "../ui/NFTs";
import { CommunityCrafting } from "../ui/CommunityCrafting";
import { Inventory } from "../../types/crafting";

interface Props {
  inventory: Inventory;
  totalItemSupplies: Inventory;
  balance: number;
  level: number;
}
export const Blacksmith: React.FC<Props> = ({
  inventory,
  totalItemSupplies,
  balance,
  level,
}) => {
  const [showModal, setShowModal] = React.useState(false);

  const [tab, setTab] = React.useState<"Tools" | "NFTs" | "Community">(
    "Tools"
  );

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel hasTabs>
          <img
            src={close}
            className="close-icon"
            onClick={() => setShowModal(false)}
          />
          <div id="inventory-tabs">
            <div
              className={`inventory-tab ${
                tab === "Tools" && "active-tab"
              }`}
              onClick={() => setTab("Tools")}
            >
              <img src={hammer} alt="basket" className="tab-icon" />
              <span>Tools</span>
              {tab === "Tools" && (
                <>
                  <img id="panel-left-edge" src={leftEdgeInner} />
                  <img id="panel-right-edge" src={rightEdgeInner} />
                  <img id="panel-top-edge" src={topEdgeInner} />
                  <img id="panel-top-left" src={topLeftInner} />
                  <img id="panel-top-right" src={topRightInner} />
                </>
              )}
            </div>

            <div
              className={`inventory-tab ${tab === "NFTs" && "active-tab"}`}
              onClick={() => setTab("NFTs")}
            >
              <img src={basket} alt="basket" className="tab-icon" />
              <span>NFTs</span>
              {tab === "NFTs" && (
                <>
                  <img id="panel-left-edge" src={leftEdgeInner} />
                  <img id="panel-right-edge" src={rightEdgeInner} />
                  <img id="panel-top-edge" src={topEdgeInner} />
                  <img id="panel-top-left" src={topLeftInner} />
                  <img id="panel-top-right" src={topRightInner} />
                </>
              )}
            </div>

            <div
              className={`inventory-tab ${
                tab === "Community" && "active-tab"
              }`}
              onClick={() => setTab("Community")}
            >
              <img src={man} alt="basket" className="tab-icon" />
              <span>Community</span>
              {tab === "Community" && (
                <>
                  <img id="panel-left-edge" src={leftEdgeInner} />
                  <img id="panel-right-edge" src={rightEdgeInner} />
                  <img id="panel-top-edge" src={topEdgeInner} />
                  <img id="panel-top-left" src={topLeftInner} />
                  <img id="panel-top-right" src={topRightInner} />
                </>
              )}
            </div>
          </div>
          {tab === "Tools" && (
            <Tools
              onClose={() => setShowModal(false)}
              inventory={inventory}
              totalItemSupplies={totalItemSupplies}
              balance={balance}
              level={level}
            />
          )}
          {tab === "NFTs" && (
            <NFTs
              onClose={() => setShowModal(false)}
              inventory={inventory}
              totalItemSupplies={totalItemSupplies}
              balance={balance}
              level={level}
            />
          )}
          {tab === "Community" && (
            <CommunityCrafting
              onClose={() => setShowModal(false)}
              inventory={inventory}
              totalItemSupplies={totalItemSupplies}
              balance={balance}
              level={level}
            />
          )}
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
