# @labyrinth/react

A collection of React hooks to simplify the development of labyrinth web applications.

## Getting Started

```bash
git clone https://github.com/betarixm/labyrinth.git
cd labyrinth
bun install
```

## Hooks

### `useInstances`

```typescript
export const useInstances = (
  googleSpreadsheetId: string | undefined | null,
): InstancesResponse => { ... };
```

This hook fetches all instances from the specified Google Spreadsheet. Powered by SWR, it automatically revalidates the data and builds the database.

### `useInteractable`

```typescript
export const useInteractable = (
  instance: Omit<InstanceType, "body", "__html">,
  config: {
    onVerify: (nextNodeHash: string) => void;
    onFailure: () => void;
  },
) => { ... };
```

This hook prepares not only the `Interactable` instance but also the `form` helper, and the `onSubmit` handler, making it easier to integrate with your React components and handle user interactions within the labyrinth application. These helpers are compatible with the `react-hook-form` library.
