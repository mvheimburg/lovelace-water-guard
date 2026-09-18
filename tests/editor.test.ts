import { afterEach, expect, it } from "vitest";
import "../src/editor";
import { LEAK, fixture, leak, settle } from "./fixtures";
import type { HomeAssistant } from "../src/types";

type Editor = HTMLElement & {
  setConfig(config: Record<string, unknown>): void;
  hass: HomeAssistant;
};

afterEach(() => document.body.replaceChildren());

async function mount(hass: HomeAssistant, config: Record<string, unknown>) {
  const editor = document.createElement("water-guard-card-editor") as Editor;
  editor.hass = hass;
  editor.setConfig(config);
  document.body.append(editor);
  await settle();
  return { editor, root: editor.shadowRoot! };
}

it("offers only Water Guard sensors and emits the chosen entity", async () => {
  const hass = fixture();
  hass.states["binary_sensor.cabin_leak"] = {
    ...leak("off", { friendly_name: "Cabin Leak" }),
    entity_id: "binary_sensor.cabin_leak",
  };
  hass.states["binary_sensor.door"] = {
    entity_id: "binary_sensor.door",
    state: "off",
    attributes: { friendly_name: "Door" },
  };
  const { editor, root } = await mount(hass, {
    type: "custom:water-guard-card",
    entity: LEAK,
  });
  const select = root.querySelector<HTMLSelectElement>(
    '[data-field="entity"]',
  )!;
  expect(Array.from(select.options).map((option) => option.value)).toEqual([
    "",
    "binary_sensor.cabin_leak",
    LEAK,
  ]);
  let config: Record<string, unknown> | undefined;
  editor.addEventListener("config-changed", (event) => {
    config = (event as CustomEvent).detail.config;
  });
  select.value = "binary_sensor.cabin_leak";
  select.dispatchEvent(new Event("change"));
  expect(config).toEqual({
    type: "custom:water-guard-card",
    entity: "binary_sensor.cabin_leak",
  });
});

it("removes an emptied title, keeps appearance values stable and speaks Bokmål", async () => {
  const hass = fixture();
  hass.language = "nb-NO";
  const { editor, root } = await mount(hass, { entity: LEAK, title: "Hytta" });
  expect(root.textContent).toContain("Utseende");
  const configs: Array<Record<string, unknown>> = [];
  editor.addEventListener("config-changed", (event) =>
    configs.push((event as CustomEvent).detail.config),
  );
  const title = root.querySelector<HTMLInputElement>('[data-field="title"]')!;
  title.value = "";
  title.dispatchEvent(new Event("change"));
  const appearance = root.querySelector<HTMLSelectElement>(
    '[data-field="appearance"]',
  )!;
  appearance.value = "bubble";
  appearance.dispatchEvent(new Event("change"));
  expect(configs).toEqual([
    { entity: LEAK },
    { entity: LEAK, appearance: "bubble" },
  ]);
});

it("keeps an unknown configured entity visible and explains when no guard exists", async () => {
  const hass = fixture();
  delete hass.states[LEAK];
  const { root } = await mount(hass, { entity: "binary_sensor.gone" });
  const select = root.querySelector<HTMLSelectElement>(
    '[data-field="entity"]',
  )!;
  expect(select.value).toBe("binary_sensor.gone");
  const empty = await mount(hass, { entity: "" });
  expect(empty.root.textContent).toContain("No Water Guard found");
});
