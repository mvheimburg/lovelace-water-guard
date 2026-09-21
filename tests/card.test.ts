import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/water-guard-card";
import { WaterGuardCard } from "../src/water-guard-card";
import { LEAK, fixture, leak, settle, text } from "./fixtures";
import type { HomeAssistant } from "../src/types";

type Card = HTMLElement & {
  setConfig(config: Record<string, unknown>): void;
  hass: HomeAssistant;
};

afterEach(() => document.body.replaceChildren());

async function mount(
  hass: HomeAssistant,
  config: Record<string, unknown> = {},
) {
  const card = document.createElement("water-guard-card") as Card;
  card.setConfig({ entity: LEAK, ...config });
  card.hass = hass;
  document.body.append(card);
  await settle();
  return { card, root: card.shadowRoot! };
}

const alerting = (extra: Record<string, unknown> = {}) =>
  leak("on", {
    since: new Date(Date.now() - 12 * 60000).toISOString(),
    sensors: ["binary_sensor.sink_leak"],
    wet_sensors: ["binary_sensor.sink_leak"],
    notified: { "person.kari": "sent", "person.ola": "no_app" },
    ...extra,
  });

describe("calm", () => {
  it("shows what is guarded in Bokmål, with the settings link and no override", async () => {
    const hass = fixture();
    hass.language = "nb";
    const { root } = await mount(hass);
    const card = text(root);
    expect(card).toContain("Vannvakt");
    expect(card).toContain("Ingen lekkasje");
    expect(card).toContain("Overvåker 2 sensorer");
    expect(card).toContain("Main valve Åpen");
    expect(card).toContain("2 varsles ved lekkasje");
    expect(root.querySelector("a.settings")?.getAttribute("href")).toBe(
      "/config/integrations/integration/water_guard",
    );
    expect(root.querySelector("a.settings")?.getAttribute("aria-label")).toBe(
      "Innstillinger for Vannvakt",
    );
    expect(root.querySelector("[data-override]")).toBeNull();
  });
  it("keeps the user's title and says when a sensor is still wet or cannot be watched", async () => {
    const hass = fixture(
      leak("off", {
        wet_sensors: ["binary_sensor.sink_leak"],
        unavailable_sensors: ["binary_sensor.boiler_leak"],
      }),
    );
    const { root } = await mount(hass, { title: "Hytta" });
    expect(text(root)).toContain("Hytta");
    expect(text(root)).toContain(
      "Sink still reports water, but the alert was overridden.",
    );
    expect(text(root)).toContain("Cannot watch: Boiler.");
  });
  it("reads a switch that drives a valve and summarises the water", async () => {
    const hass = fixture(
      leak("off", { valves: ["switch.knx_valve", "valve.main"] }),
    );
    hass.states["switch.knx_valve"] = {
      entity_id: "switch.knx_valve",
      state: "off",
      attributes: { friendly_name: "KNX valve" },
    };
    const { root } = await mount(hass);
    expect(text(root)).toContain("Partly off Water");
    expect(text(root)).toContain("KNX valve Closed");
  });
  it("falls back to what an older Water Guard reports and asks for an update", async () => {
    const state = leak("off", {
      last_result: {
        target: "open",
        reason: "override",
        status: "ok",
        valves: { "valve.main": "open" },
      },
    });
    delete state.attributes.leak_sensors;
    delete state.attributes.valves;
    delete state.attributes.people;
    const { root } = await mount(fixture(state));
    expect(text(root)).toContain("Main valve Open");
    expect(text(root)).toContain("Update Water Guard to 0.2.0");
  });
});

describe("alert", () => {
  it("names the sensors, the water and who was reached", async () => {
    const hass = fixture(alerting());
    hass.states["valve.main"].state = "closed";
    const { root } = await mount(hass);
    const alert = text(root, ".alert");
    expect(alert).toContain("Water leak");
    expect(alert).toContain("12 min");
    expect(alert).toContain("Sink Still wet");
    expect(alert).toContain("The water is shut off.");
    expect(alert).toContain("Alerted: Kari");
    expect(alert).toContain("Not reached: Ola (no app)");
  });
  it("says which valve is still open and who is still being alerted", async () => {
    const hass = fixture(
      alerting({
        sensors: ["binary_sensor.sink_leak", "binary_sensor.boiler_leak"],
        wet_sensors: [],
        notified: {},
      }),
    );
    const { root } = await mount(hass);
    const alert = text(root, ".alert");
    expect(alert).toContain("Sink Dry now");
    expect(alert).toContain("Not shut off: Main valve.");
    expect(alert).toContain("Kari and Ola: sending…");
  });
  it("cancel makes no call; confirm calls the override once and shows it pending", async () => {
    let release!: () => void;
    const hass = fixture(
      alerting(),
      () => new Promise<void>((resolve) => (release = resolve)),
    );
    const { root } = await mount(hass);
    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    const dialog = root.querySelector<HTMLDialogElement>("#confirm")!;
    expect(dialog.open).toBe(true);
    expect(text(root, "#confirm")).toContain(
      "Opens Main valve and clears the leak alert",
    );
    expect(text(root, "#confirm")).toContain("Sink still reports water");
    root.querySelector<HTMLButtonElement>("[data-cancel]")!.click();
    await settle();
    expect(dialog.open).toBe(false);
    expect(hass.calls).toEqual([]);

    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    root.querySelector<HTMLButtonElement>("[data-confirm]")!.click();
    root.querySelector<HTMLButtonElement>("[data-confirm]")!.click();
    await settle();
    expect(hass.calls).toEqual([
      ["water_guard", "override", {}, { entity_id: LEAK }, false],
    ]);
    const button = root.querySelector<HTMLButtonElement>("[data-override]")!;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain("Opening the water…");
    button.click();
    await settle();
    expect(dialog.open).toBe(false);
    release();
    await settle();
    expect(button.disabled).toBe(false);
  });
  it("shows a rejected override and keeps the alert and action", async () => {
    const hass = fixture(alerting(), async () => {
      throw new Error("Not every water valve opened: valve.main: failed.");
    });
    const { root } = await mount(hass);
    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    root.querySelector<HTMLButtonElement>("[data-confirm]")!.click();
    await settle();
    expect(root.querySelector('[role="alert"].note')?.textContent).toContain(
      "Not every water valve opened",
    );
    expect(root.querySelector(".alert")).not.toBeNull();
    expect(
      root.querySelector<HTMLButtonElement>("[data-override]")!.disabled,
    ).toBe(false);
  });
  it("refuses to confirm an alert that changed while the dialog was open", async () => {
    const hass = fixture(alerting());
    const { card, root } = await mount(hass);
    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    hass.states[LEAK] = alerting({
      sensors: ["binary_sensor.sink_leak", "binary_sensor.boiler_leak"],
    });
    card.hass = { ...hass };
    await settle();
    root.querySelector<HTMLButtonElement>("[data-confirm]")!.click();
    await settle();
    expect(hass.calls).toEqual([]);
    expect(text(root)).toContain("The alert changed");
  });
  it("disables the override while Water Guard is moving valves and reports a valve that failed", async () => {
    const running = fixture(
      alerting({
        last_result: {
          target: "open",
          reason: "override",
          status: "running",
          valves: {},
        },
      }),
    );
    const { root } = await mount(running);
    expect(
      root.querySelector<HTMLButtonElement>("[data-override]")!.disabled,
    ).toBe(true);
    document.body.replaceChildren();
    const failed = fixture(
      alerting({
        last_result: {
          target: "open",
          reason: "override",
          status: "failed",
          valves: { "valve.main": "failed" },
        },
      }),
    );
    const second = await mount(failed);
    expect(text(second.root, ".alert")).toContain(
      "Did not open: Main valve. The leak alert stays.",
    );
  });
  it("says to open the water by hand when Water Guard controls no valves", async () => {
    const hass = fixture(alerting({ valves: [] }));
    const { root } = await mount(hass);
    expect(text(root, ".alert")).toContain("Check that the water is shut off.");
    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    expect(text(root, "#confirm")).toContain("controls no valves");
  });
});

describe("availability and locale", () => {
  it("disables the action while Water Guard is unavailable and explains a missing sensor", async () => {
    const hass = fixture(leak("unavailable"));
    const { card, root } = await mount(hass);
    expect(text(root)).toContain("Unavailable");
    expect(text(root)).toContain("The override is disabled");
    expect(root.querySelector("[data-override]")).toBeNull();
    expect(root.querySelector("a.settings")).not.toBeNull();
    card.setConfig({ entity: "binary_sensor.missing" });
    await settle();
    expect(text(root)).toContain("Water Guard sensor not found");
  });
  it("clears an old failure when the card switches to another guard", async () => {
    const hass = fixture(alerting(), async () => {
      throw new Error("Denied");
    });
    hass.states["binary_sensor.cabin_leak"] = {
      ...leak("off"),
      entity_id: "binary_sensor.cabin_leak",
    };
    const { card, root } = await mount(hass);
    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    root.querySelector<HTMLButtonElement>("[data-confirm]")!.click();
    await settle();
    expect(text(root)).toContain("Denied");
    card.setConfig({ entity: "binary_sensor.cabin_leak" });
    await settle();
    expect(text(root)).not.toContain("Denied");
  });
  it("keeps en-GB's 24-hour clock with English labels, and follows a language change live", async () => {
    const since = new Date();
    since.setHours(14, 5, 0, 0);
    const hass = fixture(alerting({ since: since.toISOString() }));
    hass.locale = { language: "en-GB", time_format: "language" };
    const { card, root } = await mount(hass);
    expect(text(root, ".alert")).toContain("Since 14:05");
    card.hass = { ...hass, language: "NO", locale: { language: "no" } };
    await settle();
    expect(text(root, ".alert")).toContain("Siden 14:05");
    expect(text(root, ".alert")).toContain("Overstyr: åpne vannet");
    card.hass = {
      ...hass,
      language: "en",
      locale: { language: "en-US", time_format: "12" },
    };
    await settle();
    expect(text(root, ".alert")).toMatch(/Since 2:05\s?PM/);
  });
  it("validates configuration and picks the first guard for a new card", () => {
    const card = new WaterGuardCard();
    expect(() => card.setConfig({ entity: "switch.valve" })).toThrow(
      "binary_sensor",
    );
    expect(() => card.setConfig({ entity: LEAK, appearance: "fancy" })).toThrow(
      "appearance",
    );
    expect(() => card.setConfig({ entity: LEAK, title: 3 })).toThrow("title");
    const hass = fixture();
    hass.states["binary_sensor.plain"] = {
      entity_id: "binary_sensor.plain",
      state: "off",
      attributes: {},
    };
    expect(WaterGuardCard.getStubConfig(hass)).toEqual({ entity: LEAK });
    expect(WaterGuardCard.getStubConfig()).toEqual({ entity: "" });
  });
});

const HOUR = 3_600_000;
/** The fixture with a recorder: the alert fired 20 h ago, Boiler dropped out. */
function withHistory(now: number, fail?: Error) {
  const hass = fixture();
  const s = (ms: number) => ms / 1000;
  const history = vi.fn(async (m: Record<string, unknown>) => {
    if (fail) throw fail;
    const rows: Record<string, unknown[]> = {
      [LEAK]: [
        { s: "off", lu: s(now - 24 * HOUR) },
        { s: "on", lu: s(now - 20 * HOUR) },
        { s: "off", lu: s(now - 18 * HOUR) },
      ],
      "binary_sensor.sink_leak": [
        { s: "off", lu: s(now - 24 * HOUR) },
        { s: "on", lu: s(now - 20 * HOUR) },
        { s: "off", lu: s(now - 19 * HOUR) },
      ],
      "binary_sensor.boiler_leak": [
        { s: "off", lu: s(now - 24 * HOUR) },
        { s: "unavailable", lu: s(now - 12 * HOUR) },
        { s: "off", lu: s(now - 8 * HOUR) },
      ],
      "valve.main": [
        { s: "open", lu: s(now - 24 * HOUR) },
        { s: "closing", lu: s(now - 20 * HOUR) },
        { s: "closed", lu: s(now - 19.9 * HOUR) },
        { s: "open", lu: s(now - 18 * HOUR) },
      ],
    };
    return Object.fromEntries(
      (m.entity_ids as string[]).map((id) => [id, rows[id] ?? []]),
    );
  });
  hass.callWS = history as HomeAssistant["callWS"];
  return { hass, history };
}
const legend = (root: ShadowRoot) =>
  Array.from(root.querySelectorAll(".history-legend .lane-item")).map((i) =>
    i.textContent!.replace(/\s+/g, " ").trim(),
  );
async function opened(root: ShadowRoot, selector: string) {
  root.querySelector<HTMLButtonElement>(selector)!.click();
  await vi.waitFor(() => expect(legend(root).length).toBeGreaterThan(0));
  await settle();
}

describe("history", () => {
  it("opens one timeline of the alert, each leak sensor and each valve from a valve", async () => {
    const now = Date.now();
    const { hass, history } = withHistory(now);
    const { root } = await mount(hass);
    await opened(root, '[data-history="valve.main"]');
    const dialog = root.querySelector<HTMLDialogElement>("#history")!;
    expect(dialog.open).toBe(true);
    expect(history).toHaveBeenCalledTimes(1);
    const message = history.mock.calls[0][0];
    expect(message).toMatchObject({
      type: "history/history_during_period",
      entity_ids: [
        LEAK,
        "binary_sensor.sink_leak",
        "binary_sensor.boiler_leak",
        "valve.main",
      ],
      minimal_response: true,
      no_attributes: true,
      significant_changes_only: false,
    });
    expect(Date.parse(String(message.start_time))).toBeCloseTo(
      now - 24 * HOUR,
      -4,
    );
    expect(text(root, "#history-title")).toBe("Leak and valve history");
    expect(legend(root)).toEqual([
      "Leak alert No leak",
      "Sink Dry",
      "Boiler Dry",
      "Main valve Open",
    ]);
    const lanes = root.querySelectorAll(".timeline .lane");
    expect(lanes).toHaveLength(4);
    const states = (id: string) =>
      Array.from(
        root.querySelectorAll(`.timeline [data-lane="${id}"] .band`),
      ).map((band) => band.getAttribute("data-state"));
    expect(states(LEAK)).toEqual(["clear", "leak", "clear"]);
    expect(states("valve.main")).toEqual(["open", "closing", "closed", "open"]);
    // Boiler's unavailable spell is a hatched gap between two dry spells.
    expect(states("binary_sensor.boiler_leak")).toEqual([
      "dry",
      "unavailable",
      "dry",
    ]);
    expect(
      root
        .querySelector('[data-lane="binary_sensor.boiler_leak"] .tone-gap')
        ?.getAttribute("class"),
    ).toContain("band");
    expect(
      root
        .querySelector(`[data-lane="${LEAK}"] [data-state="leak"]`)
        ?.getAttribute("class"),
    ).toContain("tone-alarm");
    expect(
      root
        .querySelector('[data-lane="valve.main"] [data-state="closed"]')
        ?.getAttribute("class"),
    ).toContain("tone-attention");
    dialog.close();
    await opened(root, '[data-history="alert"]');
    expect(dialog.open).toBe(true);
    dialog.close();
    await opened(root, '[data-history="sensors"]');
    expect(dialog.open).toBe(true);
  });

  it("opens from a sensor in the alert and keeps the override and its confirmation", async () => {
    const { hass } = withHistory(Date.now());
    hass.states[LEAK] = alerting();
    const { root } = await mount(hass);
    await opened(root, '[data-history="binary_sensor.sink_leak"]');
    expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(true);
    root.querySelector<HTMLButtonElement>("[data-close]")!.click();
    await settle();
    expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(false);
    root.querySelector<HTMLButtonElement>("[data-override]")!.click();
    await settle();
    expect(root.querySelector<HTMLDialogElement>("#confirm")!.open).toBe(true);
    expect(hass.calls).toEqual([]);
  });

  it("reads each lane's state under the pointer, changes range and opens more-info", async () => {
    const now = Date.now();
    const { hass, history } = withHistory(now);
    const { card, root } = await mount(hass);
    await opened(root, '[data-history="water"]');
    const chart = root.querySelector<SVGSVGElement>(".timeline")!;
    const box = chart.getBoundingClientRect();
    const width = chart.viewBox.baseVal.width;
    const pointAt = async (hoursAgo: number) => {
      const ratio = (24 - hoursAgo) / 24;
      root.querySelector(".history-plot")!.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: box.left + ((12 + ratio * (width - 24)) / width) * box.width,
        }),
      );
      await settle();
    };
    await pointAt(19.5);
    expect(legend(root)).toEqual([
      "Leak alert Leak",
      "Sink Wet",
      "Boiler Dry",
      "Main valve Closed",
    ]);
    expect(text(root, ".history-when")).not.toBe("Now");
    await pointAt(10);
    expect(legend(root)).toContain("Boiler Unavailable");
    root
      .querySelector(".history-plot")!
      .dispatchEvent(new PointerEvent("pointerleave"));
    await settle();
    expect(text(root, ".history-when")).toBe("Now");

    root.querySelector<HTMLButtonElement>('[data-range="6"]')!.click();
    await vi.waitFor(() => expect(history).toHaveBeenCalledTimes(2));
    expect(Date.parse(String(history.mock.calls[1][0].start_time))).toBeCloseTo(
      now - 6 * HOUR,
      -4,
    );
    await vi.waitFor(() =>
      expect(
        root.querySelector('[data-range="6"]')!.getAttribute("aria-pressed"),
      ).toBe("true"),
    );
    const info: string[] = [];
    card.addEventListener("hass-more-info", (e) =>
      info.push((e as CustomEvent).detail.entityId),
    );
    await vi.waitFor(() => expect(legend(root)).toHaveLength(4));
    root
      .querySelector<HTMLButtonElement>(
        '.lane-item[data-lane="binary_sensor.boiler_leak"]',
      )!
      .click();
    expect(info).toEqual(["binary_sensor.boiler_leak"]);
    expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(false);
  });

  it("explains a failed history request in Bokmål, with Norwegian ranges", async () => {
    const { hass } = withHistory(Date.now(), new Error("Recorder is off"));
    hass.language = "nb";
    hass.locale = { language: "nb-NO", time_format: "language" };
    const { root } = await mount(hass);
    root.querySelector<HTMLButtonElement>('[data-history="alert"]')!.click();
    await vi.waitFor(() =>
      expect(text(root, "#history [role=alert]")).toBe(
        "Kunne ikke hente historikk: Recorder is off",
      ),
    );
    expect(
      Array.from(root.querySelectorAll("[data-range]")).map((b) =>
        b.textContent!.trim(),
      ),
    ).toEqual(["6 t", "24 t", "7 d"]);
    expect(text(root, "#history-title")).toBe("Lekkasje- og ventilhistorikk");
    expect(root.querySelector("[data-close]")?.getAttribute("aria-label")).toBe(
      "Lukk",
    );
  });

  it("reads Bokmål states, falls back to the connection and ignores a stale reply", async () => {
    const now = Date.now();
    const { hass, history } = withHistory(now);
    hass.language = "nb";
    delete hass.callWS;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    let asked = 0;
    hass.connection = {
      sendMessagePromise: (async (m: Record<string, unknown>) => {
        if (asked++ === 0) await gate;
        return history(m);
      }) as NonNullable<HomeAssistant["connection"]>["sendMessagePromise"],
    };
    const { root } = await mount(hass);
    root
      .querySelector<HTMLButtonElement>('[data-history="valve.main"]')!
      .click();
    await settle();
    expect(text(root, ".history-plot")).toBe("Laster…");
    // A newer range answers first; the older reply must not replace it.
    root.querySelector<HTMLButtonElement>('[data-range="168"]')!.click();
    await vi.waitFor(() => expect(legend(root)).toHaveLength(4));
    release();
    await settle();
    expect(
      root.querySelector('[data-range="168"]')!.getAttribute("aria-pressed"),
    ).toBe("true");
    expect(legend(root)).toEqual([
      "Lekkasjevarsel Ingen lekkasje",
      "Sink Tørt",
      "Boiler Tørt",
      "Main valve Åpen",
    ]);
  });

  it("says when there is no history and fails clearly without a websocket", async () => {
    const hass = fixture(leak("unavailable", { leak_sensors: [], valves: [] }));
    hass.callWS = (async () => ({})) as HomeAssistant["callWS"];
    const { root } = await mount(hass);
    root.querySelector<HTMLButtonElement>('[data-history="alert"]')!.click();
    await vi.waitFor(() =>
      expect(text(root, ".history-plot")).toBe("No history for this period"),
    );
    root.querySelector<HTMLButtonElement>("[data-close]")!.click();
    delete hass.callWS;
    root.querySelector<HTMLButtonElement>('[data-history="alert"]')!.click();
    await vi.waitFor(() =>
      expect(text(root, "#history [role=alert]")).toContain(
        "Home Assistant history API unavailable",
      ),
    );
  });
});
