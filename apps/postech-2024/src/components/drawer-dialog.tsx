import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type DrawerDialogProps = React.ComponentProps<typeof Drawer> &
  React.ComponentProps<typeof Dialog> & {
    title: string;
    description?: string;
    trigger: React.ReactNode;
  };

export const DrawerDialog: React.FC<DrawerDialogProps> = ({
  title,
  description,
  children,
  trigger,
  ...props
}: DrawerDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog {...props} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={clsx("sm:max-w-[425px]")}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer
        {...props}
        open={open}
        onOpenChange={setOpen}
        shouldScaleBackground
      >
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        {createPortal(
          <DrawerContent>
            <DrawerHeader className={clsx("text-left")}>
              <DrawerTitle>{title}</DrawerTitle>
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
            <div className={clsx("p-4", "h-[200px]", "overflow-y-scroll")}>
              {children}
            </div>
            <DrawerFooter className={clsx("pt-2")}>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>,
          document.body,
        )}
      </Drawer>
    );
  }
};

const useMediaQuery = (query: string) => {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
};
