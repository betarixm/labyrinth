import * as Database from "@labyrinth/labyrinth/database";
import * as Repository from "@labyrinth/labyrinth/repository";
import { hashedNodeId } from "@labyrinth/labyrinth/sealing";
import { expect, it, describe, mock } from "bun:test";

describe("repository", async () => {
  const repository = mock(async () => {
    const database = await Database.fromDefault();

    database
      .insertInto("node")
      .values([
        {
          id: "1",
          body: "foo",
          hash: await hashedNodeId("1"),
          variant: "challenge",
        },
        {
          id: "2",
          body: "bar",
          hash: await hashedNodeId("2"),
          variant: "branch",
        },
        {
          id: "3",
          body: "baz",
          hash: await hashedNodeId("3"),
          variant: "ending",
        },
      ])
      .execute();

    return Repository.fromDatabase(database);
  });

  it("should be able to create nodes", async () => {
    const r = await repository();
    const nodes = await r.createNodes([
      {
        id: "1337",
        body: "foo",
        hash: await hashedNodeId("1337"),
        variant: "challenge",
      },
    ]);

    expect(nodes).toEqual([
      {
        id: "1337",
        body: "foo",
        hash: await hashedNodeId("1337"),
        variant: "challenge",
      },
    ]);
  });

  it("should be able to create edges", async () => {
    const r = await repository();
    const edges = await r.createEdges([
      {
        sourceNodeId: "1",
        targetNodeId: "2",
        proof: "a",
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

  it("should be able to find a first node", async () => {
    const r = await repository();

    r.createEdges([
      {
        sourceNodeId: "1",
        targetNodeId: "2",
        proof: "a",
      },
      {
        sourceNodeId: "1",
        targetNodeId: "3",
        proof: "b",
      },
    ]);

    const firstNode = await r.firstNode();

    expect(firstNode).toEqual({
      id: "1",
      body: "foo",
      hash: await hashedNodeId("1"),
      variant: "challenge",
    });
  });
});
