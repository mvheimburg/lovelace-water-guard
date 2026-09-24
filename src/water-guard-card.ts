import {
  HistoryController,
  historyDialog,
  openHistoryDialog,
  historyFormat,
  historyStrings,
  historyStyles,
  timeline,
  timelineTimeAt,
} from "lovelace-card-history";
import { applyColorScheme } from "./color-schemes";
import { LitElement, html, nothing } from "lit";
import { validateConfig } from "./config";
import { icon } from "./icons";
import { formatLocale, list, localize, type MessageKey } from "./localize";
import {
  TONE,
  loadLanes,
  stateAt,
  type Lane,
  type LaneKind,
  type LaneState,
} from "./history";
import { friendlyName, guardSensors, readGuard, valveStatus } from "./model";
import { styles } from "./styles";
import type { CardConfig, Guard, HomeAssistant, ValveStatus } from "./types";
import "./editor";

const VALVE_LABEL: Record<ValveStatus, MessageKey> = {
  open: "valveOpen",
  closed: "valveClosed",
  moving: "valveMoving",
  unavailable: "valveUnavailable",
};

/**
 * Shows one Water Guard: a calm status, the latched leak alert, and the
 * override. Water Guard owns the alert; the card only calls its override.
 */
export class WaterGuardCard extends LitElement {
  static styles = [historyStyles, styles];
  private config?: CardConfig;
  private ha?: HomeAssistant;
  private pending = false;
  private error = "";
  /** The alert the confirmation was opened for; confirm refuses a changed one. */
  private confirming?: string;
  private timer?: ReturnType<typeof setInterval>;
  /** History dialog: chosen range, loaded lanes and the hovered time. */
  private history = new HistoryController<Lane[]>(this, (range, end) =>
    loadLanes(this.ha!, this.historySources(), this.ha!.states, range, end),
  );

  static getConfigElement() {
    return document.createElement("water-guard-card-editor");
  }
  static getStubConfig(hass?: HomeAssistant) {
    return { entity: hass ? (guardSensors(hass.states)[0] ?? "") : "" };
  }
  setConfig(config: Record<string, unknown>) {
    const next = validateConfig(config);
    applyColorScheme(this, config.color_scheme, this.ha);
    if (next.entity !== this.config?.entity) {
      // A different guard: nothing from the previous one may linger.
      this.error = "";
      this.confirming = undefined;
      this.closeDialog();
      this.closeHistory();
    }
    this.config = next;
    this.requestUpdate();
  }
  set hass(value: HomeAssistant) {
    this.ha = value;
    this.requestUpdate();
  }
  get hass() {
    return this.ha!;
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback();
    this.timer = setInterval(() => this.requestUpdate(), 15000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
    this.closeDialog();
    this.closeHistory();
  }
  protected updated() {
    this.history.observe(this.shadowRoot?.querySelector(".history-plot"));
  }

  private t(key: MessageKey, values?: Record<string, string | number>) {
    return localize(this.ha, key, values);
  }
  private names(ids: string[]) {
    return list(
      this.ha,
      ids.map((id) => friendlyName(this.ha?.states ?? {}, id)),
    );
  }
  private get guard(): Guard {
    return readGuard(this.config && this.ha?.states[this.config.entity]);
  }
  private duration(since?: string) {
    const start = Date.parse(since ?? "");
    if (!Number.isFinite(start)) return undefined;
    const minutes = Math.max(0, Math.floor((Date.now() - start) / 60000));
    const unit = (value: number, name: string) =>
      new Intl.NumberFormat(formatLocale(this.ha), {
        style: "unit",
        unit: name,
        unitDisplay: "short",
      }).format(value);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days) return `${unit(days, "day")} ${unit(hours % 24, "hour")}`;
    if (hours) return `${unit(hours, "hour")} ${unit(minutes % 60, "minute")}`;
    return unit(minutes, "minute");
  }
  /** A time today, or a date and time; honours HA's 12/24-hour preference. */
  private time(since?: string) {
    const date = new Date(since ?? "");
    if (Number.isNaN(date.getTime())) return undefined;
    const format = this.ha?.locale?.time_format;
    const hour12 = format === "12" ? true : format === "24" ? false : undefined;
    const today = date.toDateString() === new Date().toDateString();
    return new Intl.DateTimeFormat(formatLocale(this.ha), {
      ...(today ? {} : { dateStyle: "medium" }),
      timeStyle: "short",
      hour12,
    }).format(date);
  }
  private valves(guard: Guard) {
    return guard.valves.map((id) => ({
      id,
      status: valveStatus(this.ha?.states[id]),
    }));
  }
  private waterValue(guard: Guard): string {
    const statuses = this.valves(guard).map((valve) => valve.status);
    if (!statuses.length) return this.t("noValves");
    if (statuses.every((status) => status === "open")) return this.t("waterOn");
    if (statuses.every((status) => status === "closed"))
      return this.t("waterOff");
    if (statuses.some((status) => status === "unavailable"))
      return this.t("waterUnknown");
    return this.t("waterMixed");
  }
  private failedOverride(guard: Guard) {
    const result = guard.result;
    if (result?.reason !== "override" || result.status !== "failed") return [];
    return Object.entries(result.valves)
      .filter(([, status]) => status !== "open")
      .map(([id]) => id);
  }
  private get running() {
    return this.pending || this.guard.result?.status === "running";
  }
  private snapshot(guard: Guard) {
    return JSON.stringify([this.config?.entity, guard.since, guard.fired]);
  }

  private closeDialog() {
    this.shadowRoot?.querySelector<HTMLDialogElement>("#confirm")?.close();
  }
  /** Close the history and drop what it loaded; a late reply is ignored. */
  private closeHistory() {
    this.history.reset();
    this.shadowRoot?.querySelector<HTMLDialogElement>("#history")?.close();
  }
  /** The leak alert, every leak sensor and every valve of this guard. */
  private historySources(): Array<{ kind: LaneKind; entityId: string }> {
    const entity = this.config?.entity;
    if (!entity) return [];
    const guard = this.guard;
    const sensors = [
      ...new Set([
        ...guard.watched,
        ...guard.fired,
        ...guard.wet,
        ...guard.unavailableSensors,
      ]),
    ];
    return [
      { kind: "alert" as const, entityId: entity },
      ...sensors.map((entityId) => ({ kind: "sensor" as const, entityId })),
      ...guard.valves.map((entityId) => ({ kind: "valve" as const, entityId })),
    ];
  }
  private async openHistory(event: Event) {
    await openHistoryDialog(
      this.history,
      this.shadowRoot,
      this,
      this.t("historyFailed"),
      event.currentTarget as HTMLElement,
    );
  }

  private moreInfo(entityId: string) {
    this.shadowRoot?.querySelector<HTMLDialogElement>("#history")?.close();
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private laneName(lane: Lane) {
    return lane.kind === "alert"
      ? this.t("leakAlert")
      : friendlyName(this.ha?.states ?? {}, lane.entityId);
  }
  private laneState(lane: Lane, state: string | undefined | null) {
    if (state === null) return "—";
    const key: Record<LaneState, MessageKey> = {
      clear: "noLeak",
      leak: lane.kind === "alert" ? "leak" : "stateWet",
      dry: "stateDry",
      open: "valveOpen",
      closed: "valveClosed",
      opening: "valveOpening",
      closing: "valveClosing",
    };
    return this.t(state ? key[state as LaneState] : "unavailable");
  }
  private historyDialog() {
    const title = this.t("historyTitle");
    const format = historyFormat(this.ha);
    return historyDialog(this.history, {
      strings: {
        ...historyStrings(this.ha),
        history: title,
        loading: this.t("loading"),
        empty: this.t("noHistory"),
        closeHistory: this.t("close"),
      },
      format,
      chart: (lanes, window, at, width) =>
        timeline(
          lanes,
          window[0],
          window[1],
          at,
          {
            time: format.time,
            lane: (lane) => this.laneName(lane),
            laneId: (lane) => lane.entityId,
            stateLabel: (lane, state) =>
              this.laneState(lane, state as LaneState | undefined),
            label: title,
            tone: (_lane, state) => TONE[state as LaneState],
          },
          width,
        ),
      isEmpty: (lanes) =>
        lanes.every(
          (lane) => !lane.marks.some(([, state]) => state !== undefined),
        ),
      timeAt: (event, svg, window) =>
        timelineTimeAt(event, svg, window[0], window[1]),
      legend: () => [],
      select: (entityId) => this.moreInfo(entityId),
      renderLegend: (lanes, at) => html`
        ${lanes.map((lane) => {
          const state =
            at === undefined
              ? lane.marks[lane.marks.length - 1]?.[1]
              : stateAt(lane, at);
          const tone =
            state === null ? "none" : state ? TONE[state as LaneState] : "gap";
          return html`<button
            class=${`lane-item tone-${tone}`}
            data-lane=${lane.entityId}
            @click=${() => this.moreInfo(lane.entityId)}
          >
            <span class="lane-swatch"></span>
            <span class="lane-name">${this.laneName(lane)}</span>
            <strong class="lane-state">${this.laneState(lane, state)}</strong>
          </button>`;
        })}
      `,
    });
  }

  private async ask() {
    const guard = this.guard;
    if (this.running || !guard.alert) return;
    this.confirming = this.snapshot(guard);
    this.error = "";
    this.requestUpdate();
    await this.updateComplete;
    this.shadowRoot!.querySelector<HTMLDialogElement>("#confirm")!.showModal();
  }
  private cancel() {
    this.confirming = undefined;
    this.closeDialog();
    this.requestUpdate();
  }
  private async execute() {
    const guard = this.guard;
    const entity = this.config?.entity;
    if (this.pending || !entity) return;
    if (!guard.alert || this.confirming !== this.snapshot(guard)) {
      this.error = this.t("changed");
      this.cancel();
      return;
    }
    this.confirming = undefined;
    this.closeDialog();
    this.pending = true;
    this.requestUpdate();
    try {
      if (!this.ha?.callService)
        throw new Error("Home Assistant service API unavailable");
      // Water Guard reports the outcome in its state; the call only asks.
      await this.ha.callService(
        "water_guard",
        "override",
        {},
        { entity_id: entity },
        false,
      );
    } catch (error) {
      if (this.config?.entity === entity)
        this.error =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error && "message" in error
              ? String(error.message)
              : String(error);
    } finally {
      this.pending = false;
      this.requestUpdate();
    }
  }

  private renderCalm(guard: Guard) {
    const valves = this.valves(guard);
    return html`
      ${
        guard.wet.length
          ? html`<p class="note sev-attention" role="status">
              ${this.t("stillWetCalm", { sensors: this.names(guard.wet) })}
            </p>`
          : nothing
      }
      ${
        guard.unavailableSensors.length
          ? html`<p class="note sev-attention">
              ${this.t("cannotWatch", {
                sensors: this.names(guard.unavailableSensors),
              })}
            </p>`
          : nothing
      }
      <div class="tiles">
        <button
          class="tile"
          data-history="sensors"
          aria-describedby="history-hint"
          @click=${this.openHistory}
        >
          <span class="value">${guard.watched.length}</span>
          <span class="label"
            >${this.t(guard.watched.length === 1 ? "sensorsOne" : "sensors")}</span
          >
        </button>
        <button
          class="tile"
          data-history="water"
          aria-describedby="history-hint"
          @click=${this.openHistory}
        >
          <span class="value">${this.waterValue(guard)}</span>
          <span class="label">${this.t("water")}</span>
        </button>
        ${
          guard.legacy
            ? nothing
            : html`<div class="tile">
                <span class="value">${guard.people.length}</span>
                <span class="label">${this.t("alerts")}</span>
              </div>`
        }
      </div>
      ${valves.length ? this.renderValves(valves) : nothing}
      ${
        guard.legacy
          ? html`<p class="note sev-unknown">${this.t("legacy")}</p>`
          : nothing
      }
    `;
  }
  private renderValves(valves: Array<{ id: string; status: ValveStatus }>) {
    return html`<ul class="valves">
      ${valves.map(
        (valve) =>
          html`<li
            class="sev-${
              valve.status === "open"
                ? "ok"
                : valve.status === "closed"
                  ? "attention"
                  : "unknown"
            }"
          >
            <button
              data-history=${valve.id}
              aria-describedby="history-hint"
              @click=${this.openHistory}
            >
              <span class="icon">${icon("valve")}</span>
              <span class="name"
                >${friendlyName(this.ha!.states, valve.id)}</span
              >
              <span class="status">${this.t(VALVE_LABEL[valve.status])}</span>
            </button>
          </li>`,
      )}
    </ul>`;
  }
  private renderPeople(guard: Guard) {
    if (!guard.people.length && !Object.keys(guard.notified).length)
      return html`<p>${this.t("noPeople")}</p>`;
    const sent = Object.entries(guard.notified)
      .filter(([, status]) => status === "sent")
      .map(([id]) => id);
    const missed = Object.entries(guard.notified).filter(
      ([, status]) => status !== "sent",
    );
    const waiting = guard.people.filter((id) => !(id in guard.notified));
    const name = (id: string) => friendlyName(this.ha!.states, id);
    return html`
      ${
        sent.length
          ? html`<p>
              <span class="strong">${this.t("notified")}:</span>
              ${this.names(sent)}
            </p>`
          : nothing
      }
      ${
        missed.length
          ? html`<p>
              <span class="strong">${this.t("notReached")}:</span>
              ${list(
                this.ha,
                missed.map(
                  ([id, status]) =>
                    `${name(id)} (${this.t(status === "no_app" ? "noApp" : "failed")})`,
                ),
              )}
            </p>`
          : nothing
      }
      ${
        waiting.length
          ? html`<p>${this.names(waiting)}: ${this.t("sending")}</p>`
          : nothing
      }
    `;
  }
  private renderAlert(guard: Guard) {
    const valves = this.valves(guard);
    const open = valves.filter((valve) => valve.status !== "closed");
    const failed = this.failedOverride(guard);
    const since = this.time(guard.since);
    return html`<section class="alert" aria-label=${this.t("leakDetected")}>
      <div class="alert-head">
        <span class="icon sev-alarm">${icon("leak")}</span>
        <span class="text">
          <strong>${this.t("leakDetected")}</strong>
          ${
            since
              ? html`<span class="sub"
                  >${this.t("since", { time: since })}</span
                >`
              : nothing
          }
        </span>
        <span class="timer"
          ><small>${this.t("detectedFor")}</small>${
            this.duration(guard.since) ?? "–"
          }</span
        >
      </div>
      <ul class="fired">
        ${guard.fired.map((id) => {
          const wet = guard.wet.includes(id);
          const gone = guard.unavailableSensors.includes(id);
          return html`<li>
            <button
              data-history=${id}
              aria-describedby="history-hint"
              @click=${this.openHistory}
            >
              <strong>${friendlyName(this.ha!.states, id)}</strong>
              <span class="badge ${wet ? "wet" : ""}"
                >${this.t(
                  wet ? "stillWet" : gone ? "sensorUnavailable" : "dryNow",
                )}</span
              >
            </button>
          </li>`;
        })}
      </ul>
      <p class="strong">
        ${
          !valves.length
            ? this.t("checkWater")
            : open.length
              ? this.t("waterNotShut", {
                  valves: this.names(open.map((v) => v.id)),
                })
              : this.t("waterShut")
        }
      </p>
      ${
        failed.length
          ? html`<p class="strong" role="alert">
              ${this.t("valveFailed", { valves: this.names(failed) })}
            </p>`
          : nothing
      }
      ${this.renderPeople(guard)}
      <button
        class="override"
        data-override
        ?disabled=${this.running}
        @click=${this.ask}
      >
        ${this.t(this.running ? "opening" : "override")}
      </button>
    </section>`;
  }
  private renderConfirm(guard: Guard) {
    return html`<dialog
      id="confirm"
      aria-labelledby="confirm-title"
      @cancel=${() => (this.confirming = undefined)}
    >
      <h2 id="confirm-title">${this.t("overrideTitle")}</h2>
      <p>
        ${
          guard.valves.length
            ? this.t("overrideValves", { valves: this.names(guard.valves) })
            : this.t("overrideNoValves")
        }
      </p>
      ${
        guard.wet.length
          ? html`<p class="note sev-attention">
              ${this.t("overrideWet", { sensors: this.names(guard.wet) })}
            </p>`
          : nothing
      }
      <div class="actions">
        <button data-cancel @click=${this.cancel}>${this.t("cancel")}</button>
        <button data-confirm class="danger" @click=${this.execute}>
          ${this.t("confirm")}
        </button>
      </div>
    </dialog>`;
  }

  render() {
    if (!this.config) return nothing;
    const state = this.config.entity
      ? this.ha?.states[this.config.entity]
      : undefined;
    const guard = this.guard;
    const severity = !guard.available
      ? "unknown"
      : guard.alert
        ? "alarm"
        : guard.wet.length || guard.unavailableSensors.length
          ? "attention"
          : "ok";
    const sub = !guard.available
      ? ""
      : guard.alert
        ? ""
        : this.t(guard.watched.length === 1 ? "watchingOne" : "watching", {
            n: guard.watched.length,
          });
    return html`<ha-card class=${this.config.appearance}>
        <div class="head sev-${severity}">
          <span class="icon"
            >${icon(!guard.available ? "unknown" : guard.alert ? "leak" : "drop")}</span
          >
          <span class="text">
            <strong>${this.config.title ?? this.t("title")}</strong>
            ${sub ? html`<span class="sub">${sub}</span>` : nothing}
          </span>
          <button
            class="status-button"
            data-history="alert"
            aria-describedby="history-hint"
            ?disabled=${!state}
            @click=${this.openHistory}
          >
            <span class="status"
              >${this.t(
                !guard.available
                  ? "unavailable"
                  : guard.alert
                    ? "leak"
                    : "noLeak",
              )}</span
            >
          </button>
          <a
            class="settings"
            href="/config/integrations/integration/water_guard"
            aria-label=${this.t("settings")}
            title=${this.t("settings")}
            >${icon("cog")}</a
          >
        </div>
        ${
          !state
            ? html`<p class="note sev-unknown" role="alert">
                ${this.t("missing")}
              </p>`
            : !guard.available
              ? html`<p class="note sev-unknown" role="status">
                  ${this.t("unavailableHelp")}
                </p>`
              : guard.alert
                ? this.renderAlert(guard)
                : this.renderCalm(guard)
        }
        ${
          this.error
            ? html`<p class="note sev-alarm" role="alert">
                ${this.t("overrideFailed")}: ${this.error}
              </p>`
            : nothing
        }
        <span id="history-hint" hidden>${this.t("showHistory")}</span>
      </ha-card>
      ${this.renderConfirm(guard)}${this.historyDialog()}`;
  }
}

customElements.define("water-guard-card", WaterGuardCard);

// Card-picker metadata has no hass context, so it stays English.
const registry = window as unknown as {
  customCards?: Array<Record<string, unknown>>;
};
registry.customCards ??= [];
registry.customCards.push({
  type: "water-guard-card",
  name: "Water Guard",
  description: "Leak alert and water override for Water Guard",
  preview: true,
  documentationURL: "https://github.com/mvheimburg/lovelace-water-guard",
});
