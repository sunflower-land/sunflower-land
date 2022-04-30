import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import greenBook from "assets/decorations/green_book.png";
import yellowBook from "assets/decorations/yellow_book.png";
import tombstone from "assets/decorations/tombstone.png";
import close from "assets/icons/close.png";
import { battleAudio, diaryAudio } from "lib/utils/sfx";

export const Lore: React.FC = () => {
  const [showGreenBook, setShowGreenBook] = useState(false);
  const [showYellowBook, setShowYellowBook] = useState(false);
  const [showTombstone, setShowTombstone] = useState(false);

  const onOpenGreenBook = () => {
    setShowGreenBook(true);
    battleAudio.play();
  };

  const onOpenYellowBook = () => {
    setShowYellowBook(true);
    diaryAudio.play();
  };

  const onCloseBook = () => {
    setShowYellowBook(false);
    setShowGreenBook(false);
    battleAudio.stop();
    diaryAudio.stop();
  };

  return (
    <>
      <img
        src={greenBook}
        className="absolute hover:img-highlight cursor-pointer z-10"
        onClick={onOpenGreenBook}
        style={{
          width: `${GRID_WIDTH_PX * 0.5}px`,
          right: `${GRID_WIDTH_PX * 4.25}px`,
          top: `${GRID_WIDTH_PX * 27.1}px`,
        }}
      />
      {showGreenBook && (
        <Modal centered show={showGreenBook} onHide={onCloseBook}>
          <Panel>
            <img
              src={close}
              className="h-6 top-4 right-4 absolute cursor-pointer"
              onClick={onCloseBook}
            />
            <div className="flex items-start">
              <img src={greenBook} className="w-12 img-highlight mr-2" />
              <div className="flex-1">
                <span className="text-shadow  block">
                  The battle of 3 trees
                </span>
                <span className="text-shadow text-xs block">19th March</span>
                <span className="text-shadow block mt-4">
                  The outsiders have stormed the village and forced us to the
                  outskirts. Those that survived have fled to the mountains.
                </span>
              </div>
            </div>
          </Panel>
        </Modal>
      )}

      <img
        src={yellowBook}
        className="absolute hover:img-highlight cursor-pointer z-10"
        onClick={onOpenYellowBook}
        style={{
          width: `${GRID_WIDTH_PX * 0.3}px`,
          right: `${GRID_WIDTH_PX * 55.3}px`,
          top: `${GRID_WIDTH_PX * 2}px`,
        }}
      />
      {showYellowBook && (
        <Modal centered show={showYellowBook} onHide={onCloseBook}>
          <Panel>
            <img
              src={close}
              className="h-6 top-4 right-4 absolute cursor-pointer"
              onClick={onCloseBook}
            />
            <div className="flex items-start">
              <img src={yellowBook} className="w-12 img-highlight mr-2" />
              <div className="flex-1">
                <span className="text-shadow  block">{`A young girl's diary`}</span>
                <span className="text-shadow text-xs block">26th March</span>
                <span className="text-shadow block mt-4">{`My home, my dolls, my friends. They're all gone.....`}</span>
              </div>
            </div>
          </Panel>
        </Modal>
      )}

      <img
        src={tombstone}
        className="absolute hover:img-highlight cursor-pointer z-10"
        onClick={() => setShowTombstone(true)}
        style={{
          width: `${GRID_WIDTH_PX * 0.88}px`,
          left: `${GRID_WIDTH_PX * 31.07}px`,
          top: `${GRID_WIDTH_PX * 36.94}px`,
        }}
      />
      {showTombstone && (
        <Modal
          centered
          show={showTombstone}
          onHide={() => setShowTombstone(false)}
        >
          <Panel>
            <img
              src={close}
              className="h-6 top-4 right-4 absolute cursor-pointer"
              onClick={() => setShowTombstone(false)}
            />
            <div className="flex items-start">
              <img src={tombstone} className="w-12 img-highlight mr-2" />
              <div className="flex-1">
                <span className="text-shadow  block">{`Bilk Noggin`}</span>
                <span className="text-shadow text-xs block">
                  Died, 45 years
                </span>
                <span className="text-shadow block mt-4">{`A hero of the resistance. Loved by friends, family & followers`}</span>
              </div>
            </div>
          </Panel>
        </Modal>
      )}
    </>
  );
};
