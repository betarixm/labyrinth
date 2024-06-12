import * as Database from "@labyrinth/labyrinth/database";
import * as Instance from "@labyrinth/labyrinth/instance";
import * as Repository from "@labyrinth/labyrinth/repository";
import { expect, it, describe, mock } from "bun:test";

const nodesData = `id,body,variant
1,foo,challenge
2,bar,branch
3,baz,ending`;

const edgesData = `sourceNodeId,targetNodeId,proof
1,2,a
1,3,b`;

describe("node", async () => {
  const repository = mock(async () => {
    const database = await Database.fromCsvStrings({
      nodesData,
      edgesData,
    });

    return Repository.fromDatabase(database);
  });

  it("should be able to be created from a database node", async () => {
    const r = await repository();
    const node = await r.findNodeById("1");

    if (node === undefined) {
      throw new Error("Node not found");
    }

    const instance = await Instance.fromNode(node, {
      repository: r,
    });

    expect(instance).toMatchObject({
      __html: "<p>foo</p>\n",
      body: "foo",
      hash: "c2d877e84ee105aef1f72297b45597efe6f7f6a3f5927065a653f1a83d2b3b7f",
      variant: "challenge",
      relations: [
        {
          sourceNodeHash:
            "c2d877e84ee105aef1f72297b45597efe6f7f6a3f5927065a653f1a83d2b3b7f",
          encryptedTargetNodeId:
            "63824bbc1e1247662a54b8ba0c647440840419f03ed78723b387c20401ede4a2c7fa633358c533abffc2e85f42052927a7aff2308810d4068cf3bb8d6e920706fd33c1ee42ab704ab3be3fabb1c6d467",
          token:
            "770a0568c26b34fc1b59f6f5ea6813b2aa27053b6215b1478de312466347ed96",
        },
        {
          sourceNodeHash:
            "c2d877e84ee105aef1f72297b45597efe6f7f6a3f5927065a653f1a83d2b3b7f",
          encryptedTargetNodeId:
            "09b4a7edcf4a52e2a59592227d4b49f43102c4d5a4c84c4159cd8efe619885249d4c04dca12f853f98cc3cbb0ccbbd8d6d742e4684326b2493fc5294fce21927f2791a6b5d2770c415db89506420a49d",
          token:
            "d0883ffc61600d0408bcad00f39c3b6128cfb4c8c4dfa4ff9aee57a9b5fd265e",
        },
      ],
    });
  });
});
