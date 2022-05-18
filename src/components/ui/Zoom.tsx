import React, { useEffect, useState } from "react";

import zoom_out from "assets/ui/zoom/zoom-out.png";
import zoom_in from "assets/ui/zoom/zoom-in.png";
import { Button } from "components/ui/Button";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

interface Props {
  isFarming?: boolean;
}

export const Zoom: React.FC<Props> = () => {
  const [zoomedOut, setZoomedOut] = useState<boolean>(false);
  const [isMobile] = useIsMobile();

  useEffect(() => {
    const toggleZoom = async () => {
      if (zoomedOut) {
        document.body.style.zoom = 0.8;
      } else {
        document.body.style.zoom = 1;
      }
    };
    toggleZoom(), [zoomedOut];
  });

  return (
    <>
      {isMobile && (
        <div
          className={`position-fixed left-2 sm:left-2 bottom-4 z-50 md:w-56 w-48 h-fit`}
        >
          <div
            className={`position-absolute left-0 sm:-left-0 bottom-0 duration-500 w-fit z-50`}
          >
            <Button onClick={() => setZoomedOut(!zoomedOut)}>
              <img
                src={zoomedOut ? zoom_in : zoom_out}
                alt="zoom in/out map"
                className="w-4 h-4 sm:w-6 sm:h-5"
              />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
