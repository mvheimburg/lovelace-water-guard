import type {
  Guard,
  HassEntity,
  HassStates,
  MoveResult,
  ValveStatus,
} from "./types";

const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const unique = (...lists: string[][]) => [...new Set(lists.flat())];

function moveResult(value: unknown): MoveResult | undefined {
  if (!value || typeof value !== "object") return undefined;
  const result = value as Record<string, unknown>;
  const valves =
    result.valves && typeof result.valves === "object"
      ? Object.fromEntries(
          Object.entries(result.valves as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {};
  return {
    target: String(result.target ?? ""),
    reason: String(result.reason ?? ""),
    status: String(result.status ?? ""),
    valves,
    updated: typeof result.updated === "string" ? result.updated : undefined,
  };
}

/** Read a Water Guard Leak sensor. Missing or malformed attributes read as empty. */
export function readGuard(state?: HassEntity): Guard {
  const attributes = state?.attributes ?? {};
  const fired = strings(attributes.sensors);
  const wet = strings(attributes.wet_sensors);
  const unavailableSensors = strings(attributes.unavailable_sensors);
  const notifiedValue = attributes.notified;
  const notified =
    notifiedValue && typeof notifiedValue === "object"
      ? Object.fromEntries(
          Object.entries(notifiedValue as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {};
  const result = moveResult(attributes.last_result);
  const legacy = !Array.isArray(attributes.leak_sensors);
  return {
    available: state?.state === "on" || state?.state === "off",
    alert: state?.state === "on",
    since: typeof attributes.since === "string" ? attributes.since : undefined,
    fired,
    wet,
    unavailableSensors,
    // Before 0.2.0 the configured lists are unknown; show what the alert reveals.
    watched: legacy
      ? unique(fired, wet, unavailableSensors)
      : strings(attributes.leak_sensors),
    valves: legacy
      ? Object.keys(result?.valves ?? {})
      : strings(attributes.valves),
    people: legacy ? Object.keys(notified) : strings(attributes.people),
    notified,
    result,
    legacy,
  };
}

/** Is this entity a Water Guard Leak sensor? Used by the editor and stub config. */
export function isGuardSensor(state?: HassEntity): boolean {
  return (
    !!state &&
    state.entity_id.startsWith("binary_sensor.") &&
    "wet_sensors" in state.attributes &&
    "last_result" in state.attributes
  );
}

export function guardSensors(states: HassStates): string[] {
  return Object.keys(states)
    .filter((id) => isGuardSensor(states[id]))
    .sort();
}

/** A valve entity's position; a switch that drives a valve is open when on. */
export function valveStatus(state?: HassEntity): ValveStatus {
  switch (state?.state) {
    case "open":
    case "on":
      return "open";
    case "closed":
    case "off":
      return "closed";
    case "opening":
    case "closing":
      return "moving";
    default:
      return "unavailable";
  }
}

export function friendlyName(states: HassStates, entityId: string): string {
  const name = states[entityId]?.attributes.friendly_name;
  return typeof name === "string" && name.trim() ? name : entityId;
}
