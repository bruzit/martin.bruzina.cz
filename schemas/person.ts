import { z } from "zod";

export const personSchema = z.strictObject({
  url: z.url({ protocol: /^https$/ }).endsWith("/"),
  givenName: z.string(),
  familyName: z.string(),
  jobTitle: z.string(),
  description: z.string().max(160),
  ogDescription: z.string(),
  knowsAbout: z.array(z.string()),
});

export type Person = z.infer<typeof personSchema>;
