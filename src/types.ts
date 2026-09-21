import type { ColorScheme } from "./color-schemes";
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export type HassStates = Record<string, HassEntity>;

export interface HomeAssistant {
  states: HassStates;
  language?: string;
  locale?: { language?: string; time_format?: string };
  callService?(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: { entity_id: string },
    notifyOnError?: boolean,
  ): Promise<unknown>;
  /** Websocket access; the history dialog reads the recorder through it. */
  callWS?<T>(message: Record<string, unknown>): Promise<T>;
  connection?: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  };
}

export interface CardConfig {
  type?: string;
  entity: string;
  title?: string;
  appearance: "default" | "bubble";
  color_scheme?: ColorScheme;
}

export type ValveStatus = "open" | "closed" | "moving" | "unavailable";

/** The result of Water Guard's last valve move, as the Leak sensor reports it. */
export interface MoveResult {
  target: string;
  reason: string;
  status: "running" | "ok" | "failed" | string;
  valves: Record<string, string>;
  updated?: string;
}

/** Everything the card reads from one Water Guard Leak sensor. */
export interface Guard {
  available: boolean;
  alert: boolean;
  since?: string;
  fired: string[];
  wet: string[];
  unavailableSensors: string[];
  watched: string[];
  valves: string[];
  people: string[];
  notified: Record<string, string>;
  result?: MoveResult;
  /** Integration older than 0.2.0: configured lists are not published. */
  legacy: boolean;
}
