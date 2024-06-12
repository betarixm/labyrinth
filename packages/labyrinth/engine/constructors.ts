import type { T } from "./types";
import type { Kysely } from "kysely";

import * as Database from "@labyrinth/labyrinth/database";
import * as Instance from "@labyrinth/labyrinth/instance";
import * as Repository from "@labyrinth/labyrinth/repository";
import { marked } from "marked";

export const fromDatabase = (
  database: Kysely<Database.T>,
  context: {
    html?: (node: Database.Node) => string;
  },
): T => {
  const repository = Repository.fromDatabase(database);
  return fromRepository(repository, context);
};

export const fromRepository = (
  repository: Repository.T,
  context: {
    html?: (node: Database.Node) => string;
  },
): T => {
  const { html = defaultHtml, ...restContext } = context;

  const firstInstance: Promise<Instance.T | undefined> = repository
    .firstNodeOrThrow()
    .then((node) =>
      Instance.fromNode(node, { ...restContext, repository, html }),
    )
    .catch(() => undefined);

  const allHashes: Promise<string[]> = repository.allHashes();

  const instanceById = (id: string): Promise<Instance.T | undefined> =>
    repository
      .findNodeByIdOrThrow(id)
      .then((node) =>
        Instance.fromNode(node, { ...restContext, repository, html }),
      )
      .catch(() => undefined);

  const instanceByHash = (hash: string): Promise<Instance.T | undefined> =>
    repository
      .findNodeByHashOrThrow(hash)
      .then((node) =>
        Instance.fromNode(node, { ...restContext, repository, html }),
      )
      .catch(() => undefined);

  return {
    firstInstance,
    allHashes,
    instanceById,
    instanceByHash,
  };
};

const defaultHtml = (node: Database.Node): string =>
  marked.parse(node.body, {
    async: false,
  }) as string;
