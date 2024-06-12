import { persistentAtom } from "@nanostores/persistent";

export const visitedInstances = persistentAtom<string[]>(
  "visitedInstances",
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const username = persistentAtom<string>("username", "");
