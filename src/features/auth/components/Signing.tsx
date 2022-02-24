import React from "react";

export const Signing: React.FC = () => {
  return (
    <>
      <span className="text-shadow loading">Signing you in</span>
      <span className="text-shadow block mt-4 sm:text-sm">
        Accept the signature request in your browser wallet to login.
      </span>
    </>
  );
};
