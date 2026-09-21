import type { HassEntity, HomeAssistant } from "./types";

/**
 * What a lane can show. The leak alert reads `clear`/`leak`, a leak sensor
 * `dry`/`leak`, a valve (or a switch driving one) `open`/`closed` and the
 * moves between. `undefined` is an unavailable spell and is drawn as a gap.
 */
export type LaneState =
  "clear" | "dry" | "leak" | "open" | "closed" | "opening" | "closing";
export type LaneKind = "alert" | "sensor" | "valve";
export type Tone = "ok" | "alarm" | "attention" | "moving";

/** Time (ms) and the state from then on. */
export type Point = [number, LaneState | undefined];
export interface Lane {
  kind: LaneKind;
  entityId: string;
  points: Point[];
}
export const RANGES = [6, 24, 168] as const;
export type Range = (typeof RANGES)[number];

export const TONE: Record<LaneState, Tone> = {
  clear: "ok",
  dry: "ok",
  open: "ok",
  leak: "alarm",
  closed: "attention",
  opening: "moving",
  closing: "moving",
};

/** Home Assistant's compressed, minimal history row. */
interface Row {
  s: string;
  lu?: number;
  lc?: number;
}

/** A raw Home Assistant state as this lane reads it; anything else is a gap. */
export function laneState(
  kind: LaneKind,
  state?: string,
): LaneState | undefined {
  if (kind === "valve")
    switch (state) {
      case "open":
      case "on":
        return "open";
      case "closed":
      case "off":
        return "closed";
      case "opening":
      case "closing":
        return state;
      default:
        return undefined;
    }
  if (state === "on") return "leak";
  if (state === "off") return kind === "alert" ? "clear" : "dry";
  return undefined;
}

/** Ask Home Assistant over its websocket, through whichever API this hass offers. */
function ask<T>(hass: HomeAssistant, message: Record<string, unknown>) {
  if (hass.callWS) return hass.callWS<T>(message);
  if (hass.connection?.sendMessagePromise)
    return hass.connection.sendMessagePromise<T>(message);
  return Promise.reject(new Error("Home Assistant history API unavailable"));
}

/**
 * Each lane's states over the last `hours` from Home Assistant's recorder,
 * ending with the current state at `now`.
 */
export async function loadLanes(
  hass: HomeAssistant,
  sources: Array<{ kind: LaneKind; entityId: string }>,
  states: Record<string, HassEntity>,
  hours: number,
  now = Date.now(),
): Promise<Lane[]> {
  const start = now - hours * 3_600_000;
  const reply = sources.length
    ? await ask<Record<string, Row[]>>(hass, {
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        entity_ids: [...new Set(sources.map((s) => s.entityId))],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      })
    : {};
  return sources.map(({ kind, entityId }) => {
    const points: Point[] = (reply?.[entityId] ?? []).map((row) => [
      Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
      laneState(kind, row.s),
    ]);
    points.push([now, laneState(kind, states[entityId]?.state)]);
    return { kind, entityId, points };
  });
}

/**
 * The state in force at `time`: `null` before the first record, `undefined`
 * while unavailable.
 */
export function stateAt(
  lane: Lane,
  time: number,
): LaneState | undefined | null {
  let value: LaneState | undefined | null = null;
  for (const [t, v] of lane.points) {
    if (t > time) break;
    value = v;
  }
  return value;
}

/** Consecutive spells of one state, clipped to the window. */
export function spells(
  lane: Lane,
  start: number,
  end: number,
): Array<{ from: number; to: number; state: LaneState | undefined }> {
  const out: Array<{ from: number; to: number; state: LaneState | undefined }> =
    [];
  const points = lane.points;
  for (let i = 0; i < points.length - 1; i++) {
    const from = Math.max(start, points[i][0]);
    const to = Math.min(end, points[i + 1][0]);
    if (to <= from) continue;
    const last = out[out.length - 1];
    if (last && last.state === points[i][1] && last.to === from) last.to = to;
    else out.push({ from, to, state: points[i][1] });
  }
  return out;
}
