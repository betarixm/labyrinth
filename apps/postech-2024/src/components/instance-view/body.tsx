import type { T as InstanceType } from "@labyrinth/labyrinth/instance";
import type React from "react";

import clsx from "clsx";

type InstanceViewBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  instance: Pick<InstanceType, "__html">;
};

export const InstanceViewBody: React.FC<InstanceViewBodyProps> = ({
  instance,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx("prose", "prose-invert")}
      dangerouslySetInnerHTML={instance}
    ></div>
  );
};
