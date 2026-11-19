import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = ".output/public";
const types: Record<string, string> = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

const headers = Object.fromEntries(
  (await readFile(join(root, "_headers"), "utf8"))
    .split("\n")
    .filter((line) => /^\s+\S/.test(line))
    .map((line) => line.trim().split(/:\s(.*)/s).slice(0, 2)),
);

const file = async (path: string) => {
  for (const candidate of [path, join(path, "index.html"), `${path}.html`]) {
    if ((await stat(candidate).catch(() => null))?.isFile()) return candidate;
  }
};

createServer(async (request, response) => {
  const path = join(root, normalize(decodeURIComponent(new URL(request.url!, "http://localhost").pathname)));
  const found = path.startsWith(root) ? await file(path) : undefined;
  const served = found ?? join(root, "404.html");
  response.writeHead(found ? 200 : 404, { ...headers, "content-type": types[extname(served)] ?? "application/octet-stream" });
  response.end(await readFile(served));
}).listen(Number(process.env.PORT ?? 3000));
