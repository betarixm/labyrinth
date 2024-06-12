import { Branch, Challenge, Ending, Closing } from "./variants";

export type T =
  | Branch.Instance
  | Challenge.Instance
  | Ending.Instance
  | Closing.Instance;
