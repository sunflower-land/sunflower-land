import React, { useState, useEffect } from "react";
import { useMachine } from "@xstate/react";
import Decimal from "decimal.js-light";

import { incubateMachine } from "../lib/incubateMachine";
import { ITEM_DETAILS } from "features/community/types/images";
import {
  Incubator as ActiveIncubator,
  IncubatorName,
  Tadpole,
} from "features/community/types/community";
import { Frog } from "features/community/project-dignity/models/frog";
import { loadIncubators } from "../actions/loadIncubators";
import { loadFrogs } from "features/community/merchant/actions/loadFrogs";
import { loadTadpoles } from "features/community/scientist/actions/loadTadpoles";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Modal } from "react-bootstrap";
import { OuterPanel, Panel } from "components/ui/Panel";

// images
import alert from "assets/icons/expression_alerted.png";
import frog_revealed from "assets/sfts/frogs/frog_revealed.gif";
import tadpole_icon from "features/community/assets/icons/tadpole.png";
import empty_incubator from "features/community/assets/incubator/empty-small.gif";
import active_incubator from "features/community/assets/incubator/algae-small.gif";
import token from "features/community/assets/icons/token.png";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

export const Incubator: React.FC = () => {
  const [machine, send] = useMachine(incubateMachine);

  const [incubatorData, setIncubatorData] = useState<ActiveIncubator[]>([]);
  const [tadpoleData, setTadpoleData] = useState<Tadpole[]>([]);
  const [frogData, setFrogData] = useState<Frog[]>([]);
  const [isIncubatorModalOpen, showIncubatorModal] = React.useState(false);
  const [isUnloadModalOpen, showUnloadModal] = React.useState(false);
  const [isClaimModalOpen, showClaimModal] = React.useState(false);

  // selected
  const [selected, setSelected] = useState("empty");
  const [selectedActiveIncubator, setSelectedActiveIncubator] =
    useState<string>();
  const [selectedIncubatorEarnings, setSelectedIncubatorEarnings] =
    useState<string>();
  const [selectedFrog, setSelectedFrog] = useState<number[]>();
  const [selectedTadpole, setSelectedTadpole] = useState<number[]>();

  useEffect(() => {
    const fetchIncubator = async () => {
      const data = await loadIncubators();
      setIncubatorData(data);
    };

    const fetchTadpoles = async () => {
      const data = await loadTadpoles();
      setTadpoleData(data);
    };

    const fetchFrogs = async () => {
      const data = await loadFrogs();
      setFrogData(data);
    };

    fetchIncubator();
    fetchTadpoles();
    fetchFrogs();
  }, []);

  // select tadpole and frog to incubate
  const openIncubatorModal = () => {
    showIncubatorModal(true);
  };

  const closeIncubatorModal = () => {
    showIncubatorModal(false);
  };

  // confirm unload incubator
  const openUnloadModal = () => {
    showUnloadModal(true);
  };

  const closeUnloadModal = () => {
    showUnloadModal(false);
  };

  // confirm claim incubator
  const openClaimModal = () => {
    showClaimModal(true);
  };

  const closeClaimModal = () => {
    showClaimModal(false);
  };

  const projectDignity = "https://www.projectdignity.work";

  return (
    <>
      {(machine.matches("loading") ||
        machine.matches("check_frog_approve")) && (
        <span className="loading">Loading</span>
      )}
      {machine.matches("no_tadpole_or_incubator") && (
        <div>
          <span className="no-tadpoles mt-2 mb-1 px-2 text-sm">
            You have no tadpoles or active incubators.
          </span>
        </div>
      )}
      {machine.matches("approve_frog") && (
        <>
          <div className="flex flex-col items-center mb-1">
            <h1 className="text-lg mb-2 text-center">
              {`Approve Access to your Frogs`}
            </h1>
            <p className="text-xs mb-4\2 mt-2 text-center">
              {`Note: This is a Community Feature`}
            </p>
            <p className="text-xxs mb-4\2 mt-2 text-center">
              initiated by{" "}
              <a
                href={`${projectDignity}/project-dignity/members`}
                target="_blank"
                rel="noreferrer"
              >
                Project Dignity
              </a>
            </p>
            <img
              src={frog_revealed}
              alt="Random frog revealed"
              className="m-2"
              width="200px"
            />
            <div className="flex items-center mt-1 border-2 m-2 rounded-md border-black p-2 bg-[#ffa214]">
              <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
              <span className="text-xs">
                Before incubating, you will need to Approve All Frogs in your{" "}
                <u>METAMASK WALLET</u>.
              </span>
            </div>
            <Button
              className="text-xs mt-2"
              onClick={() => send("APPROVE_FROG")}
            >
              Approve Frogs
            </Button>
          </div>
        </>
      )}
      {machine.matches("approve_tadpole") && (
        <>
          <div className="flex flex-col items-center mb-1">
            <h1 className="text-lg mb-2 text-center">
              {`Approve Access to your Tadpoles`}
            </h1>
            <p className="text-xs mb-4\2 mt-2 text-center">
              {`Note: This is a Community Feature`}
            </p>
            <p className="text-xxs mb-4\2 mt-2 text-center">
              initiated by{" "}
              <a
                href={`${projectDignity}/project-dignity/members`}
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Project Dignity
              </a>
            </p>
            <img
              src={tadpole_icon}
              alt="Tadpole Icon"
              className="m-2"
              width="100px"
            />
            <div className="flex items-center mt-1 border-2 m-2 rounded-md border-black p-2 bg-[#ffa214]">
              <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
              <span className="text-xs">
                Before incubating, you will need to Approve All Tadpoles in your{" "}
                <u>METAMASK WALLET</u>.
              </span>
            </div>
            <Button
              className="text-xs mt-2"
              onClick={() => send("APPROVE_TADPOLE")}
            >
              Approve Tadpoles
            </Button>
          </div>
        </>
      )}
      {(machine.matches("approving_frog") ||
        machine.matches("approving_tadpole")) && (
        <>
          <span className="loading">Approving</span>
        </>
      )}
      {machine.matches("incubating") && (
        <>
          <span className="loading">Incubating</span>
        </>
      )}
      {machine.matches("claiming") && (
        <>
          <span className="loading">Claiming</span>
        </>
      )}
      {machine.matches("removing") && (
        <>
          <span className="loading">Removing</span>
        </>
      )}
      {machine.matches("removed") && (
        <>
          <div className="flex flex-col items-center mb-1">
            <h1 className="text-lg mb-2 text-center">{`Awesome!`}</h1>
            <img
              src={empty_incubator}
              alt="Empty Incubator"
              className="m-2"
              width="100px"
            />
            <span className="mt-2 text-center">
              Your tokens have been claimed and the contents of the Incubator
              has been returned to your wallet.
            </span>
          </div>
        </>
      )}
      {machine.matches("claimed") && (
        <>
          <div className="flex flex-col items-center mb-1">
            <h1 className="text-lg mb-2 text-center">{`Sweet!`}</h1>
            <img
              src={active_incubator}
              alt="Active Incubator"
              className="m-2"
              width="100px"
            />
            <span className="mt-2 text-center">
              The token rewards have been claimed and transfered to your wallet.
            </span>
          </div>
        </>
      )}
      {machine.matches("incubated") && (
        <>
          <div className="flex flex-col items-center mb-1">
            <h1 className="text-lg mb-2 text-center">{`Congratulations!`}</h1>
            <img
              src={active_incubator}
              alt="Active Incubator"
              className="m-2"
              width="100px"
            />
            <span className="mt-2 text-center">
              Your tadpole and frog have been successfully incubated.
            </span>
          </div>
        </>
      )}
      {machine.matches("display_vaults") && (
        <>
          <div className="flex flex-col-reverse sm:flex-row">
            <div
              className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
              style={{ maxHeight: TAB_CONTENT_HEIGHT }}
            >
              <p className="mb-2 underline">Empty Incubator</p>
              <Box
                isSelected={selected === "empty"}
                onClick={() => {
                  setSelected("empty");
                }}
                key={0}
                image={ITEM_DETAILS.empty.image}
              />
              <p className="mt-2 mb-2 underline">Active Incubators</p>
              {incubatorData.length < 1 && (
                <p className="mt-1 mb-1 text-xs">
                  You have no active incubators.
                </p>
              )}
              {incubatorData &&
                incubatorData.map((incubator, index) => (
                  <Box
                    isSelected={
                      selected === "active" &&
                      selectedActiveIncubator === incubator.id
                    }
                    onClick={() => {
                      setSelected("active");
                      setSelectedActiveIncubator(incubator.id);
                      setSelectedIncubatorEarnings(
                        incubator.earnings
                          ?.toDecimalPlaces(4, Decimal.ROUND_DOWN)
                          .toString()
                      );
                    }}
                    key={index}
                    image={ITEM_DETAILS[incubator.name].image}
                  />
                ))}
            </div>
            <OuterPanel className="w-full flex-1">
              <div className="flex flex-col justify-center items-center p-2 ">
                <span className="text-center">Incubator</span>
                <img
                  src={ITEM_DETAILS[selected as IncubatorName].image}
                  className="h-16 img-highlight mt-1"
                  alt={selected}
                />
                {selected === "empty" && (
                  <>
                    <span className="text-center mt-2 text-sm">
                      {ITEM_DETAILS[selected as IncubatorName].description}
                    </span>
                    <Button
                      className="text-xs mt-1"
                      onClick={openIncubatorModal}
                    >
                      Incubate
                    </Button>
                  </>
                )}
                {selected === "active" && (
                  <>
                    <span className="text-center mt-2 text-sm">
                      {`#${selectedActiveIncubator}`}
                    </span>
                    <div className="border-t border-white w-full mt-2 pt-1">
                      <div className="flex justify-center items-end">
                        <img src={token} className="h-6 mr-1" />
                        <span className="text-xs text-center mt-2 mb-1">
                          {`${selectedIncubatorEarnings}`}
                        </span>
                      </div>
                    </div>
                    <Button className="text-xs mt-1" onClick={openUnloadModal}>
                      Remove
                    </Button>
                    <Button className="text-xs mt-1" onClick={openClaimModal}>
                      Claim
                    </Button>
                  </>
                )}
              </div>
            </OuterPanel>
          </div>

          {/* INCUBATION MODAL */}
          <Modal
            centered
            show={isIncubatorModalOpen}
            onHide={closeIncubatorModal}
          >
            <Panel className="md:w-4/5 m-auto">
              <div className="m-auto flex flex-col">
                <span className="text-sm text-center underline mt-2">
                  Select Tadpole
                </span>
                <div className="flex flex-wrap h-fit mb-2 mt-2">
                  {tadpoleData.map((tadpole, index) => {
                    return (
                      <Box
                        isSelected={selectedTadpole === tadpole.id}
                        onClick={() => {
                          setSelectedTadpole(tadpole.id);
                        }}
                        key={index}
                        image={ITEM_DETAILS[tadpole.health].image}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="m-auto flex flex-col">
                <span className="text-sm text-center underline">
                  Select Frog
                </span>
                <div className="flex flex-wrap h-fit mb-2 mt-2">
                  {frogData.map((frog, index) => {
                    return (
                      <Box
                        isSelected={selectedFrog === frog.edition}
                        onClick={() => {
                          setSelectedFrog(frog.edition);
                        }}
                        key={index}
                        image={frog.pixel_image}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-content-around p-1">
                <Button
                  className="text-xs"
                  onClick={() => {
                    send("INCUBATE", {
                      frogId: selectedFrog,
                      tadpoleId: selectedTadpole,
                    });

                    closeIncubatorModal();
                  }}
                >
                  Incubate
                </Button>
                <Button className="text-xs ml-2" onClick={closeIncubatorModal}>
                  Close
                </Button>
              </div>
            </Panel>
          </Modal>

          {/* UNLOAD MODAL */}
          <Modal centered show={isUnloadModalOpen} onHide={closeUnloadModal}>
            <Panel className="md:w-4/5 m-auto">
              <div className="m-auto flex flex-col">
                <span className="text-sm text-center">
                  Are you sure you want to <br className="hidden md:block" />
                  remove Incubator #{selectedActiveIncubator} and{" "}
                  <br className="hidden md:block" />
                  claim {selectedIncubatorEarnings} PD-WL?
                </span>
              </div>
              <div className="flex justify-content-around p-1">
                <Button
                  className="text-xs"
                  onClick={() => {
                    send("REMOVE", {
                      incubatorId: selectedActiveIncubator,
                    });
                    closeUnloadModal();
                  }}
                >
                  Yes
                </Button>
                <Button className="text-xs ml-2" onClick={closeUnloadModal}>
                  No
                </Button>
              </div>
            </Panel>
          </Modal>

          {/* CLAIM MODAL */}
          <Modal centered show={isClaimModalOpen} onHide={closeClaimModal}>
            <Panel className="md:w-4/5 m-auto">
              <div className="m-auto flex flex-col">
                <span className="text-sm text-center">
                  Are you sure you want to <br className="hidden md:block" />
                  claim your {selectedIncubatorEarnings} PD-WL tokens on
                  Incubator #{selectedActiveIncubator}?
                </span>
              </div>
              <div className="flex justify-content-around p-1">
                <Button
                  className="text-xs"
                  onClick={() => {
                    send("CLAIM", {
                      incubatorId: selectedActiveIncubator,
                    });
                    closeClaimModal();
                  }}
                >
                  Yes
                </Button>
                <Button className="text-xs ml-2" onClick={closeClaimModal}>
                  No
                </Button>
              </div>
            </Panel>
          </Modal>
        </>
      )}
    </>
  );
};
