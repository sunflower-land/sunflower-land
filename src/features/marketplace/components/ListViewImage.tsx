import React, { memo, useRef } from "react";
import classNames from "classnames";

interface Props {
  name: string;
  image: string;
  type: string;
  isResources?: boolean;
}

const ListViewImageComponent = ({ name, image, type, isResources }: Props) => {
  // Use ref to maintain image reference
  const imageRef = useRef<string>(image);

  if (type === "buds") {
    return (
      <div className="absolute -inset-1.5 overflow-hidden">
        <img
          alt={name}
          src={imageRef.current}
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <img
      alt={name}
      src={imageRef.current}
      className={classNames("object-contain h-[80%] mt-1", {
        "h-[55%] mt-3": isResources,
      })}
      loading="lazy"
      decoding="async"
    />
  );
};

export const ListViewImage = memo(ListViewImageComponent);
