import { Panel } from "components/ui/Panel";
import React from "react";
import { Modal } from "react-bootstrap";
import humanDeath from "assets/npcs/human_death.gif";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

export const IslandNotFound = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <Modal centered show={true}>
      <Panel>
        <div className="flex flex-col items-center">
          <img id="richBegger" src={humanDeath} />
          <p className="my-4 px-2 text-center">
            You have landed in the middle of nowhere!
          </p>
          <Button onClick={() => navigate(`/`)}>Take me home</Button>
        </div>
      </Panel>
    </Modal>
  );
};
