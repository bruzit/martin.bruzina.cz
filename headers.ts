import { createHash } from "node:crypto";

const inlineScript = /<script(?![^>]*\ssrc=)(?![^>]*\stype="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g;

export const scriptHashes = (html: string) =>
  [...html.matchAll(inlineScript)].map(([, js]) => `'sha256-${createHash("sha256").update(js!).digest("base64")}'`);

export const headers = (hashes: Iterable<string>) => `/*
  Content-Security-Policy: default-src 'none'; script-src 'self' ${[...new Set(hashes)].sort().join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
`;
