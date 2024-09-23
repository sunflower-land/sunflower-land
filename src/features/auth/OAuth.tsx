import { Panel } from "components/ui/Panel";
import React from "react";
import { useParams } from "react-router-dom";

const getCode = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  return code;
};

export const OAuth: React.FC = () => {
  const code = getCode();
  const { name } = useParams();

  return <Panel>Name - {name}</Panel>;
};
