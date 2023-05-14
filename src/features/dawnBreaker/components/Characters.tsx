import React, { useState } from "react";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC, NPCParts } from "features/island/bumpkin/components/NPC";
import {
  SpeakingCharacter,
  Week,
  bumpkinParts,
  characters,
  characterImages,
  isSpeakingBumpkin,
  isSpeakingNonBumpkin,
} from "../lib/characters";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import classNames from "classnames";

import wendyGif from "assets/sfts/wood_nymph_wendy.gif";
import kuebiko from "assets/sfts/kuebiko.gif";

interface Props {
  currentWeek: Week;
}

export const Characters: React.FC<Props> = ({ currentWeek }) => {
  const [speaking, setSpeaking] = useState<{
    character: SpeakingCharacter;
    parts?: Partial<NPCParts>;
  } | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const { marcus, bella, sofia, obie, maximus, wendy, snail } =
    characters[currentWeek];

  const handleDialogueClose = () => {
    setShowDialogue(false);
  };

  const handleDialogueOpen = (character: SpeakingCharacter) => {
    if (!characters[currentWeek][character]?.dialogue) return;

    const parts = isSpeakingBumpkin(character)
      ? bumpkinParts[character]
      : undefined;

    setSpeaking({ character, parts });
    setShowDialogue(true);
  };

  const hasDialogue = (character: SpeakingCharacter) => {
    return !!characters[currentWeek][character]?.dialogue;
  };

  return (
    <>
      <MapPlacement x={-1} y={3} width={2}>
        <img
          src={kuebiko}
          // Remove brightness if npc is on a bright part of the map
          className="brightness-[0.6] absolute"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            bottom: `-${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          alt="Kuebiko"
        />
      </MapPlacement>
      {marcus && (
        <MapPlacement x={marcus.x} y={marcus.y}>
          <div className={classNames({ "brightness-50": marcus.inDarkness })}>
            <NPC
              parts={bumpkinParts.marcus}
              flip={marcus.flip}
              onClick={
                hasDialogue("marcus")
                  ? () => handleDialogueOpen("marcus")
                  : undefined
              }
            />
          </div>
        </MapPlacement>
      )}
      {bella && (
        <MapPlacement x={bella.x} y={bella.y}>
          <div className={classNames({ "brightness-50": bella.inDarkness })}>
            <NPC
              parts={bumpkinParts.bella}
              flip={bella.flip}
              onClick={
                hasDialogue("bella")
                  ? () => handleDialogueOpen("bella")
                  : undefined
              }
            />
          </div>
        </MapPlacement>
      )}
      {sofia && (
        <MapPlacement x={sofia.x} y={sofia.y}>
          <div className={classNames({ "brightness-50": sofia.inDarkness })}>
            <NPC
              parts={bumpkinParts.sofia}
              flip={sofia.flip}
              onClick={
                hasDialogue("sofia")
                  ? () => handleDialogueOpen("sofia")
                  : undefined
              }
            />
          </div>
        </MapPlacement>
      )}
      {obie && (
        <MapPlacement x={obie.x} y={obie.y}>
          <img
            src={characterImages.obie}
            alt="Obie"
            style={{ width: `${PIXEL_SCALE * 15}px` }}
            // Remove brightness if npc is on a bright part of the map
            className={classNames("brightness-50", {
              "cursor-pointer hover:img-highlight": hasDialogue("obie"),
              "-scale-x-100": !!obie.flip,
            })}
            onClick={
              hasDialogue("obie") ? () => handleDialogueOpen("obie") : undefined
            }
          />
        </MapPlacement>
      )}
      {maximus && (
        <MapPlacement x={maximus.x} y={maximus.y}>
          <img
            src={characterImages.maximus}
            alt="Maximus"
            style={{ width: `${PIXEL_SCALE * 21}px` }}
            // Remove brightness-50  if npc is in a bright part of the map
            className={classNames("brightness-50", {
              "cursor-pointer hover:img-highlight": hasDialogue("maximus"),
              "-scale-x-100": !!maximus.flip,
            })}
            onClick={
              hasDialogue("maximus")
                ? () => handleDialogueOpen("maximus")
                : undefined
            }
          />
        </MapPlacement>
      )}
      {snail && (
        <MapPlacement x={snail.x} y={snail.y} width={1}>
          <img
            src={characterImages.snail}
            style={{
              width: `${PIXEL_SCALE * 15}px`,
            }}
            alt="Snail"
            // Remove brightness-50  if npc is in a bright part of the map
            className={classNames("brightness-50", {
              "cursor-pointer hover:img-highlight": hasDialogue("maximus"),
              "-scale-x-100": !!snail.flip,
            })}
            onClick={
              hasDialogue("maximus")
                ? () => handleDialogueOpen("maximus")
                : undefined
            }
          />
        </MapPlacement>
      )}
      {wendy && (
        <MapPlacement x={wendy.x} y={wendy.y} width={1} height={2}>
          <img
            src={wendyGif}
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 0}px`,
            }}
            // Remove brightness-50  if npc is in a bright part of the map
            className="brightness-50 absolute"
            alt="Wood Nymph Wendy"
          />
        </MapPlacement>
      )}
      <Modal
        show={showDialogue}
        onHide={handleDialogueClose}
        onExited={() => setSpeaking(null)}
        centered
      >
        {speaking && (
          <CloseButtonPanel
            onClose={handleDialogueClose}
            bumpkinParts={speaking?.parts}
          >
            <div className="p-1 pt-0 flex">
              {isSpeakingNonBumpkin(speaking.character) && (
                <div
                  className="basis-4 mr-2 "
                  style={{ minWidth: `${PIXEL_SCALE * 15}px` }}
                >
                  <img
                    src={characterImages[speaking.character]}
                    alt={speaking.character}
                    className="w-full"
                  />
                </div>
              )}
              <div className="p-1 space-y-2 flex flex-col justify-center">
                {characters[currentWeek][speaking.character]?.dialogue}
              </div>
            </div>
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
