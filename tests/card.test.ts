import { afterEach, describe, expect, it } from "vitest";
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
