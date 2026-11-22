# Visual pattern catalogue

Recipes for the forms named in SKILL.md. Each lists: when to use, layout, what the interaction must
reveal, and pitfalls. All of them build on `assets/template.html`.

---

## Stepper (algorithms, procedures, state machines)

**Use for:** sorting/searching, graph traversal, dynamic programming tables, garbage collection,
consensus rounds, tokenization, backprop through a small net, git operations, an event loop tick.

**Layout:** state drawn in the stage; below it the control bar (⏮ ◀ ▶/⏸ ▶ ⏭ + scrubber + speed);
narration line under that; pseudocode panel at the side (desktop) or below (mobile) with the
active line highlighted.

**Recipe:**
1. Write the real algorithm in JS, but make it *record* a list of frames:
   `frames.push({ state: structuredClone(state), line: 4, msg: "Compare 7 and 2 — 7 is bigger, swap" })`.
2. Feed `frames` to `Stepper` from the template; its `render(frame)` callback draws one frame.
3. Let the user edit the input (comma-separated list, small graph editor, text box) → recompute frames.

**Must reveal:** the invariant (what's always true at each step — e.g. "everything left of the bar is
sorted"). Draw the invariant explicitly (a bar, a shaded region, a ✓).

**Pitfalls:** frames that change too much at once; narration that says *what* but not *why*; inputs
so big that steps become noise (keep 5–12 elements).

---

## Explorable (functions of parameters)

**Use for:** gradient descent & learning rate, softmax temperature, bias/variance, Fourier series,
compound interest, Bayes' rule, attention weights, similarity thresholds, top-k, fusion weights.

**Layout:** sliders on the left/top, live chart(s) in the stage, the formula with the current values
substituted (`softmax(z/T) with T = 0.50 → [0.84, 0.11, 0.05]`).

**Recipe:** a single `update()` that reads all controls and redraws everything; call it on every
`input` event. Draw curves as SVG `<path>` from sampled points.

**Must reveal:** the regimes — show what happens at the extremes (T→0, T→∞). Add preset buttons
("too small", "just right", "too large") that jump to illuminating settings.

**Pitfalls:** axes rescaling on every change (it hides the effect — fix the axes); too many sliders.

---

## Diagram (structure)

**Use for:** system architecture, class hierarchies, B-trees, network layers, a codebase's module
graph, a RAG pipeline, transformer blocks.

**Layout:** boxes + arrows in SVG; details panel beside the diagram that fills on hover/click.

**Recipe:** describe nodes/edges as data (`{id, label, x, y, detail}`), render from data. On hover:
highlight the node, its edges and neighbours; dim the rest (opacity .25).

**Must reveal:** *why* the parts are connected — label edges with what flows on them
("query embedding, 384-d"). Add a "trace a request" button that animates one path through it.

**Pitfalls:** spaghetti — lay out left→right in the direction of data flow; at most ~12 nodes per view
(group the rest, click to expand).

---

## Sequence / flow animation (actors exchanging things)

**Use for:** TCP handshake, OAuth, HTTP caching, Raft, pub/sub, CPU pipeline, request through
middleware, streaming tokens.

**Layout:** actors as vertical lifelines (sequence) or nodes (flow); messages animate as dots/labels
moving along arrows; timeline scrubber below.

**Recipe:** a list of events `{t, from, to, label}`; the Stepper drives `t`; draw each in-flight
message interpolated between endpoints. Provide a "break something" toggle (drop a packet, a node
fails) to show how the protocol reacts.

**Must reveal:** ordering and waiting — what is blocked on what.

---

## Side-by-side comparison

**Use for:** BM25 vs embeddings, array vs linked list, merge vs quick sort, SQL vs NoSQL,
optimistic vs pessimistic locking.

**Layout:** two (max three) panels in a grid; a single shared input at the top drives all panels;
a verdict row underneath that updates ("A wins here because…").

**Must reveal:** a case where A wins and a case where B wins — include presets for both.

---

## Spatial canvas (geometry, vectors, embeddings)

**Use for:** dot product / cosine similarity, linear transforms, k-means, kNN, embeddings & nearest
neighbours, PCA, decision boundaries.

**Layout:** a square SVG plane with gridlines; draggable points/vectors; readouts beside it.

**Recipe:** pointer events on SVG circles (`pointerdown` → `setPointerCapture` → `pointermove`);
convert with `svgPoint(evt)` from the template. Recompute and redraw everything on move.

**Must reveal:** the quantity as geometry (angle arc for cosine, projection line for dot product,
Voronoi-ish regions for kNN).

---

## Colour roles (use consistently)

The template defines `--c1 … --c5` (categorical) plus `--good`, `--bad`, `--focus`.
Typical mapping: `--focus` = the thing being acted on this step; `--good` = done / correct / kept;
`--bad` = rejected / error; `--c1..c5` = distinct entities. Always pair colour with a label, shape or
position so it isn't the only signal.
