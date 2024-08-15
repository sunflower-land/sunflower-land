import { Loading } from "features/auth/components";
import {
  Collection as ICollection,
  CollectionName,
} from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import { loadCollection } from "../actions/loadCollection";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import { ListViewCard } from "./ListViewCard";
import { OPEN_SEA_COLLECTIBLES } from "metadata/metadata";

interface Props {
  type: CollectionName;
}
export const Collection: React.FC<Props> = ({ type }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<ICollection>();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const data = await loadCollection({
        type,
        token: authState.context.user.rawToken as string,
      });

      setCollection(data);
      setIsLoading(false);
    };

    load();
  }, [type]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-wrap">
      {collection?.items.map((item) => (
        <ListViewCard
          name={item.name}
          hasBoost
          price={new Decimal(25)}
          image={OPEN_SEA_COLLECTIBLES[item].image}
          supply={item.supply}
          key={item.id}
          onClick={() => {
            navigate(`/marketplace/${type}/${item.id}`);
          }}
        />
      ))}
    </div>
  );
};
