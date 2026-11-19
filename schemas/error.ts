import { z } from "zod";

const page = z.strictObject({ label: z.string(), heading: z.string(), text: z.string(), title: z.string() });

export const errorSchema = z.strictObject({ notFound: page, failure: page, home: z.string() });

export type ErrorContent = z.infer<typeof errorSchema>;
