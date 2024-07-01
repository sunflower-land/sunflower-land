import { useState, useEffect } from "react";

type Orientation = "portrait" | "landscape";

export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(
    window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape",
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.matchMedia("(orientation: portrait)").matches
          ? "portrait"
          : "landscape",
      );
    };

    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return orientation;
};
