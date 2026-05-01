import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const assetsDir = path.join(clientDir, "assets");

async function buildStaticIndex() {
  const files = await readdir(assetsDir);
  const indexCandidates = files.filter((file) => /^index-.*\.js$/.test(file));

  if (indexCandidates.length === 0) {
    throw new Error("No index-*.js bundle found in dist/client/assets");
  }

  // The app entry bundle is the largest index chunk in this build output.
  const sortedBySize = await Promise.all(
    indexCandidates.map(async (file) => {
      const stats = await stat(path.join(assetsDir, file));
      return { file, size: stats.size };
    }),
  );
  sortedBySize.sort((a, b) => b.size - a.size);
  const appEntry = sortedBySize[0].file;

  const styleEntry = files.find((file) => /^styles-.*\.css$/.test(file));
  const styleTag = styleEntry ? `  <link rel="stylesheet" href="/assets/${styleEntry}" />\n` : "";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sasti Collection</title>
${styleTag}  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${appEntry}"></script>
  </body>
</html>
`;

  await writeFile(path.join(clientDir, "index.html"), html, "utf8");
  console.log(`Generated static index: dist/client/index.html -> ${appEntry}`);
}

buildStaticIndex().catch((error) => {
  console.error(error);
  process.exit(1);
});
