import type { Instance, Relation } from "./types";

import * as Database from "@labyrinth/labyrinth/database";
import * as Repository from "@labyrinth/labyrinth/repository";
import { hashedNodeId } from "@labyrinth/labyrinth/sealing";

export const fromNode = async (
  node: Database.Node,
  context: {
    repository: Repository.T;
    html: (node: Database.Node) => string;
  },
): Promise<Instance> => {
  const { repository, html } = context;

  const edges = await repository.findOutEdgesBySourceNodeId(node.id);

  const relations = await Promise.all(edges.map(relationFromEdge));

  const { id, ...nodeWithoutId } = node;

  return {
    ...nodeWithoutId,
    __html: html(node),
    relations,
  };
};

const relationFromEdge = async (edge: Database.Edge): Promise<Relation> => ({
  sourceNodeHash: await hashedNodeId(edge.sourceNodeId),
  targetNodeHash: await hashedNodeId(edge.targetNodeId),
  proof: edge.proof,
});
