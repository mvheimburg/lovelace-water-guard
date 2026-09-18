# Water Guard card

A Lovelace card for the [Water Guard](https://github.com/mvheimburg/water-guard)
integration. It shows whether the water is on, flags a detected leak, and lets
the household restore the water once the leak is fixed. English and Norwegian
Bokmål (*Vannvakt*).

**Status:** not yet released. This repository is being set up.

## Planned scope

- Water on or off, and the state of each valve.
- A clear alert when a leak is detected, naming the sensors that fired.
- «Gjenopprett vann» (Restore water), which calls Water Guard's restore
  action. Home Assistant refuses it while a sensor still reports a leak, and
  the card shows why.
- Pending, failed and unavailable states, with actions disabled when data is
  unavailable.
- Default and Bubble appearances, light and dark themes, and narrow layouts.

Water Guard's own settings stay in the integration, under **Settings →
Devices & services → Water Guard → Configure**. The card's settings cog links
there.

Installs through HACS (category **Dashboard**) and requires the Water Guard
integration.

## License

MIT
