import type { T } from "./types";
import type { SqlJsConfig } from "sql.js";

import { hashedNodeId } from "@labyrinth/labyrinth/sealing";
import { Kysely } from "kysely";
import { SqlJsDialect } from "kysely-sql-js";
import Papa from "papaparse";
import initSqlJs from "sql.js";
import z from "zod";

import { edgeSchema, nodeSchema } from "./schemas";

export const fromGoogleSpreadsheet = async (
  spreadsheetId: string,
  config?: SqlJsConfig,
) => {
  const nodesData = await fetch(
    googleSpreadsheetIdAsCsvUrl(spreadsheetId, "nodes"),
  ).then((response) => response.text());

  const edgesData = await fetch(
    googleSpreadsheetIdAsCsvUrl(spreadsheetId, "edges"),
  ).then((response) => response.text());

  return fromCsvStrings({ nodesData, edgesData }, config);
};

const googleSpreadsheetIdAsCsvUrl = (
  spreadsheetId: string,
  sheet: string | undefined,
) =>
  `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv${
    sheet ? `&sheet=${sheet}` : ""
  }`;

export const fromCsvStrings = async (
  csvStrings: {
    nodesData: string;
    edgesData: string;
  },
  config?: SqlJsConfig,
) => {
  const { nodesData, edgesData } = csvStrings;

  const { data: parsedNodes } = Papa.parse(nodesData, { header: true });

  const nodes = await Promise.all(
    z
      .array(nodeSchema)
      .parse(parsedNodes)
      .map(async (node) => ({
        ...node,
        hash: await hashedNodeId(node.id),
      })),
  );

  const { data: parsedEdges } = Papa.parse(edgesData, { header: true });
  const edges = z.array(edgeSchema).parse(parsedEdges);

  const database = await fromDefault(config);

  database.insertInto("node").values(nodes).execute();
  database.insertInto("edge").values(edges).execute();

  return database;
};

export const fromDefault = async (config?: SqlJsConfig) => {
  const { Database } = await initSqlJs(config);

  const sqlJs = new Database();
  sqlJs.exec("PRAGMA foreign_keys = ON;");

  const dialect = new SqlJsDialect({ sqlJs });
  const database = new Kysely<T>({ dialect });

  const nodeIdType = "varchar(255)";

  await database.schema
    .createTable("node")
    .addColumn("id", nodeIdType, (cb) => cb.primaryKey().notNull())
    .addColumn("body", "text", (cb) => cb.notNull())
    .addColumn("variant", "text", (cb) => cb.notNull())
    .addColumn("hash", "text", (cb) => cb.notNull().unique())
    .execute();

  await database.schema
    .createTable("edge")
    .addColumn("id", "integer", (cb) => cb.primaryKey().autoIncrement())
    .addColumn("sourceNodeId", nodeIdType, (cb) => cb.notNull())
    .addColumn("targetNodeId", nodeIdType, (cb) => cb.notNull())
    .addColumn("proof", "text", (cb) => cb.notNull())
    .addForeignKeyConstraint("sourceNodeForeign", ["sourceNodeId"], "node", [
      "id",
    ])
    .addForeignKeyConstraint("targetNodeForeign", ["targetNodeId"], "node", [
      "id",
    ])
    .addUniqueConstraint("uniqueEdgeByTargetNodeIdAndProof", [
      "targetNodeId",
      "proof",
    ])
    .execute();

  return database;
};
