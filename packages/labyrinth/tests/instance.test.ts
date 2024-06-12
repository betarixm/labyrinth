import * as Database from "@labyrinth/labyrinth/database";
import * as Instance from "@labyrinth/labyrinth/instance";
import * as Interactable from "@labyrinth/labyrinth/interactable";
import * as Repository from "@labyrinth/labyrinth/repository";
import { hashedNodeId } from "@labyrinth/labyrinth/sealing";
import { expect, it, describe } from "bun:test";
import { Challenge } from "instance/variants";

describe("instance", async () => {
  const nodesData = `id,body,variant
1,foo,challenge
2,bar,branch
3,baz,ending`;

  const edgesData = `sourceNodeId,targetNodeId,proof
1,2,a
1,3,b
2,3,c`;

  const database = await Database.fromCsvStrings({
    nodesData,
    edgesData,
  });

  const repository = Repository.fromDatabase(database);

  const node = await repository.findNodeById("1");

  if (node === undefined) {
    throw new Error("Node not found");
  }

  const instance = (await Instance.fromNode(node, {
    repository,
  })) as Challenge.Instance;

  const branchNode = await repository.findNodeById("2");

  if (branchNode === undefined) {
    throw new Error("Node not found");
  }

  const branch = await Instance.fromNode(branchNode, {
    repository,
  });

  it("should verify correct proofs on a challenge node", async () => {
    const interactable = Interactable.fromInstance(instance);

    expect(await interactable.verify("a")).toEqual(await hashedNodeId("2"));
    expect(await interactable.verify("b")).toEqual(await hashedNodeId("3"));
  });

  it("should verify correct proofs on a branch node", async () => {
    const interactable = Interactable.fromInstance(branch);

    expect(await interactable.verify("c")).toEqual(await hashedNodeId("3"));
  });

  it("should not verify invalid proofs", async () => {
    const interactable = Interactable.fromInstance(instance);

    expect(await interactable.verify("c")).toBeUndefined();
  });

  it("should not verified by its token", async () => {
    const interactable = Interactable.fromInstance(instance);

    expect(instance.relations.length).toBeGreaterThan(0);

    instance.relations.forEach(async (relation) => {
      expect(await interactable.verify(relation.token)).toBeUndefined();
    });
  });
});
