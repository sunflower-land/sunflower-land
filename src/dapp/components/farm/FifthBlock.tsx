import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import soil from "../../images/land/soil/planted.png";
import { ActionableItem, Fruit, Square } from "../../types/contract";
import { FruitItem } from "../../types/fruits";

import { UpgradeOverlay } from "../ui/UpgradeModal";

import { Field } from "./Field";

interface Props {
  land: Square[];
  balance: number;
  onHarvest: (landIndex: number) => void;
  onPlant: (landIndex: number) => void;
  selectedItem: ActionableItem;
  fruits: FruitItem[];
}

export const FifthBlock: React.FC<Props> = ({
  fruits,
  land,
  balance,
  onHarvest,
  onPlant,
  selectedItem,
}) => {
  const isUnlocked = land.length > 14;

  return (
    <>
      <div className="dirt" style={{ gridColumn: "2/3", gridRow: "4/5" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[14]}
            onClick={
              land[14].fruit === Fruit.None
                ? () => onPlant(14)
                : () => onHarvest(14)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "3/4", gridRow: "4/5" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[15]}
            onClick={
              land[15].fruit === Fruit.None
                ? () => onPlant(15)
                : () => onHarvest(15)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "2/3", gridRow: "5/6" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[16]}
            onClick={
              land[16].fruit === Fruit.None
                ? () => onPlant(16)
                : () => onHarvest(16)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "3/4", gridRow: "5/6" }} />

      <div
        className="left-edge"
        style={{ gridColumn: "1/2", gridRow: "4/5" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "1/2", gridRow: "5/6" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "4/5", gridRow: "4/5" }}
      />
      <div className="top-edge" style={{ gridColumn: "2/3", gridRow: "3/4" }} />
      <div className="top-edge" style={{ gridColumn: "3/4", gridRow: "3/4" }} />
      <div
        className="bottom-edge"
        style={{ gridColumn: "2/3", gridRow: "6/7" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "3/4", gridRow: "6/7" }}
      />

      {!isUnlocked && (
        <OverlayTrigger
          overlay={UpgradeOverlay}
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
        >
          <div
            className="upgrade-overlay"
            style={{ gridColumn: "2/3", gridRow: "4/5" }}
          />
        </OverlayTrigger>
      )}
    </>
  );
};
