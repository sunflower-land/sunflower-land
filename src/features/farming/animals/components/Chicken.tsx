import { useActor } from "@xstate/react";
import { useContext } from "react";

import chicken from "assets/resources/chicken.png";
import { Context } from "features/game/GameProvider";

interface Props {
  chicken: IChicken;
  index: number;
}
export const Chicken: React.FC<Props> = ({ chicken, index }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const feed = () => {
    gameService.send("chicken.feed", {
      index,
    });
  };

  const collectEgg = () => {
    gameService.send("chicken.collectEgg", {
      index,
    });
  };

  return (
    <div>
      <img src={chicken} />
    </div>
  );
};
