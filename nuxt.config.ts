import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "@rollup/plugin-yaml";
import { parse } from "yaml";
import type { ZodType } from "zod";
import { headers, scriptHashes } from "./headers";
import { cardSchema } from "./schemas/card";
import { errorSchema } from "./schemas/error";
import { footerSchema } from "./schemas/footer";
import { personSchema } from "./schemas/person";

const validate = <T>(schema: ZodType<T>, file: string) => schema.parse(parse(readFileSync(file, "utf8")));
const card = validate(cardSchema, "content/card.yaml");
validate(footerSchema, "content/footer.yaml");
validate(errorSchema, "content/error.yaml");
validate(personSchema, "content/person.yaml");

export default defineNuxtConfig({
  compatibilityDate: "2026-11-18",
  modules: ["@nuxt/ui"],
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: card.name,
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  fonts: {
    families: [
      {
        name: "Libre Franklin",
        provider: "google",
        weights: [400, 600, 800],
        subsets: ["latin", "latin-ext"],
        preload: { subsets: ["latin", "latin-ext"] },
      },
    ],
  },
  icon: {
    serverBundle: "local",
    clientBundle: { scan: true },
    customCollections: [{ prefix: "brand", dir: "./app/assets/icons" }],
  },
  vite: { plugins: [yaml()] },
  hooks: {
    // Prefetch links carry `as`, which HTML allows only on preload links.
    "build:manifest"(manifest) {
      for (const chunk of Object.values(manifest)) chunk.dynamicImports = [];
    },
    "nitro:init"(nitro) {
      const hashes = new Set<string>();
      nitro.hooks.hook("prerender:route", (route) => {
        if (typeof route.contents === "string") scriptHashes(route.contents).forEach((hash) => hashes.add(hash));
      });
      nitro.hooks.hook("prerender:done", () => {
        writeFileSync(join(nitro.options.output.publicDir, "_headers"), headers(hashes));
      });
    },
  },
});
