import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import sflIcon from "assets/icons/flower_token.webp";
import tradeIcon from "assets/icons/trade.png";
import { MarketplaceProfile } from "features/game/types/marketplace";
import { Loading } from "features/auth/components";
import * as Auth from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { loadProfile } from "../actions/loadProfile";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { Sales } from "./PriceHistory";
import { AuthMachineState } from "features/auth/lib/authMachine";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const MarketplaceUser: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const token = useSelector(authService, _token);
  const navigate = useNavigate();

  const { id } = useParams();
  const { t } = useAppTranslation();

  const [profile, setProfile] = useState<MarketplaceProfile | undefined>(
    undefined,
  );

  useEffect(() => {
    loadProfile({
      token,
      id: Number(id),
    }).then(setProfile);
  }, [id, token]);

  if (Number(id) !== profile?.id) {
    return (
      <InnerPanel>
        <Loading />
      </InnerPanel>
    );
  }

  return (
    <div className="overflow-y-scroll scrollable pr-1">
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/3 pr-1 mb-1">
          <InnerPanel className="flex items-center h-full">
            <div className="h-16 w-16 flex items-center justify-center mr-2 relative">
              <NPCIcon
                parts={interpretTokenUri(profile.tokenUri).equipped}
                width={60}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <Label type="default" className="mb-0.5">
                {`Lvl. ${profile.level}`}
              </Label>
              <p className="text-sm truncate">{profile.username}</p>
            </div>
          </InnerPanel>
        </div>

        <div className="w-full sm:w-1/3 pr-1 mb-1">
          <InnerPanel className="flex items-center h-full">
            <div className="h-16 w-16 flex items-center justify-center mr-2">
              <img src={tradeIcon} className="h-12" />
            </div>
            <div>
              <Label type="default" className="mb-0.5">
                {`Total Trades`}
              </Label>
              <p className="text-sm">{profile.totalTrades}</p>
            </div>
          </InnerPanel>
        </div>

        <div className="w-full sm:w-1/3 mb-1">
          <InnerPanel className="flex items-center h-full">
            <div className="h-16 w-16 flex items-center justify-center mr-2">
              <img src={sflIcon} className="h-12" />
            </div>
            <div>
              <Label type="default" className="mb-0.5">
                {`FLOWER Traded (last 7 days)`}
              </Label>
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="">{`Spent:`}</span>
                    <span className="font-bold text-red-600">
                      {profile.weeklyFlowerSpent.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="">{`Earned:`}</span>
                    <span className="font-bold text-green-700">
                      {profile.weeklyFlowerEarned.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </InnerPanel>
        </div>
      </div>

      <InnerPanel className="mb-1">
        <Label type="default" icon={tradeIcon} className="ml-2">
          {t("marketplace.topFriends")}
        </Label>
        <div className="flex flex-wrap">
          {profile.friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center w-full sm:w-1/3 pr-4 cursor-pointer"
              onClick={() => {
                navigate(`/marketplace/profile/${friend.id}`);
              }}
            >
              <div className="h-16 w-16 flex items-center justify-center relative">
                <NPCIcon parts={interpretTokenUri(friend.tokenUri).equipped} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate">{friend.username}</p>
                <p className="text-xs">{`${friend.trades} trades`}</p>
              </div>
            </div>
          ))}
        </div>
      </InnerPanel>

      <InnerPanel>
        <Sales sales={profile.trades ?? []} />
      </InnerPanel>
    </div>
  );
};
