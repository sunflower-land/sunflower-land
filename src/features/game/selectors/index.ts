/**
 * Game State Selectors
 *
 * Centralized selectors for accessing game state with stable references.
 * Using selectors outside components prevents unnecessary re-renders.
 *
 * @see https://xstate.js.org/docs/packages/xstate-react/#useselector-actor-selector-compare-getsnapshot
 */

export * from "./inventory";
export * from "./bumpkin";
export * from "./buildings";
export * from "./resources";
export * from "./common";
