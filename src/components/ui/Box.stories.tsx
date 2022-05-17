import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Box } from "./Box";

export default {
  title: "UI/Box",
  component: Box,
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = (args) => <Box {...args} />;

export const Default = Template.bind({});
Default.args = {};
