import React, { useContext, useState } from "react";
import classNames from "classnames";
import Modal from "react-bootstrap/Modal";

import { Bar } from "components/ui/ProgressBar";
import { RemovePlaceableModal } from "../../game/expansion/placeable/RemovePlaceableModal";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ResourceName } from "features/game/types/resources";
import { Soil } from "../plots/components/Soil";
import { Gold } from "features/game/expansion/components/resources/Gold";
import { Iron } from "features/game/expansion/components/resources/Iron";
import { Stone } from "features/game/expansion/components/resources/Stone";
import { Tree } from "features/game/expansion/components/resources/Tree";
import { SUNNYSIDE } from "assets/sunnyside";

export interface ResourceProps {
  name: ResourceName;
  id: string;
  readyAt: number;
  createdAt: number;
}

export const RESOURCE_COMPONENTS: Record<
  ResourceName,
  React.FC<ResourceProps>
> = {
  "Crop Plot": () => (
    <img
      src={SUNNYSIDE.soil.soil2}
      className="absolute bottom-0 w-full"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
    />
  ),
  "Gold Rock": () => (
    <img
      src={SUNNYSIDE.resource.gold_rock}
      className="relative h-full w-full"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
    />
  ),
  "Iron Rock": () => (
    <img
      src={SUNNYSIDE.resource.iron_rock}
      className="relative h-full w-full"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
    />
  ),
  "Stone Rock": () => (
    <img
      src={SUNNYSIDE.resource.stone_rock}
      className="relative h-full w-full"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
    />
  ),
  Tree: () => (
    <img
      src={SUNNYSIDE.resource.tree}
      className="absolute h-auto w-full"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * -4}px`,
      }}
    />
  ),
};

export const Resource: React.FC<ResourceProps> = ({
  name,
  id,
  readyAt,
  createdAt,
}) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const inProgress = readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  const shortcuts = getShortcuts();

  const canRemoveOnClick = shortcuts[0] !== "Rusty Shovel";
  const handleOnClick = () => {
    if (canRemoveOnClick) return;

    setShowRemoveModal(true);
  };

  const Component = RESOURCE_COMPONENTS[name];
  return (
    <>
      <div
        className={classNames("h-full", {
          "cursor-pointer hover:img-highlight": canRemoveOnClick,
        })}
        onClick={canRemoveOnClick ? handleOnClick : undefined}
      >
        <div
          className={classNames("h-full", {
            "pointer-events-none": canRemoveOnClick,
          })}
        >
          <Component
            key={id}
            createdAt={createdAt}
            id={id}
            name={name}
            readyAt={readyAt}
          />
        </div>
      </div>
      <Modal
        show={showRemoveModal}
        centered
        onHide={() => setShowRemoveModal(false)}
      >
        {showRemoveModal && (
          <RemovePlaceableModal
            type="collectible"
            placeableId={id}
            name={name}
            onClose={() => setShowRemoveModal(false)}
          />
        )}
      </Modal>
    </>
  );
};
