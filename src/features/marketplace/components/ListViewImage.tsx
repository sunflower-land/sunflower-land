import React, { useState } from "react";
import classNames from "classnames";

interface Props {
  name: string;
  image: string;
  type: string;
  fallbackImage?: string;
  isResources?: boolean;
}

export const ListViewImage = ({
  name,
  image,
  type,
  fallbackImage,
  isResources,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string>(image);

  if (type === "buds" || type === "pets") {
    return (
      <div className="absolute -inset-1.5 overflow-hidden">
        <img
          alt={name}
          src={imageUrl}
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!fallbackImage || imageUrl === fallbackImage) {
              return;
            }

            setImageUrl(fallbackImage);
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>
    );
  }

  return (
    <img
      alt={name}
      src={imageUrl}
      className={classNames("object-contain h-[80%] mt-1", {
        "h-[55%] mt-3": isResources,
      })}
      loading="lazy"
      decoding="async"
    />
  );
};
