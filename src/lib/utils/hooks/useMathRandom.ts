import { useState } from "react";

export const useMathRandom = () => {
  const [random] = useState(() => Math.random());

  return random;
};
