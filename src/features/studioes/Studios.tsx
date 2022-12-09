import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useLayoutEffect, useState } from "react";

import background from "assets/land/headquarters.png";
import adam from "assets/npcs/adam.gif";
import spencer from "assets/npcs/spencer.gif";
import harry from "assets/npcs/harry.gif";
import roulette from "assets/npcs/roulette.gif";
import steve from "assets/npcs/steve.gif";
import craig from "assets/npcs/craig.gif";
import harnoor from "assets/npcs/harnoor.gif";
import romy from "assets/npcs/romy.gif";
import diggle from "assets/npcs/diggle.gif";

import ausFlag from "assets/sfts/flags/australia_flag.gif";
import usFlag from "assets/sfts/flags/usa_flag.gif";
import britishFlag from "assets/sfts/flags/british_flag.gif";
import laptop from "assets/decorations/laptop.png";
import shadow from "assets/npcs/shadow.png";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

export const Studios: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  const [showModal, setShowModal] = useState(false);
  const [showDiggle, setShowDiggle] = useState(false);

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.TreasureIsland, "auto");
  }, []);

  // Load data
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${PIXEL_SCALE * 335}px`,
        height: `${PIXEL_SCALE * 270}px`,
      }}
    >
      <img
        src={background}
        className="absolute inset-0 w-full h-full"
        id={Section.TreasureIsland}
      />
      <MapPlacement x={-4.2} y={-3} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={adam}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-3} y={-0.5} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={spencer}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE}px`,
            transform: "scaleX(-1)",
          }}
        />
      </MapPlacement>

      <MapPlacement x={2.2} y={-2} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={craig}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={1.2} y={-4} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={harnoor}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-0.5} y={-2.5} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={romy}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={2.5} y={-4} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={harry}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * -1}px`,
            transform: "scaleX(-1)",
          }}
        />
      </MapPlacement>

      <MapPlacement x={3} y={-5.5} height={1} width={1}>
        <img
          src={ausFlag}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
      </MapPlacement>

      <img
        src={laptop}
        className="absolute cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${GRID_WIDTH_PX * 7}px`,
          left: `${GRID_WIDTH_PX * 11}px`,
        }}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="p-2">
            <p className="mb-2">
              The team are preparing for a live Twitch stream.
            </p>
            <Button
              onClick={() => {
                window.location.href =
                  "https://www.twitch.tv/0xsunflowerstudios";
              }}
            >
              Go to Twitch
            </Button>
          </div>
        </Panel>
      </Modal>

      <Modal centered show={showDiggle} onHide={() => setShowDiggle(false)}>
        <Panel>
          <div className="p-2">
            <p className="mb-2">{`Hi I'm Daniel!`}</p>
            <p className="mb-2">I am the designer of the base asset pack.</p>
            <p className="mb-2">
              You can follow my art and latest game developments on Twitter.
            </p>
            <Button
              onClick={() => {
                window.location.href = "https://twitter.com/DanielDiggle";
              }}
            >
              Twitter
            </Button>
          </div>
        </Panel>
      </Modal>

      <MapPlacement x={-7.5} y={7.5} height={1} width={1}>
        <img
          src={britishFlag}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-8.8} y={7.2} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={steve}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-3.5} y={5.6} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={diggle}
          className="absolute cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          onClick={() => setShowDiggle(true)}
        />
      </MapPlacement>

      <MapPlacement x={8.5} y={4.5} height={1} width={1}>
        <img
          src={usFlag}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
      </MapPlacement>
      <MapPlacement x={8.8} y={3.5} height={1} width={1}>
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={roulette}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
            transform: "scaleX(-1)",
          }}
        />
      </MapPlacement>
    </div>
  );
};
