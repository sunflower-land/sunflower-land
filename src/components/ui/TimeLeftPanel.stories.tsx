import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TimeLeftPanel } from "./TimeLeftPanel";

export default {
  title: "UI/TimeLeftPanel",
  component: TimeLeftPanel,
} as ComponentMeta<typeof TimeLeftPanel>;

const Template: ComponentStory<typeof TimeLeftPanel> = (args) => (
  <TimeLeftPanel {...args} />
);

export const Default = Template.bind({});
Default.args = {};
