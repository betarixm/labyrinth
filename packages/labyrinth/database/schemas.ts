import z from "zod";

export const nodeSchema = z.object({
  id: z.string(),
  body: z.string(),
  variant: z
    .literal("branch")
    .or(z.literal("challenge"))
    .or(z.literal("ending"))
    .or(z.literal("closing")),
});

export const edgeSchema = z.object({
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  proof: z.string(),
});
