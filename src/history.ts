import {
  loadLanes as loadSharedLanes,
  historyConnection,
  stateAt as sharedStateAt,
  type Lane,
} from "lovelace-card-history";
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

export type { Lane } from "lovelace-card-history";
export const TONE: Record<LaneState, Tone> = {
  clear: "ok",
  dry: "ok",
  open: "ok",
  leak: "alarm",
  closed: "attention",
  opening: "moving",
  closing: "moving",
};

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

export async function loadLanes(
  hass: HomeAssistant,
  sources: Array<{ kind: LaneKind; entityId: string }>,
  states: Record<string, HassEntity>,
  hours: number,
  now = Date.now(),
): Promise<Lane[]> {
  const lanes = await loadSharedLanes(
    historyConnection(hass),
    sources,
    states,
    hours,
    { now },
  );
  return lanes.map((lane) => ({
    ...lane,
    marks: lane.marks.map(([time, state]) => [
      time,
      laneState(lane.kind as LaneKind, state),
    ]),
  }));
}
export function stateAt(lane: Lane, time: number): string | undefined | null {
  return !lane.marks.length || time < lane.marks[0][0]
    ? null
    : sharedStateAt(lane, time);
}
