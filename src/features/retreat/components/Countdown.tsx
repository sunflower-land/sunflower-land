import React from "react";

const TextDisplay: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex flex-col w-[10%] items-center stroke-slate-100 leading-none">
      <span className="font-timer text-white timer-text">{text}</span>
    </div>
  );
};

interface Props {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<Props> = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="relative w-full flex rounded-2xl items-center justify-center">
      <TextDisplay text={`${days}`} />
      <TextDisplay text={`:`} />
      <TextDisplay text={`${hours}`} />
      <TextDisplay text={`:`} />
      <TextDisplay text={`${minutes}`} />
      <TextDisplay text={`:`} />
      <TextDisplay text={`${Math.floor(seconds as number)}`} />
    </div>
  );
};
