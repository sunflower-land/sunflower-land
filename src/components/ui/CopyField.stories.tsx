import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CopyField } from "./CopyField";

export default {
  title: "UI/CopyField",
  component: CopyField,
} as ComponentMeta<typeof CopyField>;

const Template: ComponentStory<typeof CopyField> = (args) => (
  <CopyField {...args} />
);

export const Default = Template.bind({});
Default.args = {};
