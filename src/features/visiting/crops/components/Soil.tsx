import React, { useRef } from "react";

import soil from "assets/land/soil2.png";

import { FieldItem } from "features/game/types/game";
import { RandomID } from "lib/images";

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
  const id = useRef(RandomID());

  return (
    <img
      id={id.current}
      src={image}
      className={classnames("w-full", className)}
    />
  );
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
