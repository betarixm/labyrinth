import type { T as InstanceType } from "@labyrinth/labyrinth/instance";

import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { match } from "ts-pattern";

import { username, visitedInstances } from "@/stores";

type InstanceViewTrackerProps = {
  instance: Omit<InstanceType, "body" | "__html">;
};

export const InstanceViewTracker: React.FC<InstanceViewTrackerProps> = ({
  instance,
}: InstanceViewTrackerProps) => {
  const currentUsername = useStore(username);

  useEffect(() => {
    visitedInstances.set([...visitedInstances.get(), instance.hash]);
  }, []);

  useEffect(() => {
    if (currentUsername) {
      fetch(`/api/log?username=${currentUsername}&hash=${instance.hash}`, {})
        .then(showToast)
        .catch(showErrorToast);
    }
  }, [currentUsername]);

  return <></>;
};

const showToast = (response: Response) => {
  if (response.ok) {
    toast.success("📝", {
      description: "진척도가 기록되었습니다.",
      duration: 2000,
    });
  } else {
    throw new Error("진척도 기록에 실패했습니다.");
  }
};

const showErrorToast = (error: Error) => {
  toast.error("Error!", {
    description: error.message,
  });
};
