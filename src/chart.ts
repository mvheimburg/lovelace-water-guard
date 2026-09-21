import { nothing, svg } from "lit";
import { TONE, spells, type Lane, type LaneState } from "./history";

/** Horizontal padding each side of the plot. */
export const PAD = 12;
const TITLE = 18,
  BAND = 26,
  GAP = 10,
  LANE = TITLE + BAND + GAP,
  AXIS = 22;

export interface TimelineText {
  time: (ms: number, withDay: boolean) => string;
  name: (lane: Lane) => string;
  state: (lane: Lane, state: LaneState | undefined) => string;
  label: string;
}

/** Hour ticks that suit the span and the width. */
function hourTicks(start: number, end: number, narrow: boolean) {
  const hours = (end - start) / 3_600_000;
  const every =
    hours <= 6
      ? narrow
        ? 2
        : 1
      : hours <= 24
        ? narrow
          ? 6
          : 4
        : narrow
          ? 48
          : 24;
  const out: number[] = [];
  const hour = new Date(start);
  hour.setMinutes(0, 0, 0);
  let midnights = 0;
  for (let t = hour.getTime(); t <= end; t += 3_600_000) {
    if (t < start) continue;
    const h = new Date(t).getHours();
    if (
      every >= 24
        ? h === 0 && midnights++ % (every / 24) === 0
        : h % every === 0
    )
      out.push(t);
  }
  return { ticks: out, withDay: every >= 24 };
}

/**
 * One lane per entity: coloured bands for each spell of a state, a hatched
 * gap while it was unavailable, and nothing before the first record.
 */
export function timeline(
  lanes: Lane[],
  start: number,
  end: number,
  hover: number | undefined,
  text: TimelineText,
  W = 600,
) {
  const RIGHT = W - PAD;
  const H = lanes.length * LANE + AXIS;
  const x = (t: number) =>
    PAD +
    ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
      (RIGHT - PAD);
  const bottom = lanes.length * LANE - GAP;
  const { ticks, withDay } = hourTicks(start, end, W < 480);
  return svg`<svg class="timeline" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    <defs>
      <pattern id="wg-gap" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect class="gap-bg" width="7" height="7"></rect>
        <line class="gap-line" x1="0" y1="0" x2="0" y2="7"></line>
      </pattern>
    </defs>
    ${ticks.map(
      (t) =>
        svg`<line class="grid" x1=${x(t)} x2=${x(t)} y1="0" y2=${bottom}></line>
        <text class="axis" x=${x(t)} y=${bottom + 18} text-anchor="middle">${text.time(t, withDay)}</text>`,
    )}
    ${lanes.map((lane, i) => {
      const top = i * LANE;
      return svg`<g class="lane" data-lane=${lane.entityId}>
        <text class="lane-title" x=${PAD} y=${top + 13}>${text.name(lane)}</text>
        <rect class="track" x=${PAD} y=${top + TITLE} width=${RIGHT - PAD} height=${BAND} rx="6"></rect>
        ${spells(lane, start, end).map(({ from, to, state }) => {
          const x1 = x(from),
            width = Math.max(1, x(to) - x1);
          const label = text.state(lane, state);
          const tone = state ? `tone-${TONE[state]}` : "tone-gap";
          return svg`<rect class=${`band ${tone}`} data-state=${state ?? "unavailable"} x=${x1} y=${top + TITLE} width=${width} height=${BAND}></rect>
            ${
              width >= label.length * 6.8 + 12
                ? svg`<text class=${`band-label ${tone}`} x=${x1 + 6} y=${top + TITLE + 17}>${label}</text>`
                : nothing
            }`;
        })}
      </g>`;
    })}
    ${
      hover === undefined
        ? nothing
        : svg`<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1="0" y2=${bottom}></line>`
    }
  </svg>`;
}

/** The time under a pointer over the timeline. */
export function timeAt(
  event: PointerEvent,
  element: Element,
  start: number,
  end: number,
): number {
  const box = element.getBoundingClientRect();
  const W = (element as SVGSVGElement).viewBox?.baseVal?.width || box.width;
  const px = ((event.clientX - box.left) / box.width) * W;
  const ratio = (px - PAD) / (W - 2 * PAD);
  return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}
