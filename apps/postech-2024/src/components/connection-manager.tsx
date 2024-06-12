import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { username } from "@/stores";

import { Badge } from "./ui/badge";

type ConnectionManagerProps = React.HTMLAttributes<HTMLDivElement> & {};

const formSchema = z.object({
  username: z.string(),
});

const countSchema = z.object({
  count: z.number().int(),
});

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  className,
  ...props
}) => {
  const currentUsername = useStore(username);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUsername,
    },
  });

  const { data, error, isLoading } = useSWR(
    `/api/count?username=${currentUsername}`,
    (key) =>
      fetch(key, { method: "GET", credentials: "include" })
        .then((res) => res.json())
        .then(countSchema.parse),
  );

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    username.set(values.username);
  };

  const badgeClass = (() => {
    if (currentUsername && error) {
      return "destructive";
    } else if (currentUsername && data?.count !== undefined) {
      return "default";
    } else {
      return "secondary";
    }
  })();

  const badgeText = (() => {
    if (!currentUsername) {
      return "Disconnected";
    } else if (currentUsername && error) {
      return "Error";
    } else if (currentUsername && isLoading) {
      return "Loading";
    } else {
      return `Verified ${data?.count ?? 0} Instances`;
    }
  })();

  return (
    <Form {...props} {...form}>
      <form
        className={clsx("space-y-4", className)}
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <div className={clsx("flex", "gap-2")}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grow">
                <div className={clsx("relative")}>
                  <FormControl>
                    <Input
                      pattern="[0-9]{8}"
                      placeholder="학번 (00000000)"
                      {...field}
                    />
                  </FormControl>
                  <div
                    className={clsx(
                      "absolute",
                      "h-full",
                      "right-2",
                      "top-0",
                      "flex",
                      "items-center",
                    )}
                  >
                    <Badge variant={badgeClass}>{badgeText}</Badge>
                  </div>
                </div>
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">연결</Button>
        </div>
      </form>
    </Form>
  );
};
