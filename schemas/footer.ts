import { z } from "zod";

export const footerSchema = z.strictObject({
  name: z.string(),
  holder: z.string(),
  home: z.url({ protocol: /^https$/ }),
  address: z.string(),
  ico: z.string().regex(/^\d{8}$/),
  icoHref: z.url({ protocol: /^https$/ }),
  register: z.string(),
  year: z.int().min(2026),
});

export type Footer = z.infer<typeof footerSchema>;
