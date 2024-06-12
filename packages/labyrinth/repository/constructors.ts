import type { T } from "./types";

import * as Database from "@labyrinth/labyrinth/database";
import { Kysely } from "kysely";
import { match } from "ts-pattern";

export const fromDatabase = (database: Kysely<Database.T>): T => {
  const createNodes = (nodes: Database.NewNode[]): Promise<Database.Node[]> =>
    database.insertInto("node").values(nodes).returningAll().execute();

  const findNodeByIdOrThrow = (id: string) => findNodeOrThrow({ id });

  const findNodeByHashOrThrow = (hash: string) => findNodeOrThrow({ hash });

  const findNodeOrThrow = (criteria: Partial<Database.Node>) =>
    findNode(criteria).then((node) =>
      match(node)
        .with(undefined, () => {
          throw new Error("Node not found");
        })
        .otherwise((node) => node),
    );

  const findNodeById = (id: string): Promise<Database.Node | undefined> =>
    findNode({ id });

  const findNodeByHash = (hash: string): Promise<Database.Node | undefined> =>
    findNode({ hash });

  const findNode = (
    criteria: Partial<Database.Node>,
  ): Promise<Database.Node | undefined> => {
    let query = database.selectFrom("node");

    if (criteria.id) {
      query = query.where("id", "=", criteria.id);
    }

    if (criteria.hash) {
      query = query.where("hash", "=", criteria.hash);
    }

    if (criteria.body) {
      query = query.where("body", "=", criteria.body);
    }

    if (criteria.variant) {
      query = query.where("variant", "=", criteria.variant);
    }

    return query.selectAll().executeTakeFirst();
  };

  const findOutEdgesBySourceNodeId = (
    sourceNodeId: string,
  ): Promise<Database.Edge[]> =>
    database
      .selectFrom("edge")
      .where("sourceNodeId", "=", sourceNodeId)
      .selectAll()
      .execute();

  const createEdges = (edges: Database.NewEdge[]): Promise<Database.Edge[]> =>
    database.insertInto("edge").values(edges).returningAll().execute();

  const firstNodeOrThrow = async (): Promise<Database.Node> => {
    const node = await firstNode();

    if (node === undefined) {
      throw new Error("No nodes found");
    }

    return node;
  };

  const firstNode = async (): Promise<Database.Node | undefined> => {
    const candidates = await database
      .selectFrom("node")
      .leftJoin("edge", "node.id", "edge.targetNodeId")
      .where("edge.targetNodeId", "is", null)
      .where("node.variant", "==", "challenge")
      .select(["node.id", "node.body", "node.hash", "node.variant"])
      .execute();

    if (candidates.length === 0 || candidates.length > 1) {
      return undefined;
    }

    const [firstNode] = candidates;

    return firstNode;
  };

  const closingNodeOrThrow = async (): Promise<Database.Node> =>
    closingNode().then((node) =>
      match(node)
        .with(undefined, () => {
          throw new Error("No closing node found");
        })
        .otherwise((node) => node),
    );

  const closingNode = async (): Promise<Database.Node | undefined> =>
    database
      .selectFrom("node")
      .where("variant", "=", "closing")
      .selectAll()
      .executeTakeFirst();

  const nextNodeOrThrow = (
    sourceNodeId: string,
    proof: string,
  ): Promise<Database.Node> =>
    nextNode(sourceNodeId, proof).then((node) =>
      match(node)
        .with(undefined, () => {
          throw new Error("No nodes found");
        })
        .otherwise((node) => node),
    );

  const nextNode = (
    sourceNodeId: string,
    proof: string,
  ): Promise<Database.Node | undefined> =>
    database
      .selectFrom("edge")
      .innerJoin("node", "edge.targetNodeId", "node.id")
      .select(["node.id", "node.body", "node.hash", "node.variant"])
      .where("edge.sourceNodeId", "=", sourceNodeId)
      .where("edge.proof", "=", proof)
      .executeTakeFirst();

  const allHashes = async (): Promise<string[]> => {
    const nodes = await database.selectFrom("node").select(["hash"]).execute();

    return nodes.map((node) => node.hash);
  };

  const allNodes = async (): Promise<Database.Node[]> =>
    database.selectFrom("node").selectAll().execute();

  return {
    createEdges,
    createNodes,
    findNode,
    findNodeOrThrow,
    findNodeById,
    findNodeByIdOrThrow,
    findNodeByHash,
    findNodeByHashOrThrow,
    findOutEdgesBySourceNodeId,
    firstNode,
    firstNodeOrThrow,
    closingNode,
    closingNodeOrThrow,
    nextNode,
    nextNodeOrThrow,
    allNodes,
    allHashes,
  };
};
