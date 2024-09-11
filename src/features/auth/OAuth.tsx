import { Panel } from "components/ui/Panel";
import React from "react";

const getCode = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  return code;
};

export const OAuth: React.FC = () => {
  const code = getCode();

  return <Panel>Something went wrong - go back</Panel>;
};
