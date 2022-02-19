import React from "react";
import { useSprite } from "react-sprite-animator";
import sheet from "assets/resources/tree/chopped_cut.png";

interface Props {
  shouldAnimate: boolean;
}

export const TreeAnimation: React.FC<Props> = ({ shouldAnimate }) => {
  const styles = useSprite({
    sprite: sheet,
    width: 266,
    height: 168,
    fps: 20,
    stopLastFrame: true,
    frameCount: 11,
    shouldAnimate,
  });

  return <div style={styles} />;
};
