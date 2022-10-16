import React from "react";

import soil from "assets/land/soil2.png";

import { FieldItem } from "features/game/types/game";

import classnames from "classnames";
import { LIFECYCLE } from "features/farming/crops/lib/plant";

interface Props {
  field?: FieldItem;
  className?: string;
  showCropDetails?: boolean;
}

const Ready: React.FC<{ image: string; className: string }> = ({
  image,
  className,
}) => {
  return <img src={image} className={classnames("w-full", className)} />;
};

export const Soil: React.FC<Props> = ({ field, className }) => {
  if (!field) {
    return <img src={soil} className={classnames("w-full", className)} />;
  }

  return (
    <Ready
      className={className as string}
      image={LIFECYCLE[field.name].ready}
    />
  );
};
