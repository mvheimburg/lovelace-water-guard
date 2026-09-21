import type { HomeAssistant } from "./types";

const norwegian = (value: string) => /^(nb|nn|no)(-|$)/.test(value);
const normalize = (value?: string) =>
  (value ?? "").replace(/_/g, "-").toLowerCase();

/** Dictionary language: Bokmål for nb, no and nn (no Nynorsk dictionary), else English. */
export function dictionary(hass?: Pick<HomeAssistant, "language" | "locale">) {
  return norwegian(normalize(hass?.language || hass?.locale?.language))
    ? "nb"
    : "en";
}

/**
 * Formatting locale, kept apart from the dictionary: en-GB keeps its
 * 24-hour clock even though its labels come from the English dictionary.
 */
export function formatLocale(
  hass?: Pick<HomeAssistant, "language" | "locale">,
): string {
  const value = normalize(hass?.locale?.language || hass?.language || "en");
  if (norwegian(value)) return "nb-NO";
  try {
    return Intl.getCanonicalLocales(value)[0] ?? "en";
  } catch {
    return "en";
  }
}

const en = {
  title: "Water Guard",
  noLeak: "No leak",
  leak: "Leak",
  leakDetected: "Water leak",
  unavailable: "Unavailable",
  unavailableHelp:
    "Water Guard is not reporting right now. The override is disabled until it is back.",
  missing: "Water Guard sensor not found. Choose it in the card editor.",
  settings: "Water Guard settings",
  watching: "Watching {n} sensors",
  watchingOne: "Watching 1 sensor",
  sensors: "sensors",
  sensorsOne: "sensor",
  water: "Water",
  waterOn: "On",
  waterOff: "Off",
  waterMixed: "Partly off",
  waterUnknown: "Unknown",
  noValves: "Not controlled",
  alerts: "alerted on a leak",
  valveOpen: "Open",
  valveClosed: "Closed",
  valveMoving: "Moving",
  valveUnavailable: "Unavailable",
  detectedFor: "Detected for",
  since: "Since {time}",
  stillWet: "Still wet",
  dryNow: "Dry now",
  sensorUnavailable: "Unavailable",
  waterShut: "The water is shut off.",
  waterNotShut: "Not shut off: {valves}. Shut the water off by hand.",
  checkWater: "Check that the water is shut off.",
  notified: "Alerted",
  notReached: "Not reached",
  noApp: "no app",
  failed: "failed",
  sending: "sending…",
  noPeople: "No one is set up to be alerted.",
  override: "Override: open water",
  overrideTitle: "Open the water?",
  overrideValves:
    "Opens {valves} and clears the leak alert, also on everyone's phones.",
  overrideNoValves:
    "Clears the leak alert, also on everyone's phones. Water Guard controls no valves, so open the water where it was shut off.",
  overrideWet: "{sensors} still reports water. The override opens it anyway.",
  cancel: "Cancel",
  confirm: "Open the water",
  opening: "Opening the water…",
  changed: "The alert changed. Review it and try again.",
  overrideFailed: "Override failed",
  stillWetCalm: "{sensors} still reports water, but the alert was overridden.",
  cannotWatch: "Cannot watch: {sensors}.",
  valveFailed: "Did not open: {valves}. The leak alert stays.",
  legacy:
    "Update Water Guard to 0.2.0 or later to see its valves and people here.",
  entity: "Water Guard",
  selectEntity: "Select a Water Guard",
  entityHelp: "The Leak sensor of the Water Guard to show.",
  noGuards: "No Water Guard found. Add the integration first.",
  requiredEntity: "Select a Water Guard.",
  cardTitle: "Title",
  appearance: "Appearance",
  default: "Default",
  bubble: "Bubble",
  history: "History",
  showHistory: "Opens the history",
  historyTitle: "Leak and valve history",
  historyFailed: "Could not load history",
  noHistory: "No history for this period",
  loading: "Loading…",
  close: "Close",
  now: "Now",
  leakAlert: "Leak alert",
  stateWet: "Wet",
  stateDry: "Dry",
  valveOpening: "Opening",
  valveClosing: "Closing",
};

const nb: typeof en = {
  title: "Vannvakt",
  noLeak: "Ingen lekkasje",
  leak: "Lekkasje",
  leakDetected: "Vannlekkasje",
  unavailable: "Utilgjengelig",
  unavailableHelp:
    "Vannvakt rapporterer ikke akkurat nå. Overstyring er slått av til den er tilbake.",
  missing: "Fant ikke Vannvakt-sensoren. Velg den i kortredigeringen.",
  settings: "Innstillinger for Vannvakt",
  watching: "Overvåker {n} sensorer",
  watchingOne: "Overvåker 1 sensor",
  sensors: "sensorer",
  sensorsOne: "sensor",
  water: "Vann",
  waterOn: "På",
  waterOff: "Stengt",
  waterMixed: "Delvis stengt",
  waterUnknown: "Ukjent",
  noValves: "Styres ikke",
  alerts: "varsles ved lekkasje",
  valveOpen: "Åpen",
  valveClosed: "Stengt",
  valveMoving: "Beveger seg",
  valveUnavailable: "Utilgjengelig",
  detectedFor: "Oppdaget for",
  since: "Siden {time}",
  stillWet: "Fortsatt vått",
  dryNow: "Tørt nå",
  sensorUnavailable: "Utilgjengelig",
  waterShut: "Vannet er stengt.",
  waterNotShut: "Ikke stengt: {valves}. Steng vannet manuelt.",
  checkWater: "Kontroller at vannet er stengt.",
  notified: "Varslet",
  notReached: "Ikke nådd",
  noApp: "mangler appen",
  failed: "feilet",
  sending: "sender…",
  noPeople: "Ingen er satt opp til å bli varslet.",
  override: "Overstyr: åpne vannet",
  overrideTitle: "Åpne vannet?",
  overrideValves:
    "Åpner {valves} og fjerner lekkasjevarselet, også på alles telefoner.",
  overrideNoValves:
    "Fjerner lekkasjevarselet, også på alles telefoner. Vannvakt styrer ingen ventiler, så åpne vannet der det ble stengt.",
  overrideWet: "{sensors} melder fortsatt vann. Overstyringen åpner likevel.",
  cancel: "Avbryt",
  confirm: "Åpne vannet",
  opening: "Åpner vannet…",
  changed: "Varselet er endret. Se over og prøv igjen.",
  overrideFailed: "Overstyring mislyktes",
  stillWetCalm: "{sensors} melder fortsatt vann, men varselet er overstyrt.",
  cannotWatch: "Kan ikke overvåke: {sensors}.",
  valveFailed: "Åpnet ikke: {valves}. Lekkasjevarselet står.",
  legacy:
    "Oppdater Vannvakt til 0.2.0 eller nyere for å se ventiler og personer her.",
  entity: "Vannvakt",
  selectEntity: "Velg en Vannvakt",
  entityHelp: "Lekkasjesensoren til Vannvakten som skal vises.",
  noGuards: "Fant ingen Vannvakt. Legg til integrasjonen først.",
  requiredEntity: "Velg en Vannvakt.",
  cardTitle: "Tittel",
  appearance: "Utseende",
  default: "Standard",
  bubble: "Bubble",
  history: "Historikk",
  showHistory: "Åpner historikken",
  historyTitle: "Lekkasje- og ventilhistorikk",
  historyFailed: "Kunne ikke hente historikk",
  noHistory: "Ingen historikk for denne perioden",
  loading: "Laster…",
  close: "Lukk",
  now: "Nå",
  leakAlert: "Lekkasjevarsel",
  stateWet: "Vått",
  stateDry: "Tørt",
  valveOpening: "Åpner",
  valveClosing: "Stenger",
};

export type MessageKey = keyof typeof en;
const dictionaries = { en, nb };

export function localize(
  hass: Pick<HomeAssistant, "language" | "locale"> | undefined,
  key: MessageKey,
  values: Record<string, string | number> = {},
): string {
  return dictionaries[dictionary(hass)][key].replace(/\{(\w+)\}/g, (_, name) =>
    String(values[name] ?? ""),
  );
}

/** "Kari, Ola og Per" / "Kari, Ola and Per". */
export function list(
  hass: Pick<HomeAssistant, "language" | "locale"> | undefined,
  items: string[],
): string {
  return new Intl.ListFormat(dictionary(hass) === "nb" ? "nb-NO" : "en", {
    type: "conjunction",
  }).format(items);
}
