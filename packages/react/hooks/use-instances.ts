import type { T as InstanceType } from "@labyrinth/labyrinth/instance";
import type { SqlJsConfig } from "sql.js";
import type { SWRResponse } from "swr";

import { Database, Instance, Repository } from "@labyrinth/labyrinth";
import useSWR from "swr";
import { match } from "ts-pattern";

type InstancesResponse = Omit<SWRResponse, "data"> & {
  instances: InstanceType[] | undefined;
};

export const useInstances = (
  googleSpreadsheetId: string | undefined | null,
): InstancesResponse => {
  const fetcher = (id: string | undefined | null) =>
    match(googleSpreadsheetId)
      .with(undefined, () => {
        throw new Error("googleSpreadsheetId is required");
      })
      .with(null, () => {
        throw new Error("googleSpreadsheetId is required");
      })
      .otherwise(() =>
        Database.fromGoogleSpreadsheet(googleSpreadsheetId, {
          locateFile: (file) =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
        })
          .then(Repository.fromDatabase)
          .then(async (repository) => {
            const nodes = await repository.allNodes();

            const instances = await Promise.all(
              nodes.map((databaseNode) =>
                Instance.fromNode(databaseNode, { repository }),
              ),
            );

            return instances;
          }),
      );

  const { data, ...rest } = useSWR(googleSpreadsheetId, fetcher);

  return {
    ...rest,
    instances: data as InstanceType[],
  };
};
