import type { Locale } from "../types";
import { fi } from "./fi";
import { en } from "./en";
import { es } from "./es";

export const messages = { fi, en, es } as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}

export type { Messages } from "./types";
