import type { T } from "./types";

import * as Database from "@labyrinth/labyrinth/database";
import * as Repository from "@labyrinth/labyrinth/repository";
import { marked } from "marked";
import { match } from "ts-pattern";

import * as BranchNode from "./variants/branch";
import * as ChallengeNode from "./variants/challenge";
import * as ClosingNode from "./variants/closing";
import * as EndingNode from "./variants/ending";

export const fromNode = (
  node: Database.Node,
  context: {
    repository: Repository.T;
    html?: (node: Database.Node) => string;
  },
): Promise<T> => {
  const { html = defaultHtml, ...partialContext } = context;

  const constructor = match(node.variant)
    .with("branch", () => BranchNode.fromNode)
    .with("challenge", () => ChallengeNode.fromNode)
    .with("ending", () => EndingNode.fromNode)
    .with("closing", () => ClosingNode.fromNode)
    .exhaustive();

  return constructor(node, { ...partialContext, html });
};

const defaultHtml = (node: Database.Node): string =>
  marked.parse(node.body, {
    async: false,
  }) as string;
