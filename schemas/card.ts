import { z } from "zod";

const href = z.string().regex(/^(https:\/\/|mailto:|tel:\+)/);

export const cardSchema = z.strictObject({
  name: z.string(),
  headline: z.string(),
  bio: z.string(),
  engagement: z.string(),
  inquiry: z.strictObject({
    label: z.string(),
    email: z.email(),
    subject: z.string(),
    body: z.string(),
  }),
  contacts: z.array(
    z.strictObject({
      kind: z.enum(["email", "phone", "linkedin", "github"]),
      label: z.string(),
      href,
    }),
  ),
  blog: z.string(),
  location: z.string(),
});

export type Card = z.infer<typeof cardSchema>;
