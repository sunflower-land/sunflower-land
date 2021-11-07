import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { ActionableItem, Fruit, Square } from "../../types/contract";

import { UpgradeOverlay } from "../ui/UpgradeModal";

import soil from "../../images/land/soil/planted.png";

import { Field } from "./Field";
import { FruitItem } from "../../types/fruits";

interface Props {
  land: Square[];
  balance: number;
  onHarvest: (landIndex: number) => void;
  onPlant: (landIndex: number) => void;
  selectedItem: ActionableItem;
  fruits: FruitItem[];
}

export const ThirdBlock: React.FC<Props> = ({
  fruits,
  land,
  balance,
  onHarvest,
  onPlant,
  selectedItem,
}) => {
  const isUnlocked = land.length > 8;

  return (
    <>
      <div className="dirt" style={{ gridColumn: "6/7", gridRow: "3/4" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[8]}
            onClick={
              land[8].fruit === Fruit.None
                ? () => onPlant(8)
                : () => onHarvest(8)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "2/3" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[9]}
            onClick={
              land[9].fruit === Fruit.None
                ? () => onPlant(9)
                : () => onHarvest(9)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>

      <div className="dirt" style={{ gridColumn: "6/7", gridRow: "2/3" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[10]}
            onClick={
              land[10].fruit === Fruit.None
                ? () => onPlant(10)
                : () => onHarvest(10)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "3/4" }} />

      <div
        className="left-edge"
        style={{ gridColumn: "5/6", gridRow: "2/3" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "5/6", gridRow: "3/4" }}
      />
      <div className="top-edge" style={{ gridColumn: "6/7", gridRow: "1/2" }} />
      <div className="top-edge" style={{ gridColumn: "7/8", gridRow: "1/2" }} />
      <div
        className="right-edge"
        style={{ gridColumn: "8/9", gridRow: "2/3" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "6/7", gridRow: "4/5" }}
      />

      {!isUnlocked && (
        <OverlayTrigger
          overlay={UpgradeOverlay}
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
        >
          <div
            className="upgrade-overlay"
            style={{ gridColumn: "6/7", gridRow: "2/3" }}
          />
        </OverlayTrigger>
      )}
    </>
  );
};
