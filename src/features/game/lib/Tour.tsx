import React from "react";
import { Button } from "components/ui/Button";
import { StepType } from "@reactour/tour";
import { Panel } from "components/ui/Panel";

function tourStyles(base: any) {
  return {
    ...base,
    padding: 0,
    backgroundColor: "transparent",
  };
}

export const stepList: StepType[] = [
  {
    selector: "#first-sunflower",
    content: () => (
      <Panel>
        These sunflowers are ready for harvest. Click on one of the sunflowers.
      </Panel>
    ),
    padding: { mask: [60, 1] },
    styles: { popover: tourStyles },
  },
  {
    selector: "#open-inventory",
    content: () => (
      <Panel>
        You just harvested your first sunflower, open your inventory to see it.
      </Panel>
    ),
    position: "left",
    padding: { mask: [20, 25] },
    styles: { popover: tourStyles },
  },
  {
    selector: "#inventory",
    content: ({ setCurrentStep }) => (
      <Panel>
        All your items can be found in the inventory. You can select items to
        perform actions on your farm!
        <Button onClick={() => setCurrentStep(3)}>Next</Button>
      </Panel>
    ),
    styles: { popover: tourStyles },
  },
  {
    selector: "#open-shop",
    content: () => (
      <Panel>
        Next you will learn how to sell your crops and buy more seeds. Click on
        the shop.
      </Panel>
    ),
    position: "left",
    styles: { popover: tourStyles },
  },
  {
    selector: ".shop",
    content: () => (
      <Panel>
        Click on the sell tab to sell the Sunflower you just harvested.
      </Panel>
    ),
    styles: { popover: tourStyles },
  },
  {
    selector: ".shop",
    content: () => (
      <Panel>Select the sunflower and click on the `SELL 1` button.</Panel>
    ),
    styles: { popover: tourStyles },
  },
  {
    selector: ".shop",
    content: () => (
      <Panel>Now you can go back to the BUY tab and buy sunflower seeds.</Panel>
    ),
    position: "bottom",
    styles: { popover: tourStyles },
  },
  {
    selector: "#first-sunflower",
    content: () => (
      <Panel>
        You can now plant the seeds you bought! Click on an empty plot.
      </Panel>
    ),
    padding: { mask: [60, 1] },
    styles: { popover: tourStyles },
  },
  {
    selector: ".save",
    content: () => (
      <Panel>
        Now lets save your progress to the game server. Do not worry if you
        forget, the progress is automatically saved every 30 seconds!
      </Panel>
    ),
    styles: { popover: tourStyles },
  },
  {
    selector: ".open-menu",
    content: () => <Panel>Open the menu.</Panel>,
    styles: { popover: tourStyles },
  },
  {
    selector: "#menu",
    content: () => (
      <Panel>
        Now click on Sync on Chain, this will sync your farm to the Blockchain.
      </Panel>
    ),
    position: "bottom",
    padding: { mask: [1, 120], popover: [-30, 130] },
    styles: { popover: tourStyles },
  },
];
