import * as Database from "@labyrinth/labyrinth/database";
import { hashedNodeId } from "@labyrinth/labyrinth/sealing";
import { expect, it, describe, mock } from "bun:test";

const nodesData = `id,body,variant
1,foo,challenge
2,bar,branch
3,baz,ending`;

const edgesData = `sourceNodeId,targetNodeId,proof
1,2,a`;

describe("database", async () => {
  const database = mock(async () => {
    const database = await Database.fromDefault();

    database
      .insertInto("node")
      .values([
        {
          id: "1",
          body: "foo",
          hash: "hash1",
          variant: "branch",
        },
        {
          id: "2",
          body: "bar",
          hash: "hash2",
          variant: "challenge",
        },
        {
          id: "3",
          body: "baz",
          hash: "hash3",
          variant: "ending",
        },
      ])
      .execute();

    return database;
  });

  it("should be able to be created from csv strings", async () => {
    const database = await Database.fromCsvStrings({
      nodesData: nodesData,
      edgesData: edgesData,
    });

    const nodes = await database
      .selectFrom("node")
      .select(["id", "body", "hash"])
      .execute();
    const edges = await database.selectFrom("edge").selectAll().execute();

    expect(nodes).toEqual([
      {
        id: "1",
        body: "foo",
        hash: await hashedNodeId("1"),
      },
      {
        id: "2",
        body: "bar",
        hash: await hashedNodeId("2"),
      },
      {
        id: "3",
        body: "baz",
        hash: await hashedNodeId("3"),
      },
    ]);

    expect(edges).toEqual([
      {
        id: 1,
        sourceNodeId: "1",
        targetNodeId: "2",
        proof: "a",
      },
    ]);
  });

  it("should ensure foreign key constraint of edge", async () => {
    const db = await database();

    expect(
      db
        .insertInto("edge")
        .values([
          {
            sourceNodeId: "1",
            targetNodeId: "4",
            proof: "a",
          },
        ])
        .execute(),
    ).rejects.toThrowError();
  });

  it("should ensure unique constraint of edge in terms of `targetNodeId` and `proof`", async () => {
    const db = await database();

    expect(
      db
        .insertInto("edge")
        .values([
          {
            sourceNodeId: "1",
            targetNodeId: "2",
            proof: "a",
          },
          {
            sourceNodeId: "1",
            targetNodeId: "2",
            proof: "a",
          },
        ])
        .execute(),
    ).rejects.toThrowError();
  });

  it("allows same route with different proofs", async () => {
    const db = await database();

    const edges = await db
      .insertInto("edge")
      .values([
        {
          sourceNodeId: "1",
          targetNodeId: "2",
          proof: "a",
        },
        {
          sourceNodeId: "1",
          targetNodeId: "2",
          proof: "b",
        },
      ])
      .returningAll()
      .execute();

    expect(edges).toEqual([
      {
        id: 1,
        sourceNodeId: "1",
        targetNodeId: "2",
        proof: "a",
      },
      {
        id: 2,
        sourceNodeId: "1",
        targetNodeId: "2",
        proof: "b",
      },
    ]);
  });
});
