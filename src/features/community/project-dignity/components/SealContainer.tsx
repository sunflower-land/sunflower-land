import React from "react";

import { Seal } from "../models/seal";
import { SealComponent } from "./SealComponent";

interface Props {
  seals: Seal[];
  isGarden?: boolean;
}

// Main Farm Coordinates
const coordinates = [
  [
    { top: -5, left: 35 },
    { top: -7, left: 43 },
    { top: -2, left: 39 },
  ], // 1-3
  [
    { top: 30, left: 32 },
    { top: 30, left: 40 },
    { top: 35, left: 35 },
  ], // 4-6
  [
    { top: 32, left: 3 },
    { top: 39, left: 0 },
    { top: 35, left: -6 },
  ], // 7-9
  [
    { top: -5, left: -7 },
    { top: -7, left: 2 },
    { top: 1, left: 0 },
  ], // 10-12
  [
    { top: 35, left: 10 },
    { top: 31, left: 13 },
    { top: 34, left: 18 },
  ], // 13-15
  [
    { top: -9, left: 21 },
    { top: -6, left: 18 },
    { top: -9, left: 15 },
  ], // 16-18
];

// Community Garden Coordinates
const gardenCoordinates = [
  { top: 13, left: 38 },
  { top: 10, left: 36 },
  { top: 13, left: 30 }, // 1-3
  { top: 3, left: 28 },
  { top: 5, left: 31 },
  { top: 8, left: 34 }, // 4-6
  { top: 12, left: 34 },
  { top: 3, left: 34 },
  { top: 15, left: 26 }, // 7-9
  { top: 5, left: 25 },
  { top: 13, left: 23 },
  { top: 11, left: 20 }, // 10-12
  { top: 3, left: 22 },
  { top: 6, left: 22 },
  { top: 8, left: 19 }, // 13-15
  { top: 5, left: 18 },
  { top: 15, left: 30 },
  { top: 14, left: 33 }, // 16-18
];

const shuffleCoords = (array: any) => {
  return array.sort(() => Math.random() - 0.5);
};

const shuffledCoords = shuffleCoords(coordinates);
const flattenedCoords = shuffledCoords.flat();

const shuffledCoordsGarden = shuffleCoords(gardenCoordinates);

export const SealContainer: React.FC<Props> = ({ seals, isGarden }) => {
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
