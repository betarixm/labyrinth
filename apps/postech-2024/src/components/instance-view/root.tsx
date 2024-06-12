import clsx from "clsx";

type InstanceViewRootProps = React.HTMLAttributes<HTMLDivElement> & {};

export const InstanceViewRoot: React.FC<InstanceViewRootProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={clsx("space-y-8", className)}>
      {children}
    </div>
  );
};
