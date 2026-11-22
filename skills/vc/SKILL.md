---
name: vc
description: Build an interactive, self-contained HTML visualization that explains a concept — an algorithm, a data structure, a math idea, a system architecture, a protocol, a piece of code from the current project, or anything the user is trying to understand. Use when the user says "visualize", "show me", "draw", "animate", "help me see/picture/understand how X works", or runs /vc. Produces one offline HTML page and shows it to the user right away, with no clicks needed (side panel in the Claude app, browser on a local machine).
argument-hint: "[concept or question, or leave empty to visualize what we're discussing]"
---

# Visualize a concept

The goal is **understanding**, not decoration. A good visualization shows the *mechanism*: the
moving parts, how they change over time, and what happens when you change the inputs. If a static
paragraph would teach it equally well, the visualization has failed.

## 1. Pin down the concept (no file yet)

- Concept = `$ARGUMENTS` if given; otherwise the idea currently being discussed in this conversation.
  If it's about code in the current project, **read that code first** and visualize what it actually
  does (real function names, real parameters, realistic data) — not a generic textbook version.
- Write down for yourself, in one line each:
  1. **The core insight** — the single sentence the user should "get" after using the page.
  2. **The moving parts** — the 3–7 things that exist (nodes, arrays, vectors, messages, states…).
  3. **The knob** — the input or parameter whose change reveals the mechanism (data, `k`, a weight,
     a learning rate, network latency…). Almost every great explainer has one.
  4. **The common misconception** — what people usually get wrong; the visual should make it visibly wrong.
- Only ask the user a question if the concept is genuinely ambiguous. Otherwise decide and go.

## 2. Choose the visual form

Pick the form from the *shape of the concept* — see `references/patterns.md` for the full catalogue
with layout recipes. Short version:

| Concept shape | Form |
|---|---|
| A process / algorithm that runs in steps | **Stepper**: play/pause/step/back + scrubber, state drawn each step, narration line explaining *why* this step happened |
| A function of a parameter (math, ML, tuning) | **Explorable**: sliders drive a live plot/diagram; show the formula with the live numbers substituted |
| Structure (architecture, data structure, hierarchy) | **Diagram** with hover/click to reveal details and highlight connected parts |
| Flow between actors (protocols, requests, pipelines) | **Sequence/flow animation**: packets/tokens travel along edges, timeline below |
| Comparison of approaches | **Side-by-side** panels driven by the *same* input, so differences are causal |
| Geometry / vectors / spaces | **Spatial canvas** with draggable points, live projections/distances |

Combine at most two forms. One strong interaction beats five weak ones.

## 3. Build the page

Start from `assets/template.html` (copy it, don't link it). It provides the theme tokens (light +
dark), layout, typography, control styles and a small helper library (`Stepper`, `slider`, `svg`
helpers). Keep its structure:

1. **Title + one-line core insight** at the top.
2. **The stage** — the visualization itself, the largest thing on the page.
3. **Controls** directly under/beside the stage (play/step/reset, sliders, input editors).
4. **Narration** — a live caption that explains what's happening *right now* and why.
5. **"What to notice"** — 2–4 bullets pointing at what to try ("Drag k to 1 and watch…").
6. **Misconception check** — one short "You might think X — but look at Y" box.
7. Optional: **"Go deeper"** — the formula/pseudocode, with the currently active line highlighted.

Hard rules:
- **One self-contained `.html` file**, works offline. Vanilla JS + inline SVG/Canvas by default.
  Only if truly needed (e.g. 3D), load one library from `cdnjs.cloudflare.com` with an exact version.
- **Real, worked data.** Use concrete values (`[7, 2, 9, 4]`, a real query, real scores), and let the
  user edit them when that's cheap.
- **Every visual change is narrated.** Colour, motion and highlights must be explained by the caption
  or a legend. Use colour to encode meaning consistently (one colour = one role across the page).
- **Default state is already informative.** The page should teach something before any click. Never
  open on an empty stage: open on the finished state (`Stepper` option `start: 'end'`) or on a meaningful
  step. Autoplay only short, visual steps; when each step has text to read, use `autoplay: false`.
- **Accurate.** Compute with the real algorithm in JS rather than hard-coding frames, so any input the
  user types produces correct output. Double-check numbers shown against the math.
- Keyboard: Space = play/pause, ←/→ = step (the template's `Stepper` wires this up).
- **Stable stage size.** Size the stage for the largest state in the current frame set (e.g. the
  tallest tree), not the current frame, so the controls below never jump while stepping.
- Works at phone width; no horizontal scroll; respects `prefers-color-scheme` and `prefers-reduced-motion`.

## 4. Save, check, show

1. **Save** the page as `<kebab-case-concept>.html`:
   - In a cloud / remote session (the system prompt mentions a remote container or a scratchpad
     directory): in the scratchpad directory, or `./visualizations/` in the working directory if none is listed.
   - Otherwise: `~/.claude/visualizations/` (create the folder).
   - If the user named a path, use it.
2. **Check it** (do not skip): run
   `node "${CLAUDE_PLUGIN_ROOT}/skills/vc/scripts/check.js" <file>`
   It loads the page headlessly, reports JS errors/console errors, and saves screenshots next to the
   file (`<name>.png`, `<name>.mobile.png`). If Playwright isn't available it says so and exits cleanly;
   then re-read your JS carefully instead. **Look at the screenshots** (Read tool) and fix anything
   broken, cramped, overlapping or empty, then re-check. Don't publish the screenshots.
3. **Show it: the user must not have to click anything.** Use the first option that exists in this session:
   1. **`Artifact` tool** (Claude app / claude.ai): publish the file with it: `file_path` = the page,
      a one-word `icon` (e.g. `chart`, `diagram`, `tree`, `search`) and a one-sentence `description`.
      The page opens in the side panel by itself and stays private to the user. The template already
      meets the artifact page contract (2–4 word `<title>`, colour tokens with dark mode, body
      background, phone width, no external scripts); keep it that way. When updating the same
      visualization later, publish the **same file path** again so it keeps its URL.
   2. **`SendUserFile` tool**: send the file with `display: "render"` and `status: "normal"`.
   3. **Local machine**: `bash "${CLAUDE_PLUGIN_ROOT}/skills/vc/scripts/open.sh" <file>` opens it in
      the default browser (macOS/Linux/WSL/Windows).

If `${CLAUDE_PLUGIN_ROOT}` is unset (skill installed outside a plugin), use the directory this
SKILL.md lives in.

## 5. Report back

In chat, keep it short: where it is (artifact link or file path), one sentence on what the visualization shows, and 2–3 concrete
things to try. Offer to add a follow-up view (a deeper level, an edge case, a comparison). If the user
asks follow-up questions about the concept, prefer **updating the same file** (new section, new mode)
over making a new one, so the explainer grows with the conversation.
