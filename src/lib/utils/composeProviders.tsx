import React from "react";

type ProviderWithProps = readonly [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<any>,
  Record<string, unknown>?,
];

export const composeProviders = (
  providers: readonly ProviderWithProps[],
): React.FC<{ children: React.ReactNode }> => {
  return ({ children }) =>
    providers.reduceRight<React.ReactNode>(
      (acc, [Provider, props = {}]) => <Provider {...props}>{acc}</Provider>,
      children,
    );
};
