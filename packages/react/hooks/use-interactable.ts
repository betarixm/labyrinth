import type { T as InstanceType } from "@labyrinth/labyrinth/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Interactable } from "@labyrinth/labyrinth";
import { useForm } from "react-hook-form";
import z from "zod";
export const useInteractable = (
  instance: Omit<InstanceType, "body", "__html">,
  config: {
    onVerify: (nextNodeHash: string) => void;
    onFailure: () => void;
  },
) => {
  const interactable = Interactable.fromInstance(instance);

  const formSchema = z.object({
    proof: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proof: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const nextNodeHash = await interactable.verify(values.proof);

    if (nextNodeHash) {
      config.onVerify(nextNodeHash);
    } else {
      config.onFailure();
    }
  };

  return {
    interactable,
    form,
    onSubmit,
  };
};
