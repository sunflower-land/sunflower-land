import classNames from "classnames";
import React, { useState } from "react";

type Props = {
  image: string;
  onAnswer: (answer: string) => void;
};

const SQUARES = 24;

export const Captcha: React.FC<Props> = ({ image, onAnswer }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const finish = (indexes: number[]) => {
    const code = indexes.join("_");

    console.log({ code });
    onAnswer(code);
  };

  const toggle = (index: number) => {
    if (selected.includes(index)) {
      setSelected((prev) => prev.filter((num) => num !== index));
    } else {
      const indexes = [...selected, index];
      setSelected(indexes);

      console.log({ indexes });
      if (indexes.length >= 3) {
        console.log({ indexes });
        finish(indexes);
      }
    }
  };

  console.log({ selected });

  // The captcha image has some extra border padding of 4px
  const widthOffset = (8 / 104) * 100;
  const heightOffset = (8 / 72) * 100;

  return (
    <div className="w-full">
      <span className="text-base my-2">Click on the Goblins to proceed.</span>

      <div className="relative w-full">
        <img src={image} className="w-full" />
        <div
          className="absolute h-full flex flex-wrap"
          style={{
            width: `${100 - widthOffset}%`,
            height: `${100 - heightOffset}%`,
            left: `${widthOffset / 2}%`,
            top: `${heightOffset / 2}%`,
          }}
        >
          {new Array(SQUARES).fill(null).map((_, index) => (
            <div
              className={classNames(
                "border opacity-5 bg-slate-50 cursor-pointer ",
                {
                  "opacity-80": selected.includes(index),
                  "hover:opacity-20": !selected.includes(index),
                }
              )}
              style={{ width: "16.66%", height: "25%" }}
              onClick={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
