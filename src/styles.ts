import { colorSchemeStyles } from "./color-schemes";
import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    color: var(--primary-text-color, #1b1b1a);
    font-family: var(--paper-font-body1_-_font-family, system-ui);
    --wg-text: var(--primary-text-color, #1b1b1a);
    --wg-muted: var(--secondary-text-color, #5b5a55);
    --wg-ok: var(--success-color, #2e7d32);
    --wg-warn: var(--warning-color, #f59e0b);
    --wg-alarm: var(--error-color, #c62828);
    --wg-neutral: var(--disabled-text-color, #8a8984);
    --wg-water: var(--info-color, #0288d1);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    --wg-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --wg-pill: var(--secondary-background-color, #f3f2ee);
    --wg-pill-radius: 20px;
    --wg-tile-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    background: var(--wg-surface);
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    border-radius: var(--ha-card-border-radius, 16px);
    box-shadow: var(--ha-card-box-shadow);
  }
  ha-card.bubble {
    --wg-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --wg-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --wg-pill-radius: var(--bubble-border-radius, 32px);
    --wg-tile-radius: var(--bubble-sub-button-border-radius, 22px);
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  .sev-ok {
    --sev: var(--wg-water);
  }
  .sev-attention {
    --sev: var(--wg-warn);
  }
  .sev-alarm {
    --sev: var(--wg-alarm);
  }
  .sev-unknown {
    --sev: var(--wg-neutral);
  }
  p {
    margin: 0;
    line-height: 1.45;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 64px;
    padding: 6px;
    border-radius: var(--wg-pill-radius);
    background: var(--wg-pill);
  }
  .icon {
    flex: 0 0 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: var(--bubble-icon-border-radius, 50%);
    color: color-mix(in srgb, var(--sev) 75%, var(--wg-text));
    background: color-mix(in srgb, var(--sev) 20%, transparent);
  }
  .icon svg {
    width: 26px;
    height: 26px;
  }
  .text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .text strong {
    font-size: 1rem;
    overflow-wrap: anywhere;
  }
  .sub {
    font-size: 0.85rem;
    color: var(--wg-muted);
  }
  .status {
    flex: 0 0 auto;
    padding: 6px 11px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    background: color-mix(in srgb, var(--sev) 22%, transparent);
    color: color-mix(in srgb, var(--sev) 55%, var(--wg-text));
  }
  .settings {
    flex: 0 0 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--wg-muted);
  }
  .settings svg {
    width: 20px;
    height: 20px;
  }
  .settings:hover {
    background: color-mix(in srgb, var(--wg-text) 6%, transparent);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 6px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 14px;
    border-radius: var(--wg-tile-radius);
    background: var(--wg-pill);
    min-width: 0;
  }
  .tile .value {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .tile .label {
    font-size: 0.78rem;
    color: var(--wg-muted);
  }
  .valves {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .valves li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 8px;
    border-radius: var(--wg-pill-radius);
    background: var(--wg-pill);
  }
  .valves .icon {
    flex-basis: 40px;
    height: 40px;
  }
  .valves .icon svg {
    width: 20px;
    height: 20px;
  }
  .valves .name {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .note {
    font-size: 0.88rem;
    padding: 12px 14px;
    border-radius: var(--wg-tile-radius);
    background: color-mix(in srgb, var(--sev) 16%, var(--wg-pill));
  }
  .alert {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-radius: var(--wg-pill-radius);
    background: var(--wg-alarm);
    color: #fff;
  }
  .alert-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .alert-head .icon {
    color: var(--wg-alarm);
    background: #fff;
  }
  .alert-head strong {
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1.1;
  }
  .alert-head .sub {
    color: rgb(255 255 255 / 0.85);
  }
  .timer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 1.4rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .timer small {
    font-size: 0.7rem;
    font-weight: 500;
  }
  .fired {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .fired li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--wg-tile-radius);
    background: rgb(0 0 0 / 0.2);
  }
  .fired strong {
    overflow-wrap: anywhere;
  }
  .badge {
    flex: 0 0 auto;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.2);
  }
  .badge.wet {
    background: #fff;
    color: var(--wg-alarm);
  }
  .alert p {
    font-size: 0.92rem;
  }
  .alert .strong {
    font-weight: 700;
  }
  button {
    font: inherit;
    cursor: pointer;
    border: 0;
    border-radius: 999px;
    padding: 10px 16px;
    min-height: 44px;
    color: inherit;
    background: var(--wg-pill, var(--secondary-background-color, #f3f2ee));
  }
  button:disabled {
    cursor: wait;
    opacity: 0.6;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 3px solid var(--primary-color, #0277bd);
    outline-offset: 2px;
  }
  .alert button:focus-visible {
    outline-color: #fff;
  }
  .override {
    min-height: 56px;
    font-size: 1.05rem;
    font-weight: 800;
    background: #fff;
    color: var(--wg-alarm);
  }
  dialog {
    color: var(--primary-text-color, #1b1b1a);
    background: var(--card-background-color, #fff);
    border: 0;
    border-radius: 24px;
    padding: 24px;
    width: min(460px, calc(100vw - 24px));
    box-shadow: 0 16px 60px #0006;
  }
  dialog::backdrop {
    background: #0007;
  }
  dialog h2 {
    margin: 0 0 10px;
    font-size: 1.35rem;
  }
  dialog p + p,
  dialog p + .note {
    margin-top: 10px;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 18px;
  }
  .actions button {
    flex: 1;
  }
  .actions .danger {
    font-weight: 800;
    background: var(--wg-alarm);
    color: #fff;
  }
  /* Readings that open the history keep their look and gain a pressed state. */
  button.tile {
    align-items: flex-start;
    text-align: start;
    min-height: 44px;
    border-radius: var(--wg-tile-radius);
    padding: 12px 14px;
  }
  .valves li {
    padding: 0;
  }
  .valves li > button,
  .fired li > button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 44px;
    text-align: start;
    background: transparent;
    border-radius: inherit;
  }
  .valves li > button {
    padding: 8px 12px 8px 8px;
  }
  .fired li {
    padding: 0;
  }
  .fired li > button {
    justify-content: space-between;
    padding: 12px 14px;
  }
  .status-button {
    flex: 0 0 auto;
    padding: 0;
    min-width: 44px;
    background: transparent;
  }
  .status-button:disabled {
    cursor: default;
    opacity: 1;
  }
  button.tile:hover,
  .valves li > button:hover,
  .status-button:hover:not(:disabled) .status {
    background-image: linear-gradient(
      color-mix(in srgb, var(--wg-text) 6%, transparent),
      color-mix(in srgb, var(--wg-text) 6%, transparent)
    );
  }
  .fired li > button:hover {
    background: rgb(255 255 255 / 0.08);
  }

  /* History: one timeline lane per entity, coloured by state. */
  .b-ok,
  .tone-ok {
    --tone: var(--wg-water);
  }
  .b-alarm,
  .tone-alarm {
    --tone: var(--wg-alarm);
  }
  .b-attention,
  .tone-attention {
    --tone: var(--wg-warn);
  }
  .b-moving,
  .tone-moving {
    --tone: color-mix(in srgb, var(--wg-water) 45%, var(--wg-neutral));
  }
  .tone-gap,
  .b-none,
  .tone-none {
    --tone: var(--wg-neutral);
  }
  :host {
    --history-text: var(--wg-text);
    --history-muted: var(--wg-muted);
    --history-surface: var(
      --ha-card-background,
      var(--card-background-color, #fff)
    );
    --history-pill: var(--secondary-background-color, #f3f2ee);
  }
  ha-card.bubble ~ dialog#history {
    --history-surface-color: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --history-pill-color: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --history-radius: min(var(--bubble-border-radius, 32px), 28px);
  }
  .timeline {
    display: block;
    width: 100%;
    height: auto;
  }
  .timeline .grid {
    stroke: color-mix(in srgb, var(--wg-muted) 22%, transparent);
  }
  .timeline .axis {
    fill: var(--wg-muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .timeline .lane-label {
    fill: var(--wg-muted);
    font-size: 12px;
    font-weight: 600;
  }
  .timeline .track {
    fill: color-mix(in srgb, var(--wg-muted) 8%, transparent);
  }
  .timeline .band {
    fill: color-mix(in srgb, var(--tone) 34%, transparent);
  }
  .timeline .band.b-alarm {
    fill: var(--tone);
  }
  .timeline .band.b-gap {
    fill: url(#history-hatch);
  }
  .timeline .hatch-bg {
    fill: color-mix(in srgb, var(--wg-neutral) 10%, transparent);
  }
  .timeline .hatch {
    stroke: color-mix(in srgb, var(--wg-neutral) 55%, transparent);
    stroke-width: 2;
  }
  .timeline .band-label {
    fill: var(--wg-text);
    font-size: 11.5px;
    font-weight: 600;
    pointer-events: none;
  }
  .timeline .band-label.b-alarm {
    fill: #fff;
  }
  .timeline .band-label.b-gap {
    fill: var(--wg-muted);
  }
  .timeline .cursor {
    stroke: var(--wg-text);
    stroke-width: 1.5;
    stroke-dasharray: 3 3;
  }
  .history-when {
    margin: 4px 4px 8px;
    font-size: 0.78rem;
    color: var(--wg-muted);
  }
  .history-legend {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 6px;
  }
  .lane-item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2px 8px;
    min-height: 44px;
    padding: 8px 12px;
    border-radius: 14px;
    background: var(--secondary-background-color, #f3f2ee);
    text-align: start;
  }
  .lane-swatch {
    grid-row: span 2;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--tone);
  }
  .lane-item.tone-gap .lane-swatch,
  .lane-item.tone-none .lane-swatch {
    background: transparent;
    border: 2px solid var(--tone);
  }
  .lane-name {
    font-size: 0.75rem;
    color: var(--wg-muted);
    overflow-wrap: anywhere;
  }
  .lane-state {
    font-size: 0.95rem;
  }
  @media (max-width: 400px) {
    ha-card {
      padding: 10px;
    }
    dialog {
      padding: 18px;
    }
    dialog#history {
      padding: 14px 12px 16px;
    }
  }
  ${colorSchemeStyles}
`;
