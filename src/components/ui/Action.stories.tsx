import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Action } from "./Action";

export default {
  title: "UI/Action",
  component: Action,
} as ComponentMeta<typeof Action>;

const Template: ComponentStory<typeof Action> = (args) => <Action {...args} />;

export const Default = Template.bind({});
Default.args = {};
