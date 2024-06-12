import type { T } from "./types";

import { Branch, Challenge, Ending, Closing } from "./variants";

export const isBranch = (
  instance: Pick<T, "variant">,
): instance is Branch.Instance => instance.variant === "branch";

export const isChallenge = (
  instance: Pick<T, "variant">,
): instance is Challenge.Instance => instance.variant === "challenge";

export const isEnding = (
  instance: Pick<T, "variant">,
): instance is Ending.Instance => instance.variant === "ending";

export const isClosing = (
  instance: Pick<T, "variant">,
): instance is Closing.Instance => instance.variant === "closing";
