# Mutaibutsu 無体物 — Design System

> **Observe. Tune. Hold. Return.**
> *Another Fine Product from We Make Trouble · © James Straker*

This is the design system for **Piza Sukeruton and the Mutaibutsu Realm** — a persistent-state simulation universe, an arcade-game pitch, and an academic research instrument all wearing the same coat. It encodes **three worlds** that must live in one brand:

- **THE REALM** — the bright, daylight, rubber-hose cartoon world the audience *watches*. Pink skies, green grass, mascots (the **Butsu**) with white gloves and sneakers, hand-lettered speech bubbles. (Shipped: `realm.html` v0.2.)
- **THE LAB** — the **Engine Laboratory**, the dark instrument-panel dashboard where the deterministic psychological engines are run, observed, and validated. Emerald-on-near-black, telemetry, terminal output. (Shipped: `index.html` on :3002.)
- **THE EXPANSE** — Pineaple Yurei's literal body: a formless white void with no perspective, where the **Mutai** drift as fractured emotional states. **Not metaphorical** — the Yurei Engine (#33, operational) writes real state about this third space. Its visual law is the *absence* of the other worlds' systems (see below).

The bridge across all three is **colour-as-telemetry**: the same Colour Engine (#24) drives every world, but with **different rendering rules per world** — Realm = a Butsu's *chosen, discrete* t-shirt colour; Expanse = a Mutai's *involuntary, continuous* emotional leak; Lab = a *data readout*. That three-way split is the connective tissue. (INK — the black cartoon outline — bridges Realm↔Lab but is deliberately *absent* in the Expanse.)

> **Population separation rule (enforced at the component level):** Butsu (Earth Realm) and Mutai (The Expanse) occupy different worlds and must **never** be visually conflated. A Butsu is a `CharacterChip` (bounded, ink-outlined, named, on grass); a Mutai is a `MutaiWisp` (formless, outline-less, shadow-less colour leak in a void). They are **separate components**, never one component with a different skin.

---

## What this is, in one breath

The **Mutaibutsu Engine Laboratory** is a suite of **55 theoretical NPC engines** (deterministic maths + psychology — OCEAN, PAD, FSRS spaced repetition, Jaynes' bicameral mind, Turchin's cliodynamics, etc.) that power a persistent multiverse. Players don't "play" — they **observe** autonomous characters (the **B-Roll Chaos Characters**: inanimate retro objects brought to life) who learn, bond, forget, and decay whether you are watching or not. The emotional core is **mono no aware** (物の哀れ) — the bittersweet ache of impermanence — implemented *as systems design*, not as theme. There is no victory; success is a fragment of story that held steady for one moment because someone was there.

### The cast (use exact spellings)
- **Piza Sukeruton** — protagonist, a dimension-travelling skeleton. Patient Zero.
- **Pineaple Yurei** — antagonist (note: **one P**, to match Piza). A malevolence that feeds on despair; not really a pineapple.
- **Claude the Tanuki** — guide, narrator, teacher; the funny face of the system.
- **Slicifer** — the first Angry Slice of Pizza; Yurei's chief soldier.
- **Angry Slices of Pizza** — Yurei's degrading photocopy-chain army.
- **B-Roll Chaos Characters** — the general population (the "Butsu" / *thing* half).
- **The Mutai** — the "intangible" half; fractured emotional states.
- **Chīzu no Kiba** (チーズの牙, "Cheese Fang") — the Sixth Sword Under Heaven, the goal of the arcade game.

---

## Source materials given

These were provided by the user and are the source of truth. **Do not assume the reader has access** — recorded here in case they do.

- **`dashboard/public/index.html`** — the real Engine Laboratory test-controller dashboard (mobile bottom-sheet UI, terminal, toast, ELI5 explain overlay, the full 55-engine list with status legend). Recreated faithfully in `ui_kits/engine-laboratory/`.
- **`dashboard/public/realm.html`** (v0.2) — the live B-Roll Chaos Character realm observer (pink sky, green ground, force-field physics, SSE event bubbles). Basis for `ui_kits/realm-observer/`.
- Local paths referenced: `~/Desktop/mutaibutsu/` (dashboard, `bicameralEngine/`, `bicameralEngine/visualiser` Vite app on :5173, API on :3002 / same-origin).
- **15 B-Roll character PNGs** (uploaded) → copied to `assets/broll/`.
- Design inspiration cited by the author: Max Kreminski's *Gossamer* open problem (CoG 2023).

---

## DATA ARCHITECTURE — two databases (drives where UI reads from)

The system runs on **two databases**, and which one a surface reads from is a design decision:

- **`bicameral_sweep_17` — the lab bench (ephemeral).** Where engines run; **wiped between runs** (ResetManager). Holds current character state, perception edges, conflicts, karma, colour state, `yurei_presence_state`, etc. → The **Realm Observer** and the **CharacterInspector** (click-to-inspect) read *this* — they are windows into a live run.
- **`mutaibutsu_observatory` — the data rig (permanent).** Never wiped; 26 tables, 26M+ rows across 92 runs. → The **StatCard telemetry strip** and any **longitudinal/historical** view read *this* — it's the research archive.

Rule of thumb: *current state → bench; accumulated history → archive.* Label which source a panel uses (the CharacterInspector footer and StatCard subs name their table).

## CONTENT FUNDAMENTALS — how the words work

The brand speaks in **two registers**, and switching between them *is* the voice.

**1. The Mythic register** (narrative, marketing, lore, character cards). Sparse, capitalised, elegiac. Sentences are short and land like bells. **Key Nouns are Capitalised mid-sentence** — Realm, Beings, Stories, Gods, Myths, Despair, Forge — giving everything the weight of proper nouns in a legend. Japanese terms appear with kanji and a gloss: *mono no aware (物の哀れ)*. The tone is melancholy but never bleak; it finds dignity in loss. Em-dashes and one-line paragraphs carry rhythm.
- *Example:* "You cannot save them. But their Pain does not have to be for nothing."
- *Example:* "The measure of success is a fragment that held steady for one precious moment because you were there."

**2. The Instrument register** (the Lab dashboard, engine names, telemetry, dev tools). Terse, technical, deterministic, lower-case, monospace-flavoured. States facts and counts. Emoji are used **functionally as icons/status**, never decoratively: ⚡ engines, 🧪 tests, 🗄️ database, ✅ validators, 👁️ visualiser, 🔧 tools. Run states read like a console: `idle`, `running: <jobId>`, `Job <id> finished: completed`.
- *Example:* "Dry-run: would delete 1,284 rows from reconciliation_log."
- *Example:* "resets all 50 B-Roll characters to genesis (source_monitoring = 0, developmental_stage = pre_verbal)."

**The ELI5 ladder.** A signature mechanic: every concept can be explained at three levels — **Academic → Gaming → Layperson** — toggled by the 🤡 clown button. This three-tier explanation is core to the brand's pedagogical mission (it is a teaching instrument). When writing explanatory copy, provide all three voices.

**Person.** Mythic register addresses the observer as **"you"** ("When you return after a day or months…"). Instrument register is impersonal/imperative ("Run all unit tests", "Abort current job"). The author occasionally appears as **"Dr James"** / 🤡 — warm, self-deprecating, human.

**Emoji policy.** Yes in the Lab (functional status + toolbar icons only) and in character speech bubbles. **No** in mythic/lore prose. Engine status legend is canonical (Artefact ① 6-value taxonomy): 🟢 WIRED · 🟡 BUILT · 🔵 DESIGNED · ◐ STUB · ⚪ CONCEPT · ✕ ORPHAN. Engine rows also carry an EarWig role badge: **ACT** (action) · **PER** (perception) · **NAR** (narrative).

**Engine naming.** `The <Name> Engine` + Japanese term in kanji where applicable + a one-line "the X" descriptor + the human research it's built on + a single italic question. e.g. *"The Kizuki Engine (気づき) — the missing filter between environment and cognition. … In a world full of noise, what does a person actually pay attention to?"*

---

## VISUAL FOUNDATIONS

### The three worlds
| | THE REALM | THE LAB | THE EXPANSE |
|---|---|---|---|
| Backdrop | pink sky `#ff5580`, green grass | near-black `#0a0a0f`, emerald grid | formless white void `#f3f1ee` |
| Outline | heavy black ink, 2.5–6px | hairline `rgba(255,255,255,.08)` | **none** (INK is absent) |
| Shadow | hard offset sticker shadows | soft glow + inset wells | **none** |
| Anchor | grass ground + horizon | app-shell grid | **none** — no ground, horizon or perspective |
| Population | Butsu (`CharacterChip`) | — | Mutai (`MutaiWisp`) |
| Colour rule | chosen, discrete (t-shirt) | data readout | involuntary, continuous (leak) |
| Type | Mochiy Pop + Zen Kaku | Inter + mono | sparse mono, near-invisible |
| Mood | warm, bouncy, alive | precise, quiet, deterministic | dissolved, grieving, edgeless |

**The law of The Expanse:** define it by what it *lacks*. No ink outlines, no shadows, no ground plane, horizon, or perspective anchor. Form dissolves; only colour leaks. Build it from `--void*`, `--despair*`, `--mutai-leak`, and the `.mtb-expanse` backdrop.

### Colour
A bright, saturated **cartoon primary palette** (the B-Roll characters use pure red/blue/yellow/green against black outlines — see the Simon and Rubik's mascots) layered over the two world-backdrops. The **emotional-coordinate scales** are the most important brand-specific colour idea: colour *encodes psychological state* and is read as data — warm gold = positive valence/contentment, cool blue = negative valence/withdrawal, red = high arousal, amber = cortisol/stress, pink = bond/oxytocin, desaturated violet `#7b6f86` = Yurei's despair-harvest condition. See `tokens/colors.css`. The **narrative layer** adds two more colour-as-data scales: `--beat-*` (the 8 `narrative_function` hues — the shape of a story) and `--evidence-*` (blueprint provenance tiers).

### Type
Three voices: **POP** (Mochiy Pop One) for mascot headlines and character names — rounded, chunky, carries kanji natively; **GOTHIC** (Zen Kaku Gothic New) for body/prose — calm, neutral, JP-capable; **MONO** (Space Mono) for telemetry, readouts, engine labels. The Lab product itself ships **Inter** + plain monospace (`--font-ui`), preserved for fidelity. Mono labels are UPPERCASE with wide tracking (`.14em`).

### Outline & shape
The soul of the Realm is the **black ink outline** — everything wears one, like a rubber-hose cartoon. Thickness signals importance (`--ink-hair` 1.5px → `--ink-heavy` 6px). Corners are friendly and rounded: speech bubbles at 16px (`--r-lg`), pills at 999px. The Lab is squarer and quieter: 8px / 12px radii, 1px hairline borders.

### Shadows
Two distinct systems. **Realm = hard offset cel shadows** with zero blur (`3px 3px 0 var(--ink)`) — the sticker/decal look. **Lab = soft depth**: inset wells for recessed fields, soft drop shadows for raised panels, and coloured glows (`0 0 12px` emerald/amber) for live signals and focus rings (`0 0 0 2px rgba(52,211,153,.12)`).

### Backgrounds
The Realm uses **flat colour fills** (pink sky, layered green grass with little SVG grass tufts and a dark stroke horizon) — no gradients, no photos. The Lab uses near-flat black with a barely-there emerald measurement grid and the occasional `radial-gradient` for The Expanse's formless void. Imagery is the **rubber-hose character PNGs** — full-colour, transparent background, sitting on the grass and idle-bobbing.

### Motion
- **Realm:** characters **idle-bob** on a ~3.4s ease-in-out loop; movement between positions is slow (`transition: left 1.5s ease-out`) driven by force-field physics (warmth attraction, conflict repulsion). Bounce easing (`--ease-cartoon`, overshoot) for pop-in. Speech bubbles fade in/out (0.3s).
- **Lab:** bottom sheets slide up `cubic-bezier(0.16,1,0.3,1)` (0.36s); the ELI5 overlay slides in from the right; toasts drop from the top; buttons **press-shrink** to `scale(0.96)`. A spinner for running jobs. Reduced-motion is honoured globally.

### States
- **Hover (Lab):** surface lightens (`--lab-hover`), border brightens to `rgba(255,255,255,.14)`.
- **Press:** `transform: scale(0.96)` + accent border/colour. This shrink-on-press is the signature interaction feel.
- **Focus:** 2px emerald glow ring.
- **Realm hover:** tooltip fades in above the character.

### Layout
App-shell pattern in the Lab: fixed centered title bar, fixed wrapping toolbar, scrolling main area, fixed chat/command footer, modal bottom-sheet overlays. The Realm is an infinite pan/zoom canvas (drag to pan, wheel to zoom-to-cursor, clamped). Fixed elements stay out of the scaled content.

---

## THE NARRATIVE LAYER (NAR)

The storytelling engine — the NAR EarWig role — is now in the system. It is built from **seven narrative blueprints** (Vogler's Hero's Journey, Harmon's Story Circle, the Todorov detective dual-timeline, Film Noir, Kishōtenketsu, the Adams Story Spine, and the Reagan/Vonnegut emotional-arc overlay), each a sequence of **beats** carrying a `narrative_function` (orientation → disruption → … → resolution) and a `pacing_position` (0–100%). Forty-one **storytelling heuristics** (Pixar's Emma Coats, Vonnegut, McKee, the Story Grid) are the quality gate; the **speech_templates** ladder turns a beat into an utterance at a character's `developmental_stage` (holophrastic → complex).

Two encodings are canonical:
- **Beat function = hue** — the `--beat-*` scale reads the shape of a story (cool setup, the gold of revelation, the green of return). A token legend, like the engine-status legend.
- **Every id is a colour** — `blueprint_id` / heuristic id / speech id are all hex (`#35xxxx` blueprints, `#354xxx` heuristics, `#70xxxx` speech): an id-namespace that is CSS-valid. The literal hex is shown as a faithful identity chip; real differentiation is carried by the evidence tier (`--evidence-*`) and the beat-function timeline. Rigidity (hard/soft) is structural — solid vs dashed edge — never hue.

The Tanuki is the **noir narrator who already knows the ending** (Film Noir #350004, the detective dual-timeline #350003): you name an **outcome** (a target PAD coordinate) and the NPCs compose the micro-narrative — beat by beat — that arrives there. Components: `BlueprintCard`, `BeatTimeline` (the proportional pacing band), `FunctionTag`, `HeuristicCard`, `SpeechLadder`. Surfaces: the **Narrative Composer** (name the end → cast NPCs → emit dialogue) and the **Narrative Director** (browse the library).

## ICONOGRAPHY

The brand's icon language is **emoji, used functionally** — this is intentional and on-brand, not a placeholder. The real Lab toolbar is built entirely from emoji glyphs (⚡🧪⚙️👤🗄️✅👁️🔧), and engine build-status is a coloured-circle legend (🟢🟡🔵⚪). Speech bubbles and the 🤡 ELI5 toggle also use emoji. **Keep emoji for Lab UI and status; do not substitute an icon font there** — it would break the established voice.

The **primary brand imagery is the rubber-hose character art** — detailed cartoon illustrations of retro 80s/90s objects (boombox, Simon, Rubik's cube, rotary phone, 8-ball, pager, cassette, lipstick, lighter, matches, inhaler, pill, letters, desktop computer, mobile phone) with cartoon faces, white four-finger gloves, black rubber-hose limbs, and white sneakers. All 15 are in `assets/broll/` as transparent PNGs (~1000×1000). These ARE the icons of the Realm — characters, not glyphs. Never redraw them as SVG; always reference the PNGs.

No SVG icon system, no icon font, no Lucide/Heroicons in the existing product. If a future surface needs line icons, match the emoji's filled/expressive weight rather than introducing thin strokes — and flag the addition.

---

## INDEX — what's in this folder

**Foundations / tokens**
- `styles.css` — global entry point (consumers link this only; it's just `@import`s).
- `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css` · `base.css`

**Specimen cards** (Design System tab) — `cards/` : colour scales, type voices, spacing/outline/shadow, emotional-coordinate scales, B-Roll cast, **principal cast**, engine-status legend, world backdrops.

**Components** — `components/`
- `core/` — Button, Badge, StatusDot, MonoLabel
- `realm/` — SpeechBubble, CharacterChip (Butsu)
- `expanse/` — MutaiWisp (Mutai), YureiPresence (live Expanse/Yurei readout)
- `lab/` — StatCard, EngineRow, Terminal, Toast, CharacterInspector (click-to-inspect)
- `narrative/` — BlueprintCard, BeatTimeline (the proportional pacing band), FunctionTag, HeuristicCard, SpeechLadder (the NAR storytelling layer)

**UI kits** — `ui_kits/`
- `engine-laboratory/` — faithful recreation + extension of the real Lab dashboard.
- `realm-observer/` — the B-Roll Chaos Character realm canvas.

**Templates** (Design-Component starting points) — `templates/`
- `narrative-composer/` — name an outcome (+ target PAD) → NPCs compose the micro-narrative that arrives there.
- `narrative-director/` — browse the blueprint library, beat timelines and the matched storytelling heuristics.
- `valence-soundscape/` — **the Valence Engine (#25) wired into the Realm Observer**: the realm *sings* as you watch it live and die. Live mood, a scripted journey, or hands-on signals drive `audio/realm-audio.js` (the deterministic 13-layer Soundscape Engine); affect-coloured console with oscilloscope, layer mixer (solo/mute) and the signal→sound legend.
- `engine-laboratory/` · `realm-observer/` — DC ports of the two kits.

**`SKILL.md`** — Agent-Skills-compatible entry for downloading/using this system.

---

## Caveats
- **Fonts are loaded from Google Fonts via CDN** (Mochiy Pop One, Zen Kaku Gothic New, Space Mono, Inter) — no local binaries bundled. If you want the system fully offline, supply font files and I'll add `@font-face` rules.
- Mochiy Pop One / Zen Kaku Gothic New cover Japanese; Inter does not, so 無体物 in Lab chrome falls back to a JP gothic.
- **Principal-character art now provided** (`assets/principals/`): Piza Sukeruton, Pineaple Yurei, Claude the Tanuki + the arcade key-art cabinet. Slicifer / Angry Slice art, Chīzu no Kiba (Cheese Fang) and the We Make Trouble logo are still outstanding — principals other than these three remain typographic until art arrives.
