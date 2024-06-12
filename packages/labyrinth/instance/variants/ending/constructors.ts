import type { Instance } from "./types";

import * as Database from "@labyrinth/labyrinth/database";
import * as Repository from "@labyrinth/labyrinth/repository";

export const fromNode = async (
  node: Database.Node,
  context: {
    repository: Repository.T;
    html: (node: Database.Node) => string;
  },
): Promise<Instance> => {
  const closingNode = await context.repository.closingNodeOrThrow();
  const { id, ...nodeWithoutId } = node;

  return {
    ...nodeWithoutId,
    __html: context.html(node),
    relation: {
      sourceNodeHash: node.hash,
      targetNodeHash: closingNode.hash,
    },
  };
};
