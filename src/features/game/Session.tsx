import React from "react";

import { Routes, Route, HashRouter } from "react-router-dom";

import { Humans } from "./Humans";
import { Goblins } from "./Goblins";

export const Session: React.FC = () => {
  // Switch between humans and goblins using react router

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Humans />} />
        <Route path="/humans" element={<Humans />} />
        <Route path="/goblins" element={<Goblins />} />
      </Routes>
    </HashRouter>
  );
};
