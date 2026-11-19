import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = ".output/public";
const types: Record<string, string> = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const file = async (path: string) => {
  for (const candidate of [path, join(path, "index.html"), `${path}.html`]) {
    if ((await stat(candidate).catch(() => null))?.isFile()) return candidate;
  }
};

createServer(async (request, response) => {
  const path = join(root, normalize(decodeURIComponent(new URL(request.url!, "http://localhost").pathname)));
  const found = path.startsWith(root) ? await file(path) : undefined;
  const served = found ?? join(root, "404.html");
  response.writeHead(found ? 200 : 404, { "content-type": types[extname(served)] ?? "application/octet-stream" });
  response.end(await readFile(served));
}).listen(Number(process.env.PORT ?? 3000));
