import React, { useState } from "react";

import { IntroPage } from "./Intro";
import { ExpandingRoom } from "../ExpandingRoom";
import { ResultPage } from "./Result";
import { Experiment } from "./Experiment";

export const PotionHouse: React.FC = () => {
  const [page, setPage] = useState<"intro" | "game" | "result">("intro");
  const [score, setScore] = useState(0);

  return (
    <>
      <ExpandingRoom roomName="Potion Room">
        <div className="flex flex-col grow mb-1">
          {page === "intro" && <IntroPage onComplete={() => setPage("game")} />}
          {page === "game" && (
            <Experiment
              score={score}
              onScoreChange={setScore}
              onComplete={() => setPage("result")}
            />
          )}
          {page === "result" && <ResultPage score={score} />}
        </div>
      </ExpandingRoom>
    </>
  );
};
