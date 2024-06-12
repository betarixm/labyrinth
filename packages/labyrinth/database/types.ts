import type { edgeSchema, nodeSchema } from "./schemas";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";

import z from "zod";

export interface T {
  node: NodeTable;
  edge: EdgeTable;
}

export type EdgeTable = z.infer<typeof edgeSchema> & {
  id: Generated<number>;
};

export type Edge = Selectable<EdgeTable>;
export type NewEdge = Insertable<EdgeTable>;
export type EdgeUpdate = Updateable<EdgeTable>;

export type NodeTable = z.infer<typeof nodeSchema> & {
  hash: string;
};

export type Node = Selectable<NodeTable>;
export type NewNode = Insertable<NodeTable>;
export type NodeUpdate = Updateable<NodeTable>;
