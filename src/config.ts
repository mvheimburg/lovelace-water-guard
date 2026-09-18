import type { CardConfig } from "./types";

export function validateConfig(input: Record<string, unknown>): CardConfig {
  if (!input || typeof input !== "object")
    throw new Error("Card configuration is required");
  const config = { appearance: "default", entity: "", ...input };
  if (typeof config.entity !== "string")
    throw new Error("entity must be a Water Guard Leak sensor");
  if (config.entity && !config.entity.startsWith("binary_sensor."))
    throw new Error("entity must be a Water Guard Leak sensor (binary_sensor)");
  if (!["default", "bubble"].includes(String(config.appearance)))
    throw new Error("appearance must be default or bubble");
  if (input.title !== undefined && typeof input.title !== "string")
    throw new Error("title must be text");
  return config as CardConfig;
}
