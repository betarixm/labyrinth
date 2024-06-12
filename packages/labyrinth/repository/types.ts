import * as Database from "@labyrinth/labyrinth/database";

export type T = {
  createNodes: (nodes: Database.NewNode[]) => Promise<Database.Node[]>;
  createEdges: (edges: Database.NewEdge[]) => Promise<Database.Edge[]>;
  findNode: (
    criteria: Partial<Database.Node>,
  ) => Promise<Database.Node | undefined>;
  findNodeOrThrow: (criteria: Partial<Database.Node>) => Promise<Database.Node>;
  findNodeById: (id: string) => Promise<Database.Node | undefined>;
  findNodeByIdOrThrow: (id: string) => Promise<Database.Node>;
  findNodeByHash: (hash: string) => Promise<Database.Node | undefined>;
  findNodeByHashOrThrow: (hash: string) => Promise<Database.Node>;
  findOutEdgesBySourceNodeId: (
    sourceNodeId: string,
  ) => Promise<Database.Edge[]>;
  firstNode: () => Promise<Database.Node | undefined>;
  firstNodeOrThrow: () => Promise<Database.Node>;
  closingNode: () => Promise<Database.Node | undefined>;
  closingNodeOrThrow: () => Promise<Database.Node>;
  nextNode: (
    sourceNodeId: string,
    proof: string,
  ) => Promise<Database.Node | undefined>;
  nextNodeOrThrow: (
    sourceNodeId: string,
    proof: string,
  ) => Promise<Database.Node>;
  allHashes: () => Promise<string[]>;
  allNodes: () => Promise<Database.Node[]>;
};
