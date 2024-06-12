import * as Database from "@labyrinth/labyrinth/database";

export type Instance = Omit<Database.Node, "id"> & {
  __html: string;
  relations: Relation[];
};

export type Relation = {
  sourceNodeHash: string;
  targetNodeHash: string;
  proof: string;
};
