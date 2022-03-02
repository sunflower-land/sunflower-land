import { MutableRefObject, useEffect, useState } from "react";

export enum Section {
  Crops = "crops",
  Water = "water",
  Animals = "animals",
  Shop = "shop",
  Town = "town",
}

export const useScrollIntoView = () => {
  const scrollIntoView = (id: Section) => {
    const el = document.getElementById(id);

    console.log({ scrollIntoView: id });
    el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return [scrollIntoView];
};
