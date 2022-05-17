import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { HealthBar } from "./HealthBar";

export default {
  title: "UI/HealthBar",
  component: HealthBar,
} as ComponentMeta<typeof HealthBar>;

const Template: ComponentStory<typeof HealthBar> = (args) => (
  <HealthBar {...args} />
);

export const Default = Template.bind({});
Default.args = {};
