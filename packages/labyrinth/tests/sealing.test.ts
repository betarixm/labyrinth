import * as Sealing from "@labyrinth/labyrinth/sealing";
import { expect, it, describe } from "bun:test";

describe("sealing", async () => {
  it("should be able to hash a node id", async () => {
    const hash = await Sealing.hashedNodeId("1");

    expect(hash).toEqual(
      "c2d877e84ee105aef1f72297b45597efe6f7f6a3f5927065a653f1a83d2b3b7f",
    );
  });

  it("should be able to encrypt node id by proof", async () => {
    const encrypted = await Sealing.encryptedNodeIdByProof("proof", "1");

    expect(encrypted).toEqual(
      "0670636ad992dd3ba8b3295c6abe7f88c6d5da68ca1671de98217e12d27429f7ae60b03756cfed1cda66470c3055959f03117c90ac81275ca695e0c177b21c934ef59bba8122f5d61b847d3665ac80bd",
    );
  });

  it("should be able to decrypt encrypted node id", async () => {
    const decrypted = await Sealing.hashedNodeIdFromEncryptedNodeId(
      "proof",
      "0670636ad992dd3ba8b3295c6abe7f88c6d5da68ca1671de98217e12d27429f7ae60b03756cfed1cda66470c3055959f03117c90ac81275ca695e0c177b21c934ef59bba8122f5d61b847d3665ac80bd",
    );

    expect(decrypted).toEqual(await Sealing.hashedNodeId("1"));
  });

  it("should not be able to decrypt encrypted node id with token", async () => {
    const proof = "proof";
    const encrypted = await Sealing.encryptedNodeIdByProof(proof, "1");

    const token = await Sealing.proofAsToken(proof);

    expect(
      await Sealing.hashedNodeIdFromEncryptedNodeId(proof, encrypted),
    ).toEqual(await Sealing.hashedNodeId("1"));

    expect(async () => Sealing.decrypt(token, encrypted)).toThrow(
      new Error("The operation failed for an operation-specific reason"),
    );
  });
});
