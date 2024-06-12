# @labyrinth/postech-2024

The official labyrinth for the POSTECH-KAIST Science War 2024, showcasing the capabilities of *Labyrinth*.

## Getting Started

```bash
git clone https://github.com/betarixm/labyrinth.git
cd labyrinth
bun install
cd apps/postech-2024
echo "GOOGLE_SPREADSHEET_ID=..." > .env # Replace ... with the valid Google Spreadsheet ID
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |
