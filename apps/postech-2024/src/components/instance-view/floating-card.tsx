import clsx from "clsx";

import { Card } from "@/components/ui/card";

type InstanceViewFloatingCardProps = React.HTMLAttributes<HTMLDivElement> & {};

export const InstanceViewFloatingCard: React.FC<
  InstanceViewFloatingCardProps
> = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={clsx(
        "sticky",
        "-bottom-[5.5rem]",
        "left-0",
        "right-0",
        "container",
        "group",
        "transition-all",
        "max-sm:focus-within:static",
        className,
      )}
    >
      <Card className={clsx("p-4", "backdrop-blur-xl", "bg-card/25")}>
        {children}
      </Card>
    </div>
  );
};
