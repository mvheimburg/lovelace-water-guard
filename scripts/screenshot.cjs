const { chromium } = require("playwright");
const { readFileSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "..");

const light = `--primary-text-color: #1b1b1a; --secondary-text-color: #5b5a55; --card-background-color: #fff; --secondary-background-color: #f3f2ee; --divider-color: #e4e2dc; --primary-color: #1d4ed8; background: #eeede9;`;
const dark = `--primary-text-color: #ecebe8; --secondary-text-color: #a9a8a3; --card-background-color: #1a1c20; --secondary-background-color: #25272c; --divider-color: #2f3137; --primary-color: #8ab4f8; --bubble-main-background-color: #1a1c20; --bubble-secondary-background-color: #25272c; --bubble-border-radius: 32px; --bubble-sub-button-border-radius: 22px; background: #121316;`;

/** Simulated Home Assistant states: no live Home Assistant is involved. */
function states(variant) {
  const entity = (entity_id, state, name) => ({
    entity_id,
    state,
    attributes: { friendly_name: name },
  });
  const base = {
    "binary_sensor.kitchen_leak": entity(
      "binary_sensor.kitchen_leak",
      "off",
      "Kitchen sink",
    ),
    "binary_sensor.boiler_leak": entity(
      "binary_sensor.boiler_leak",
      "off",
      "Boiler",
    ),
    "binary_sensor.laundry_leak": entity(
      "binary_sensor.laundry_leak",
      "off",
      "Laundry",
    ),
    "valve.main": entity("valve.main", "open", "Main valve"),
    "person.resident_1": entity("person.resident_1", "home", "Beboer 1"),
    "person.resident_2": entity("person.resident_2", "home", "Beboer 2"),
  };
  const leak = {
    entity_id: "binary_sensor.water_leak",
    state: "off",
    attributes: {
      friendly_name: "Water Leak",
      leak_sensors: Object.keys(base).filter((id) =>
        id.startsWith("binary_sensor."),
      ),
      valves: ["valve.main"],
      people: ["person.resident_1", "person.resident_2"],
      since: null,
      sensors: [],
      notified: {},
      wet_sensors: [],
      unavailable_sensors: [],
      last_result: null,
    },
  };
  if (variant === "alert") {
    leak.state = "on";
    Object.assign(leak.attributes, {
      since: new Date(Date.now() - 14 * 60000).toISOString(),
      sensors: ["binary_sensor.kitchen_leak", "binary_sensor.laundry_leak"],
      wet_sensors: ["binary_sensor.kitchen_leak"],
      notified: { "person.resident_1": "sent", "person.resident_2": "no_app" },
    });
    base["valve.main"].state = "closed";
  }
  if (variant === "wet") {
    leak.attributes.wet_sensors = ["binary_sensor.kitchen_leak"];
    leak.attributes.unavailable_sensors = ["binary_sensor.boiler_leak"];
  }
  return { ...base, "binary_sensor.water_leak": leak };
}

async function shot(
  browser,
  errors,
  { file, width, height, theme, cards, history = false },
) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setContent(`<style>
    body { margin: 0; padding: 28px; font: 15px system-ui, sans-serif; ${theme} }
    main { display: flex; gap: 24px; align-items: flex-start; }
    main > * { display: block; flex: 0 0 380px; }
  </style><main></main>`);
  await page.addScriptTag({
    type: "module",
    content: readFileSync(resolve(root, "dist/water-guard-card.js"), "utf8"),
  });
  await page.evaluate(async (cards) => {
    await customElements.whenDefined("water-guard-card");
    for (const { config, states } of cards) {
      const card = document.createElement("water-guard-card");
      card.setConfig({ entity: "binary_sensor.water_leak", ...config });
      card.hass = {
        states,
        language: "en",
        locale: { language: "en-GB" },
        callService: async () => {},
        callWS: async (message) => {
          const start = Date.parse(message.start_time) / 1000;
          const now = Date.now() / 1000;
          return Object.fromEntries(
            message.entity_ids.map((id) => {
              const valve = id.startsWith("valve.");
              const quiet = valve ? "open" : "off";
              const active = valve ? "closed" : "on";
              const marks = id.includes("boiler")
                ? [
                    [quiet, start],
                    ["unavailable", now - 12 * 3600],
                    [quiet, now - 8 * 3600],
                  ]
                : [
                    [quiet, start],
                    [active, now - 6 * 3600],
                    [quiet, now - 4 * 3600],
                  ];
              return [id, marks.map(([s, lu]) => ({ s, lu }))];
            }),
          );
        },
      };
      document.querySelector("main").append(card);
    }
  }, cards);
  await page.waitForFunction(
    (count) =>
      [...document.querySelectorAll("water-guard-card")].filter((card) =>
        card.shadowRoot?.querySelector("ha-card"),
      ).length === count,
    cards.length,
  );
  if (history) {
    await page.locator('water-guard-card [data-history="water"]').click();
    await page.locator("water-guard-card #history .timeline").waitFor();
    await page.waitForTimeout(100);
  }
  await page.screenshot({ path: resolve(root, "docs", file), fullPage: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const errors = [];
    mkdirSync(resolve(root, "docs"), { recursive: true });
    const cards = (appearance) => [
      { config: { appearance }, states: states("calm") },
      { config: { appearance }, states: states("wet") },
      { config: { appearance }, states: states("alert") },
    ];
    await shot(browser, errors, {
      file: "water-guard-light.png",
      width: 1300,
      height: 700,
      theme: light,
      cards: cards("default"),
    });
    await shot(browser, errors, {
      file: "water-guard-dark.png",
      width: 1300,
      height: 700,
      theme: dark,
      cards: cards("bubble"),
    });
    await shot(browser, errors, {
      file: "water-guard-history.png",
      width: 760,
      height: 790,
      theme: dark,
      cards: [{ config: { appearance: "bubble" }, states: states("calm") }],
      history: true,
    });
    if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
    console.log(
      "Wrote docs/water-guard-light.png docs/water-guard-dark.png and docs/water-guard-history.png with simulated Home Assistant data.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
