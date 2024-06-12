import type { Node as NodeType } from "@labyrinth/labyrinth/database/types";

import { Database, Engine } from "@labyrinth/labyrinth";
import { marked } from "marked";

const html = (node: NodeType) =>
  marked.parse(node.body, {
    async: false,
  }) as string;

const database = await Database.fromGoogleSpreadsheet(
  import.meta.env.SOURCE_GOOGLE_SPREADSHEET_ID,
);

export const engine = Engine.fromDatabase(database, { html });
