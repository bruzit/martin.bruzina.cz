import { z } from "zod";

const href = z.string().regex(/^(https:\/\/|mailto:|tel:\+)/);

export const cardSchema = z.strictObject({
  name: z.string(),
  photo: z.strictObject({ src: z.string().regex(/^\/[\w-]+\.jpg$/), alt: z.string() }),
  headline: z.string(),
  bio: z.string(),
  links: z.array(
    z.strictObject({
      kind: z.enum(["blog", "linkedin", "github"]),
      label: z.string(),
      href: href.optional(),
    }),
  ),
  consulting: z.strictObject({
    label: z.string(),
    pitch: z.string(),
    engagement: z.string(),
    inquiry: z.strictObject({
      label: z.string(),
      email: z.email(),
      subject: z.string(),
      body: z.string(),
    }),
    note: z.string(),
  }),
  contact: z.strictObject({
    label: z.string(),
    items: z.array(
      z.strictObject({
        kind: z.enum(["email", "phone"]),
        label: z.string(),
        href,
      }),
    ),
    location: z.string(),
  }),
});

export type Card = z.infer<typeof cardSchema>;
