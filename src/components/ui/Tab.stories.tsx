import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tab } from "./Tab";

export default {
  title: "UI/Tab",
  component: Tab,
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => <Tab {...args} />;

export const Default = Template.bind({});
Default.args = {};
