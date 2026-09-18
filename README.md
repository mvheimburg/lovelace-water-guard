# Water Guard card

A Lovelace card for the [Water Guard](https://github.com/mvheimburg/water-guard)
integration. It shows a leak alert clearly and gives the household the one
action they need afterwards: **Override: open water**. English and Norwegian
Bokmål (*Vannvakt*).

**Status:** not yet released. This repository is being set up.

## Planned scope

- Calm "no leak" status, and a clear alert when a leak is detected: which
  sensors fired, since when, and who was notified.
- Whether each water valve is open or closed.
- «Overstyr: åpne vannet» (Override: open water), which calls Water Guard's
  override action. It asks for confirmation, says when a sensor still reports
  a leak, and shows a valve that failed to open.
- Pending, failed and unavailable states, with the action disabled when data is
  unavailable.
- Default and Bubble appearances, light and dark themes, and narrow layouts.

Water Guard's own settings stay in the integration, under **Settings →
Devices & services → Water Guard → Configure**. The card's settings cog links
there.

Installs through HACS (category **Dashboard**) and requires the Water Guard
integration.

## License

MIT
