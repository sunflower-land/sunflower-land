import * as React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AudioPlayer } from "./AudioPlayer";

export default {
  title: "UI/AudioPlayer",
  component: AudioPlayer,
} as ComponentMeta<typeof AudioPlayer>;

const Template: ComponentStory<typeof AudioPlayer> = (args) => (
  <AudioPlayer {...args} />
);

export const Default = Template.bind({});
Default.args = {};
