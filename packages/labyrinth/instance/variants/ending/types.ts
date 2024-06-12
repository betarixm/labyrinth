import * as Database from "@labyrinth/labyrinth/database";

export type Instance = Omit<Database.Node, "id"> & {
  __html: string;
  relation: Relation;
};

export type Relation = {
  sourceNodeHash: string;
  targetNodeHash: string;
};
