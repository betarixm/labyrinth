import type { Instance as BranchInstanceType } from "@labyrinth/labyrinth/instance/variants/branch";
import type { Instance as ChallengeInstanceType } from "@labyrinth/labyrinth/instance/variants/challenge";
import type { Instance as EndingInstanceType } from "@labyrinth/labyrinth/instance/variants/ending";
import type React from "react";
import type { ControllerRenderProps } from "react-hook-form";

import { Instance } from "@labyrinth/labyrinth";
import { useInteractable } from "@labyrinth/react";
import clsx from "clsx";
import { toast } from "sonner";
import { match } from "ts-pattern";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup } from "@/components/ui/radio-group";

type InstanceViewFormProps = React.HTMLAttributes<HTMLDivElement> & {
  instance: Omit<
    BranchInstanceType | ChallengeInstanceType | EndingInstanceType,
    "body" | "__html"
  >;
  onVerify?: (nextNodeHash: string) => void;
  onFailure?: () => void;
};

export const InstanceViewForm: React.FC<InstanceViewFormProps> = ({
  instance,
  children,
  onVerify = (nextNodeHash: string) => {
    location.href = `/instance/${nextNodeHash}`;
  },
  onFailure = () => {
    toast.error("Wrong!", {
      description: "Try again 🤔",
    });
  },
  ...props
}) => {
  const { form, onSubmit } = useInteractable(instance, {
    onVerify,
    onFailure,
  });

  const render = match(instance)
    .when(Instance.isBranch, renderBranch)
    .when(Instance.isEnding, renderEnding)
    .when(Instance.isChallenge, renderChallenge)
    .otherwise(() => {
      throw new Error("Invalid instance");
    });

  return (
    <Form {...props} {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={clsx("space-y-4")}
      >
        <FormField control={form.control} name="proof" render={render} />
        <div className={clsx("flex", "justify-between")}>
          <div>{children}</div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

type RenderProps = {
  field: ControllerRenderProps<
    {
      proof: string;
    },
    "proof"
  >;
};

const renderBranch =
  (instance: BranchInstanceType) =>
  ({ field }: RenderProps) => (
    <FormItem className={clsx("space-y-3")}>
      <FormLabel>Choice</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className={clsx("flex", "flex-col", "space-y-1")}
        >
          {instance.relations.map((relation) => (
            <FormItem
              key={relation.targetNodeHash + relation.proof}
              className={clsx("flex", "items-center", "space-x-3", "space-y-0")}
            >
              <FormControl>
                <RadioGroupItem value={relation.proof} />
              </FormControl>
              <FormLabel className={clsx("text-base")}>
                {relation.proof}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

const renderChallenge =
  (_: ChallengeInstanceType) =>
  ({ field }: RenderProps) => (
    <FormItem>
      <FormLabel>Answer</FormLabel>
      <FormControl>
        <Input {...field} className={clsx("text-base")} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

const renderEnding =
  (instance: EndingInstanceType) =>
  ({ field }: RenderProps) => (
    <FormItem>
      <FormLabel>End of the Labyrinth</FormLabel>
      <FormMessage />
    </FormItem>
  );
