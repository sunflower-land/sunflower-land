import React from "react";

import { Seal } from "../models/seal";
import { SealComponent } from "./SealComponent";

interface Props {
  seals: Seal[];
  isGarden?: boolean;
  offset?: number;
}

// community garden coordinates
const gardenCoordinates = [
  { x: 10, y: 23 },
  { x: 9, y: 20 },
  { x: 2, y: 25 }, // 1-3
  { x: 0, y: 13 },
  { x: 3, y: 15 },
  { x: 6, y: 18 }, // 4-6
  { x: 6, y: 22 },
  { x: 6, y: 13 },
  { x: -2, y: 25 }, // 7-9
  { x: -3, y: 15 },
  { x: -9, y: 24 },
  { x: -11, y: 21 }, // 10-12
  { x: -5, y: 12 },
  { x: -8, y: 15 },
  { x: -10, y: 18 }, // 13-15
  { x: -12, y: 15 },
  { x: -7, y: 27 },
  { x: -5, y: 24 }, // 16-18
];

const shuffleCoords = (array: any) => {
  return array.sort(() => Math.random() - 0.5);
};

const shuffledCoordsGarden = shuffleCoords(gardenCoordinates);

export const SealContainer: React.FC<Props> = ({ seals, isGarden, offset }) => {
  offset = offset ?? 0;
  // main farm coordinates
  const mainIslandCoordinates = [
    [
      { x: 7 + offset, y: 11 + offset },
      { x: 17 + offset, y: 13 + offset },
      { x: 11 + offset, y: 18 + offset },
    ], // 1-3, top right
    [
      { x: 1, y: 13 + offset },
      { x: -6, y: 18 + offset },
      { x: 2, y: 21 + offset },
    ], // 4-6, top
    [
      { x: -10 - offset, y: 10 + offset },
      { x: -18 - offset, y: 13 + offset },
      { x: -13 - offset, y: 18 + offset },
    ], // 7-9, top left
    [
      { x: -14 - offset, y: -12 - offset },
      { x: -6 - offset, y: -8 - offset },
      { x: -11 - offset, y: -4 - offset },
    ], // 10-12, bottom left
    [
      { x: 4, y: -18 - offset },
      { x: -2, y: -13 - offset },
      { x: 8, y: -11 - offset },
    ], // 13-15, bottom
    [
      { x: 10 + offset, y: -10 - offset },
      { x: 16 + offset, y: -9 - offset },
      { x: 14 + offset, y: -4 - offset },
    ], // 16-18, bottom right
  ];
  const shuffledCoords = shuffleCoords(mainIslandCoordinates);
  const flattenedCoords = shuffledCoords.flat();

  return (
    <>
      {seals.map((seal, index) => (
        <SealComponent
          key={index}
          seal={seal}
          position={
            isGarden ? shuffledCoordsGarden[index] : flattenedCoords[index]
          }
        />
      ))}
    </>
  );
};
