import React from "react";

import { Modal } from "react-bootstrap";

export const LetsGo: React.FC = () => {
  return (
    <>
      <Modal.Header className="justify-content-space-between">
        <h1 className="ml-2">Time to play!</h1>
      </Modal.Header>
      <Modal.Body>
        <p className="text-xs p-2 sm:text-sm text-center">
          Thanks for playing beta! We are still working on the game and
          appreciate your support during the early stages!
        </p>

        <p className="text-xs p-2 sm:text-sm text-center">
          You can read more about the game in the{" "}
          <a
            className="text-xs sm:text-sm underline"
            href="https://docs.sunflower-land.com"
            target="_blank"
            rel="noreferrer"
          >
            official docs.
          </a>
        </p>
      </Modal.Body>
    </>
  );
};
