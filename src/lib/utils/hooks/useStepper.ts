import { useState } from "react";

export const useStepper = (props: {
  initial: number;
  step: number;
  min: number;
  max: number;
}) => {
  const [value, setValue] = useState<number>(
    Math.min(Math.max(props.initial, props.min), props.max)
  );

  const decrease = () => {
    setValue(Math.max(value - props.step, props.min));
  };

  const increase = () => {
    setValue(Math.min(value + props.step, props.max));
  };

  return {
    decrease,
    increase,
    value,
  };
};
