import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Panel } from "./Panel";

export default {
  title: "UI/Panel",
  component: Panel,
} as ComponentMeta<typeof Panel>;

const Template: ComponentStory<typeof Panel> = (args) => <Panel {...args} />;

export const Default = Template.bind({});
Default.args = {};
