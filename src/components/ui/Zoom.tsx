import React, { useEffect, useState } from "react";

import zoom_out from "assets/ui/zoom/zoom-out.png";
import zoom_in from "assets/ui/zoom/zoom-in.png";
import { Button } from "components/ui/Button";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

export const Zoom: React.FC = () => {
  const maxZoomIn = 1.0;
  const maxZoomOut = 0.8;
  const [zoomLevel, setZoomedLevel] = useState<number>(1.0);
  const [isMobile] = useIsMobile();

  const zoomOut = () => {
    if (zoomLevel > maxZoomOut) {
      setZoomedLevel(zoomLevel - 0.1);
      console.log(zoomLevel);
    }
  };

  const zoomIn = () => {
    if (zoomLevel < maxZoomIn) {
      setZoomedLevel(zoomLevel + 0.1);
    }
  };

  useEffect(() => {
    const changeZoom = () => {
      // Not supported on FireFox mobile
      document.body.style.zoom = zoomLevel;
    };
    changeZoom();
  }, [zoomLevel]);

  return (
    <>
      {isMobile && (
        <>
          <Button onClick={() => zoomIn()} disabled={zoomLevel >= maxZoomIn}>
            <img
              src={zoom_in}
              alt="zoom in on the map"
              className="w-4 h-4 sm:w-6 sm:h-5"
            />
          </Button>
          <Button onClick={() => zoomOut()} disabled={zoomLevel <= maxZoomOut}>
            <img
              src={zoom_out}
              alt="zoom out of the map"
              className="w-4 h-4 sm:w-6 sm:h-5"
            />
          </Button>
        </>
      )}
    </>
  );
};
