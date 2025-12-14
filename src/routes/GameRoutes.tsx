import React from "react";
import { Splash } from "features/auth/components";
import { Forbidden } from "features/auth/components/Forbidden";
import { Builder } from "features/builder/Builder";
import { EconomyDashboard } from "features/economyDashboard/EconomyDashboard";
import { FlowerDashboard } from "features/flowerDashboard/FlowerDashboard";
import { LandExpansion } from "features/game/expansion/LandExpansion";
import { INITIAL_FARM } from "features/game/lib/constants";
import { LedgerDashboardProfile } from "features/ledgerDashboard/LedgerDashboardProfile";
import { Marketplace } from "features/marketplace/Marketplace";
import { World } from "features/world/World";
import { CONFIG } from "lib/config";
import { hasFeatureAccess } from "lib/flags";
import { Route, Routes } from "react-router";

type GameRoutesProps = {
  isVisiting: boolean;
  onForbiddenClose: () => void;
};

export const GameRoutes: React.FC<GameRoutesProps> = ({
  isVisiting,
  onForbiddenClose,
}) => {
  return (
    <Routes>
      {/* Forbid entry to Goblin Village when in Visiting State show Forbidden screen */}
      {!isVisiting && (
        <Route
          path="/goblins"
          element={
            <Splash>
              <Forbidden onClose={() => onForbiddenClose()} />
            </Splash>
          }
        />
      )}
      <Route path="/world" element={<World key="world" />}>
        <Route
          path="marketplace/*"
          element={
            <div className="absolute inset-0 z-50">
              <Marketplace />
            </div>
          }
        />
        <Route path=":name" element={null} />
      </Route>
      <Route
        path="/community/:name"
        element={<World key="community" isCommunity />}
      />
      <Route path="/visit/*" element={<LandExpansion key="visit" />} />

      {CONFIG.NETWORK === "amoy" && (
        <Route path="/builder" element={<Builder key="builder" />} />
      )}
      {hasFeatureAccess(INITIAL_FARM, "LEDGER") && (
        <>
          <Route
            path="/ledger-dashboard/:id"
            element={<LedgerDashboardProfile key="ledger-dashboard" />}
          />
        </>
      )}
      {/* Internal flower-dashboard route with game contexts */}
      <Route path="/game/flower-dashboard" element={<FlowerDashboard />} />
      <Route path="/game/economy-dashboard" element={<EconomyDashboard />} />
      <Route path="*" element={<LandExpansion key="land" />} />
    </Routes>
  );
};
