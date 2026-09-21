import { colorSchemeSelector } from "./color-schemes";
import { LitElement, css, html, nothing } from "lit";
import { localize, type MessageKey } from "./localize";
import { friendlyName, guardSensors } from "./model";
import type { HomeAssistant } from "./types";

type EditorConfig = Record<string, unknown>;

/** Card-only choices: which guard, the title and the appearance. */
export class WaterGuardCardEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    select,
    input {
      font: inherit;
      min-height: 44px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1b1b1a);
    }
    small {
      font-weight: 400;
      color: var(--secondary-text-color, #5b5a55);
    }
    .error {
      color: var(--error-color, #c62828);
    }
  `;
  private config: EditorConfig = {};
  private ha?: HomeAssistant;

  set hass(value: HomeAssistant) {
    this.ha = value;
    this.requestUpdate();
  }
  setConfig(config: EditorConfig) {
    this.config = { ...config };
    this.requestUpdate();
  }
  private t(key: MessageKey) {
    return localize(this.ha, key);
  }
  private change(key: string, value: string) {
    const config = { ...this.config };
    if (value === "" && key === "title") delete config.title;
    else config[key] = value;
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
    this.requestUpdate();
  }
  render() {
    const states = this.ha?.states ?? {};
    const entity = String(this.config.entity ?? "");
    const choices = guardSensors(states);
    if (entity && !choices.includes(entity)) choices.unshift(entity);
    return html`
      ${colorSchemeSelector(this.ha, this.config.color_scheme, (scheme) => this.change("color_scheme", scheme))}
      <label>
        ${this.t("entity")}
        <select
          data-field="entity"
          .value=${entity}
          @change=${(event: Event) =>
            this.change("entity", (event.target as HTMLSelectElement).value)}
        >
          <option value="" ?selected=${!entity}>
            ${this.t("selectEntity")}
          </option>
          ${choices.map(
            (id) =>
              html`<option value=${id} ?selected=${id === entity}>
                ${friendlyName(states, id)}
              </option>`,
          )}
        </select>
        <small>${this.t("entityHelp")}</small>
        ${
          !choices.length
            ? html`<small class="error">${this.t("noGuards")}</small>`
            : !entity
              ? html`<small class="error">${this.t("requiredEntity")}</small>`
              : nothing
        }
      </label>
      <label>
        ${this.t("cardTitle")}
        <input
          data-field="title"
          .value=${String(this.config.title ?? "")}
          placeholder=${this.t("title")}
          @change=${(event: Event) =>
            this.change("title", (event.target as HTMLInputElement).value)}
        />
      </label>
      <label>
        ${this.t("appearance")}
        <select
          data-field="appearance"
          .value=${String(this.config.appearance ?? "default")}
          @change=${(event: Event) =>
            this.change(
              "appearance",
              (event.target as HTMLSelectElement).value,
            )}
        >
          <option value="default">${this.t("default")}</option>
          <option value="bubble">${this.t("bubble")}</option>
        </select>
      </label>
    `;
  }
}

customElements.define("water-guard-card-editor", WaterGuardCardEditor);
