import type { HassEntity, HomeAssistant } from "../src/types";

export const LEAK = "binary_sensor.water_leak";

export function leak(
  state: "on" | "off" | "unavailable",
  attributes: Record<string, unknown> = {},
): HassEntity {
  return {
    entity_id: LEAK,
    state,
    attributes: {
      friendly_name: "Water Leak",
      device_class: "moisture",
      leak_sensors: ["binary_sensor.sink_leak", "binary_sensor.boiler_leak"],
      valves: ["valve.main"],
      people: ["person.kari", "person.ola"],
      since: null,
      sensors: [],
      notified: {},
      wet_sensors: [],
      unavailable_sensors: [],
      last_result: null,
      ...attributes,
    },
  };
}

export type Calls = unknown[][];

export function fixture(
  leakState: HassEntity = leak("off"),
  service: (...args: unknown[]) => Promise<unknown> = async () => {},
): HomeAssistant & { calls: Calls } {
  const calls: Calls = [];
  const entity = (entity_id: string, state: string, name: string) => ({
    entity_id,
    state,
    attributes: { friendly_name: name },
  });
  return {
    calls,
    language: "en",
    locale: { language: "en", time_format: "language" },
    states: {
      [LEAK]: leakState,
      "binary_sensor.sink_leak": entity(
        "binary_sensor.sink_leak",
        "off",
        "Sink",
      ),
      "binary_sensor.boiler_leak": entity(
        "binary_sensor.boiler_leak",
        "off",
        "Boiler",
      ),
      "valve.main": entity("valve.main", "open", "Main valve"),
      "person.kari": entity("person.kari", "home", "Kari"),
      "person.ola": entity("person.ola", "home", "Ola"),
    },
    callService: async (...args: unknown[]) => {
      calls.push(args);
      return service(...args);
    },
  };
}

export async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 20));
}

export function text(root: ShadowRoot, selector = "ha-card") {
  return (root.querySelector(selector)?.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
