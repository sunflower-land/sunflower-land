import React, { memo, useRef } from "react";
import classNames from "classnames";

interface Props {
  name: string;
  image: string;
  type: string;
  fallbackImage?: string;
  isResources?: boolean;
}

const ListViewImageComponent = ({
  name,
  image,
  type,
  fallbackImage,
  isResources,
}: Props) => {
  // Use ref to maintain image reference
  const imageRef = useRef<string>(image);

  if (type === "buds" || type === "pets") {
    return (
      <div className={"absolute -inset-1.5 overflow-hidden"}>
        <img
          alt={name}
          src={imageRef.current}
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!fallbackImage || imageRef.current === fallbackImage) {
              return;
            }

            imageRef.current = fallbackImage;
            e.currentTarget.src = fallbackImage;
          }}
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
