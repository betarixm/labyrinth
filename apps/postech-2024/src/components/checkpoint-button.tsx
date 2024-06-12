import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { match } from "ts-pattern";

import { visitedInstances } from "@/stores";
type CheckpointButtonProps = React.HTMLAttributes<HTMLAnchorElement> & {};

export const CheckpointButton: React.FC<CheckpointButtonProps> = ({
  className,
  children,
  ...props
}) => {
  const currentVisitedInstances = useStore(visitedInstances);

  return match(currentVisitedInstances.length)
    .with(0, () => <></>)
    .otherwise((length) => (
      <a
        {...props}
        className={clsx(className)}
        href={`/instance/${currentVisitedInstances[length - 1]}`}
      >
        {children}
      </a>
    ));
};
