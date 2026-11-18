import { readFileSync } from "node:fs";
import yaml from "@rollup/plugin-yaml";
import { parse } from "yaml";
import type { ZodType } from "zod";
import { cardSchema } from "./schemas/card";
import { footerSchema } from "./schemas/footer";

const validate = (schema: ZodType, file: string) => schema.parse(parse(readFileSync(file, "utf8")));
validate(cardSchema, "content/card.yaml");
validate(footerSchema, "content/footer.yaml");

export default defineNuxtConfig({
  compatibilityDate: "2026-11-18",
  vite: { plugins: [yaml()] },
});
