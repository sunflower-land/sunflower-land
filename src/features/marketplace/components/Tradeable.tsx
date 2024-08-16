import { Loading } from "features/auth/components";
import {
  CollectionName,
  Tradeable as ITradeable,
} from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useParams } from "react-router-dom";
import { loadTradeable } from "../actions/loadTradeable";

export const Tradeable: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { collection, id } = useParams<{
    collection: CollectionName;
    id: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [tradeable, setTradeable] = useState<ITradeable>();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const data = await loadTradeable({
        type: collection as CollectionName,
        id: Number(id),
        token: authState.context.user.rawToken as string,
      });

      setTradeable(data);
      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <div>{JSON.stringify(tradeable, null, 2)}</div>;
};
