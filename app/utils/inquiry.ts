import type { Card } from "~~/schemas/card";

export const inquiryHref = ({ email, subject, body }: Card["consulting"]["inquiry"]) =>
  `mailto:${email}?${new URLSearchParams({ subject, body }).toString().replaceAll("+", "%20")}`;
