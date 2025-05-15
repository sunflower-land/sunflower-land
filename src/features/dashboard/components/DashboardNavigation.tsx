import React, { useContext, useEffect, useState } from "react";

import { Route, Routes } from "react-router";

import { Context } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { DashboardHome } from "./DashboardHome";

export const DashboardNavigation: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { openModal } = useContext(ModalContext);

  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { t } = useTranslation();

  const { gameService } = useContext(Context);

  return (
    <>
      <div className="flex h-[calc(100%-50px)] lg:h-full">
        <div className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/hot" element={<div />} />

            {/* catch all other routes */}
            <Route path="*" element={<DashboardHome />} />

            {/* default to home */}
            <Route path="/" element={<DashboardHome />} />
          </Routes>
        </div>
      </div>
    </>
  );
};
