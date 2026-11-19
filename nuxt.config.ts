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
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  fonts: {
    families: [{ name: "Libre Franklin", provider: "google", weights: [400, 600, 800], subsets: ["latin", "latin-ext"] }],
  },
  icon: {
    serverBundle: "local",
    clientBundle: { scan: true },
    customCollections: [{ prefix: "brand", dir: "./app/assets/icons" }],
  },
  vite: { plugins: [yaml()] },
});
