import { readFileSync } from "node:fs";
import yaml from "@rollup/plugin-yaml";
import { parse } from "yaml";
import { cardSchema } from "./schemas/card";

cardSchema.parse(parse(readFileSync("content/card.yaml", "utf8")));

export default defineNuxtConfig({
  compatibilityDate: "2026-11-18",
  vite: { plugins: [yaml()] },
});
