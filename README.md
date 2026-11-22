# Vizcon

A Claude Code plugin that turns any concept you're trying to understand into an **interactive,
self-contained HTML visualization**: algorithms you can step through, parameters you can drag,
architectures you can explore. Works in any project, offline.

```
/vc binary search
/vc how does a RAG pipeline work?
/vc            # visualizes whatever you're discussing right now
```

Or just ask in plain words ("show me how this works", "can you visualize that?").
Claude picks the right visual form, builds the page from real data (your own code, when the
concept lives in your project), checks it in a headless browser, and shows it to you with no clicks: in the Claude app it opens
in the side panel (as a private artifact); on your own machine it opens in your browser.

## Install (once, then it's in every session)

```bash
claude plugin marketplace add Pownek-code/vizcon
```

```bash
claude plugin install vizcon@vizcon
```

Or inside Claude Code: `/plugin marketplace add Pownek-code/vizcon`, then `/plugin install vizcon@vizcon`.

To have it in **cloud sessions** too, add it to your user settings (`~/.claude/settings.json`) or
to a project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "vizcon": { "source": { "source": "github", "repo": "Pownek-code/vizcon" } }
  },
  "enabledPlugins": { "vizcon@vizcon": true }
}
```

## What you get

| Concept shape | Visual form |
|---|---|
| Algorithm / process | Stepper: play, pause, step, scrub, narrated, with live pseudocode |
| Function of a parameter | Explorable: sliders, live plot, formula with the numbers filled in |
| Structure / architecture | Diagram with hover and click to trace connections |
| Protocol / data flow | Animated messages between actors |
| A vs B | Side-by-side panels driven by the same input |
| Vectors / geometry / embeddings | Draggable spatial canvas |

Every page has a one-line core insight, live narration, "what to notice" prompts and a misconception
check, and works in light and dark mode on phone and desktop. See [`examples/`](examples/).

Pages are saved to `~/.claude/visualizations/` (or to the session scratchpad / `./visualizations/`
in cloud sessions). If another installed plugin also has a `/vc` command, use `/vizcon:vc`.

## Layout

```
.claude-plugin/          plugin + marketplace manifests
skills/vc/
  SKILL.md               how Claude designs and builds a visualization
  references/patterns.md recipes for each visual form
  assets/template.html   theme, layout and helper library (Stepper, slider, svg helpers)
  scripts/check.js       headless check: JS errors, overflow, screenshots (uses Playwright if present)
  scripts/open.sh        opens the page in your browser
examples/                sample output
```
