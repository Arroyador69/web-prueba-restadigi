import { randomUUID } from "node:crypto";

import { isPublicDemo } from "@/lib/auth";

/** En demo pública no persistimos nada creado por visitantes/clientes. */
export function blockVisitorPersistence() {
  return isPublicDemo();
}

export function ephemeralId() {
  return randomUUID();
}

export function demoNotPersisted<T extends Record<string, unknown>>(payload: T) {
  return {
    ...payload,
    ok: true,
    demo: true,
    persisted: false as const,
    message:
      "Public demo: visitor data is not saved. Only curated example data stays in the database.",
  };
}
