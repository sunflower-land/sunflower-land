import React from "react";

interface Props {}

export const Signing: React.FC<Props> = () => {
  return (
    <>
      <span className="text-shadow loading">Waiting for you...</span>
      <span className="text-shadow block mt-4 text-sm">
        Accept the signature request in your browser wallet to login.
      </span>
    </>
  );
};
