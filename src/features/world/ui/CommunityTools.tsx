import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { COMMUNITY_TEST_ISLAND } from "../scenes/CommunityScene";

export const CommunityTools: React.FC = () => {
  const [url, setURL] = useState<string>("");

  const navigate = useNavigate();

  const testIt = () => {
    localStorage.setItem("community-tools-url", url as string);
    navigate(`/community/${COMMUNITY_TEST_ISLAND}`);
  };

  return (
    <Modal show centered>
      <Panel>
        <div className="p-2">
          <p className="text-sm">Enter your repo URL:</p>
          <input
            type="text"
            name="url"
            className="mt-1 text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
          <Button className="mt-1" disabled={!url} onClick={testIt}>
            Test
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
