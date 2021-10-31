import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { UpgradeOverlay } from "../ui/UpgradeModal";

import soil from "../../images/land/soil/planted.png";
import { ActionableItem, Fruit, Square } from "../../types/contract";

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

export const FourthBlock: React.FC<Props> = ({
  fruits,
  land,
  balance,
  onHarvest,
  onPlant,
  selectedItem,
}) => {
  const isUnlocked = land.length > 11;

  return (
    <>
      <div className="dirt" style={{ gridColumn: "11/12", gridRow: "3/4" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[11]}
            onClick={
              land[11].fruit === Fruit.None
                ? () => onPlant(11)
                : () => onHarvest(11)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "12/13", gridRow: "3/4" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[12]}
            onClick={
              land[12].fruit === Fruit.None
                ? () => onPlant(12)
                : () => onHarvest(12)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>

      <div className="dirt" style={{ gridColumn: "12/13", gridRow: "4/5" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[13]}
            onClick={
              land[13].fruit === Fruit.None
                ? () => onPlant(13)
                : () => onHarvest(13)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "11/12", gridRow: "4/5" }} />

      <div
        className="top-edge"
        style={{ gridColumn: "11/12", gridRow: "2/3" }}
      />
      <div
        className="top-edge"
        style={{ gridColumn: "12/13", gridRow: "2/3" }}
      />

      <div
        className="right-edge"
        style={{ gridColumn: "13/14", gridRow: "3/4" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "13/14", gridRow: "4/5" }}
      />

      <div
        className="left-edge"
        style={{ gridColumn: "10/11", gridRow: "4/5" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "10/11", gridRow: "3/4" }}
      />

      <div
        className="bottom-edge"
        style={{ gridColumn: "11/12", gridRow: "5/6" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "12/13", gridRow: "5/6" }}
      />

      {!isUnlocked && (
        <OverlayTrigger
          overlay={UpgradeOverlay}
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
        >
          <div
            className="upgrade-overlay"
            style={{ gridColumn: "11/12", gridRow: "3/4" }}
          />
        </OverlayTrigger>
      )}
    </>
  );
};
