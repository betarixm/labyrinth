import * as Instance from "@labyrinth/labyrinth/instance";

export type T = {
  firstInstance: Promise<Instance.T | undefined>;
  allHashes: Promise<string[]>;
  instanceById: (id: string) => Promise<Instance.T | undefined>;
  instanceByHash: (hash: string) => Promise<Instance.T | undefined>;
};
