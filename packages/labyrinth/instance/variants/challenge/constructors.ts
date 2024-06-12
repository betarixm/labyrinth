import type { Relation, Instance } from "./types";

import * as Database from "@labyrinth/labyrinth/database";
import * as Repository from "@labyrinth/labyrinth/repository";
import {
  encryptedNodeIdByProof,
  hashedNodeId,
  proofAsToken,
} from "@labyrinth/labyrinth/sealing";

export const fromNode = async (
  node: Database.Node,
  context: {
    repository: Repository.T;
    html: (node: Database.Node) => string;
  },
): Promise<Instance> => {
  const { id, ...nodeWithoutId } = node;

  return {
    ...nodeWithoutId,
    __html: context.html(node),
    relations: await challengeEdgesFromSourceNodeId(node.id, context),
  };
};

const challengeEdgesFromSourceNodeId = async (
  nodeId: string,
  context: { repository: Repository.T },
): Promise<Relation[]> => {
  const { repository } = context;

  const outEdges = await repository.findOutEdgesBySourceNodeId(nodeId);

  return Promise.all(outEdges.map(relationFromEdge));
};

const relationFromEdge = async (edge: Database.Edge): Promise<Relation> => ({
  sourceNodeHash: await hashedNodeId(edge.sourceNodeId),
  encryptedTargetNodeId: await encryptedNodeIdByProof(
    edge.proof,
    edge.targetNodeId,
  ),
  token: await proofAsToken(edge.proof),
});
