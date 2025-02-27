import util from "util";
import Decimal from "decimal.js-light";
import { initialiseFont } from "./fonts";

// import { Amplify } from "aws-amplify";

export function initialise() {
  /**
   * Override the default stringify of Decimal.js for assist in debugging.
   */
  (Decimal.prototype as any)[util.inspect.custom] = Decimal.prototype.toString;

  /**
   * Decimal precision standard to handle ERC20 18 decimals + 12 decimal places reserved for in game actions
   */
  Decimal.set({ toExpPos: 30 });
  Decimal.set({ toExpNeg: -30 });

  initialiseFont();

  // Amplify.configure({
  //   Auth: {
  //     // region: "us-east-1",
  //     identityPoolId: "your-identity-pool-id", // Get from SST output
  //   },
  //   FaceLiveness: {
  //     region: "us-east-1",
  //     collectionId: "face-liveness-collection", // Get from SST output
  //   },
  // });
}
