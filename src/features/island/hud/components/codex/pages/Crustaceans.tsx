import React, { useState, useEffect } from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { CrustaceanName, CRUSTACEANS } from "features/game/types/crustaceans";
import { Detail } from "../components/Detail";
import { GameState } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  loadCrustaceanChums,
  CrustaceanChumMapping,
} from "../actions/loadCrustaceanChums";
import { useAuth } from "features/auth/lib/Provider";

type Props = {
  state: GameState;
};

const ALL_CRUSTACEANS = getKeys(CRUSTACEANS);

export const Crustaceans: React.FC<Props> = ({ state }) => {
  const { t } = useAppTranslation();
  const { authState } = useAuth();
  const [selectedCrustacean, setSelectedCrustacean] = useState<
    CrustaceanName | undefined
  >();
  const [chumMapping, setChumMapping] = useState<CrustaceanChumMapping | null>(
    null,
  );

  const { farmActivity } = state;

  useEffect(() => {
    const caught = ALL_CRUSTACEANS.filter(
      (name) => (farmActivity[`${name} Caught`] ?? 0) > 0,
    );

    loadCrustaceanChums(authState.context.user.rawToken!, caught).then(
      setChumMapping,
    );
  }, [farmActivity, authState.context.user.rawToken]);

  if (selectedCrustacean) {
    const hasCaught = (farmActivity[`${selectedCrustacean} Caught`] ?? 0) > 0;
    const crustaceanInfo = chumMapping?.[selectedCrustacean];
    const chums = crustaceanInfo?.chums ?? [];

    return (
      <Detail
        name={selectedCrustacean}
        caught={hasCaught}
        onBack={() => setSelectedCrustacean(undefined)}
        additionalLabels={
          <div>
            <div className="flex flex-wrap items-center mb-2">
              <Label
                type="default"
                className="px-0.5 text-xxs mb-1"
                icon={
                  crustaceanInfo
                    ? ITEM_DETAILS[crustaceanInfo.waterTrap].image
                    : ITEM_DETAILS["Crab Pot"].image
                }
              >
                {`${farmActivity[`${selectedCrustacean} Caught`] ?? 0} Caught`}
              </Label>
            </div>
            {crustaceanInfo && (
              <div className="flex flex-wrap items-center mb-2">
                <Label
                  type="chill"
                  className="px-0.5 text-xxs whitespace-nowrap mr-4 mb-1"
                  icon={ITEM_DETAILS[crustaceanInfo.waterTrap].image}
                  secondaryIcon={SUNNYSIDE.icons.heart}
                >
                  {crustaceanInfo.waterTrap}
                </Label>
              </div>
            )}
            {hasCaught && chums.length > 0 && (
              <div className="flex flex-wrap items-center">
                {chums.map((chum) => (
                  <Label
                    key={chum}
                    type="chill"
                    className="px-0.5 text-xxs whitespace-nowrap mr-4 mb-1"
                    icon={ITEM_DETAILS[chum].image}
                    secondaryIcon={SUNNYSIDE.icons.heart}
                  >
                    {chum}
                  </Label>
                ))}
              </div>
            )}
          </div>
        }
        state={state}
      />
    );
  }

  return (
    <div
      className={classNames(
        "flex flex-col h-full overflow-y-auto scrollable pr-1",
      )}
    >
      <InnerPanel>
        <div className="flex flex-col">
          <div className="flex flex-col mb-2">
            <Label
              type="default"
              className="capitalize ml-3"
              icon={SUNNYSIDE.crustaceans.blueCrab}
            >
              {t("crustaceans")}
            </Label>
            <div className="flex flex-wrap">
              {ALL_CRUSTACEANS.map((name) => (
                <SimpleBox
                  silhouette={!farmActivity[`${name} Caught`]}
                  onClick={() => setSelectedCrustacean(name)}
                  key={name}
                  inventoryCount={state.inventory[name]?.toNumber()}
                  image={ITEM_DETAILS[name].image}
                />
              ))}
            </div>
          </div>
        </div>
      </InnerPanel>
    </div>
  );
};
