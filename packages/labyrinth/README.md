# @labyrinth/labyrinth

The core package containing the fundamental functionality for creating labyrinths.

## Features

- Browser on-memory database using `sql.js` with `Kysely`.
- Verify problems with hash functions and AES algorithms.

## Getting Started

```bash
git clone https://github.com/betarixm/labyrinth.git
cd labyrinth
bun install
```

## Unit Tests

```bash
bun test
```

## Usage

```typescript
import { Database } from "@labyrinth/labyrinth";

const database = await Database.fromGoogleSpreadsheet(
  import.meta.env.SOURCE_GOOGLE_SPREADSHEET_ID,
);
```

You can build the database from a Google Spreadsheet. Each sheet should follow the format below.

`nodes` sheet:
| id | body | variant |
|----|------|---------|
| (Unique String) | ... | (challenge \| ending \| closing \| branch) |

`edges` sheet:
| sourceNodeId | targetNodeId | proof |
|--------------|--------------|------|
| (String)     | (String)     | (String) |

You can also build the database from CSV strings via `Database.fromCsvString`. It is okay if there are other ways to build a valid database.

```typescript
import { Engine } from "@labyrinth/labyrinth";

const database = await Database.fromGoogleSpreadsheet(
  import.meta.env.SOURCE_GOOGLE_SPREADSHEET_ID,
);

const engine = Engine.fromDatabase(database, {});
```

Then, you can create an engine from the database. The second argument is the options for the engine. You can obtain all hashes, the first instance, and an instance by id or hash.

```typescript
import { Interactable } from "@labyrinth/labyrinth";

const instance = await engine.firstInstance;

const interactable = Interactable.fromInstance(instance);

interactable.verify("proof");
```

Lastly, you can create an interactable from the instance. You can verify the proof with the interactable. For a valid proof, `verify` will return the next hash. For an invalid proof, `verify` will return `undefined`.

`Instance` and `Interactable` are separated to enable static site generation (SSG). Instance is a JSON-serializable object, so it can be handled by frameworks like Astro or React Server Components (RSC). `Interactable` derives from `Instance`, so you can use it in the browser.
