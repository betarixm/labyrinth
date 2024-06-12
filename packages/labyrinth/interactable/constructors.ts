import type { T } from "./types";

import * as Instance from "@labyrinth/labyrinth/instance";
import {
  hashedNodeIdFromEncryptedNodeId,
  proofAsToken,
} from "@labyrinth/labyrinth/sealing";
import { match } from "ts-pattern";

import { EdgeNotFoundError } from "./exceptions";

export const fromInstance = (instance: Instance.T): T => {
  const verifyOrAbort = (proof: string) =>
    match(instance)
      .when(Instance.isBranch, async (instance) => {
        const edge = instance.relations.find((edge) => edge.proof === proof);

        if (edge === undefined) {
          throw new EdgeNotFoundError("Edge not found");
        }

        return edge.targetNodeHash;
      })
      .when(Instance.isChallenge, async (instance) => {
        const token = await proofAsToken(proof);

        const edge = instance.relations.find((edge) => edge.token === token);

        if (edge === undefined) {
          throw new EdgeNotFoundError("Edge not found");
        }

        const hashedTargetNodeId = await hashedNodeIdFromEncryptedNodeId(
          proof,
          edge.encryptedTargetNodeId,
        );

        return hashedTargetNodeId;
      })
      .when(Instance.isEnding, async (instance) => {
        return instance.relation.targetNodeHash;
      })
      .when(Instance.isClosing, async (instance) => {
        throw new EdgeNotFoundError("Closing nodes do not have edges");
      })
      .exhaustive();

  const verify = async (proof: string): Promise<string | undefined> => {
    try {
      return await verifyOrAbort(proof);
    } catch (error) {
      if (error instanceof EdgeNotFoundError) {
        return undefined;
      } else {
        throw error;
      }
    }
  };

  return {
    ...instance,
    verify,
  };
};
