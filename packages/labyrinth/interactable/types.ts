import * as Database from "@labyrinth/labyrinth/database";

export type T = Database.Node & {
  verify: (proof: string) => Promise<string | undefined>;
};
