import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { getBumpkinLevel } from "features/game/lib/level";
import { Equipped } from "features/game/types/bumpkin";
import React from "react";

interface Props {
  bumpkinId: number;
  accountId: number;
  wearables: Equipped;
  experience: number;
  onVisit: (id: number) => void;
}

export const BumpkinPreview: React.FC<Props> = ({
  accountId,
  bumpkinId,
  experience,
  wearables,
  onVisit,
}) => {
  return (
    <Panel>
      <div className="flex sm:flex-row flex-col">
        <DynamicNFT bumpkinParts={wearables} />
        <div>
          <span className="mb-2">{`#${bumpkinId}`}</span>
          <span className="">{`Lvl ${getBumpkinLevel(experience)}`}</span>
          <Button
            className="text-sm"
            onClick={() => onVisit(accountId)}
          >{`Visit Island: ${accountId}`}</Button>
        </div>
      </div>
    </Panel>
  );
};
