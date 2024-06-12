import { DrawerDialog } from "@/components/drawer-dialog";

import { Button } from "../ui/button";

type InstanceViewHintProps = Omit<
  React.ComponentProps<typeof DrawerDialog>,
  "trigger" | "fadeFromIndex"
> & {
  disabled: boolean;
};

export const InstanceViewHint: React.FC<InstanceViewHintProps> = ({
  children,
  disabled,
  ...props
}) => {
  return (
    <DrawerDialog
      {...props}
      trigger={
        <Button variant="secondary" disabled={disabled}>
          Hint
        </Button>
      }
      shouldScaleBackground
    >
      {children}
    </DrawerDialog>
  );
};
