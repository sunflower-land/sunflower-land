import { MutableRefObject, useEffect, useState } from "react";

export enum Section {
  Crops = "crops",
  Water = "water",
  Animals = "animals",
}

export const useScrollIntoView = () => {
  const scrollIntoView = (id: Section) => {
    const el = document.getElementById(id);

    el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return [scrollIntoView];
};
