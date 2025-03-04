import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import sflIcon from "assets/icons/sfl.webp";
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

const _rawToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const MarketplaceUser: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const rawToken = useSelector(authService, _rawToken);
  const navigate = useNavigate();

  const { id } = useParams();

  const { t } = useAppTranslation();

  const [profile, setProfile] = useState<MarketplaceProfile>();

  useEffect(() => {
    setProfile(undefined);
    loadProfile({
      token: rawToken,
      id: Number(id),
    }).then(setProfile);
  }, [id]);

  if (!profile) {
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
          <InnerPanel className="flex items-center">
            <div className="h-16 w-16 flex items-center justify-center mr-2 relative">
              <NPCIcon parts={interpretTokenUri(profile.tokenUri).equipped} />
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
          <InnerPanel className="flex items-center">
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
          <InnerPanel className="flex items-center">
            <div className="h-16 w-16 flex items-center justify-center mr-2">
              <img src={sflIcon} className="h-12" />
            </div>
            <div>
              <Label type="default" className="mb-0.5">
                {`SFL Traded`}
              </Label>
              <p className="text-sm">{profile.profit}</p>
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
