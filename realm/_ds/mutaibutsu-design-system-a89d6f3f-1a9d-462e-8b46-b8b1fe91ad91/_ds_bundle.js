/* @ds-bundle: {"format":3,"namespace":"MutaibutsuDesignSystem_a89d6f","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"MonoLabel","sourcePath":"components/core/MonoLabel.jsx"},{"name":"StatusDot","sourcePath":"components/core/StatusDot.jsx"},{"name":"MutaiWisp","sourcePath":"components/expanse/MutaiWisp.jsx"},{"name":"YureiPresence","sourcePath":"components/expanse/YureiPresence.jsx"},{"name":"CharacterInspector","sourcePath":"components/lab/CharacterInspector.jsx"},{"name":"EngineRow","sourcePath":"components/lab/EngineRow.jsx"},{"name":"StatCard","sourcePath":"components/lab/StatCard.jsx"},{"name":"Terminal","sourcePath":"components/lab/Terminal.jsx"},{"name":"Toast","sourcePath":"components/lab/Toast.jsx"},{"name":"BeatTimeline","sourcePath":"components/narrative/BeatTimeline.jsx"},{"name":"BlueprintCard","sourcePath":"components/narrative/BlueprintCard.jsx"},{"name":"FunctionTag","sourcePath":"components/narrative/FunctionTag.jsx"},{"name":"HeuristicCard","sourcePath":"components/narrative/HeuristicCard.jsx"},{"name":"SpeechLadder","sourcePath":"components/narrative/SpeechLadder.jsx"},{"name":"CharacterChip","sourcePath":"components/realm/CharacterChip.jsx"},{"name":"SpeechBubble","sourcePath":"components/realm/SpeechBubble.jsx"}],"sourceHashes":{"audio/realm-audio.js":"a3ff57f1964d","components/core/Badge.jsx":"789b268d0bc1","components/core/Button.jsx":"5de92f5fe02d","components/core/MonoLabel.jsx":"d7a719b3c928","components/core/StatusDot.jsx":"8e4ff7ad166f","components/expanse/MutaiWisp.jsx":"2ccf2bc47849","components/expanse/YureiPresence.jsx":"8e9b864caa72","components/lab/CharacterInspector.jsx":"c784616904bd","components/lab/EngineRow.jsx":"76cbfdc79341","components/lab/StatCard.jsx":"3d8c0e0e217f","components/lab/Terminal.jsx":"1d1bbb0a6cf6","components/lab/Toast.jsx":"a1c4ecda1e79","components/narrative/BeatTimeline.jsx":"7eaeda8c7743","components/narrative/BlueprintCard.jsx":"c7cb8dc43fb4","components/narrative/FunctionTag.jsx":"5604d5e7c69d","components/narrative/HeuristicCard.jsx":"4dbedb349f26","components/narrative/SpeechLadder.jsx":"b8e6091a5953","components/realm/CharacterChip.jsx":"e6aa5e235f31","components/realm/SpeechBubble.jsx":"e2ca234a9cf1","realm-visualiser/ds-base.js":"f45ce6dafa67","realm-visualiser/realmSim.js":"0f783f9251c7","ui_kits/engine-laboratory/EngineLaboratory.jsx":"ecb013822afd","ui_kits/engine-laboratory/characterData.js":"d288ecbd2f26","ui_kits/engine-laboratory/engineData.js":"fb537251435f","ui_kits/realm-observer/realmSim.js":"1d7d724bc448"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MutaibutsuDesignSystem_a89d6f = window.MutaibutsuDesignSystem_a89d6f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// audio/realm-audio.js
try { (() => {
/**
 * ===========================================================================
 * realm-audio.js — Realm Soundscape Engine  v2.0
 * ===========================================================================
 * Copyright © 2026 James Straker / We Make Trouble
 * Mutaibutsu (無体物)
 * Another Fine Product from We Make Trouble
 * All Rights Reserved. Proprietary and confidential.
 * ===========================================================================
 *
 * A pure audio module. No UI, no transport, no data loading, no scope.
 * It takes population signals from every WIRED engine and produces a living,
 * layered soundscape. Plug it into the realm observer and feed it one tick at
 * a time while the viewer watches the realm live and die.
 *
 *   realmAudio.init(audioContext?)                       -> Promise (ready)
 *   realmAudio.calibrate({ pMin, pMax, dMin, dMax })     -> void   (optional)
 *   realmAudio.updateTick({ …signals })                  -> void
 *   realmAudio.setMasterGain(0..1)                       -> void   (optional)
 *   realmAudio.getInfo()                                 -> object (optional)
 *   realmAudio.getAnalyser()                             -> AnalyserNode
 *   realmAudio.destroy()                                 -> void
 *
 * ---------------------------------------------------------------------------
 * THE TWO AXES
 *   STRESS  (crisis)      — the Pelican wall. High A, low P, low SM accumulate
 *                           mass: sub, grind, strings, dissonance, loudness.
 *   WARMTH  (contentment) — the thing low stress alone never gave us. Driven by
 *                           Ikigai: a content realm at rest GLOWS — cello + warm
 *                           pad bloom, the fifth shines, the reverb warms. A
 *                           hollow realm at rest (low Ikigai) is near-silent and
 *                           cold. The difference between an empty room and a warm
 *                           one full of people who need nothing.
 *   True neutral calm is almost nothing — a hovering tone, just enough to know
 *   the speakers are on (Mogwai "Atomic"). Layers only bloom with contentment,
 *   or accumulate with stress.
 *
 * THE SIGNAL PALETTE  (all new signals optional; undefined → benign default;
 * the PAD + SM + event mapping below is LOCKED and unchanged)
 *   meanP        -1..1  Pleasure    → mode (Lydian…Locrian) + colour voice
 *   meanA         0..1  Arousal     → cutoff, LFO rate, bow density, tempo
 *   meanD        -1..1  Dominance   → tonic pitch, master weight
 *   meanSM        0..1  Source-mon  → fifth↔tritone consonance, noise, h-rhythm
 *   eventCount    int   events      → timpani surges, filter event-depth
 *   ── new dimensions ──
 *   meanIkigai          0..1  contentment → WARMTH axis: cello/pad/fifth glow,
 *                                            warm reverb tail, sunlit shimmer
 *   rwi                 0..1  realm wellness → reverb: warm room ↔ cold cathedral
 *   psi                 0..1  political stress → rhythmic instability (clock
 *                                            jitter, skipped pulses, stutter)
 *   meanWarmth          0..1  social warmth → voices blend (centre) ↔ isolate (spread)
 *   activeConflicts     int   → rhythmic aggression: timpani syncopation, tight chug
 *   kfi                 0..1  karma fairness → resolved ↔ hanging suspension
 *   meanMoralCoherence  0..1  → clean harmonic series ↔ creeping minor-2nd partials
 *   yureiMode    'WITHDRAWN'|'BREACHED' → the void drone absent ↔ present
 *   yureiHunger         int   → void drone intensity (felt in the chest)
 *   meanAllostaticLoad  0..1  exhaustion → thin, strained, compressed, narrow voicing
 *   meanRetrievability  0..1  memory → harmonic richness: extensions added ↔ stripped
 *   dominantColourWarmth 'warm'|'cool'|'neutral' → timbre tilt EQ + layer bias
 *
 * Most dimensions are barely perceptible alone — you should only notice them
 * when they CHANGE. The listener never thinks "the Karma Index is low"; they
 * think "something feels unresolved" and can't name why. That is the target.
 *
 * DETERMINISM: no Math.random. An internal tick counter advances each
 * updateTick(); all stagger/jitter is tick-seeded hashing; noise + both reverb
 * impulses come from a seeded PRNG. Wall-clock enters only as smoothing /
 * scheduling between targets.
 *
 * Dependency: smplr 0.26.0 (start(), not play()) — dynamic import from jsDelivr.
 * ===========================================================================
 */
(function (global) {
  "use strict";

  /* ====================================================================== */
  /* CONFIG                                                                  */
  /* ====================================================================== */
  const CONFIG = {
    /* tonic (D) */
    TONIC_CENTRE_MIDI: 50,
    TONIC_RANGE_ST: 12,
    D_PITCH_SIGN: -1,
    TONIC_MIN_MIDI: 36,
    TONIC_MAX_MIDI: 62,
    GLIDE_S: 2.0,
    /* arousal (A) */
    CUTOFF_BASE_HZ: 360,
    CUTOFF_SPAN_HZ: 1700,
    LFO_RATE_MIN_HZ: 0.035,
    LFO_RATE_MAX_HZ: 0.55,
    BOW_INTERVAL_CALM_S: 5.4,
    BOW_INTERVAL_HOT_S: 1.1,
    /* events */
    EVENT_LFO_DEPTH_HZ: 55,
    EVENT_DEPTH_CAP_HZ: 900,
    EMA_ALPHA: 0.05,
    SURGE_RATIO: 1.6,
    SURGE_MIN_EV: 3,
    SURGE_COOLDOWN_TICKS: 6,
    SURGE_FIFTH_RATIO: 2.4,
    /* source monitoring (SM) */
    NOISE_GAIN_MAX: 0.06,
    PULSE_INTERVAL_HI_SM_S: 9.0,
    PULSE_INTERVAL_LO_SM_S: 2.6,
    /* stress weighting (locked crisis axis) */
    W_AROUSAL: 0.46,
    W_DISPLEASURE: 0.30,
    W_MISMONITOR: 0.24,
    /* warmth axis (Ikigai) */
    WARM_BLOOM_LO: 0.40,
    WARM_BLOOM_HI: 0.95,
    // ikigai window for the glow
    GLOW_STRESS_BLEED: 0.65,
    // crisis erodes contentment

    /* mix */
    MASTER_BASE: 0.22,
    MASTER_STRESS: 0.52,
    MASTER_DOM: 0.12,
    MASTER_CAP: 0.94,
    REVERB_SEND_BASE: 0.30,
    REVERB_SEND_STRESS: 0.45,
    REVERB_SEND_WARMTH: 0.12,
    REVERB_WARM_SECONDS: 2.2,
    REVERB_COLD_SECONDS: 4.8,
    REVERB_WET: 1.0,
    /* per-layer ceilings (linear) */
    CEIL: {
      sub: 0.82,
      cello: 0.95,
      pad: 0.62,
      strings: 0.78,
      grind: 0.78,
      tremStr: 0.62,
      noise: 1.0,
      timpani: 0.95,
      voidd: 0.82,
      karma: 0.11,
      moral: 0.07,
      harp: 0.5,
      celesta: 0.34
    },
    /* timpani — heartbeat near-silent at calm (was 0.42 base) */
    TIMP_BASE: 0.035,
    TIMP_STRESS: 0.60,
    TIMP_CONFLICT: 0.25,
    /* colour tilt EQ */
    TILT_DB: 4.0,
    TILT_LOW_HZ: 320,
    TILT_HIGH_HZ: 3200,
    /* void / Yurei */
    VOID_FLOOR: 0.15,
    VOID_SPAN: 0.85,
    VOID_FREQ_MIN: 24,
    VOID_FREQ_MAX: 46,
    VOID_TREMOR_HZ: 5.5,
    /* karma suspension + moral dissonance */
    KARMA_SUS_ST: 5,
    // perfect 4th — hangs against the 3rd
    MORAL_DISS_ST: 1,
    // minor 2nd — creeping unease

    /* psi rhythmic instability + conflicts */
    PSI_JITTER: 0.55,
    PSI_SKIP: 0.42,
    CONFLICT_NORM: 8,
    /* social warmth panning (isolate when low) */
    PAN_BASE: {
      cello: -0.45,
      pad: 0.35,
      strings: 0.50,
      grind: 0.0
    },
    /* allostatic load */
    ALLO_NARROW: 0.55,
    ALLO_COMPRESS: 0.45,
    ALLO_CEIL: 0.22,
    ALLO_CUTOFF_HZ: 140,
    /* smoothing taus (s) */
    TAU_LAYER: 2.6,
    TAU_MASTER: 0.40,
    TAU_CUTOFF: 0.12,
    TAU_SEND: 2.6,
    TAU_NOISE_BP: 1.4,
    TAU_PAN: 3.0,
    TAU_TILT: 2.6,
    TAU_VOID: 4.0,
    TAU_RWI: 3.5,
    /* sampler */
    CELLO_RANGE: [36, 76],
    STRINGS_RANGE: [40, 96],
    PAD_RANGE: [36, 96],
    GRIND_RANGE: [40, 76],
    TIMPANI_RANGE: [40, 57],
    CELLO_OVERLAP: 2.3,
    CELLO_DUR_MIN_S: 2.5,
    CELLO_DUR_MAX_S: 11,
    PULSE_OVERLAP: 2.6,
    GRIND_OVERLAP: 1.6,
    JITTER_S: 0.18,
    /* harp + celesta — the melodic motion of contentment (gated entirely by glow) */
    HARP_RANGE: [48, 96],
    CELESTA_RANGE: [72, 105],
    HARP_INTERVAL_S: 0.42,
    HARP_DUR_S: 2.0,
    HARP_GLOW_GATE: 0.04,
    HARP_DEGREES: [0, 1, 2, 4, 5],
    // root·2nd·3rd·5th·6th — no 4th/7th: cleanest, happiest in any mode
    CELESTA_SPARKLE_P: 0.34,
    /* chaos clock — frantic tremolo guitar/cello + bright tremolo strings in the
       heavy moments, REPLACING the old static synth drone with chaotic activity */
    CHAOS_SLOW_S: 0.42,
    CHAOS_FAST_S: 0.095,
    CHAOS_DUR_S: 0.2,
    TREMSTR_RANGE: [52, 96],
    EXPAND_MIN_SPAN: 0.05,
    LOOKAHEAD_S: 0.28,
    SCHED_MS: 25,
    NOISE_SEED: 0x9E3779B9,
    WARM_SEED: 0x51ED5EED,
    COLD_SEED: 0xC0FFEE11
  };
  const SCALES = Object.freeze({
    lydian: [0, 2, 4, 6, 7, 9, 11],
    ionian: [0, 2, 4, 5, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    aeolian: [0, 2, 3, 5, 7, 8, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10]
  });
  const COLOUR_DEGREES = [1, 2, 5];
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  function pickScale(p) {
    if (p > 0.4) return 'lydian';
    if (p > 0.1) return 'ionian';
    if (p > -0.1) return 'mixolydian';
    if (p > -0.3) return 'dorian';
    if (p > -0.5) return 'aeolian';
    if (p > -0.7) return 'phrygian';
    return 'locrian';
  }

  /* signal neutral defaults (undefined → benign, so it sounds healthy) */
  const DEF = {
    meanIkigai: 0.5,
    rwi: 0.6,
    psi: 0.0,
    meanWarmth: 0.55,
    activeConflicts: 0,
    kfi: 0.85,
    meanMoralCoherence: 0.85,
    yureiHunger: 0,
    meanAllostaticLoad: 0.25,
    meanRetrievability: 0.7
  };

  /* ---- the layer roster, in console-reading order (warmth → crisis → expanse →
     telemetry). key = solo/mute handle · info = getInfo().layers key ·
     ceil = its meter's full-scale · token = the affect colour it should wear. */
  const LAYERS = Object.freeze([{
    key: 'harp',
    info: 'harp',
    label: 'harp',
    family: 'warmth',
    token: '--valence-pos',
    ceil: CONFIG.CEIL.harp
  }, {
    key: 'celesta',
    info: 'celesta',
    label: 'celesta',
    family: 'warmth',
    token: '--cheese',
    ceil: CONFIG.CEIL.celesta
  }, {
    key: 'cello',
    info: 'cello',
    label: 'cello',
    family: 'warmth',
    token: '--contentment',
    ceil: CONFIG.CEIL.cello
  }, {
    key: 'pad',
    info: 'pad',
    label: 'warm pad',
    family: 'warmth',
    token: '--contentment',
    ceil: CONFIG.CEIL.pad
  }, {
    key: 'strings',
    info: 'strings',
    label: 'strings',
    family: 'crisis',
    token: '--arousal-high',
    ceil: CONFIG.CEIL.strings
  }, {
    key: 'tremStr',
    info: 'tremStr',
    label: 'trem str',
    family: 'crisis',
    token: '--arousal-high',
    ceil: CONFIG.CEIL.tremStr
  }, {
    key: 'grind',
    info: 'grind',
    label: 'guitar',
    family: 'crisis',
    token: '--slice-red',
    ceil: CONFIG.CEIL.grind
  }, {
    key: 'sub',
    info: 'sub',
    label: 'sub',
    family: 'crisis',
    token: '--stress',
    ceil: CONFIG.CEIL.sub
  }, {
    key: 'timp',
    info: 'timpani',
    label: 'timpani',
    family: 'crisis',
    token: '--stress',
    ceil: CONFIG.CEIL.timpani
  }, {
    key: 'voidd',
    info: 'void',
    label: 'void',
    family: 'expanse',
    token: '--despair',
    ceil: CONFIG.CEIL.voidd
  }, {
    key: 'karma',
    info: 'karma',
    label: 'karma',
    family: 'telemetry',
    token: '--signal-blue',
    ceil: CONFIG.CEIL.karma
  }, {
    key: 'moral',
    info: 'moral',
    label: 'moral',
    family: 'telemetry',
    token: '--mutai-leak',
    ceil: CONFIG.CEIL.moral
  }, {
    key: 'noise',
    info: 'noise',
    label: 'noise',
    family: 'telemetry',
    token: '--valence-neu',
    ceil: CONFIG.NOISE_GAIN_MAX
  }]);

  /* ---- the academic legend: every population signal → its musical consequence.
     The first five (axis:'pad') are the LOCKED core mapping; the rest are the new
     dimensions. This is the engine's own account of why you hear what you hear. */
  const MAPPING = Object.freeze([{
    signal: 'meanP',
    label: 'Pleasure',
    range: '−1…1',
    axis: 'pad',
    musical: 'Mode',
    consequence: 'Bright Lydian / Ionian at high pleasure soften through Dorian to dark Aeolian / Phrygian / Locrian as it falls. Sets the scale every voice draws from.'
  }, {
    signal: 'meanA',
    label: 'Arousal',
    range: '0…1',
    axis: 'pad',
    musical: 'Brightness & pace',
    consequence: 'Opens the lowpass, quickens the throb LFO, shortens the bow and pulse intervals, and lifts every chord’s velocity.'
  }, {
    signal: 'meanD',
    label: 'Dominance',
    range: '−1…1',
    axis: 'pad',
    musical: 'Tonic & weight',
    consequence: 'Lowers the tonic pitch and adds master weight as the realm asserts itself; high submission floats it up and thin.'
  }, {
    signal: 'meanSM',
    label: 'Source-monitoring',
    range: '0…1',
    axis: 'pad',
    musical: 'Consonance',
    consequence: 'High → the perfect fifth shines. Low → the tritone creeps in and noise rises — the realm can no longer tell signal from noise.'
  }, {
    signal: 'eventCount',
    label: 'Events',
    range: 'int',
    axis: 'pad',
    musical: 'Surges',
    consequence: 'Bursts of activity fire timpani surges and swing the filter; a sustained rate sets the baseline restlessness.'
  }, {
    signal: 'meanIkigai',
    label: 'Ikigai · contentment',
    range: '0…1',
    axis: 'warmth',
    musical: 'The glow',
    consequence: 'The WARMTH axis. Blooms cello, warm pad, the shining fifth and the harp + celesta melody. A content realm at rest GLOWS; a hollow one is near-silent and cold.'
  }, {
    signal: 'rwi',
    label: 'Realm wellness',
    range: '0…1',
    axis: 'telemetry',
    musical: 'Reverb',
    consequence: 'Crossfades the space from a warm, intimate room to a cold, vast cathedral.'
  }, {
    signal: 'psi',
    label: 'Political stress',
    range: '0…1',
    axis: 'telemetry',
    musical: 'Rhythmic instability',
    consequence: 'The heartbeat jitters and skips pulses — the institutions can no longer keep time.'
  }, {
    signal: 'meanWarmth',
    label: 'Social warmth',
    range: '0…1',
    axis: 'telemetry',
    musical: 'Stereo image',
    consequence: 'Voices blend at the centre when warm; isolate and spread apart when cold — strangers in a room.'
  }, {
    signal: 'activeConflicts',
    label: 'Active conflicts',
    range: 'int',
    axis: 'crisis',
    musical: 'Aggression',
    consequence: 'Syncopated off-beat timpani and a tighter, more insistent harmonic rhythm.'
  }, {
    signal: 'kfi',
    label: 'Karma fairness',
    range: '0…1',
    axis: 'telemetry',
    musical: 'Suspension',
    consequence: 'A perfect-4th that hangs against the 3rd, unresolved, when justice goes unanswered. Silent while the realm is fair; contentment papers over it.'
  }, {
    signal: 'meanMoralCoherence',
    label: 'Moral coherence',
    range: '0…1',
    axis: 'telemetry',
    musical: 'Dissonance',
    consequence: 'A creeping minor-2nd partial as shared meaning rots. You feel the unease before you can name it.'
  }, {
    signal: 'yureiMode · yureiHunger',
    label: 'Yurei breach',
    range: 'mode · int',
    axis: 'expanse',
    musical: 'The void',
    consequence: 'A sub-harmonic drone felt in the chest, not heard — present only when the Yurei breaches; hunger drives its tremor.'
  }, {
    signal: 'meanAllostaticLoad',
    label: 'Allostatic load',
    range: '0…1',
    axis: 'crisis',
    musical: 'Exhaustion',
    consequence: 'Thins and compresses the whole mix — narrow voicing, strained, headroom gone, the filter dropping.'
  }, {
    signal: 'meanRetrievability',
    label: 'Retrievability · memory',
    range: '0…1',
    axis: 'telemetry',
    musical: 'Harmonic richness',
    consequence: 'Adds 9ths and colour extensions when memory is sharp; strips the chord bare as the realm forgets.'
  }, {
    signal: 'dominantColourWarmth',
    label: 'Dominant colour',
    range: 'warm / cool',
    axis: 'telemetry',
    musical: 'Timbre tilt',
    consequence: 'A shelf-EQ tilt — warm colours lift the lows, cool colours lift the highs, biasing which layers cut through.'
  }]);

  /* ---- helpers ---- */
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function num(v, fb) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fb;
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function midiToFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }
  function midiName(m) {
    const r = Math.round(m);
    return NOTE_NAMES[(r % 12 + 12) % 12] + (Math.floor(r / 12) - 1);
  }
  function sstep(x, a, b) {
    if (a === b) return x < a ? 0 : 1;
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function detHash(key, n) {
    let h = 0x811c9dc5;
    const s = key + ':' + n;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0) % 100000 / 100000;
  }
  function makePRNG(seed) {
    let s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13;
      s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
  }

  /* ====================================================================== */
  /* State                                                                   */
  /* ====================================================================== */
  let ctx = null,
    ownCtx = false,
    ready = false,
    scheduler = null,
    createdCtx = false;
  let tick = 0,
    evEMA = 0,
    lastSurgeTick = -1e9,
    colourIdx = 0,
    masterTrim = 1;
  /* per-layer solo/mute (additive — never touches the derive() mapping) */
  const soloSet = new Set(),
    muteSet = new Set();
  const LAYER_ALIAS = {
    timpani: 'timp',
    void: 'voidd'
  };
  function normLayer(n) {
    return LAYER_ALIAS[n] || n;
  }
  function layerFactor(k) {
    return muteSet.has(k) ? 0 : soloSet.size ? soloSet.has(k) ? 1 : 0 : 1;
  }
  let expand = {
    pMid: 0,
    pHalf: 1,
    dMid: 0,
    dHalf: 1
  };
  let cur = {
    P: 0.4,
    A: 0.12,
    D: 0.2,
    SM: 0.92,
    ev: 0,
    ikigai: 0.5,
    rwi: 0.6,
    psi: 0,
    warmS: 0.55,
    conflictsN: 0,
    kfi: 0.85,
    coherence: 0.85,
    breached: false,
    hungerN: 0,
    load: 0.25,
    retriev: 0.7,
    tilt: 0,
    mode: 'lydian',
    scale: SCALES.lydian,
    tonic: 50,
    stress: 0,
    warm: 0,
    glow: 0,
    cutoff: 360,
    lfoRate: 0.035,
    evDepth: 0,
    bowInt: 5.4,
    pulseInt: 9.0,
    fifthMix: 0.92,
    tritoneMix: 0.08,
    colourSemis: 4,
    lvl: {
      sub: 0,
      cello: 0,
      pad: 0,
      strings: 0,
      grind: 0,
      tremStr: 0,
      noise: 0,
      timp: 0.05,
      voidd: 0,
      karma: 0,
      moral: 0,
      harp: 0,
      celesta: 0
    }
  };

  /* audio nodes */
  const G = {};
  let master = null,
    mix = null,
    bus = null,
    weather = null,
    analyser = null;
  let tiltLow = null,
    tiltHigh = null;
  let reverbSend = null,
    warmVerb = null,
    coldVerb = null,
    warmWet = null,
    coldWet = null;
  let pan = {};
  let sub = null,
    noiseNode = null,
    voidv = null,
    karma = null,
    moral = null;
  let SF = null;
  const inst = {
    cello: null,
    pad: null,
    strings: null,
    grind: null,
    timpani: null,
    harp: null,
    celesta: null,
    tremStr: null
  };
  let strikeN = 0;

  /* ====================================================================== */
  /* Calibration                                                             */
  /* ====================================================================== */
  function calibrate(stats) {
    if (!stats) return;
    const mk = (lo, hi) => {
      lo = num(lo, -1);
      hi = num(hi, 1);
      const span = hi - lo;
      if (span < CONFIG.EXPAND_MIN_SPAN) return {
        mid: (lo + hi) / 2,
        half: 1
      };
      return {
        mid: (lo + hi) / 2,
        half: span / 2
      };
    };
    const P = mk(stats.pMin, stats.pMax),
      D = mk(stats.dMin, stats.dMax);
    expand = {
      pMid: P.mid,
      pHalf: P.half,
      dMid: D.mid,
      dHalf: D.half
    };
  }
  function expandP(p) {
    return clamp((p - expand.pMid) / expand.pHalf, -1, 1);
  }
  function expandD(d) {
    return clamp((d - expand.dMid) / expand.dHalf, -1, 1);
  }

  /* ====================================================================== */
  /* Deterministic buffers                                                   */
  /* ====================================================================== */
  function makeNoiseBuffer() {
    const len = ctx.sampleRate * 2,
      buf = ctx.createBuffer(1, len, ctx.sampleRate),
      d = buf.getChannelData(0),
      rnd = makePRNG(CONFIG.NOISE_SEED);
    for (let i = 0; i < len; i++) d[i] = rnd() * 2 - 1;
    return buf;
  }
  /* warm = short, dark, intimate room · cold = long, bright, vast cathedral */
  function makeImpulse(seconds, seed, dark) {
    const len = Math.floor(ctx.sampleRate * seconds),
      buf = ctx.createBuffer(2, len, ctx.sampleRate),
      rnd = makePRNG(seed);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / len;
        const env = Math.pow(1 - t, dark ? 2.8 : 1.8) * (1 - Math.exp(-i / (ctx.sampleRate * 0.05)));
        let v = (rnd() * 2 - 1) * env;
        if (dark) {
          lp += (v - lp) * 0.35;
          v = lp;
        } // darken the warm room
        d[i] = v;
      }
    }
    return buf;
  }
  function satCurve(k) {
    const n = 2048,
      c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1) * 2 - 1;
      c[i] = Math.tanh(k * x);
    }
    return c;
  }
  async function ensureCtor() {
    if (!SF) {
      const m = await import('https://cdn.jsdelivr.net/npm/smplr@0.26.0/dist/index.mjs');
      SF = m.Soundfont;
    }
    return SF;
  }
  function loadInst(instrument, destination) {
    const it = new SF(ctx, {
      instrument,
      destination
    });
    const p = it.load !== undefined ? it.load : it.ready;
    return Promise.resolve(p && p.then ? p : null).then(() => it);
  }

  /* ====================================================================== */
  /* Graph                                                                   */
  /* ====================================================================== */
  function buildGraph() {
    master = ctx.createGain();
    master.gain.value = CONFIG.MASTER_BASE;
    master.connect(ctx.destination);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    master.connect(analyser);

    /* colour tilt EQ on the dry sum: mix → tiltLow → tiltHigh → master */
    tiltHigh = ctx.createBiquadFilter();
    tiltHigh.type = 'highshelf';
    tiltHigh.frequency.value = CONFIG.TILT_HIGH_HZ;
    tiltHigh.gain.value = 0;
    tiltHigh.connect(master);
    tiltLow = ctx.createBiquadFilter();
    tiltLow.type = 'lowshelf';
    tiltLow.frequency.value = CONFIG.TILT_LOW_HZ;
    tiltLow.gain.value = 0;
    tiltLow.connect(tiltHigh);
    mix = ctx.createGain();
    mix.gain.value = 1;
    mix.connect(tiltLow);

    /* dual reverb (rwi crossfade), parallel to dry, post-tilt */
    warmVerb = ctx.createConvolver();
    warmVerb.buffer = makeImpulse(CONFIG.REVERB_WARM_SECONDS, CONFIG.WARM_SEED, true);
    coldVerb = ctx.createConvolver();
    coldVerb.buffer = makeImpulse(CONFIG.REVERB_COLD_SECONDS, CONFIG.COLD_SEED, false);
    warmWet = ctx.createGain();
    warmWet.gain.value = 0.6;
    warmVerb.connect(warmWet);
    warmWet.connect(master);
    coldWet = ctx.createGain();
    coldWet.gain.value = 0.4;
    coldVerb.connect(coldWet);
    coldWet.connect(master);
    reverbSend = ctx.createGain();
    reverbSend.gain.value = CONFIG.REVERB_SEND_BASE;
    reverbSend.connect(warmVerb);
    reverbSend.connect(coldVerb);

    /* dry bus + weather */
    bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(mix);
    bus.connect(reverbSend);
    weather = ctx.createBiquadFilter();
    weather.type = 'lowpass';
    weather.frequency.value = CONFIG.CUTOFF_BASE_HZ;
    weather.Q.value = 0.9;
    weather.connect(bus);

    /* stereo panners (social warmth: blend↔isolate) */
    const mkPan = () => {
      const p = ctx.createStereoPanner();
      p.pan.value = 0;
      return p;
    };
    pan.cello = mkPan();
    pan.pad = mkPan();
    pan.strings = mkPan();
    pan.grind = mkPan();
    pan.cello.connect(weather);
    pan.pad.connect(weather);
    pan.strings.connect(weather);

    /* sampled-layer gains → panner → weather */
    const mkG = dest => {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(dest);
      return g;
    };
    G.cello = mkG(pan.cello);
    G.pad = mkG(pan.pad);
    G.strings = mkG(pan.strings);
    G.timp = mkG(weather);
    G.noise = mkG(weather);

    /* grind (sampled): darken → gain → panner → bus */
    const grindLP = ctx.createBiquadFilter();
    grindLP.type = 'lowpass';
    grindLP.frequency.value = 2400;
    grindLP.Q.value = 0.7;
    G.grind = ctx.createGain();
    G.grind.gain.value = 0;
    grindLP.connect(G.grind);
    G.grind.connect(pan.grind);
    pan.grind.connect(bus);
    G.__grindLP = grindLP;

    /* sub: synth → saturate → lowpass → master (tight, felt) */
    const subSat = ctx.createWaveShaper();
    subSat.curve = satCurve(2.2);
    subSat.oversample = '2x';
    const subLP = ctx.createBiquadFilter();
    subLP.type = 'lowpass';
    subLP.frequency.value = 150;
    G.sub = ctx.createGain();
    G.sub.gain.value = 0;
    const oscA = ctx.createOscillator(),
      oscB = ctx.createOscillator();
    oscA.type = 'sine';
    oscB.type = 'sine';
    const subMix = ctx.createGain();
    subMix.gain.value = 0.5;
    oscA.connect(subMix);
    oscB.connect(subMix);
    subMix.connect(subSat);
    subSat.connect(subLP);
    subLP.connect(G.sub);
    G.sub.connect(mix);
    const subVerb = ctx.createGain();
    subVerb.gain.value = 0.10;
    G.sub.connect(subVerb);
    subVerb.connect(reverbSend);
    oscA.start();
    oscB.start();
    sub = {
      oscA,
      oscB
    };

    /* tremolo strings — bright, chaotic string activity for the heavy moments
       (replaces the static saw drone). Sampler loads into G.tremStr. Routed to
       mix so it stays bright and cuts through, with its own reverb send. */
    G.tremStr = ctx.createGain();
    G.tremStr.gain.value = 0;
    G.tremStr.connect(mix);
    const tsVerb = ctx.createGain();
    tsVerb.gain.value = 0.4;
    G.tremStr.connect(tsVerb);
    tsVerb.connect(reverbSend);

    /* (shimmer sine-drone removed at user request — contentment is carried by the
       acoustic harp / celesta / cello / warm pad, with NO sustained synth tone underneath) */

    /* noise wash */
    const nsrc = ctx.createBufferSource();
    nsrc.buffer = makeNoiseBuffer();
    nsrc.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 700;
    bp.Q.value = 0.6;
    nsrc.connect(bp);
    bp.connect(G.noise);
    nsrc.start();
    noiseNode = {
      src: nsrc,
      bp
    };

    /* VOID (Yurei breach): sub-harmonic felt in the chest → master direct */
    const vSat = ctx.createWaveShaper();
    vSat.curve = satCurve(1.7);
    vSat.oversample = '2x';
    const vLP = ctx.createBiquadFilter();
    vLP.type = 'lowpass';
    vLP.frequency.value = 75;
    G.voidd = ctx.createGain();
    G.voidd.gain.value = 0;
    const vMix = ctx.createGain();
    vMix.gain.value = 0.5;
    const v1 = ctx.createOscillator(),
      v2 = ctx.createOscillator();
    v1.type = 'sine';
    v2.type = 'sine';
    v1.frequency.value = 32;
    v2.frequency.value = 32.3;
    v1.connect(vMix);
    v2.connect(vMix);
    vMix.connect(vSat);
    vSat.connect(vLP);
    vLP.connect(G.voidd);
    G.voidd.connect(master);
    const vTrem = ctx.createOscillator();
    vTrem.type = 'sine';
    vTrem.frequency.value = CONFIG.VOID_TREMOR_HZ;
    const vTremDepth = ctx.createGain();
    vTremDepth.gain.value = 0;
    vTrem.connect(vTremDepth);
    vTremDepth.connect(G.voidd.gain);
    v1.start();
    v2.start();
    vTrem.start();
    voidv = {
      v1,
      v2,
      tremDepth: vTremDepth
    };

    /* KARMA suspension (synth 4th that hangs) + MORAL dissonance (minor 2nd) → weather */
    const mkSynthVoice = type => {
      const o = ctx.createOscillator();
      o.type = type;
      const g = ctx.createGain();
      g.gain.value = 0;
      o.connect(g);
      g.connect(weather);
      o.start();
      return {
        o,
        g
      };
    };
    karma = mkSynthVoice('triangle');
    G.karma = karma.g;
    moral = mkSynthVoice('sine');
    G.moral = moral.g;

    /* HARP + CELESTA — the melodic voices of contentment. Routed to mix (bright,
       bypassing the arousal lowpass) each with a warm reverb send. Samplers load
       into these gains in loadInstruments(). */
    G.harp = ctx.createGain();
    G.harp.gain.value = 0;
    G.harp.connect(mix);
    const harpVerb = ctx.createGain();
    harpVerb.gain.value = 0.55;
    G.harp.connect(harpVerb);
    harpVerb.connect(reverbSend);
    G.celesta = ctx.createGain();
    G.celesta.gain.value = 0;
    G.celesta.connect(mix);
    const celVerb = ctx.createGain();
    celVerb.gain.value = 0.6;
    G.celesta.connect(celVerb);
    celVerb.connect(reverbSend);
  }
  async function loadInstruments() {
    await ensureCtor();
    const [cello, pad, strings, grind, timpani, harp, celesta, tremStr] = await Promise.all([loadInst('cello', G.cello), loadInst('pad_2_warm', G.pad), loadInst('string_ensemble_1', G.strings), loadInst('distortion_guitar', G.__grindLP), loadInst('timpani', G.timp), loadInst('orchestral_harp', G.harp), loadInst('celesta', G.celesta), loadInst('tremolo_strings', G.tremStr)]);
    inst.cello = cello;
    inst.pad = pad;
    inst.strings = strings;
    inst.grind = grind;
    inst.timpani = timpani;
    inst.harp = harp;
    inst.celesta = celesta;
    inst.tremStr = tremStr;
  }

  /* ====================================================================== */
  /* Mapping — signals → targets                                             */
  /* ====================================================================== */
  function derive(sig) {
    sig = sig || {};
    /* locked */
    const P = num(sig.meanP, 0),
      A = clamp(num(sig.meanA, 0.5), 0, 1),
      D = num(sig.meanD, 0);
    const SM = clamp(num(sig.meanSM, 0.5), 0, 1),
      ev = Math.max(0, num(sig.eventCount, 0));
    /* new (benign defaults) */
    const ikigai = clamp(num(sig.meanIkigai, DEF.meanIkigai), 0, 1);
    const rwi = clamp(num(sig.rwi, DEF.rwi), 0, 1);
    const psi = clamp(num(sig.psi, DEF.psi), 0, 1);
    const warmS = clamp(num(sig.meanWarmth, DEF.meanWarmth), 0, 1);
    const conflicts = Math.max(0, num(sig.activeConflicts, DEF.activeConflicts));
    const conflictsN = clamp(conflicts / CONFIG.CONFLICT_NORM, 0, 1);
    const kfi = clamp(num(sig.kfi, DEF.kfi), 0, 1);
    const coherence = clamp(num(sig.meanMoralCoherence, DEF.meanMoralCoherence), 0, 1);
    const breached = sig.yureiMode === 'BREACHED';
    const hungerN = clamp(Math.max(0, num(sig.yureiHunger, DEF.yureiHunger)) / 20000, 0, 1.2);
    const load = clamp(num(sig.meanAllostaticLoad, DEF.meanAllostaticLoad), 0, 1);
    const retriev = clamp(num(sig.meanRetrievability, DEF.meanRetrievability), 0, 1);
    const tilt = sig.dominantColourWarmth === 'warm' ? 1 : sig.dominantColourWarmth === 'cool' ? -1 : 0;
    const px = expandP(P),
      dx = expandD(D);
    const mode = pickScale(px),
      scale = SCALES[mode];
    const tonic = clamp(CONFIG.TONIC_CENTRE_MIDI + CONFIG.D_PITCH_SIGN * dx * CONFIG.TONIC_RANGE_ST, CONFIG.TONIC_MIN_MIDI, CONFIG.TONIC_MAX_MIDI);
    const fifthMix = SM,
      tritoneMix = (1 - SM) * 0.9;
    const colourSemis = scale[COLOUR_DEGREES[colourIdx % COLOUR_DEGREES.length]];
    const thirdSemis = scale[2]; // the mode's 3rd — major in bright modes; the warmth of a SAFE chord

    const cutoff = CONFIG.CUTOFF_BASE_HZ + A * CONFIG.CUTOFF_SPAN_HZ - load * CONFIG.ALLO_CUTOFF_HZ;
    const lfoRate = lerp(CONFIG.LFO_RATE_MIN_HZ, CONFIG.LFO_RATE_MAX_HZ, A);
    const evDepth = Math.min(CONFIG.EVENT_DEPTH_CAP_HZ, ev * CONFIG.EVENT_LFO_DEPTH_HZ);
    const bowInt = lerp(CONFIG.BOW_INTERVAL_CALM_S, CONFIG.BOW_INTERVAL_HOT_S, A);
    let pulseInt = lerp(CONFIG.PULSE_INTERVAL_LO_SM_S, CONFIG.PULSE_INTERVAL_HI_SM_S, SM);
    pulseInt *= 1 - 0.25 * conflictsN; // conflict → insistent

    const pNorm = (px + 1) / 2;
    const stress = clamp(CONFIG.W_AROUSAL * A + CONFIG.W_DISPLEASURE * (1 - pNorm) + CONFIG.W_MISMONITOR * (1 - SM), 0, 1);
    const warm = sstep(ikigai, CONFIG.WARM_BLOOM_LO, CONFIG.WARM_BLOOM_HI); // contentment bloom
    const glow = warm * (1 - CONFIG.GLOW_STRESS_BLEED * stress); // eroded by crisis

    const loadTrim = 1 - CONFIG.ALLO_CEIL * load; // exhaustion compresses headroom
    const tW = tilt > 0 ? 1 : 0,
      tC = tilt < 0 ? 1 : 0; // warm / cool flags
    /* CHAOS — how frantic the heavy moment is: stress = heaviness, arousal = agitation */
    const chaos = clamp(sstep(stress, 0.48, 0.95) * (0.45 + 0.55 * A), 0, 1);
    const lvl = {
      /* warmth layers: bloom with contentment OR accumulate with stress */
      pad: clamp((0.55 * glow + sstep(stress, 0.28, 0.72)) * (1 + 0.14 * tW - 0.18 * tC), 0, 1) * loadTrim,
      cello: clamp((0.62 * glow + sstep(stress, 0.34, 0.80)) * (1 + 0.16 * tW - 0.08 * tC), 0, 1) * loadTrim,
      /* crisis mass */
      strings: sstep(stress, 0.42, 0.82) * loadTrim,
      tremStr: sstep(stress, 0.50, 0.92) * loadTrim,
      sub: sstep(stress, 0.18, 0.66) * (1 + 0.06 * tW),
      grind: sstep(stress, 0.55, 0.94) * loadTrim,
      noise: clamp((1 - SM) * 0.5 + sstep(stress, 0.46, 1) * 0.4 + load * 0.12, 0, 1),
      timp: clamp(CONFIG.TIMP_BASE + CONFIG.TIMP_STRESS * stress + CONFIG.TIMP_CONFLICT * conflictsN, 0, 1),
      /* engine-fed colour voices */
      voidd: breached ? CONFIG.VOID_FLOOR + CONFIG.VOID_SPAN * hungerN : 0,
      /* injustice / incoherence stay SILENT while the realm is healthy — they only
         creep in once kfi/coherence actually fall, and contentment papers over them */
      karma: sstep(1 - kfi, 0.30, 0.78) * (1 - 0.6 * glow),
      moral: sstep(1 - coherence, 0.30, 0.78) * (1 - 0.6 * glow),
      /* melodic JOY — harp arpeggio + celesta sparkle, present only when content */
      harp: sstep(glow, 0.28, 0.74),
      celesta: sstep(glow, 0.42, 0.86) * (0.55 + 0.45 * ikigai)
    };
    return {
      P,
      A,
      D,
      SM,
      ev,
      ikigai,
      rwi,
      psi,
      warmS,
      conflicts,
      conflictsN,
      kfi,
      coherence,
      breached,
      hungerN,
      load,
      retriev,
      tilt,
      px,
      dx,
      mode,
      scale,
      tonic,
      stress,
      warm,
      glow,
      chaos,
      cutoff,
      lfoRate,
      evDepth,
      bowInt,
      pulseInt,
      fifthMix,
      tritoneMix,
      colourSemis,
      thirdSemis,
      loadTrim,
      lvl
    };
  }

  /* ====================================================================== */
  /* Apply targets                                                           */
  /* ====================================================================== */
  function applyTargets(ac) {
    const now = ctx.currentTime,
      C = CONFIG,
      CE = C.CEIL;
    const set = (node, v, tau) => node.setTargetAtTime(v, now, tau);
    set(G.pad.gain, ac.lvl.pad * CE.pad * layerFactor('pad'), C.TAU_LAYER);
    set(G.cello.gain, ac.lvl.cello * CE.cello * layerFactor('cello'), C.TAU_LAYER);
    set(G.strings.gain, ac.lvl.strings * CE.strings * layerFactor('strings'), C.TAU_LAYER);
    set(G.sub.gain, ac.lvl.sub * CE.sub * layerFactor('sub'), C.TAU_LAYER);
    set(G.grind.gain, ac.lvl.grind * CE.grind * layerFactor('grind'), C.TAU_LAYER);
    set(G.tremStr.gain, ac.lvl.tremStr * CE.tremStr * layerFactor('tremStr'), C.TAU_LAYER);
    set(G.timp.gain, ac.lvl.timp * CE.timpani * layerFactor('timp'), C.TAU_LAYER);
    set(G.noise.gain, ac.lvl.noise * C.NOISE_GAIN_MAX * layerFactor('noise'), C.TAU_LAYER);
    set(G.voidd.gain, ac.lvl.voidd * CE.voidd * layerFactor('voidd'), C.TAU_VOID);
    set(G.karma.gain, ac.lvl.karma * CE.karma * layerFactor('karma'), C.TAU_LAYER);
    set(G.moral.gain, ac.lvl.moral * CE.moral * layerFactor('moral'), C.TAU_LAYER);
    set(G.harp.gain, ac.lvl.harp * CE.harp * layerFactor('harp'), C.TAU_LAYER);
    set(G.celesta.gain, ac.lvl.celesta * CE.celesta * layerFactor('celesta'), C.TAU_LAYER);
    set(noiseNode.bp.frequency, lerp(600, 2000, ac.stress), C.TAU_NOISE_BP);

    /* master weight, compressed toward mid by exhaustion */
    const dom = (ac.dx + 1) / 2;
    let m = C.MASTER_BASE + C.MASTER_STRESS * ac.stress + C.MASTER_DOM * dom;
    m = lerp(m, 0.5, C.ALLO_COMPRESS * ac.load);
    set(master.gain, clamp(m, 0, C.MASTER_CAP) * masterTrim, C.TAU_MASTER);

    /* reverb send amount + warm/cold (rwi) crossfade */
    set(reverbSend.gain, C.REVERB_SEND_BASE + C.REVERB_SEND_STRESS * ac.stress + C.REVERB_SEND_WARMTH * ac.glow, C.TAU_SEND);
    set(warmWet.gain, C.REVERB_WET * (0.25 + 0.75 * ac.rwi), C.TAU_RWI);
    set(coldWet.gain, C.REVERB_WET * (0.25 + 0.75 * (1 - ac.rwi)), C.TAU_RWI);

    /* colour tilt EQ */
    set(tiltLow.gain, ac.tilt * C.TILT_DB, C.TAU_TILT);
    set(tiltHigh.gain, -ac.tilt * C.TILT_DB, C.TAU_TILT);

    /* social warmth → pan spread (isolate when low) */
    const iso = 1 - ac.warmS;
    for (const k in C.PAN_BASE) if (pan[k]) set(pan[k].pan, C.PAN_BASE[k] * iso, C.TAU_PAN);

    /* pitches (glide) */
    const f = midiToFreq(ac.tonic);
    set(sub.oscA.frequency, f / 4, C.GLIDE_S);
    set(sub.oscB.frequency, f / 2, C.GLIDE_S);
    set(karma.o.frequency, f * Math.pow(2, C.KARMA_SUS_ST / 12), C.GLIDE_S);
    set(moral.o.frequency, f * Math.pow(2, C.MORAL_DISS_ST / 12), C.GLIDE_S);

    /* void: pitch from tonic (deep), tremor depth from hunger */
    const vf = clamp(midiToFreq(ac.tonic) / 8, C.VOID_FREQ_MIN, C.VOID_FREQ_MAX);
    set(voidv.v1.frequency, vf, C.TAU_VOID);
    set(voidv.v2.frequency, vf * 1.009, C.TAU_VOID);
    set(voidv.tremDepth.gain, ac.breached ? ac.hungerN * 0.5 * CE.voidd : 0, C.TAU_VOID);
  }

  /* immediate re-apply of just the 13 layer gains (so a solo/mute toggle is heard
     at once, without waiting for the next updateTick). Uses the last derived lvl. */
  function reapplyLayerGains() {
    if (!ready || !G.pad) return;
    const now = ctx.currentTime,
      CE = CONFIG.CEIL,
      L = cur.lvl,
      TAU = CONFIG.TAU_LAYER;
    const s = (n, v) => {
      if (G[n]) G[n].gain.setTargetAtTime(v, now, TAU);
    };
    s('pad', L.pad * CE.pad * layerFactor('pad'));
    s('cello', L.cello * CE.cello * layerFactor('cello'));
    s('strings', L.strings * CE.strings * layerFactor('strings'));
    s('sub', L.sub * CE.sub * layerFactor('sub'));
    s('grind', L.grind * CE.grind * layerFactor('grind'));
    s('tremStr', L.tremStr * CE.tremStr * layerFactor('tremStr'));
    s('timp', L.timp * CE.timpani * layerFactor('timp'));
    s('noise', L.noise * CONFIG.NOISE_GAIN_MAX * layerFactor('noise'));
    s('voidd', L.voidd * CE.voidd * layerFactor('voidd'));
    s('karma', L.karma * CE.karma * layerFactor('karma'));
    s('moral', L.moral * CE.moral * layerFactor('moral'));
    s('harp', L.harp * CE.harp * layerFactor('harp'));
    s('celesta', L.celesta * CE.celesta * layerFactor('celesta'));
  }

  /* ====================================================================== */
  /* Voicing — texture, never melody (extensions ← memory; doublings ← load) */
  /* ====================================================================== */
  function voiceVel(base, span, ac, key) {
    const micro = (detHash(key, strikeN) - 0.5) * 8;
    return clamp(Math.round(base + ac.A * span + micro), 1, 127);
  }
  function clampMidi(m, range) {
    return clamp(Math.round(m), range[0], range[1]);
  }
  function strikeChord(instrument, voices, dur, t0, layerKey, warmS) {
    if (!instrument) return;
    const blend = 0.4 + 0.6 * warmS; // blended ensemble overlaps tighter
    for (const v of voices) {
      if (v.on <= 0.06) continue;
      strikeN++;
      const jit = detHash(layerKey + v.tag, strikeN) * CONFIG.JITTER_S * (2 - blend);
      try {
        instrument.start({
          note: v.midi,
          velocity: clamp(Math.round(v.vel * (0.5 + 0.5 * v.on)), 1, 127),
          duration: dur,
          time: t0 + jit
        });
      } catch (e) {}
    }
  }
  function celloVoices(ac) {
    const t = Math.round(ac.tonic),
      R = CONFIG.CELLO_RANGE,
      narrow = 1 - CONFIG.ALLO_NARROW * ac.load,
      glow5 = 0.7 + 0.5 * ac.ikigai;
    return [{
      tag: 'lo',
      midi: clampMidi(t - 12, R),
      vel: voiceVel(74, 26, ac, 'c-lo'),
      on: 1 * narrow
    }, {
      tag: 'rt',
      midi: clampMidi(t, R),
      vel: voiceVel(80, 24, ac, 'c-rt'),
      on: 1
    }, {
      tag: '3',
      midi: clampMidi(t + ac.thirdSemis, R),
      vel: voiceVel(60, 18, ac, 'c-3'),
      on: clamp(ac.glow * 1.05, 0, 1)
    },
    // major 3rd blooms with contentment → a warm, safe chord
    {
      tag: '5',
      midi: clampMidi(t + 7, R),
      vel: voiceVel(64, 22, ac, 'c-5'),
      on: ac.fifthMix * glow5
    }, {
      tag: 'tt',
      midi: clampMidi(t + 6, R),
      vel: voiceVel(58, 20, ac, 'c-tt'),
      on: ac.tritoneMix
    }, {
      tag: 'co',
      midi: clampMidi(t + ac.colourSemis, R),
      vel: voiceVel(50, 18, ac, 'c-co'),
      on: 0.85 * ac.retriev
    }, {
      tag: '9',
      midi: clampMidi(t + 14, R),
      vel: voiceVel(42, 14, ac, 'c-9'),
      on: Math.max(0, ac.retriev - 0.55) * 1.8
    }];
  }
  function padVoices(ac) {
    const t = Math.round(ac.tonic),
      R = CONFIG.PAD_RANGE,
      narrow = 1 - CONFIG.ALLO_NARROW * ac.load,
      glow5 = 0.7 + 0.5 * ac.ikigai;
    return [{
      tag: 'rt',
      midi: clampMidi(t, R),
      vel: voiceVel(52, 18, ac, 'p-rt'),
      on: 1
    }, {
      tag: '3',
      midi: clampMidi(t + ac.thirdSemis, R),
      vel: voiceVel(48, 14, ac, 'p-3'),
      on: clamp(ac.glow, 0, 1)
    }, {
      tag: '5',
      midi: clampMidi(t + 7, R),
      vel: voiceVel(46, 14, ac, 'p-5'),
      on: Math.max(ac.fifthMix, 0.4) * glow5
    }, {
      tag: 'oc',
      midi: clampMidi(t + 12, R),
      vel: voiceVel(42, 12, ac, 'p-oc'),
      on: 0.8 * narrow
    }];
  }
  function stringsVoices(ac) {
    const t = Math.round(ac.tonic),
      R = CONFIG.STRINGS_RANGE,
      narrow = 1 - CONFIG.ALLO_NARROW * ac.load;
    return [{
      tag: 'lo',
      midi: clampMidi(t - 12, R),
      vel: voiceVel(58, 22, ac, 's-lo'),
      on: 1 * narrow
    }, {
      tag: 'rt',
      midi: clampMidi(t, R),
      vel: voiceVel(62, 22, ac, 's-rt'),
      on: 1
    }, {
      tag: '5',
      midi: clampMidi(t + 7, R),
      vel: voiceVel(56, 18, ac, 's-5'),
      on: ac.fifthMix
    }, {
      tag: 'tt',
      midi: clampMidi(t + 6, R),
      vel: voiceVel(52, 18, ac, 's-tt'),
      on: ac.tritoneMix
    }, {
      tag: 'oc',
      midi: clampMidi(t + 12, R),
      vel: voiceVel(54, 18, ac, 's-oc'),
      on: 0.9 * narrow
    }, {
      tag: 'co',
      midi: clampMidi(t + 12 + ac.colourSemis, R),
      vel: voiceVel(46, 16, ac, 's-co'),
      on: 0.7 * ac.retriev
    }];
  }
  function grindVoices(ac) {
    const t = Math.round(ac.tonic),
      R = CONFIG.GRIND_RANGE,
      menace = ac.SM < 0.4 ? ac.tritoneMix : 0;
    return [{
      tag: 'lo',
      midi: clampMidi(t - 12, R),
      vel: voiceVel(94, 24, ac, 'g-lo'),
      on: 1
    }, {
      tag: '5',
      midi: clampMidi(t - 12 + 7, R),
      vel: voiceVel(88, 22, ac, 'g-5'),
      on: 1
    }, {
      tag: 'rt',
      midi: clampMidi(t, R),
      vel: voiceVel(82, 22, ac, 'g-rt'),
      on: 0.85
    }, {
      tag: 'tt',
      midi: clampMidi(t - 12 + 6, R),
      vel: voiceVel(80, 20, ac, 'g-tt'),
      on: menace
    }];
  }

  /* ====================================================================== */
  /* Scheduler — clocks (bow=arousal, pulse=harmonic rhythm), psi jitter,     */
  /* conflict syncopation                                                     */
  /* ====================================================================== */
  let bowClock = 0,
    pulseClock = 0,
    harpClock = 0,
    chaosClock = 0,
    lfoPhase = 0,
    lastSchedTime = 0,
    pulseN = 0,
    bowN = 0,
    harpN = 0,
    chaosN = 0;
  function jitter(base, seedKey, n, amt) {
    return base * (1 + (detHash(seedKey, n) - 0.5) * 2 * amt);
  }
  function timpStrike(pitch, vel, dur, t0) {
    strikeN++;
    try {
      inst.timpani.start({
        note: pitch,
        velocity: clamp(Math.round(vel), 1, 127),
        duration: dur,
        time: t0
      });
    } catch (e) {}
  }

  /* a gentle rolling arpeggio through the mode's clean chord tones, two octaves up,
     with a soft descending tail — melodic MOTION, never a fixed tune */
  function harpArp(scale) {
    const d = CONFIG.HARP_DEGREES;
    const lo = d.map(k => 12 + scale[k]); // one octave up
    const hi = d.map(k => 24 + scale[k]); // two octaves up
    const tail = [12 + scale[4], 12 + scale[2]]; // gentle descent: oct+5th, oct+3rd
    return lo.concat(hi, tail);
  }
  function runScheduler() {
    if (!ctx) return;
    const now = ctx.currentTime,
      ahead = now + CONFIG.LOOKAHEAD_S,
      ac = cur;

    /* weather LFO throb */
    const dt = lastSchedTime ? now - lastSchedTime : 0;
    lastSchedTime = now;
    lfoPhase += dt * ac.lfoRate * 2 * Math.PI;
    weather.frequency.setTargetAtTime(clamp(ac.cutoff + Math.sin(lfoPhase) * ac.evDepth, 90, 6000), now, CONFIG.TAU_CUTOFF);

    /* PULSE clock — colour advance, sustained chords, timpani heartbeat */
    if (pulseClock < now + 0.05) pulseClock = now + 0.25;
    while (pulseClock < ahead) {
      const t0 = pulseClock;
      colourIdx = (colourIdx + 1) % COLOUR_DEGREES.length;
      pulseN++;
      const pulseDur = clamp(ac.pulseInt * CONFIG.PULSE_OVERLAP * (1 + 0.3 * ac.warmS), 3, 28);
      if (ac.lvl.pad > 0.02) strikeChord(inst.pad, padVoices(ac), pulseDur, t0, 'pad', ac.warmS);
      if (ac.lvl.strings > 0.02) strikeChord(inst.strings, stringsVoices(ac), pulseDur, t0, 'str', ac.warmS);
      if (ac.lvl.grind > 0.04) strikeChord(inst.grind, grindVoices(ac), clamp(ac.pulseInt * CONFIG.GRIND_OVERLAP * (1 - 0.5 * ac.chaos), 1.2, 9), t0, 'grd', ac.warmS);

      /* psi: occasionally drop the heartbeat (institutions can't keep time) */
      const skip = ac.psi > 0.25 && detHash('skip', pulseN) < ac.psi * CONFIG.PSI_SKIP;
      if (inst.timpani && ac.lvl.timp > 0.03 && !skip) {
        const pitch = clampMidi(Math.round(ac.tonic) - 12, CONFIG.TIMPANI_RANGE);
        timpStrike(pitch, 26 + 70 * ac.stress + 24 * ac.conflictsN, 2.6, t0);
        /* conflicts: syncopated off-beat accent (rhythmic aggression) */
        if (ac.conflictsN > 0.25) timpStrike(pitch, (26 + 55 * ac.stress) * ac.conflictsN, 1.8, t0 + ac.pulseInt * 0.5);
      }
      pulseClock += Math.max(0.4, jitter(ac.pulseInt, 'pj', pulseN, ac.psi * CONFIG.PSI_JITTER));
    }

    /* BOW clock — overlapping cello re-bows; durations tighten as chaos rises */
    if (bowClock < now + 0.05) bowClock = now + 0.18;
    while (bowClock < ahead) {
      const t0 = bowClock;
      bowN++;
      if (ac.lvl.cello > 0.02) {
        const dur = clamp(ac.bowInt * CONFIG.CELLO_OVERLAP * (1 - 0.55 * ac.chaos), 0.7, CONFIG.CELLO_DUR_MAX_S);
        strikeChord(inst.cello, celloVoices(ac), dur, t0, 'cel', ac.warmS);
      }
      bowClock += Math.max(0.35, jitter(ac.bowInt, 'bj', bowN, ac.psi * CONFIG.PSI_JITTER * 0.6));
    }

    /* CHAOS clock — the heavy moments as frantic ACTIVITY, not a drone: tremolo
       guitar and cello trading fast aggressive notes, bright tremolo strings
       swelling above, the rhythm itself unstable. Silent until stress is high. */
    if (ac.chaos > 0.05 && (inst.grind || inst.cello)) {
      if (chaosClock < now + 0.02) chaosClock = now + 0.05;
      const tn = Math.round(ac.tonic);
      const interval = lerp(CONFIG.CHAOS_SLOW_S, CONFIG.CHAOS_FAST_S, ac.chaos);
      const tones = [0, 7, 12, -12, ac.SM < 0.5 ? 6 : 7]; // root·5th·oct·low-oct·(tritone when mis-monitored)
      while (chaosClock < ahead) {
        const t0 = chaosClock;
        chaosN++;
        let pick = tones[chaosN % tones.length];
        const wild = detHash('cw', chaosN);
        if (ac.chaos > 0.6 && wild > 0.8) pick += wild > 0.92 ? 1 : -1; // semitone grind at peak chaos
        const bright = ac.chaos > 0.5 && detHash('cb', chaosN) > 0.72 ? 12 : 0; // occasional octave-up brightness
        if (chaosN % 2 === 0 && inst.grind) {
          const m = clampMidi(tn + pick + bright, CONFIG.GRIND_RANGE);
          const vel = clamp(Math.round(70 + 42 * ac.chaos + (detHash('gv', chaosN) - 0.5) * 18), 1, 127);
          strikeN++;
          try {
            inst.grind.start({
              note: m,
              velocity: vel,
              duration: CONFIG.CHAOS_DUR_S,
              time: t0
            });
          } catch (e) {}
        } else if (inst.cello) {
          const m = clampMidi(tn + pick + 12, CONFIG.CELLO_RANGE); // cello tremolo up an octave = brighter, frantic
          const vel = clamp(Math.round(60 + 42 * ac.chaos + (detHash('cv', chaosN) - 0.5) * 18), 1, 127);
          strikeN++;
          try {
            inst.cello.start({
              note: m,
              velocity: vel,
              duration: CONFIG.CHAOS_DUR_S * 1.3,
              time: t0
            });
          } catch (e) {}
        }
        if (inst.tremStr && ac.lvl.tremStr > 0.04 && chaosN % 4 === 0) {
          const m = clampMidi(tn + 12 + (ac.SM < 0.5 ? 6 : 7), CONFIG.TREMSTR_RANGE);
          strikeN++;
          try {
            inst.tremStr.start({
              note: m,
              velocity: clamp(Math.round(48 + 44 * ac.chaos), 1, 122),
              duration: 0.9,
              time: t0 + 0.03
            });
          } catch (e) {}
        }
        chaosClock += Math.max(0.07, jitter(interval, 'chj', chaosN, 0.3)); // unstable rhythm = chaos
      }
    } else {
      chaosClock = 0;
    }

    /* HARP clock — the melodic joy of a content realm; silent otherwise. Notes ring
       ~2s and overlap into a shimmering cascade; celesta glints sparsely above. */
    if (ac.lvl.harp > CONFIG.HARP_GLOW_GATE && inst.harp) {
      if (harpClock < now + 0.05) harpClock = now + 0.2;
      const arp = harpArp(ac.scale),
        tn = Math.round(ac.tonic);
      while (harpClock < ahead) {
        const t0 = harpClock;
        harpN++;
        const step = arp[harpN % arp.length];
        const midi = clampMidi(tn + step, CONFIG.HARP_RANGE);
        const vel = clamp(Math.round(32 + 26 * ac.glow + (detHash('hv', harpN) - 0.5) * 10), 1, 92);
        strikeN++;
        try {
          inst.harp.start({
            note: midi,
            velocity: vel,
            duration: CONFIG.HARP_DUR_S,
            time: t0
          });
        } catch (e) {}
        if (inst.celesta && ac.lvl.celesta > CONFIG.HARP_GLOW_GATE && detHash('cg', harpN) < CONFIG.CELESTA_SPARKLE_P) {
          const cm = clampMidi(tn + step + 12, CONFIG.CELESTA_RANGE);
          try {
            inst.celesta.start({
              note: cm,
              velocity: clamp(Math.round(26 + 22 * ac.glow), 1, 78),
              duration: 2.4,
              time: t0 + 0.05
            });
          } catch (e) {}
        }
        harpClock += Math.max(0.2, jitter(CONFIG.HARP_INTERVAL_S, 'hj', harpN, 0.16));
      }
    } else {
      harpClock = 0;
    }
  }
  function handleSurge(ac) {
    if (!inst.timpani) return;
    const floor = Math.max(CONFIG.SURGE_MIN_EV, evEMA),
      ratio = floor > 0 ? ac.ev / floor : 0;
    if (ac.ev >= CONFIG.SURGE_MIN_EV && ratio >= CONFIG.SURGE_RATIO && tick - lastSurgeTick >= CONFIG.SURGE_COOLDOWN_TICKS) {
      lastSurgeTick = tick;
      const over = clamp((ratio - CONFIG.SURGE_RATIO) / (3 - CONFIG.SURGE_RATIO), 0, 1);
      const v = 60 + over * 55,
        lo = clampMidi(Math.round(ac.tonic) - 12, CONFIG.TIMPANI_RANGE),
        now = ctx.currentTime;
      timpStrike(lo, v, 3.0, now);
      if (ratio >= CONFIG.SURGE_FIFTH_RATIO) timpStrike(clampMidi(lo + 7, CONFIG.TIMPANI_RANGE), v * 0.8, 3.0, now + 0.07);
    }
  }

  /* ====================================================================== */
  /* Public API                                                              */
  /* ====================================================================== */
  async function init(audioContext) {
    if (ready) return;
    if (audioContext) {
      ctx = audioContext;
      ownCtx = false;
    } else {
      ctx = new (global.AudioContext || global.webkitAudioContext)();
      ownCtx = true;
      createdCtx = true;
    }
    if (ctx.state === 'suspended') {
      try {
        ctx.resume();
      } catch (e) {}
    } // fire, never await (would hang without a gesture)
    buildGraph();
    await loadInstruments();
    bowClock = pulseClock = harpClock = chaosClock = lfoPhase = lastSchedTime = 0;
    pulseN = bowN = harpN = chaosN = 0;
    scheduler = setInterval(runScheduler, CONFIG.SCHED_MS);
    ready = true;
    applyTargets(derive({
      meanP: cur.P,
      meanA: cur.A,
      meanD: cur.D,
      meanSM: cur.SM
    }));
  }
  function updateTick(sig) {
    if (!ready) return;
    tick++;
    const ev = Math.max(0, num(sig && sig.eventCount, 0));
    evEMA = evEMA + CONFIG.EMA_ALPHA * (ev - evEMA);
    const ac = derive(sig);
    cur = Object.assign(cur, ac);
    applyTargets(ac);
    handleSurge(ac);
  }
  function setMasterGain(g) {
    masterTrim = clamp(num(g, 1), 0, 1.5);
    if (master) master.gain.setTargetAtTime(masterTrim * CONFIG.MASTER_BASE, ctx.currentTime, 0.2);
  }

  /* per-layer solo / mute. name accepts either the solo key (e.g. 'timp') or the
     getInfo()/display key (e.g. 'timpani', 'void') — both normalise. */
  function setLayerSolo(name, on) {
    const k = normLayer(name);
    if (on) soloSet.add(k);else soloSet.delete(k);
    reapplyLayerGains();
  }
  function setLayerMute(name, on) {
    const k = normLayer(name);
    if (on) muteSet.add(k);else muteSet.delete(k);
    reapplyLayerGains();
  }
  function toggleLayerSolo(name) {
    setLayerSolo(name, !soloSet.has(normLayer(name)));
  }
  function toggleLayerMute(name) {
    setLayerMute(name, !muteSet.has(normLayer(name)));
  }
  function clearLayerOverrides() {
    soloSet.clear();
    muteSet.clear();
    reapplyLayerGains();
  }
  function getOverrides() {
    return {
      solo: Array.from(soloSet),
      mute: Array.from(muteSet)
    };
  }
  function getInfo() {
    const lv = n => G[n] ? +G[n].gain.value.toFixed(4) : 0;
    return {
      ready,
      tick,
      mode: cur.mode,
      tonic: midiName(cur.tonic),
      tonicMidi: +cur.tonic.toFixed(2),
      stress: +cur.stress.toFixed(3),
      warmth: +cur.warm.toFixed(3),
      glow: +cur.glow.toFixed(3),
      chaos: +(cur.chaos || 0).toFixed(3),
      cutoff: Math.round(cur.cutoff),
      eventEMA: +evEMA.toFixed(2),
      consonance: +cur.fifthMix.toFixed(2),
      signals: {
        ikigai: +cur.ikigai.toFixed(2),
        rwi: +cur.rwi.toFixed(2),
        psi: +cur.psi.toFixed(2),
        warmth: +cur.warmS.toFixed(2),
        conflicts: cur.conflicts,
        kfi: +cur.kfi.toFixed(2),
        coherence: +cur.coherence.toFixed(2),
        yurei: cur.breached ? 'BREACHED' : 'WITHDRAWN',
        hunger: +(cur.hungerN * 20000).toFixed(0),
        allostaticLoad: +cur.load.toFixed(2),
        retrievability: +cur.retriev.toFixed(2),
        colour: cur.tilt > 0 ? 'warm' : cur.tilt < 0 ? 'cool' : 'neutral'
      },
      layers: {
        sub: lv('sub'),
        cello: lv('cello'),
        pad: lv('pad'),
        strings: lv('strings'),
        grind: lv('grind'),
        tremStr: lv('tremStr'),
        timpani: lv('timp'),
        noise: lv('noise'),
        void: lv('voidd'),
        karma: lv('karma'),
        moral: lv('moral'),
        harp: lv('harp'),
        celesta: lv('celesta')
      },
      /* derived target levels (0..1 windows) — stable even before gains ramp;
         useful for driving realm visuals straight off the soundscape */
      targets: Object.assign({}, cur.lvl)
    };
  }
  function getAnalyser() {
    return analyser;
  }
  function destroy() {
    if (scheduler) {
      clearInterval(scheduler);
      scheduler = null;
    }
    const c = ctx;
    try {
      if (master) master.gain.setTargetAtTime(0, c.currentTime, 0.6);
    } catch (e) {}
    ready = false;
    setTimeout(() => {
      try {
        const stops = [sub && sub.oscA, sub && sub.oscB, noiseNode && noiseNode.src, voidv && voidv.v1, voidv && voidv.v2, karma && karma.o, moral && moral.o];
        for (const o of stops) {
          if (o) try {
            o.stop();
          } catch (e) {}
        }
        if (voidv) try {/* tremor LFO */} catch (e) {}
        if (createdCtx && c) c.close();
      } catch (e) {}
    }, 1400);
    ctx = master = mix = bus = weather = analyser = tiltLow = tiltHigh = null;
    reverbSend = warmVerb = coldVerb = warmWet = coldWet = null;
    sub = noiseNode = voidv = karma = moral = null;
    pan = {};
    for (const k in inst) inst[k] = null;
    for (const k in G) delete G[k];
    tick = 0;
    evEMA = 0;
    lastSurgeTick = -1e9;
    colourIdx = 0;
    createdCtx = false;
    soloSet.clear();
    muteSet.clear();
  }
  const realmAudio = {
    init,
    updateTick,
    calibrate,
    setMasterGain,
    getInfo,
    getAnalyser,
    destroy,
    setLayerSolo,
    setLayerMute,
    toggleLayerSolo,
    toggleLayerMute,
    clearLayerOverrides,
    getOverrides,
    get ready() {
      return ready;
    },
    CONFIG,
    DEFAULTS: DEF,
    LAYERS,
    MAPPING
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = realmAudio;
  global.realmAudio = realmAudio;
})(typeof window !== 'undefined' ? window : this);
})(); } catch (e) { __ds_ns.__errors.push({ path: "audio/realm-audio.js", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — a small status/label pill. In `lab` it carries a run-state
 * colour (show/travel/dayoff/error/neutral); in `realm` it's an
 * ink-outlined cartoon tag.
 */
function Badge({
  children,
  world = 'lab',
  tone = 'neutral',
  style,
  ...rest
}) {
  const labTones = {
    show: {
      bg: 'rgba(52,211,153,0.14)',
      fg: 'var(--lab-show)'
    },
    travel: {
      bg: 'rgba(96,165,250,0.14)',
      fg: 'var(--lab-travel)'
    },
    dayoff: {
      bg: 'rgba(251,191,36,0.14)',
      fg: 'var(--lab-dayoff)'
    },
    error: {
      bg: 'rgba(248,113,113,0.14)',
      fg: 'var(--lab-error)'
    },
    neutral: {
      bg: 'var(--lab-hover)',
      fg: 'var(--lab-text-2)'
    }
  };
  let look;
  if (world === 'realm') {
    look = {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      background: 'var(--white)',
      color: 'var(--ink)',
      border: 'var(--ink-line) solid var(--ink)',
      borderRadius: 'var(--r-pill)',
      padding: '3px 10px'
    };
  } else {
    const t = labTones[tone] || labTones.neutral;
    look = {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      background: t.bg,
      color: t.fg,
      border: '1px solid transparent',
      borderRadius: 'var(--r-pill)',
      padding: '3px 10px'
    };
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      ...look,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the system's primary action control.
 * Two worlds: `realm` (cheese fill, heavy ink outline, hard sticker shadow,
 * bouncy press) and `lab` (emerald instrument button, hairline border,
 * shrink-on-press). Variants tune emphasis within each world.
 */
function Button({
  children,
  world = 'lab',
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const sizes = {
    sm: {
      padding: '6px 12px',
      font: 13
    },
    md: {
      padding: '10px 18px',
      font: 14
    },
    lg: {
      padding: '14px 24px',
      font: 16
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: s.padding,
    fontSize: s.font,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'transform 140ms cubic-bezier(.34,1.56,.64,1), background 140ms, border-color 140ms',
    transform: pressed && !disabled ? 'scale(0.96)' : 'scale(1)',
    opacity: disabled ? 0.45 : 1,
    whiteSpace: 'nowrap'
  };
  let look = {};
  if (world === 'realm') {
    const fills = {
      primary: {
        bg: 'var(--cheese)',
        fg: 'var(--ink)'
      },
      secondary: {
        bg: 'var(--white)',
        fg: 'var(--ink)'
      },
      danger: {
        bg: 'var(--slice-red)',
        fg: 'var(--white)'
      }
    };
    const f = fills[variant] || fills.primary;
    look = {
      fontFamily: 'var(--font-pop)',
      fontWeight: 400,
      background: f.bg,
      color: f.fg,
      border: 'var(--ink-bold) solid var(--ink)',
      borderRadius: 'var(--r-pill)',
      boxShadow: pressed || disabled ? 'none' : 'var(--shadow-sticker)'
    };
  } else {
    const fills = {
      primary: {
        bg: 'var(--phosphor)',
        fg: 'var(--lab-bg)',
        bd: 'transparent'
      },
      secondary: {
        bg: 'var(--lab-panel)',
        fg: 'var(--lab-text-2)',
        bd: 'var(--lab-line)'
      },
      danger: {
        bg: 'transparent',
        fg: 'var(--lab-error)',
        bd: 'var(--lab-error)'
      },
      ghost: {
        bg: 'transparent',
        fg: 'var(--lab-text-2)',
        bd: 'var(--lab-line)'
      }
    };
    const f = fills[variant] || fills.primary;
    look = {
      fontFamily: 'var(--font-ui)',
      fontWeight: 600,
      background: f.bg,
      color: f.fg,
      border: `1px solid ${f.bd}`,
      borderRadius: 'var(--r-sm)'
    };
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    style: {
      ...base,
      ...look,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, icon), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/MonoLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MonoLabel — the uppercase monospace eyebrow/key used for telemetry
 * keys, section labels and toolbar captions across the Lab.
 */
function MonoLabel({
  children,
  tone = 'mute',
  style,
  ...rest
}) {
  const tones = {
    mute: 'var(--lab-text-mute)',
    accent: 'var(--phosphor)',
    text: 'var(--lab-text-2)',
    ink: 'var(--ink-mute)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: tones[tone] || tones.mute,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { MonoLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MonoLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatusDot — the canonical engine build-state indicator (6-value taxonomy,
 * Artefact ① ground truth). WIRED 🟢 · BUILT 🟡 · DESIGNED 🔵 · STUB ◐ ·
 * CONCEPT ⚪ · ORPHAN ✕. STUB renders half-filled; ORPHAN carries an ✕.
 * Optional `pulse` adds a live glow.
 */
function StatusDot({
  status = 'concept',
  size = 12,
  pulse = false,
  style,
  ...rest
}) {
  const map = {
    wired: 'var(--eng-wired)',
    built: 'var(--eng-built)',
    designed: 'var(--eng-designed)',
    stub: 'var(--eng-stub)',
    concept: 'var(--eng-concept)',
    orphan: 'var(--eng-orphan)'
  };
  const color = map[status] || map.concept;

  // STUB = half-filled (registered shell, empty inside)
  const background = status === 'stub' ? `linear-gradient(90deg, ${color} 50%, color-mix(in srgb, ${color} 22%, transparent) 50%)` : color;
  return /*#__PURE__*/React.createElement("span", _extends({
    title: status,
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      background,
      border: status === 'orphan' ? `1px solid ${color}` : 'none',
      boxShadow: pulse ? `0 0 8px ${color}` : 'none',
      animation: pulse ? 'mtbPulse 1.4s ease-in-out infinite' : 'none',
      flexShrink: 0,
      ...style
    }
  }, rest), status === 'orphan' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.8,
      lineHeight: 1,
      color: 'var(--lab-bg)',
      fontWeight: 700
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("style", null, '@keyframes mtbPulse{0%,100%{opacity:1}50%{opacity:.45}}'));
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/expanse/MutaiWisp.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MutaiWisp — the representation of a Mutai in The Expanse.
 *
 * This is DELIBERATELY NOT a CharacterChip. A Butsu (CharacterChip) is a
 * bounded, ink-outlined, named cartoon body sitting on the grass. A Mutai
 * is its opposite: formless, unbounded, no outline, no shadow, no name
 * card — only an involuntary, continuous emotional colour leak drifting in
 * a white void. The two populations must never be conflated, so they are
 * separate components, not one component with a skin.
 *
 * `leak` is the Colour Engine's *involuntary continuous* readout for this
 * world (contrast the Butsu's chosen, discrete t-shirt colour).
 */
function MutaiWisp({
  leak = 'var(--mutai-leak)',
  intensity = 0.7,
  size = 120,
  label,
  style,
  ...rest
}) {
  const i = Math.max(0, Math.min(1, intensity));
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "img",
    "aria-label": label || 'a Mutai — a fractured emotional state',
    style: {
      position: 'relative',
      width: size,
      height: size,
      // no border, no outline, no box-shadow — the law of The Expanse
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: `radial-gradient(circle at 50% 45%, ${leak} 0%, transparent 70%)`,
      opacity: 0.25 + i * 0.5,
      filter: `blur(${6 + i * 8}px)`,
      animation: 'mtbLeak 6s ease-in-out infinite',
      mixBlendMode: 'multiply'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '18%',
      borderRadius: '50%',
      background: `radial-gradient(circle at 55% 60%, ${leak} 0%, transparent 65%)`,
      opacity: 0.2 + i * 0.4,
      filter: `blur(${10 + i * 10}px)`,
      animation: 'mtbLeak 8.5s ease-in-out infinite reverse',
      mixBlendMode: 'multiply'
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--despair-deep)',
      opacity: 0.55
    }
  }, label), /*#__PURE__*/React.createElement("style", null, '@keyframes mtbLeak{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(4%,-3%) scale(1.06)}66%{transform:translate(-3%,2%) scale(0.96)}}'));
}
Object.assign(__ds_scope, { MutaiWisp });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expanse/MutaiWisp.jsx", error: String((e && e.message) || e) }); }

// components/expanse/YureiPresence.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * YureiPresence — the live Expanse status readout, built from the
 * yurei_presence_state table (Artefact: tick, mode, hunger, run_id).
 * The Expanse's visual law applies: a formless void, no ink, no shadow —
 * only a mode indicator and a hunger gauge. WITHDRAWN = passive extraction;
 * BREACHED = active in the Earth Realm. `breachAt` is the hunger threshold
 * the gauge fills toward.
 */
function YureiPresence({
  mode = 'WITHDRAWN',
  hunger = 0,
  breachAt = 25000,
  tick,
  style,
  ...rest
}) {
  const breached = mode === 'BREACHED';
  const pct = Math.max(0, Math.min(100, hunger / breachAt * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "mtb-expanse",
    style: {
      position: 'relative',
      borderRadius: 'var(--r-lg)',
      padding: '22px 24px',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono)',
      // no border, no shadow — the law of The Expanse
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(120% 90% at 50% 120%, ${breached ? 'var(--despair)' : 'var(--despair-signal)'} 0%, transparent ${55 + pct * 0.35}%)`,
      opacity: breached ? 0.5 : 0.22 + pct / 350,
      filter: 'blur(14px)',
      transition: 'opacity .6s, background .6s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--despair-deep)',
      opacity: 0.6
    }
  }, "The Expanse \xB7 \u7121\u4F53 \xB7 Yurei presence"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      marginTop: 8,
      fontFamily: 'var(--font-pop)',
      fontSize: 26,
      color: breached ? 'var(--despair-deep)' : 'var(--despair)'
    }
  }, mode, breached && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--slice-red)',
      letterSpacing: '.1em'
    }
  }, "\u25CF ACTIVE IN EARTH REALM")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--despair-deep)',
      opacity: 0.6,
      width: 48
    }
  }, "hunger"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 7,
      background: 'rgba(75,68,83,0.15)',
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: pct + '%',
      background: 'var(--despair)',
      transition: 'width .6s'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--despair-deep)',
      width: 86,
      textAlign: 'right'
    }
  }, hunger.toLocaleString(), " / ", breachAt.toLocaleString())), tick != null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 10,
      color: 'var(--void-edge)'
    }
  }, "tick ", tick, " \xB7 bicameral_sweep_17")));
}
Object.assign(__ds_scope, { YureiPresence });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expanse/YureiPresence.jsx", error: String((e && e.message) || e) }); }

// components/lab/CharacterInspector.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CharacterInspector — the click-to-inspect panel for one B-Roll character,
 * built to the real GET /api/realm/character/:id schema (Artefact ②, reads
 * bicameral_sweep_17 — the live "lab bench"). Header shows the five top-line
 * stats (PAD, source monitoring, dev stage, current colour, Yurei mode);
 * the body groups every wired engine's facets by engine.
 *
 * `layout`:
 *   'panel'   — fixed right-hand rail, full height, scrolls (default)
 *   'dossier' — centred wide card, two-column body
 *   'compact' — narrow rail, header + colour + key counts only
 *
 * Pass a `character` object shaped like the endpoint response.
 */
const num = v => v == null ? 0 : parseFloat(v);
function Bar({
  label,
  value,
  max = 100,
  color = 'var(--phosphor)',
  fmt,
  bipolar = false,
  labelW = 34
}) {
  // bipolar: value is a signed PAD coordinate in [-1, +1] — render a
  // centre-zero diverging bar (positive grows right of centre, negative left).
  if (bipolar) {
    const v = Math.max(-1, Math.min(1, value));
    const half = Math.abs(v) * 50;
    const left = v >= 0 ? 50 : 50 - half;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: labelW,
        color: 'var(--lab-text-mute)'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        flex: 1,
        height: 6,
        background: 'var(--lab-bg)',
        borderRadius: 3,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: 1,
        background: 'var(--lab-line-2)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: left + '%',
        width: half + '%',
        background: color
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        textAlign: 'right',
        color: 'var(--lab-text-2)'
      }
    }, fmt ? fmt(value) : value));
  }
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: labelW,
      color: 'var(--lab-text-mute)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 6,
      background: 'var(--lab-bg)',
      borderRadius: 3,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: pct + '%',
      background: color
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      textAlign: 'right',
      color: 'var(--lab-text-2)'
    }
  }, fmt ? fmt(value) : value));
}

/** SDT need: satisfaction (warm) vs frustration (cool) facing bars. */
function NeedRow({
  label,
  sat,
  fru
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 78,
      color: 'var(--lab-text-mute)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      height: 6,
      background: 'var(--lab-bg)',
      borderRadius: 3,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: num(fru) * 100 + '%',
      background: 'var(--lab-travel)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      background: 'var(--lab-line-2)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: num(sat) * 100 + '%',
      background: 'var(--phosphor)'
    }
  }))));
}
function Section({
  title,
  count,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--lab-line)',
      padding: '12px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-mute)',
      marginBottom: 8
    }
  }, title, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--phosphor-dim)'
    }
  }, " \xB7 ", count)), children);
}
function Chip({
  label,
  v
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 6,
      background: 'var(--lab-bg)',
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-pill)',
      padding: '4px 11px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-mute)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--phosphor)',
      fontSize: 13
    }
  }, v), label);
}
const STAGES = ['pre_verbal', 'holophrastic', 'two_word', 'telegraphic', 'fluent'];
const NARR_COLOR = {
  FIGHT: 'var(--jon-red)',
  INSULT: 'var(--jon-red)',
  STEAL: 'var(--jon-red)',
  FLEE: 'var(--lab-travel)',
  HELP: 'var(--phosphor)',
  COMFORT: 'var(--phosphor)',
  GIVE: 'var(--phosphor)',
  ASK: 'var(--jon-yellow)',
  COMPOSITE: 'var(--lab-dayoff)'
};
const narrColor = t => NARR_COLOR[String(t || '').toUpperCase()] || 'var(--lab-text-mute)';
function DevLadder({
  stage,
  sm
}) {
  const idx = Math.max(0, STAGES.indexOf(stage || 'pre_verbal'));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, STAGES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 2,
      background: i <= idx ? 'var(--phosphor)' : 'var(--lab-line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 8,
      marginTop: 4,
      color: i === idx ? 'var(--lab-text)' : 'var(--lab-text-mute)'
    }
  }, s.replace('_', ' '))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--lab-text-mute)',
      marginTop: 8
    }
  }, "source-monitoring gates the ladder \xB7 ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--phosphor)'
    }
  }, num(sm).toFixed(3))));
}

/** Beta(α,β) mean → 0..100 mini bar for a Pirandello edge dimension. */
function betaMean(a, b) {
  a = num(a);
  b = num(b);
  return a + b > 0 ? a / (a + b) * 100 : 50;
}
function EdgeRow({
  e,
  who
}) {
  const name = e.target_name || e.observer_name || e.target_id || e.observer_id || '—';
  const dims = [['W', betaMean(e.warmth_alpha, e.warmth_beta), 'var(--jon-pink)'], ['C', betaMean(e.competence_alpha, e.competence_beta), 'var(--lab-travel)'], ['Cr', betaMean(e.credibility_alpha, e.credibility_beta), 'var(--jon-yellow)']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 132,
      color: 'var(--lab-text-2)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      gap: 8
    }
  }, dims.map(([l, v, c]) => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    },
    title: l + ' ' + v.toFixed(0)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lab-text-mute)',
      fontSize: 9
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 5,
      background: 'var(--lab-bg)',
      borderRadius: 3,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: v + '%',
      background: c
    }
  }))))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      textAlign: 'right',
      color: 'var(--lab-text-mute)'
    }
  }, "\xD7", e.reinforcement_count ?? 1));
}
const LAYOUTS = {
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 'min(440px, 92vw)',
    borderRadius: 0,
    borderLeft: '1px solid var(--lab-line)'
  },
  dossier: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 'min(780px, 94vw)',
    maxHeight: '88vh',
    borderRadius: 'var(--r-md)'
  },
  compact: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 'min(320px, 88vw)',
    borderRadius: 0,
    borderLeft: '1px solid var(--lab-line)'
  }
};
function CharacterInspector({
  character: c,
  avatarSrc,
  layout = 'panel',
  onClose,
  style,
  ...rest
}) {
  if (!c) return null;
  const p = c.profile || {},
    per = c.personality || {},
    mood = c.mood || {},
    col = c.colour || {};
  const yurei = c.yurei || {},
    sdt = c.sdt || {},
    karma = c.karma || {},
    ks = c.knowledgeSummary || {};
  const na = c.narrativeActions || null; // Shogen #18
  const allostatic = c.allostatic || null; // Interoception #6
  const salience = c.salience || null; // Kizuki #7
  const passion = c.passion || null; // Ikigai #20 (Vallerand)
  const face = c.faceReads || null; // RBF #39
  const selfK = c.selfKnowledge || null; // TSE #5
  const creepy = c.creepyCrawly || {}; // CreepyCrawly #38
  const their = c.pirandello?.theirViewOfOthers || [];
  const others = c.pirandello?.othersViewOfThem || [];
  const compact = layout === 'compact';
  const dossier = layout === 'dossier';
  const Header = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--r-sm)',
      background: 'var(--lab-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0
    }
  }, avatarSrc ? /*#__PURE__*/React.createElement("img", {
    src: avatarSrc,
    alt: p.name,
    style: {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      opacity: .3
    }
  }, "\u25CD")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pop)',
      fontSize: 17
    }
  }, p.name || 'Unknown'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-mute)'
    }
  }, c.id, " \xB7 ", p.developmental_stage || 'pre_verbal')), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--lab-text-mute)',
      fontSize: 18,
      cursor: 'pointer'
    }
  }, "\u2715"));
  const TopLine = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    label: "P",
    value: num(mood.p),
    bipolar: true,
    color: "var(--jon-yellow)",
    fmt: v => v.toFixed(2)
  }), /*#__PURE__*/React.createElement(Bar, {
    label: "A",
    value: num(mood.a),
    bipolar: true,
    color: "var(--jon-red)",
    fmt: v => v.toFixed(2)
  }), /*#__PURE__*/React.createElement(Bar, {
    label: "D",
    value: num(mood.d),
    bipolar: true,
    color: "var(--jon-blue)",
    fmt: v => v.toFixed(2)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: col.selected_hex || 'var(--lab-line)',
      border: '1px solid var(--lab-line-2)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lab-text-2)'
    }
  }, "wears ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--lab-text)'
    }
  }, col.selected_colour || '—'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-2)'
    }
  }, "source-mon ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--phosphor)'
    }
  }, num(per.source_monitoring).toFixed(3))), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    world: "lab",
    tone: yurei.mode === 'BREACHED' ? 'error' : 'neutral'
  }, "Yurei ", yurei.mode || '—')));
  const SecDev = /*#__PURE__*/React.createElement(Section, {
    title: "Bicameral #4 \u2014 language & self"
  }, /*#__PURE__*/React.createElement(DevLadder, {
    stage: p.developmental_stage,
    sm: per.source_monitoring
  }));
  const SecOcean = /*#__PURE__*/React.createElement(Section, {
    title: "OCEAN (Fracture #1)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].map(k => /*#__PURE__*/React.createElement(Bar, {
    key: k,
    label: k.slice(0, 4).toUpperCase(),
    value: per[k] || 0,
    color: "var(--lab-dayoff)"
  }))));
  const SecSdt = /*#__PURE__*/React.createElement(Section, {
    title: "SDT needs (Ikigai #20) \u2014 sat \u25D0 fru"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(NeedRow, {
    label: "autonomy",
    sat: sdt.autonomy_satisfaction,
    fru: sdt.autonomy_frustration
  }), /*#__PURE__*/React.createElement(NeedRow, {
    label: "competence",
    sat: sdt.competence_satisfaction,
    fru: sdt.competence_frustration
  }), /*#__PURE__*/React.createElement(NeedRow, {
    label: "relatedness",
    sat: sdt.relatedness_satisfaction,
    fru: sdt.relatedness_frustration
  })));
  const SecColour = c.colour && /*#__PURE__*/React.createElement(Section, {
    title: "Colour (Colour #26)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-2)'
    }
  }, col.selected_colour, " ", col.selected_hex, " \xB7 selected at tick ", col.tick, " \xB7 PAD ", num(col.pad_p).toFixed(2), "/", num(col.pad_a).toFixed(2), "/", num(col.pad_d).toFixed(2)));
  const SecPir = (their.length > 0 || others.length > 0) && /*#__PURE__*/React.createElement(Section, {
    title: "Pirandello #13 \u2014 perception edges",
    count: their.length + others.length
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      color: 'var(--lab-text-mute)',
      marginBottom: 4
    }
  }, "their view of others \xB7 W warmth \xB7 C competence \xB7 Cr credibility (\u03B2-means)"), their.slice(0, 5).map((e, i) => /*#__PURE__*/React.createElement(EdgeRow, {
    key: 't' + i,
    e: e
  })), others.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      color: 'var(--lab-text-mute)',
      margin: '8px 0 4px'
    }
  }, "others' view of them"), others.slice(0, 4).map((e, i) => /*#__PURE__*/React.createElement(EdgeRow, {
    key: 'o' + i,
    e: e
  }))));
  const SecKarma = /*#__PURE__*/React.createElement(Section, {
    title: "Sator #19 \u2014 karma \xB7 Conflict #12 \xB7 Kechimyaku #3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    label: "karma as actor",
    v: karma.asActor ?? karma.as_actor ?? 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "as target",
    v: karma.asTarget ?? karma.as_target ?? 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "active conflicts",
    v: c.conflicts?.length || 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "bonds",
    v: c.bonds?.length || 0
  })), c.conflicts?.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-2)'
    }
  }, c.conflicts.slice(0, 3).map((cf, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, "\u2694 ", cf.with_name || cf.target_name || cf.target_id, " \xB7 ", cf.type || 'conflict', " \xB7 intensity ", num(cf.intensity ?? 0).toFixed(2)))));
  const SecKnow = /*#__PURE__*/React.createElement(Section, {
    title: "Teaching/FSRS \xB7 Bicameral myths"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    label: "known",
    v: ks.total ?? 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "mastered",
    v: ks.mastered ?? 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "retrievability",
    v: ks.avg_retrievability != null ? num(ks.avg_retrievability).toFixed(2) : '—'
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "myths held",
    v: c.myths?.length ?? 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "beliefs",
    v: c.beliefs?.length ?? 0
  })));
  const SecYurei = /*#__PURE__*/React.createElement(Section, {
    title: "Yurei #35 \u2014 The Expanse"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-2)'
    }
  }, "mode ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: yurei.mode === 'BREACHED' ? 'var(--lab-error)' : 'var(--lab-text)'
    }
  }, yurei.mode || '—'), yurei.hunger != null && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 hunger ", Number(yurei.hunger).toLocaleString()), yurei.tick != null && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 tick ", yurei.tick)));
  const SecSelfKnow = Array.isArray(selfK) && selfK.length > 0 && /*#__PURE__*/React.createElement(Section, {
    title: "TSE #5 \u2014 self-knowledge",
    count: selfK.length
  }, selfK.slice(0, 6).map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--lab-text-2)',
      padding: '2px 0',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--phosphor-dim)',
      minWidth: 56
    }
  }, f.fact_key || '—'), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, f.fact_text || '—'), f.taught_at_tick != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lab-text-mute)'
    }
  }, "t", f.taught_at_tick))));
  const SecSalience = salience && Array.isArray(salience.buffer) && salience.buffer.length > 0 && /*#__PURE__*/React.createElement(Section, {
    title: "Kizuki #7 \u2014 salience buffer",
    count: salience.buffer.length
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, salience.buffer.slice(0, 8).map((b, i) => {
    const lab = typeof b === 'string' ? b : b.what || b.key || b.label || b.target || b.id || '—';
    const w = b && typeof b === 'object' ? b.weight ?? b.salience ?? b.score : null;
    return /*#__PURE__*/React.createElement(Chip, {
      key: i,
      label: lab,
      v: w != null ? num(w).toFixed(2) : '•'
    });
  })));
  const SecAllostatic = allostatic && /*#__PURE__*/React.createElement(Section, {
    title: "Interoception #6 \u2014 allostatic load"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, allostatic.reserve != null && /*#__PURE__*/React.createElement(Bar, {
    label: "reserve",
    labelW: 68,
    value: num(allostatic.reserve),
    max: 1,
    color: "var(--lab-dayoff)",
    fmt: v => v.toFixed(2)
  }), /*#__PURE__*/React.createElement(Bar, {
    label: "capacity",
    labelW: 68,
    value: num(allostatic.adaptive_capacity ?? allostatic.capacity),
    max: 1,
    color: "var(--phosphor)",
    fmt: v => v.toFixed(2)
  }), /*#__PURE__*/React.createElement(Bar, {
    label: "load",
    labelW: 68,
    value: num(allostatic.load ?? allostatic.allostatic_load),
    max: 1,
    color: "var(--jon-red)",
    fmt: v => v.toFixed(2)
  })), allostatic.phase && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    world: "lab",
    tone: {
      exhaustion: 'error',
      resistance: 'travel',
      alarm: 'dayoff',
      adaptation: 'neutral'
    }[allostatic.phase] || 'neutral'
  }, "phase \xB7 ", allostatic.phase)));
  const SecPassion = passion && /*#__PURE__*/React.createElement(Section, {
    title: "Ikigai #20 \u2014 passion (Vallerand)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    label: "harm.",
    labelW: 56,
    value: num(passion.harmonious_passion ?? passion.harmonious),
    max: 1,
    color: "var(--phosphor)",
    fmt: v => v.toFixed(2)
  }), /*#__PURE__*/React.createElement(Bar, {
    label: "obsess.",
    labelW: 56,
    value: num(passion.obsessive_passion ?? passion.obsessive),
    max: 1,
    color: "var(--jon-red)",
    fmt: v => v.toFixed(2)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--lab-text-mute)',
      marginTop: 6
    }
  }, "ratio ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--phosphor)'
    }
  }, num(passion.passion_ratio ?? passion.ratio).toFixed(2)), passion.trend_direction ? /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 trend ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--lab-text-2)'
    }
  }, passion.trend_direction)) : null));
  const SecFace = Array.isArray(face) && face.length > 0 && /*#__PURE__*/React.createElement(Section, {
    title: "RBF #39 \u2014 face reads",
    count: face.length
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      color: 'var(--lab-text-mute)',
      marginBottom: 4
    }
  }, "how others (mis)read this face \xB7 displayed \u2192 perceived"), face.slice(0, 5).map((r, i) => {
    const misread = r.perceived_emotion && r.perceived_emotion !== r.displayed_emotion;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        color: 'var(--lab-text-2)',
        padding: '2px 0'
      }
    }, r.observer_name || r.observer_id || 'someone', ": ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--lab-text)'
      }
    }, r.displayed_emotion || '—'), " \u2192 ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: misread ? 'var(--jon-red)' : 'var(--phosphor)'
      }
    }, r.perceived_emotion || '—'), r.true_emotion && r.true_emotion !== r.displayed_emotion ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--lab-text-mute)'
      }
    }, " (felt ", r.true_emotion, ")") : null);
  }));
  const SecNarrative = Array.isArray(na) && na.length > 0 && /*#__PURE__*/React.createElement(Section, {
    title: "Shogen #18 \u2014 witness reactions",
    count: na.reduce((s, x) => s + num(x.count), 0)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, (() => {
    const rows = na.slice().sort((p, q) => num(q.count) - num(p.count));
    const mx = Math.max(1, ...rows.map(x => num(x.count)));
    return rows.map((x, i) => /*#__PURE__*/React.createElement(Bar, {
      key: i,
      label: String(x.action_type || '—').toLowerCase(),
      labelW: 72,
      value: num(x.count),
      max: mx,
      color: narrColor(x.action_type),
      fmt: v => String(v | 0)
    }));
  })()));
  const creepyN = (creepy.asPerpetrator?.length || 0) + (creepy.asVictim?.length || 0);
  const campaignRow = (c2, i, lead, who, statusColor) => /*#__PURE__*/React.createElement("div", {
    key: lead + i,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--lab-text-2)',
      marginTop: 4
    }
  }, lead, " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--lab-text)'
    }
  }, who), " \xB7 ", c2.campaign_type || 'campaign', " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: statusColor
    }
  }, c2.status || '—'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lab-text-mute)'
    }
  }, " \xB7 debil ", num(c2.impact_debility).toFixed(2), " \xB7 depend ", num(c2.impact_dependency).toFixed(2), " \xB7 dread ", num(c2.impact_dread).toFixed(2)));
  const SecCreepy = creepyN > 0 && /*#__PURE__*/React.createElement(Section, {
    title: "CreepyCrawly #38 \u2014 psyop campaigns",
    count: creepyN
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    label: "as perpetrator",
    v: creepy.asPerpetrator?.length || 0
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "as victim",
    v: creepy.asVictim?.length || 0
  })), (Array.isArray(creepy.asPerpetrator) ? creepy.asPerpetrator : []).filter(x => x && typeof x === 'object').slice(0, 3).map((c2, i) => campaignRow(c2, i, '▸', c2.target_name || c2.target_id || '—', 'var(--jon-yellow)')), (Array.isArray(creepy.asVictim) ? creepy.asVictim : []).filter(x => x && typeof x === 'object').slice(0, 3).map((c2, i) => campaignRow(c2, i, '◂', c2.perpetrator_name || c2.perpetrator_id || '—', 'var(--jon-red)')));
  const footer = /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--lab-text-mute)',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusDot, {
    status: "wired",
    size: 8
  }), " live state \xB7 bicameral_sweep_17");
  const containerStyle = {
    background: 'var(--lab-panel)',
    border: '1px solid var(--lab-line)',
    padding: 18,
    fontFamily: 'var(--font-ui)',
    color: 'var(--lab-text)',
    overflowY: 'auto',
    zIndex: 400,
    boxShadow: 'var(--shadow-lab-pop, 0 10px 40px rgba(0,0,0,.5))',
    ...(LAYOUTS[layout] || LAYOUTS.panel),
    ...style
  };
  if (compact) {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: containerStyle
    }, rest), Header, TopLine, SecColour, SecYurei, /*#__PURE__*/React.createElement(Section, {
      title: "signals"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      label: "edges",
      v: their.length + others.length
    }), /*#__PURE__*/React.createElement(Chip, {
      label: "conflicts",
      v: c.conflicts?.length || 0
    }), /*#__PURE__*/React.createElement(Chip, {
      label: "bonds",
      v: c.bonds?.length || 0
    }), /*#__PURE__*/React.createElement(Chip, {
      label: "myths",
      v: c.myths?.length || 0
    }), allostatic && /*#__PURE__*/React.createElement(Chip, {
      label: allostatic.phase || 'load',
      v: num(allostatic.load ?? allostatic.allostatic_load).toFixed(2)
    }), Array.isArray(na) && na.length > 0 && /*#__PURE__*/React.createElement(Chip, {
      label: "actions",
      v: na.reduce((s, x) => s + num(x.count), 0)
    }))), footer);
  }
  if (dossier) {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: containerStyle
    }, rest), Header, TopLine, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0 22px'
      }
    }, /*#__PURE__*/React.createElement("div", null, SecDev, SecSelfKnow, SecOcean, SecSalience, SecAllostatic, SecSdt, SecPassion), /*#__PURE__*/React.createElement("div", null, SecColour, SecFace, SecNarrative, SecKarma, SecCreepy, SecKnow, SecYurei)), SecPir, footer);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: containerStyle
  }, rest), Header, TopLine, SecDev, SecSelfKnow, SecOcean, SecSalience, SecAllostatic, SecSdt, SecPassion, SecColour, SecPir, SecFace, SecNarrative, SecKarma, SecCreepy, SecKnow, SecYurei, footer);
}
Object.assign(__ds_scope, { CharacterInspector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lab/CharacterInspector.jsx", error: String((e && e.message) || e) }); }

// components/lab/EngineRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * EngineRow — one row in the Engine Laboratory list: build-status dot,
 * optional index number, kanji-bearing name, and a short descriptor.
 * Mirrors the .mock-btn engine list, upgraded to a structured row.
 */
function EngineRow({
  index,
  name,
  desc,
  status = 'concept',
  role,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const roleColor = {
    ACT: 'var(--lab-show)',
    PER: 'var(--lab-travel)',
    NAR: 'var(--lab-dayoff)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      textAlign: 'left',
      background: 'var(--lab-hover)',
      border: `1px solid ${pressed ? 'var(--phosphor)' : 'var(--lab-line)'}`,
      borderRadius: 'var(--r-sm)',
      padding: '11px 13px',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      color: 'var(--lab-text)',
      transition: 'transform 140ms cubic-bezier(.34,1.56,.64,1), border-color 140ms, background 140ms',
      transform: pressed ? 'scale(0.98)' : 'scale(1)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.StatusDot, {
    status: status,
    pulse: status === 'wired'
  }), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--lab-text-mute)',
      minWidth: 26
    }
  }, "#", index), role && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '.08em',
      color: roleColor[role] || 'var(--lab-text-mute)',
      border: `1px solid ${roleColor[role] || 'var(--lab-line)'}`,
      borderRadius: 3,
      padding: '1px 4px',
      flexShrink: 0
    }
  }, role), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      flexShrink: 0
    }
  }, name), desc && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--lab-text-2)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "\u2014 ", desc));
}
Object.assign(__ds_scope, { EngineRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lab/EngineRow.jsx", error: String((e && e.message) || e) }); }

// components/lab/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — the dashboard status readout card. Mono label, big emerald
 * value, optional sub-line. Matches .status-card from index.html.
 */
function StatCard({
  label,
  value,
  sub,
  tone = 'accent',
  style,
  ...rest
}) {
  const tones = {
    accent: 'var(--phosphor)',
    travel: 'var(--lab-travel)',
    dayoff: 'var(--lab-dayoff)',
    error: 'var(--lab-error)',
    text: 'var(--lab-text)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--lab-panel)',
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-md)',
      padding: '14px 16px',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-mute)',
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: tones[tone] || tones.accent,
      lineHeight: 1
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--lab-text-2)',
      marginTop: 6
    }
  }, sub));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lab/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/lab/Terminal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Terminal — the live test-output console. Mono text, header with a
 * title + run-status, scrolling body of lines. Lines may carry a tone
 * (error/ok/warn/you) for colour. Matches .terminal from index.html.
 */
function Terminal({
  title = '📡 LIVE TEST OUTPUT',
  status = 'idle',
  lines = [],
  maxHeight = 280,
  style,
  ...rest
}) {
  const toneColor = {
    out: 'var(--lab-text-2)',
    you: 'var(--lab-text)',
    ok: 'var(--phosphor)',
    warn: 'var(--lab-dayoff)',
    error: 'var(--lab-error)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--lab-panel)',
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-md)',
      padding: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--lab-text-2)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingBottom: 6,
      fontSize: 11,
      color: 'var(--lab-text-mute)',
      borderBottom: '1px solid var(--lab-line)'
    }
  }, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement("span", {
    style: {
      color: status === 'idle' ? 'var(--lab-text-mute)' : 'var(--lab-dayoff)'
    }
  }, status)), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight,
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      lineHeight: 1.55
    }
  }, lines.length === 0 && /*#__PURE__*/React.createElement("div", null, "> Dashboard ready."), lines.map((l, i) => {
    const text = typeof l === 'string' ? l : l.text;
    const tone = typeof l === 'string' ? 'out' : l.tone || 'out';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        color: toneColor[tone] || toneColor.out
      }
    }, text);
  })));
}
Object.assign(__ds_scope, { Terminal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lab/Terminal.jsx", error: String((e && e.message) || e) }); }

// components/lab/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toast — the top-drop notification from the dashboard. Pill shape,
 * spinner for running, coloured border per state. Render when `show`.
 */
function Toast({
  show = true,
  message,
  state = 'success',
  style,
  ...rest
}) {
  const borders = {
    running: 'var(--lab-dayoff)',
    success: 'var(--phosphor)',
    error: 'var(--lab-error)'
  };
  const fg = state === 'success' ? 'var(--phosphor)' : state === 'error' ? 'var(--lab-error)' : 'var(--lab-text)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      background: 'var(--lab-panel)',
      border: `1px solid ${borders[state] || 'var(--lab-line-2)'}`,
      borderRadius: 'var(--r-pill)',
      padding: '10px 18px',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 600,
      color: fg,
      boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
      transform: show ? 'translateY(0)' : 'translateY(-180%)',
      opacity: show ? 1 : 0,
      transition: 'transform 340ms cubic-bezier(.16,1,.3,1), opacity 200ms',
      ...style
    }
  }, rest), state === 'running' ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      border: '2px solid var(--lab-text-mute)',
      borderTopColor: 'var(--lab-dayoff)',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'mtbSpin 0.7s linear infinite'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), message, /*#__PURE__*/React.createElement("style", null, '@keyframes mtbSpin{to{transform:rotate(360deg)}}'));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lab/Toast.jsx", error: String((e && e.message) || e) }); }

// components/narrative/BeatTimeline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BeatTimeline — the centrepiece. Lays a blueprint's beats along a 0–100%
 * pacing ruler as a proportional band: each segment's width is its
 * pacing_position span, its fill is the narrative_function hue (colorBy
 * 'function') or a firm/loose colour (colorBy 'rigidity'). Rigidity is ALSO
 * encoded structurally in every mode — a hard beat has a solid top edge, a
 * soft beat a dashed one. Click a segment → onSelect(beat). `activeN`
 * highlights the selected beat. Honours the real pacing percentages, so the
 * shape of the story is literally the shape of the band.
 */
function parsePacing(p) {
  const m = String(p == null ? '' : p).match(/([\d.]+)\s*-\s*([\d.]+)/);
  if (!m) return [0, 0];
  return [parseFloat(m[1]), parseFloat(m[2])];
}
function BeatTimeline({
  beats = [],
  accent = 'var(--phosphor)',
  colorBy = 'function',
  showRuler = true,
  activeN = null,
  onSelect,
  height = 60,
  style,
  ...rest
}) {
  const [hoverN, setHoverN] = React.useState(null);
  const total = beats.length;
  const fillFor = b => {
    if (colorBy === 'rigidity') {
      return b.rigidity === 'soft' ? 'var(--beat-disruption)' : 'var(--beat-commitment)';
    }
    return `var(--beat-${b.fn})`;
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: '100%',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height,
      borderRadius: 'var(--r-sm)',
      overflow: 'hidden',
      background: 'var(--lab-bg)',
      border: '1px solid var(--lab-line)'
    }
  }, beats.map((b, i) => {
    let [start, end] = parsePacing(b.pacing);
    if (end <= start) {
      start = i / Math.max(total, 1) * 100;
      end = (i + 1) / Math.max(total, 1) * 100;
    }
    const isActive = activeN != null && b.n === activeN;
    const isHover = hoverN === b.n;
    const fill = fillFor(b);
    return /*#__PURE__*/React.createElement("button", {
      key: b.n ?? i,
      type: "button",
      title: `${b.n}. ${b.name} · ${b.fn} · ${b.rigidity || 'hard'} · ${b.pacing || ''}`,
      onClick: () => onSelect && onSelect(b),
      onMouseEnter: () => setHoverN(b.n),
      onMouseLeave: () => setHoverN(null),
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${start}%`,
        width: `calc(${end - start}% - 2px)`,
        margin: '0 1px',
        border: 'none',
        padding: 0,
        cursor: onSelect ? 'pointer' : 'default',
        background: fill,
        opacity: isActive ? 1 : isHover ? 0.92 : 0.74,
        borderTop: `3px ${b.rigidity === 'soft' ? 'dashed' : 'solid'} rgba(255,255,255,${isActive ? 0.85 : 0.35})`,
        boxShadow: isActive ? `inset 0 0 0 2px rgba(255,255,255,0.9)` : 'none',
        transform: isActive ? 'translateY(-0px)' : 'none',
        transition: 'opacity 130ms, box-shadow 130ms',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 5,
        color: 'rgba(10,10,15,0.82)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700
      }
    }, end - start >= 5 ? b.n : '');
  })), showRuler && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 16,
      marginTop: 4
    }
  }, [0, 25, 50, 75, 100].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      position: 'absolute',
      left: `${t}%`,
      transform: t === 0 ? 'none' : t === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.08em',
      color: 'var(--lab-text-mute)'
    }
  }, t, "%"))));
}
Object.assign(__ds_scope, { BeatTimeline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrative/BeatTimeline.jsx", error: String((e && e.message) || e) }); }

// components/narrative/BlueprintCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BlueprintCard — a narrative_blueprint summary. The blueprint_id IS a hex
 * colour (DB CHECK ^#[0-9A-F]{6}$), so the card wears its own identity: an
 * accent rail + a mono hex chip. Carries the evidence-quality tier, the
 * scale-suitability chips, beat count, the conflict-required flag, and the
 * description. `compact` is the rail row (id swatch · name · meta); the full
 * card adds chips + prose. Lab register.
 */
const EVIDENCE = {
  'peer-reviewed': 'var(--evidence-peer)',
  'industry-validated': 'var(--evidence-industry)',
  'cultural-tradition': 'var(--evidence-cultural)'
};
function BlueprintCard({
  id = '#350001',
  name = 'Blueprint',
  source,
  evidence = 'peer-reviewed',
  scales = [],
  beats,
  conflict = true,
  description,
  selected = false,
  compact = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = id; // the hex id is the identity colour
  const evColor = EVIDENCE[evidence] || 'var(--lab-text-mute)';
  const interactive = typeof onClick === 'function';
  const frame = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? 7 : 11,
    width: '100%',
    textAlign: 'left',
    boxSizing: 'border-box',
    background: selected ? 'var(--lab-pressed)' : hover && interactive ? 'var(--lab-hover)' : 'var(--lab-panel)',
    border: `1px solid ${selected ? 'var(--phosphor)' : 'var(--lab-line)'}`,
    borderLeft: `3px solid ${evColor}`,
    borderRadius: 'var(--r-md)',
    padding: compact ? '10px 13px' : '15px 17px',
    color: 'var(--lab-text)',
    fontFamily: 'var(--font-ui)',
    cursor: interactive ? 'pointer' : 'default',
    boxShadow: selected ? '0 0 0 1px var(--phosphor), 0 0 14px rgba(52,211,153,0.12)' : 'none',
    transition: 'background 140ms, border-color 140ms, box-shadow 140ms',
    ...style
  };
  const Tag = interactive ? 'button' : 'div';

  // The hex id is a faithful identity chip (a real DB fact): a literal swatch
  // of the id colour (outlined, since the #35xxxx range is near-black) + the
  // mono hex, always legible. Perceptual identity is carried by evidence +
  // the beat-function timeline, not this near-black namespace colour.
  const hexChip = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      flexShrink: 0,
      border: '1px solid var(--lab-line-2)',
      borderRadius: 4,
      padding: '2px 6px 2px 5px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: accent,
      border: '1px solid rgba(255,255,255,0.22)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      letterSpacing: '0.04em',
      color: 'var(--lab-text-2)'
    }
  }, id));
  if (compact) {
    return /*#__PURE__*/React.createElement(Tag, _extends({
      type: interactive ? 'button' : undefined,
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: frame
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      title: id,
      style: {
        width: 11,
        height: 11,
        borderRadius: 3,
        background: accent,
        border: '1px solid rgba(255,255,255,0.22)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--lab-text-mute)'
      }
    }, beats, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: .6
      }
    }, " beats")), /*#__PURE__*/React.createElement("span", {
      title: evidence,
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: evColor,
        flexShrink: 0
      }
    })));
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: interactive ? 'button' : undefined,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: frame
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 1.2,
      flex: 1
    }
  }, name), hexChip), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: evColor,
      border: `1px solid ${evColor}66`,
      borderRadius: 'var(--r-pill)',
      padding: '2px 9px'
    }
  }, evidence), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--lab-text-2)'
    }
  }, beats, " beats"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: conflict ? 'var(--lab-dayoff)' : 'var(--lab-text-mute)'
    }
  }, conflict ? '⚔ conflict' : '◦ no-conflict')), scales.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, scales.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      letterSpacing: '0.04em',
      color: 'var(--lab-text-mute)',
      background: 'var(--lab-hover)',
      borderRadius: 3,
      padding: '2px 7px'
    }
  }, s))), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12.5,
      lineHeight: 1.5,
      color: 'var(--lab-text-2)',
      fontFamily: 'var(--font-gothic)',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description), source && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      lineHeight: 1.4,
      color: 'var(--lab-text-mute)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    title: source
  }, source));
}
Object.assign(__ds_scope, { BlueprintCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrative/BlueprintCard.jsx", error: String((e && e.message) || e) }); }

// components/narrative/FunctionTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FunctionTag — the narrative_function indicator for a beat. Eight values
 * mapped to the --beat-* hue scale (the shape of a story, cool setup →
 * gold revelation → green return). `dot` is the bare swatch; `tag` adds the
 * uppercase mono label. Rigidity (hard/soft) is NOT carried here — it's a
 * structural edge treatment on the beat itself.
 */
const FUNCTIONS = ['orientation', 'disruption', 'resistance', 'preparation', 'commitment', 'escalation', 'revelation', 'resolution'];
function FunctionTag({
  fn = 'orientation',
  variant = 'tag',
  size = 10,
  glow = false,
  style,
  ...rest
}) {
  const known = FUNCTIONS.includes(fn);
  const color = known ? `var(--beat-${fn})` : 'var(--lab-text-mute)';
  const dot = /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
      boxShadow: glow ? `0 0 7px ${color}` : 'none'
    }
  });
  if (variant === 'dot') {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-flex',
        ...style
      },
      title: fn
    }, rest), dot);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    title: fn,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      ...style
    }
  }, rest), dot, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-2)'
    }
  }, fn));
}
Object.assign(__ds_scope, { FunctionTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrative/FunctionTag.jsx", error: String((e && e.message) || e) }); }

// components/narrative/HeuristicCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HeuristicCard — one storytelling_heuristic: a craft prompt the Narrative
 * engine surfaces when a beat is weak. The prompt is the hero; the source
 * (author · work) sits beneath a left rule coloured per author. `situation`
 * and `beatContext` are mono tags. `register` switches the prompt's voice:
 * 'instrument' (terse, gothic) vs 'mythic' (elegiac, larger, serif-leaning).
 */
const AUTHOR_HUE = {
  'Emma Coats': 'var(--evidence-industry)',
  'Kurt Vonnegut': 'var(--beat-resistance)',
  'Robert McKee': 'var(--beat-commitment)',
  'Shawn Coyne': 'var(--beat-resolution)'
};
function HeuristicCard({
  prompt = '',
  author,
  work,
  situation,
  beatContext = 'any',
  register = 'instrument',
  style,
  ...rest
}) {
  const hue = AUTHOR_HUE[author] || 'var(--lab-text-mute)';
  const mythic = register === 'mythic';
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      boxSizing: 'border-box',
      background: 'var(--lab-panel)',
      border: '1px solid var(--lab-line)',
      borderLeft: `3px solid ${hue}`,
      borderRadius: 'var(--r-md)',
      padding: mythic ? '20px 22px' : '16px 18px',
      color: 'var(--lab-text)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: mythic ? 'var(--font-gothic)' : 'var(--font-gothic)',
      fontSize: mythic ? 17 : 14,
      fontWeight: mythic ? 500 : 400,
      lineHeight: mythic ? 1.55 : 1.5,
      color: mythic ? 'var(--lab-text)' : 'var(--lab-text-2)',
      letterSpacing: mythic ? '0.005em' : 0,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: hue,
      marginRight: 4,
      fontWeight: 700
    }
  }, "\u201C"), prompt, /*#__PURE__*/React.createElement("span", {
    style: {
      color: hue,
      marginLeft: 2,
      fontWeight: 700
    }
  }, "\u201D")), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, author && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: hue,
      fontWeight: 700,
      letterSpacing: '0.02em'
    }
  }, author), work && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--lab-text-mute)',
      fontStyle: 'italic',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 260
    },
    title: work
  }, work)), (situation || beatContext) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, situation && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-2)',
      background: 'var(--lab-hover)',
      borderRadius: 3,
      padding: '2px 7px'
    }
  }, situation), beatContext && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-mute)',
      border: '1px solid var(--lab-line)',
      borderRadius: 3,
      padding: '2px 7px'
    }
  }, "@ ", beatContext)));
}
Object.assign(__ds_scope, { HeuristicCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrative/HeuristicCard.jsx", error: String((e && e.message) || e) }); }

// components/narrative/SpeechLadder.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SpeechLadder — the developmental utterance ladder for one
 * dialogue_function_family. Five rungs climb from one-word to sentence as a
 * character's developmental_stage matures: holophrastic → two_word →
 * telegraphic → multiword → complex. Each rung shows the stage and a real
 * example_output; competence is encoded as a left rail that warms from faint
 * to phosphor and as growing indent. The same meaning, said with more language.
 */
const STAGES = ['holophrastic', 'two_word', 'telegraphic', 'multiword', 'complex'];
const RAIL = ['var(--lab-line-2)', 'var(--beat-orientation)', 'var(--beat-preparation)', 'var(--beat-commitment)', 'var(--phosphor)'];
function SpeechLadder({
  family = '',
  rungs = [],
  style,
  ...rest
}) {
  const byStage = {};
  rungs.forEach(r => {
    byStage[r.stage] = r;
  });
  const ordered = STAGES.map((s, i) => ({
    stage: s,
    idx: i,
    ...(byStage[s] || {})
  }));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: '100%',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, rest), family && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--phosphor)',
      letterSpacing: '0.02em'
    }
  }, family), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-mute)'
    }
  }, "speech ladder")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, ordered.map(r => {
    const filled = r.example != null;
    return /*#__PURE__*/React.createElement("div", {
      key: r.stage,
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        marginLeft: r.idx * 14,
        background: 'var(--lab-panel)',
        borderLeft: `3px solid ${RAIL[r.idx]}`,
        borderRadius: 'var(--r-sm)',
        padding: '9px 13px',
        opacity: filled ? 1 : 0.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: RAIL[r.idx],
        minWidth: 84,
        flexShrink: 0,
        fontWeight: 700
      }
    }, r.stage), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-gothic)',
        fontSize: 13.5,
        lineHeight: 1.4,
        color: filled ? 'var(--lab-text)' : 'var(--lab-text-mute)'
      }
    }, filled ? `“${r.example}”` : '—'));
  })));
}
Object.assign(__ds_scope, { SpeechLadder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrative/SpeechLadder.jsx", error: String((e && e.message) || e) }); }

// components/realm/CharacterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CharacterChip — a B-Roll character avatar (one of the rubber-hose
 * PNGs) sitting on a rounded ink-outlined card with name + optional
 * emotional-colour dot (the Colour Engine readout).
 */
function CharacterChip({
  name,
  src,
  mood,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      width: 104,
      padding: '10px 8px 8px',
      background: 'var(--white)',
      border: `var(--ink-line) solid ${selected ? 'var(--cheese-deep)' : 'var(--ink)'}`,
      borderRadius: 'var(--r-md)',
      boxShadow: selected ? 'var(--shadow-sticker-lg)' : 'var(--shadow-sticker)',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, mood && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: mood,
      border: '1px solid var(--ink)'
    }
  }), name));
}
Object.assign(__ds_scope, { CharacterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/realm/CharacterChip.jsx", error: String((e && e.message) || e) }); }

// components/realm/SpeechBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SpeechBubble — the hand-lettered cartoon bubble B-Roll characters
 * emit. White fill, thick ink outline, 16px radius, a little tail,
 * and a tiny mono "who" caption. Matches realm.html exactly.
 */
function SpeechBubble({
  who,
  children,
  tail = 'left',
  style,
  ...rest
}) {
  const tailLeft = tail === 'left';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      display: 'inline-block',
      maxWidth: 240,
      background: 'var(--white)',
      color: 'var(--ink)',
      border: 'var(--ink-line) solid var(--ink)',
      borderRadius: 'var(--r-lg)',
      padding: '8px 12px',
      fontFamily: "'Comic Sans MS', 'Chalkboard SE', var(--font-pop), cursive",
      fontSize: 13,
      lineHeight: 1.35,
      ...style
    }
  }, rest), who && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 700,
      color: 'var(--ink-faint)',
      marginBottom: 2
    }
  }, who), children, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -11,
      left: tailLeft ? 22 : 'auto',
      right: tailLeft ? 'auto' : 22,
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '11px solid var(--ink)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -7,
      left: tailLeft ? 23 : 'auto',
      right: tailLeft ? 'auto' : 23,
      width: 0,
      height: 0,
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
      borderTop: '8px solid var(--white)'
    }
  }));
}
Object.assign(__ds_scope, { SpeechBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/realm/SpeechBubble.jsx", error: String((e && e.message) || e) }); }

// realm-visualiser/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '.';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/base.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "realm-visualiser/ds-base.js", error: String((e && e.message) || e) }); }

// realm-visualiser/realmSim.js
try { (() => {
// Realm Observer — B-Roll Chaos Character realm canvas.
//
// Data source: if window.__MTB_API_BASE is set (e.g. '' for same-origin, or
// 'http://localhost:3002'), the cast is loaded from GET /api/realm/avatars and
// a clicked Butsu is inspected via GET /api/realm/character/:id (Artefact ②,
// bicameral_sweep_17). With no base it runs on representative data shaped to
// the exact same schema, so the template is a faithful starting point offline.
//
// Click a Butsu → window dispatches 'mtb:inspect' with the character record.
// Ambient signals (toggle via window flags, default on):
//   __MTB_SHOW_LEAK       colour-leak aura behind each Butsu (Colour #26)
//   __MTB_SHOW_CONFLICTS  red lines between conflicting pairs (Conflict #12)
//   __MTB_SHOW_BONDS      warm lines between bonded pairs (Kechimyaku #3)
(function () {
  'use strict';

  // Each load takes a fresh token; any older simulate/event loop still running
  // from a prior mount sees a newer token and stops, so nothing ever stacks.
  var myToken = window.__realmToken = (window.__realmToken || 0) + 1;
  var scene = document.getElementById('scene');
  var charLayer = document.getElementById('charLayer');
  var bubbleLayer = document.getElementById('bubbleLayer');
  var viewport = document.getElementById('viewport');
  if (!scene || !charLayer || !bubbleLayer || !viewport) return;
  var API = typeof window.__MTB_API_BASE === 'string' ? window.__MTB_API_BASE : null;
  var flag = function (k, d) {
    return window[k] === undefined ? d : !!window[k];
  };
  var chars = {},
    bubbles = [];
  // giant open field, sized for up to 100 Butsu with blank room to grow. The
  // current cast clusters near the middle; the world extends well past them.
  var SCENE_W = 6000,
    SCENE_H = 4200,
    HORIZON = 470;
  var FIELD = {
    minX: 360,
    maxX: 5640,
    minY: 720,
    maxY: 4040
  }; // walkable grass (kept well inside the edges)
  var CELL = 520; // spacing between home zones
  var panX = 0,
    panY = 0,
    zoom = 1;
  var isPanning = false,
    panStartX = 0,
    panStartY = 0,
    panBaseX = 0,
    panBaseY = 0;
  var didPan = false;

  // Full B-Roll roster from character_profiles (all 50 originals). avatar_key is
  // null until art exists; rule (a) — only those WITH a PNG on disk are rendered.
  // As James drops a PNG into assets/broll/ and fills the avatar column, set the
  // key here (demo fallback) — in production GET /api/realm/avatars drives it.
  var ROSTER = [['#700005', 'Jack Bateman', 'pill'], ['#70000F', 'Larry Greims', 'cube'], ['#70001A', 'Pete Runs', 'cassette'], ['#70002A', 'Jake Rennick', 'boombox'], ['#70002B', 'Bernie Carteez', 'dialphone'], ['#70002C', 'Johnny Crackow', 'lighter'], ['#70002D', 'Billy Quayle', 'inhaler'], ['#70002E', 'Lem Wells', 'desktop'], ['#70002F', 'Rodney Gillen', 'colours'], ['#700030', 'Edsel Farkus', 'lipstick'], ['#700031', 'Abe Polonski', 'phone'], ['#700032', 'Steve Tregaskis', 'pager'], ['#700033', 'Guy Prince', 'letters'], ['#700034', 'Chopper Miller', 'matches'], ['#700035', 'Nick Rowland', 'eightball'], ['#700036', 'Billy Santiago', '9volt'], ['#700037', 'Sam Dunkim', 'biggmuff'], ['#700038', 'Carlos Perro', 'bagsy'], ['#700039', 'Joey Breaker', 'blender'], ['#70003A', 'Johnny Casino', 'bong'], ['#70003B', 'Wilmer Slade', 'capgun'], ['#70003C', 'Spike Koopa', 'filmcamera'], ['#70003D', 'Gage Turner', 'fuzzface'], ['#70003E', 'Lester Moore', 'hotsauce'], ['#70003F', 'Joe Gage', 'ketchup'], ['#700040', 'Tom Vernon', 'nang'], ['#700041', 'Frankie Strata', 'skateboard'], ['#700042', 'Mitchell Harris', 'sparky'], ['#700043', 'Turley Snodgrass', 'tampon'], ['#700044', 'Ritchie Davenport', 'teapot'], ['#700045', 'Jimmy Vance', 'tenpin'], ['#700046', 'Roland Vance', 'trashcan'], ['#700047', 'Frankie Parker', 'turborat'], ['#700048', 'Sylvio Santos', 'guitarpick'], ['#700049', 'Joe Scrambled', 'juicebox'], ['#70004A', 'Mikey Cut', 'piraterum'], ['#70004B', 'Roman Under', 'vacuumtube'], ['#70004C', 'Gus Japan', 'turbo'], ['#70004D', 'Tom Momma', 'sixthsword'], ['#70004E', 'Manny Columbus', 'lavalamp'], ['#70004F', 'John Vicious', 'heatvhs'], ['#700050', 'Dino Dynamite', 'fizz'], ['#700051', 'Nelly Nose', 'ramen'], ['#700052', 'Sanchez Swan', 'vendingmachine'], ['#700053', 'Ravetti Hearts', 'd20'], ['#700054', 'Ronald Shadow', 'ouija'], ['#700055', 'Terrance Machine', 'jerrycan'], ['#700056', 'Mr. Smith', 'condom'], ['#700057', 'Clem Hunger', 'fries'], ['#700058', 'Russel Reality', 'telescope'],
  // +5 new arrivals beyond the original 50 (#700059–#70005D)
  ['#700059', 'Vinnie Boxcars', 'sixdie'], ['#70005A', 'Barnacle Briggs', 'anchor'], ['#70005B', 'Trudy North', 'compass'], ['#70005C', 'Wick Hollis', 'lantern'], ['#70005D', 'Rusto Vega', 'spraycan']];
  // CAST keeps the [avatar, name, id] shape downstream code expects; only the
  // roster entries that currently have art are rendered.
  var CAST = ROSTER.filter(function (r) {
    return r[2];
  }).map(function (r) {
    return [r[2], r[1], r[0]];
  });

  // The Colour Engine's 12 Jonauskaite hexes (Artefact ④).
  var JONAUSKAITE = [['red', '#D93636'], ['orange', '#E8842A'], ['yellow', '#F5C542'], ['green', '#3A9E5C'], ['turquoise', '#2AADAD'], ['blue', '#2E6EB5'], ['purple', '#7A3EAD'], ['pink', '#E88BA7'], ['brown', '#7A5230'], ['white', '#FFFFFF'], ['grey', '#808080'], ['black', '#000000']];
  var STAGES = ['pre_verbal', 'holophrastic', 'two_word', 'telegraphic', 'fluent'];

  // representative relationships among the cast (index pairs)
  var CONFLICTS = [[0, 3], [5, 9], [11, 2], [7, 13]];
  var BONDS = [[1, 4], [6, 7], [8, 12], [10, 14], [2, 13], [0, 9]];

  // ---------- representative data, exact endpoint schema ----------
  function rnd(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  function f2(n) {
    return n.toFixed(3);
  }
  function fakeCharacter(i) {
    var c = CAST[i],
      avatar = c[0],
      name = c[1],
      id = c[2];
    var jon = JONAUSKAITE[i % JONAUSKAITE.length];
    var sm = +(rnd(i + 1) * 0.5).toFixed(4);
    var stage = STAGES[Math.min(STAGES.length - 1, Math.floor(sm * 8))];
    var p = rnd(i + 2) * 2 - 1,
      a = rnd(i + 3) * 2 - 1,
      d = rnd(i + 4) * 2 - 1;
    function edge(targetIdx, k) {
      var t = CAST[targetIdx];
      return {
        target_id: t[2],
        target_name: t[1],
        target_avatar: t[0],
        warmth_alpha: +(0.5 + rnd(i * 7 + targetIdx) * 3).toFixed(2),
        warmth_beta: 1,
        competence_alpha: +(0.5 + rnd(i * 11 + targetIdx) * 3).toFixed(2),
        competence_beta: 1,
        credibility_alpha: +(0.5 + rnd(i * 13 + targetIdx) * 3).toFixed(2),
        credibility_beta: 1,
        reinforcement_count: 1 + Math.floor(rnd(i * 3 + targetIdx) * 5)
      };
    }
    var their = [],
      others = [];
    for (var k = 1; k <= 4; k++) {
      their.push(edge((i + k) % CAST.length, k));
    }
    for (var k2 = 1; k2 <= 3; k2++) {
      var oi = (i + k2 + 5) % CAST.length;
      var e = edge(oi, k2);
      e.observer_id = e.target_id;
      e.observer_name = e.target_name;
      others.push(e);
    }
    var myConflicts = CONFLICTS.filter(function (pr) {
      return pr[0] === i || pr[1] === i;
    }).map(function (pr) {
      var oi = pr[0] === i ? pr[1] : pr[0];
      return {
        target_id: CAST[oi][2],
        with_name: CAST[oi][1],
        type: ['task', 'relationship', 'process'][oi % 3],
        intensity: +(0.3 + rnd(i + oi) * 0.6).toFixed(2)
      };
    });
    var myBonds = BONDS.filter(function (pr) {
      return pr[0] === i || pr[1] === i;
    }).map(function (pr) {
      var oi = pr[0] === i ? pr[1] : pr[0];
      return {
        target_id: CAST[oi][2],
        with_name: CAST[oi][1],
        strength: +(0.4 + rnd(i * 2 + oi) * 0.5).toFixed(2)
      };
    });
    return {
      id: id,
      profile: {
        name: name,
        avatar: avatar,
        developmental_stage: stage
      },
      personality: {
        openness: Math.round(rnd(i + 5) * 100),
        conscientiousness: Math.round(rnd(i + 6) * 100),
        extraversion: Math.round(rnd(i + 7) * 100),
        agreeableness: Math.round(rnd(i + 8) * 100),
        neuroticism: Math.round(rnd(i + 9) * 100),
        source_monitoring: sm,
        working_memory_capacity: 5 + i % 4
      },
      mood: {
        p: f2(p),
        a: f2(a),
        d: f2(d),
        sample_count: 10 + i
      },
      sdt: {
        autonomy_satisfaction: f2(rnd(i + 10)),
        autonomy_frustration: f2(rnd(i + 11)),
        competence_satisfaction: f2(rnd(i + 12)),
        competence_frustration: f2(rnd(i + 13)),
        relatedness_satisfaction: f2(rnd(i + 14)),
        relatedness_frustration: f2(rnd(i + 15))
      },
      colour: {
        selected_colour: jon[0],
        selected_hex: jon[1],
        pad_p: f2(p),
        pad_a: f2(a),
        pad_d: f2(d),
        tick: 100 + i * 3
      },
      pirandello: {
        theirViewOfOthers: their,
        othersViewOfThem: others
      },
      conflicts: myConflicts,
      bonds: myBonds,
      karma: {
        asActor: Math.floor(rnd(i + 16) * 12),
        asTarget: Math.floor(rnd(i + 17) * 12)
      },
      knowledgeSummary: {
        total: 3 + Math.floor(rnd(i + 18) * 10),
        mastered: Math.floor(rnd(i + 19) * 3),
        forgotten: 0,
        unseen: 0,
        avg_retrievability: +(0.6 + rnd(i + 20) * 0.4).toFixed(2)
      },
      myths: new Array(Math.floor(rnd(i + 21) * 6)).fill(0),
      beliefs: new Array(Math.floor(rnd(i + 22) * 8)).fill(0),
      yurei: {
        mode: 'WITHDRAWN',
        hunger: 20000,
        tick: 1
      }
    };
  }
  function getCharacter(i) {
    var id = CAST[i][2];
    if (API !== null) {
      return fetch(API + '/api/realm/character/' + encodeURIComponent(id.replace('#', ''))).then(function (r) {
        if (!r.ok) throw 0;
        return r.json();
      }).catch(function () {
        return fakeCharacter(i);
      });
    }
    return Promise.resolve(fakeCharacter(i));
  }

  // ---------- build the cast ----------
  // who each character likes (bonds) / dislikes (conflicts), by index
  var LIKES = {},
    DISLIKES = {};
  (function () {
    for (var i = 0; i < CAST.length; i++) {
      LIKES[i] = [];
      DISLIKES[i] = [];
    }
    BONDS.forEach(function (p) {
      LIKES[p[0]].push(p[1]);
      LIKES[p[1]].push(p[0]);
    });
    CONFLICTS.forEach(function (p) {
      DISLIKES[p[0]].push(p[1]);
      DISLIKES[p[1]].push(p[0]);
    });
  })();

  // homes on a fixed-spacing grid, centred in the world so the cast forms one
  // neighbourhood with blank grass around it (the same layout grows to 100).
  function layoutHomes(n) {
    var cols = Math.ceil(Math.sqrt(n)),
      rows = Math.ceil(n / cols);
    var gw = (cols - 1) * CELL,
      gh = (rows - 1) * CELL;
    var sx = SCENE_W / 2 - gw / 2,
      sy = (HORIZON + SCENE_H) / 2 - gh / 2;
    var homes = [];
    for (var i = 0; i < n; i++) {
      var col = i % cols,
        row = Math.floor(i / cols);
      var jx = (rnd(i + 70) - 0.5) * CELL * 0.42,
        jy = (rnd(i + 80) - 0.5) * CELL * 0.42;
      homes.push({
        x: sx + col * CELL + jx,
        y: sy + row * CELL + jy
      });
    }
    return homes;
  }

  // bond strength (0..1) — drives how worn/visible its trail is, and is reused
  // as the path characters actually walk between the two zones.
  var PATHS = {}; // "i-j" -> { c:{x,y}, strength }
  function pathKey(i, j) {
    return Math.min(i, j) + '-' + Math.max(i, j);
  }
  function buildWorldLayer(n, homes) {
    var w = document.getElementById('worldLayer');
    if (!w) return;
    w.innerHTML = '';
    var svgns = 'http://www.w3.org/2000/svg';

    // --- subtle ground texture: soft tonal blotches + a few faint contours ---
    var tones = ['#84cf63', '#77c156', '#8ad66c', '#71ba50'];
    for (var t = 0; t < 90; t++) {
      var bx = rnd(t * 3 + 1) * SCENE_W,
        by = HORIZON + rnd(t * 5 + 2) * (SCENE_H - HORIZON);
      var bl = document.createElementNS(svgns, 'ellipse');
      bl.setAttribute('cx', bx.toFixed(0));
      bl.setAttribute('cy', by.toFixed(0));
      bl.setAttribute('rx', (120 + rnd(t + 9) * 260).toFixed(0));
      bl.setAttribute('ry', (60 + rnd(t + 13) * 130).toFixed(0));
      bl.setAttribute('fill', tones[t % tones.length]);
      bl.setAttribute('opacity', (0.10 + rnd(t + 7) * 0.12).toFixed(3));
      w.appendChild(bl);
    }
    for (var ct = 0; ct < 7; ct++) {
      var cy = HORIZON + 180 + ct * (SCENE_H - HORIZON) / 7;
      var con = document.createElementNS(svgns, 'path');
      con.setAttribute('d', 'M0 ' + cy.toFixed(0) + ' C 1500 ' + (cy - 60).toFixed(0) + ', 3000 ' + (cy + 70).toFixed(0) + ', 6000 ' + (cy - 30).toFixed(0));
      con.setAttribute('fill', 'none');
      con.setAttribute('stroke', '#3f8a32');
      con.setAttribute('stroke-width', '2');
      con.setAttribute('opacity', '0.07');
      w.appendChild(con);
    }

    // --- worn trails between bonded zones (strength = wear) ---
    BONDS.forEach(function (pr) {
      var h1 = homes[pr[0]],
        h2 = homes[pr[1]];
      var strength = 0.4 + rnd(pr[0] * 13 + pr[1] + 3) * 0.6; // 0.4..1
      var mx = (h1.x + h2.x) / 2 + (rnd(pr[0] + pr[1] + 1) - 0.5) * 240;
      var my = (h1.y + h2.y) / 2 + (rnd(pr[0] + pr[1] + 2) - 0.5) * 240;
      PATHS[pathKey(pr[0], pr[1])] = {
        c: {
          x: mx,
          y: my
        },
        strength: strength
      };
      var d = 'M ' + h1.x.toFixed(0) + ' ' + h1.y.toFixed(0) + ' Q ' + mx.toFixed(0) + ' ' + my.toFixed(0) + ' ' + h2.x.toFixed(0) + ' ' + h2.y.toFixed(0);
      // worn-earth base, only on well-trafficked routes
      var dirt = document.createElementNS(svgns, 'path');
      dirt.setAttribute('d', d);
      dirt.setAttribute('fill', 'none');
      dirt.setAttribute('stroke', '#b89a63');
      dirt.setAttribute('stroke-width', (6 + strength * 22).toFixed(0));
      dirt.setAttribute('stroke-linecap', 'round');
      dirt.setAttribute('opacity', (0.08 + strength * 0.26).toFixed(3));
      w.appendChild(dirt);
      var worn = document.createElementNS(svgns, 'path');
      worn.setAttribute('d', d);
      worn.setAttribute('fill', 'none');
      worn.setAttribute('stroke', '#9ad06f');
      worn.setAttribute('stroke-width', (2 + strength * 8).toFixed(0));
      worn.setAttribute('stroke-linecap', 'round');
      worn.setAttribute('opacity', (0.12 + strength * 0.22).toFixed(3));
      w.appendChild(worn);
    });

    // --- zone markers: a faint soft glow in the Butsu's emotional colour ---
    for (var i = 0; i < n; i++) {
      var jon = JONAUSKAITE[i % JONAUSKAITE.length],
        h = homes[i];
      var outer = document.createElementNS(svgns, 'ellipse');
      outer.setAttribute('cx', h.x.toFixed(0));
      outer.setAttribute('cy', (h.y + 30).toFixed(0));
      outer.setAttribute('rx', '150');
      outer.setAttribute('ry', '66');
      outer.setAttribute('fill', jon[1]);
      outer.setAttribute('opacity', '0.07');
      w.appendChild(outer);
      var inner = document.createElementNS(svgns, 'ellipse');
      inner.setAttribute('cx', h.x.toFixed(0));
      inner.setAttribute('cy', (h.y + 30).toFixed(0));
      inner.setAttribute('rx', '92');
      inner.setAttribute('ry', '40');
      inner.setAttribute('fill', jon[1]);
      inner.setAttribute('opacity', '0.14');
      w.appendChild(inner);
      // worn earth patch at the very centre of the spot
      var patch = document.createElementNS(svgns, 'ellipse');
      patch.setAttribute('cx', h.x.toFixed(0));
      patch.setAttribute('cy', (h.y + 30).toFixed(0));
      patch.setAttribute('rx', '46');
      patch.setAttribute('ry', '20');
      patch.setAttribute('fill', '#a98f5e');
      patch.setAttribute('opacity', '0.16');
      w.appendChild(patch);
      // name label — hidden by default, shown only when the showNames tweak is on
      var label = document.createElementNS(svgns, 'text');
      label.setAttribute('x', h.x.toFixed(0));
      label.setAttribute('y', (h.y + 96).toFixed(0));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#2a3a1f');
      label.setAttribute('font-size', '24');
      label.setAttribute('font-family', 'monospace');
      label.setAttribute('opacity', '0.55');
      label.setAttribute('class', 'home-label');
      label.style.display = 'none';
      label.textContent = ROSTER[i][1];
      w.appendChild(label);
    }
  }

  // ---------- the three higher powers, housed across the top sky band ----------
  // They watch over the realm and only descend during events; for now each has
  // its own area: the Yurei's void (The Expanse), the Tanuki's warm perch, the
  // Sukeruton's totem. (Not part of the 15 Butsu; they don't roam.)
  var SPECIALS = [{
    key: 'tanuki',
    img: 'tanuki.png',
    name: 'Claude the Tanuki',
    sub: 'THE OBSERVER',
    x: 1500,
    h: 360,
    glow: 'radial-gradient(circle, rgba(245,197,66,0.5) 0%, transparent 66%)'
  }, {
    key: 'sukeruton',
    img: 'sukeruton.png',
    name: 'Piza Sukeruton',
    sub: 'THE HOST',
    x: 3000,
    h: 380,
    glow: 'radial-gradient(circle, rgba(120,180,200,0.42) 0%, transparent 66%)'
  }, {
    key: 'yurei',
    img: 'yurei.png',
    name: 'Pineaple Yurei',
    sub: 'THE EXPANSE',
    x: 4500,
    h: 380,
    glow: 'radial-gradient(circle, rgba(30,20,40,0.72) 0%, rgba(40,25,55,0.32) 38%, transparent 70%)'
  }];
  var specialList = [];
  function buildSpecials() {
    specialList = [];
    var feetY = HORIZON - 24; // sit just above the horizon, up in the sky band
    SPECIALS.forEach(function (s, i) {
      var wrap = document.createElement('div');
      wrap.className = 'special-wrap';
      var abode = document.createElement('div');
      abode.className = 'special-abode';
      abode.style.background = s.glow;
      wrap.appendChild(abode);
      var img = document.createElement('img');
      img.className = 'special-fig';
      img.src = './assets/realm/' + s.img;
      img.alt = s.name;
      img.style.height = s.h + 'px';
      img.style.animation = 'specialFloat ' + (5.5 + i * 0.6).toFixed(1) + 's ease-in-out infinite';
      img.style.animationDelay = (-i * 1.3).toFixed(1) + 's';
      wrap.appendChild(img);
      var label = document.createElement('div');
      label.className = 'special-name';
      wrap.appendChild(label); // intentionally blank — the powers carry no writing
      var isTanuki = s.key === 'tanuki';
      var startX = isTanuki ? SCENE_W / 2 + 700 : s.x;
      var startY = isTanuki ? (FIELD.minY + FIELD.maxY) / 2 : feetY;
      wrap.style.transform = 'translate(' + startX + 'px,' + startY + 'px) translate(-50%,-100%)';
      wrap.style.zIndex = isTanuki ? '1500' : '900';
      charLayer.appendChild(wrap);
      specialList.push({
        key: s.key,
        name: s.name,
        wrap: wrap,
        label: label,
        ax: s.x,
        ay: feetY,
        x: startX,
        y: startY,
        tx: startX,
        ty: startY,
        // Claude is always present, roaming the field; the others wait up in the sky
        state: isTanuki ? 'roam' : 'housed',
        timer: 0,
        wt: 0
      });
    });
  }

  // a power acts on an event. Housed powers (Sukeruton/Yurei) descend from the
  // sky; Claude (always roaming) instead walks over to speak to a Butsu.
  function triggerSpecial(key, tx, ty, dur) {
    for (var i = 0; i < specialList.length; i++) {
      var s = specialList[i];
      if (s.key !== key) continue;
      tx = Math.max(FIELD.minX + 200, Math.min(FIELD.maxX - 200, tx));
      ty = Math.max(FIELD.minY + 200, Math.min(FIELD.maxY - 100, ty));
      if (key === 'tanuki' && s.state === 'roam') {
        s.tx = tx;
        s.ty = ty;
        s.state = 'approach';
        s.dur = dur || 520;
        return s;
      }
      if (key !== 'tanuki' && s.state === 'housed') {
        s.tx = tx;
        s.ty = ty;
        s.state = 'descending';
        s.dur = dur || 520;
        return s;
      }
    }
    return null;
  }
  function nearestButsuDist(x, y) {
    var ids = Object.keys(chars),
      best = Infinity;
    for (var i = 0; i < ids.length; i++) {
      var c = chars[ids[i]];
      var d = Math.hypot(c.x - x, c.y - y);
      if (d < best) best = d;
    }
    return best;
  }
  function updateSpecials() {
    for (var i = 0; i < specialList.length; i++) {
      var s = specialList[i];
      if (s.key === 'tanuki') {
        // Claude is always on the field, wandering but keeping his distance from
        // the Butsu — until a visit sends him over to one to "speak".
        if (s.state === 'roam') {
          s.wt--;
          if (s.wt <= 0) {
            s.tx = FIELD.minX + 200 + Math.random() * (FIELD.maxX - FIELD.minX - 400);
            s.ty = FIELD.minY + 200 + Math.random() * (FIELD.maxY - FIELD.minY - 300);
            s.wt = 200 + Math.floor(Math.random() * 260);
          }
          var dxr = s.tx - s.x,
            dyr = s.ty - s.y,
            dr = Math.hypot(dxr, dyr) || 1;
          var vxr = dxr / dr * 1.1,
            vyr = dyr / dr * 1.1;
          // keep clear of any Butsu he isn't visiting
          var ids = Object.keys(chars);
          for (var k = 0; k < ids.length; k++) {
            var c = chars[ids[k]],
              ddx = s.x - c.x,
              ddy = s.y - c.y,
              dd = Math.hypot(ddx, ddy) || 1;
            if (dd < 360) {
              vxr += ddx / dd * (360 - dd) * 0.012;
              vyr += ddy / dd * (360 - dd) * 0.012;
            }
          }
          s.x += vxr;
          s.y += vyr;
        } else if (s.state === 'approach') {
          s.x += (s.tx - s.x) * 0.05;
          s.y += (s.ty - s.y) * 0.05;
          if (Math.hypot(s.tx - s.x, s.ty - s.y) < 150) {
            s.state = 'present';
            s.timer = s.dur;
          }
        } else if (s.state === 'present') {
          s.timer--;
          if (s.timer <= 0) s.state = 'roam';
        }
        s.x = Math.max(FIELD.minX, Math.min(FIELD.maxX, s.x));
        s.y = Math.max(FIELD.minY, Math.min(FIELD.maxY, s.y));
      } else if (s.state === 'descending') {
        s.x += (s.tx - s.x) * 0.045;
        s.y += (s.ty - s.y) * 0.045;
        if (Math.hypot(s.tx - s.x, s.ty - s.y) < 24) {
          s.state = 'present';
          s.timer = s.dur;
        }
      } else if (s.state === 'present') {
        s.timer--;
        if (s.timer % 110 === 0) {
          s.tx = Math.max(FIELD.minX + 200, Math.min(FIELD.maxX - 200, s.tx + (Math.random() - 0.5) * 360));
        }
        s.x += (s.tx - s.x) * 0.02;
        if (s.timer <= 0) s.state = 'ascending';
      } else if (s.state === 'ascending') {
        s.x += (s.ax - s.x) * 0.04;
        s.y += (s.ay - s.y) * 0.04;
        if (Math.hypot(s.ax - s.x, s.ay - s.y) < 18) {
          s.state = 'housed';
          s.x = s.ax;
          s.y = s.ay;
        }
      } else if (s.state === 'housed') {
        s.x = s.ax;
        s.y = s.ay;
      }
      // scale up as it comes into the foreground; smaller up in the sky
      var depth = Math.max(0, Math.min(1, (s.y - HORIZON) / (FIELD.maxY - HORIZON)));
      var scale = (s.key === 'tanuki' ? 0.62 : 0.9) + 0.5 * depth;
      s.wrap.style.transform = 'translate(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px) translate(-50%,-100%) scale(' + scale.toFixed(3) + ')';
      s.wrap.style.zIndex = String(1000 + Math.round(s.y));
    }
  }
  function buildScene() {
    var homes = layoutHomes(ROSTER.length); // 50 homespaces; only arted ones get a Butsu
    buildWorldLayer(ROSTER.length, homes);
    CAST.forEach(function (c, i) {
      var wrap = document.createElement('div');
      wrap.className = 'broll-wrap';
      var jon = JONAUSKAITE[i % JONAUSKAITE.length];
      var aura = document.createElement('div');
      aura.className = 'broll-aura';
      aura.style.background = 'radial-gradient(circle, ' + jon[1] + ' 0%, transparent 68%)';
      wrap.appendChild(aura);
      var shadow = document.createElement('div');
      shadow.className = 'broll-shadow';
      wrap.appendChild(shadow);

      // sprite span carries the bob/sway so the shadow below stays planted
      var sprite = document.createElement('span');
      sprite.className = 'broll-sprite';
      var img = document.createElement('img');
      img.className = 'broll';
      img.src = './assets/broll/' + c[0] + '.png';
      img.alt = c[1];
      img.style.animation = 'none';
      img.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (didPan) return;
        getCharacter(i).then(function (rec) {
          window.dispatchEvent(new CustomEvent('mtb:inspect', {
            detail: rec
          }));
        });
      });
      var tip = document.createElement('div');
      tip.className = 'broll-tooltip';
      tip.textContent = c[1];
      sprite.appendChild(tip);
      sprite.appendChild(img);
      wrap.appendChild(sprite);
      charLayer.appendChild(wrap);
      // each Butsu starts standing on its own spot; a small FSM sends it visiting & back
      var h = homes[i];
      var rec = {
        id: c[0],
        idx: i,
        cid: c[2],
        wrap: wrap,
        aura: aura,
        img: img,
        sprite: sprite,
        home: h,
        x: h.x,
        y: h.y,
        vx: 0,
        vy: 0,
        tx: h.x,
        ty: h.y,
        statev: 'home',
        timer: 200 + Math.floor(rnd(i + 90) * 320),
        name: c[1],
        phase: i * 0.7,
        u: 0,
        path: null
      };
      setEmotion(rec, jon[0], jon[1]);
      // place at home immediately so it's positioned before the first frame
      wrap.style.transform = 'translate(' + h.x + 'px,' + h.y + 'px) translate(-50%,-100%) scale(1)';
      wrap.style.zIndex = String(1000 + Math.round(h.y));
      chars[c[0]] = rec;
    });
    var hc = document.getElementById('hudCount');
    if (hc) hc.textContent = n;
  }

  // ---------- emotion model (PAD → behaviour) ----------
  // Each colour the Colour Engine #26 can pick maps to a rough PAD emotion.
  // p = valence (approach vs withdraw), a = arousal (restlessness/bounce),
  // d = dominance (how much it holds its ground vs gets pushed around).
  var EMO_BY_COLOUR = {
    red: {
      p: -0.2,
      a: 0.9,
      d: 0.6,
      word: 'furious'
    },
    orange: {
      p: 0.6,
      a: 0.6,
      d: 0.3,
      word: 'warm'
    },
    yellow: {
      p: 0.85,
      a: 0.6,
      d: 0.2,
      word: 'delighted'
    },
    green: {
      p: 0.5,
      a: -0.3,
      d: 0.1,
      word: 'content'
    },
    turquoise: {
      p: 0.4,
      a: -0.2,
      d: 0.0,
      word: 'calm'
    },
    blue: {
      p: 0.1,
      a: -0.5,
      d: -0.1,
      word: 'wistful'
    },
    purple: {
      p: 0.2,
      a: 0.0,
      d: 0.2,
      word: 'pensive'
    },
    pink: {
      p: 0.7,
      a: 0.2,
      d: -0.1,
      word: 'fond'
    },
    brown: {
      p: -0.1,
      a: -0.4,
      d: -0.1,
      word: 'dull'
    },
    white: {
      p: 0.3,
      a: -0.1,
      d: 0.0,
      word: 'clear'
    },
    grey: {
      p: -0.4,
      a: -0.5,
      d: -0.3,
      word: 'listless'
    },
    black: {
      p: -0.75,
      a: 0.3,
      d: -0.4,
      word: 'dread'
    }
  };
  function emoForColour(name) {
    return EMO_BY_COLOUR[name] || EMO_BY_COLOUR.white;
  }
  function setEmotion(c, colourName, hex) {
    var e = emoForColour(colourName);
    c.emo = {
      p: e.p,
      a: e.a,
      d: e.d
    };
    c.feel = e.word;
    c.mood = hex;
    c.aura.style.background = 'radial-gradient(circle, ' + hex + ' 0%, transparent 68%)';
  }

  // ---------- motion: free roaming in the open field ----------
  // ---------- motion: a living neighbourhood (visiting FSM) ----------
  // Butsu rest at home, then set out to visit a friend's zone, linger, and head
  // back — RimWorld-style autonomy you just watch. Rivals are avoided.
  var MINSEP = 150;
  function homeOf(idx) {
    var b = findByIdx(idx);
    return b ? b.home : null;
  }
  function simulate() {
    if (window.__realmToken !== myToken) return; // a newer load owns the realm
    var ids = Object.keys(chars),
      n = ids.length;
    if (!n) {
      requestAnimationFrame(simulate);
      return;
    }
    applyAtmosphere();
    updateSpecials();
    smoothView();
    resolveCollisions();
    for (var i = 0; i < n; i++) {
      var a = chars[ids[i]],
        emo = a.emo,
        fx = 0,
        fy = 0,
        j,
        b,
        dx,
        dy,
        d;

      // --- behaviour FSM: decide where this Butsu wants to be (a.tx, a.ty) ---
      a.timer--;
      if (a.statev === 'home') {
        if (a.timer <= 0) {
          var friends = LIKES[a.idx];
          if (friends.length && Math.random() < 0.6) {
            var fi = friends[Math.floor(Math.random() * friends.length)];
            var fh = homeOf(fi);
            if (fh) {
              var pk = PATHS[pathKey(a.idx, fi)];
              var ctrl = pk ? pk.c : {
                x: (a.home.x + fh.x) / 2,
                y: (a.home.y + fh.y) / 2
              };
              a.path = {
                p0: {
                  x: a.home.x,
                  y: a.home.y
                },
                c: ctrl,
                p1: {
                  x: fh.x + (Math.random() - 0.5) * 120,
                  y: fh.y + (Math.random() - 0.5) * 80
                }
              };
              a.u = 0;
              a.statev = 'travel';
              a.timer = 900;
            }
          } else {
            // potter about near home
            a.tx = a.home.x + (Math.random() - 0.5) * 180;
            a.ty = a.home.y + (Math.random() - 0.5) * 110;
            a.timer = 150 + Math.floor(Math.random() * 220);
          }
        } else {
          a.tx = a.tx;
        } // hold position (gentle idle)
      } else if (a.statev === 'travel') {
        a.u = Math.min(1, a.u + 0.006 * (0.55 + (emo.a + 1) * 0.5)); // walk the path curve
        var pt = quadPt(a.path.p0, a.path.c, a.path.p1, a.u);
        a.tx = pt.x;
        a.ty = pt.y;
        if (a.u >= 1 && Math.hypot(a.tx - a.x, a.ty - a.y) < 60) {
          a.statev = 'visit';
          a.timer = 300 + Math.floor(Math.random() * 360);
        } else if (a.timer <= 0) {
          a.statev = 'return';
          a.timer = 900;
        }
      } else if (a.statev === 'visit') {
        if (a.timer % 80 === 0) {
          a.tx = a.path.p1.x + (Math.random() - 0.5) * 130;
          a.ty = a.path.p1.y + (Math.random() - 0.5) * 80;
        }
        if (a.timer <= 0) {
          a.statev = 'return';
          a.timer = 900;
        }
      } else {
        // return — walk the same path back home
        a.u = Math.max(0, a.u - 0.006 * (0.55 + (emo.a + 1) * 0.5));
        var rp = quadPt(a.path.p0, a.path.c, a.path.p1, a.u);
        a.tx = rp.x;
        a.ty = rp.y;
        if (a.u <= 0 && Math.hypot(a.home.x - a.x, a.home.y - a.y) < 60 || a.timer <= 0) {
          a.statev = 'home';
          a.tx = a.home.x;
          a.ty = a.home.y;
          a.timer = 160 + Math.floor(Math.random() * 300);
        }
      }

      // steer toward the target (arousal sets the pace)
      dx = a.tx - a.x;
      dy = a.ty - a.y;
      d = Math.hypot(dx, dy) || 0.01;
      if (d > 8) {
        var acc = 0.05 * (0.6 + (emo.a + 1) * 0.45);
        fx += dx / d * acc * Math.min(d, 60);
        fy += dy / d * acc * Math.min(d, 60);
      }

      // personal space — nobody overlaps
      for (j = 0; j < n; j++) {
        if (i === j) continue;
        b = chars[ids[j]];
        dx = a.x - b.x;
        dy = a.y - b.y;
        d = Math.hypot(dx, dy) || 0.01;
        if (d < MINSEP) {
          fx += dx / d * (MINSEP - d) * 0.03;
          fy += dy / d * (MINSEP - d) * 0.03;
        }
      }
      // rivals: keep your distance; cut a visit short if one comes near
      for (j = 0; j < DISLIKES[a.idx].length; j++) {
        b = findByIdx(DISLIKES[a.idx][j]);
        if (!b) continue;
        dx = a.x - b.x;
        dy = a.y - b.y;
        d = Math.hypot(dx, dy) || 0.01;
        if (d < 520) {
          fx += dx / d * (520 - d) * 0.006;
          fy += dy / d * (520 - d) * 0.006;
          if (a.statev === 'visit' && d < 300) {
            a.statev = 'return';
            a.tx = a.home.x;
            a.ty = a.home.y;
            a.timer = 600;
          }
        }
      }
      a.vx = (a.vx + fx) * 0.82;
      a.vy = (a.vy + fy) * 0.82;
      var sp = Math.hypot(a.vx, a.vy),
        MAX = 3.1;
      if (sp > MAX) {
        a.vx *= MAX / sp;
        a.vy *= MAX / sp;
      }
      if (sp < 0.04) {
        a.vx = 0;
        a.vy = 0;
      }
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < FIELD.minX) {
        a.x = FIELD.minX;
        a.vx = 0;
      }
      if (a.x > FIELD.maxX) {
        a.x = FIELD.maxX;
        a.vx = 0;
      }
      if (a.y < FIELD.minY) {
        a.y = FIELD.minY;
        a.vy = 0;
      }
      if (a.y > FIELD.maxY) {
        a.y = FIELD.maxY;
        a.vy = 0;
      }
      // HD-2D depth: characters nearer the front (higher y) a touch larger
      var depth = (a.y - FIELD.minY) / (FIELD.maxY - FIELD.minY);
      var scale = 0.82 + 0.36 * depth;
      // wrap sits planted on the ground (shadow stays put); the SPRITE bobs
      a.wrap.style.transform = 'translate(' + a.x.toFixed(1) + 'px,' + a.y.toFixed(1) + 'px) translate(-50%,-100%) scale(' + scale.toFixed(3) + ')';
      a.wrap.style.zIndex = String(1000 + Math.round(a.y));
      var walking = sp > 0.35;
      a.phase += walking ? 0.26 : 0.05; // brisk while walking, slow idle breath
      var amp = walking ? 7 : 2.2; // gentle idle bob, springier walk
      var hop = Math.abs(Math.sin(a.phase)) * amp;
      var sway = walking ? Math.sin(a.phase) * 4 : 0;
      a.sprite.style.transform = 'translate(' + sway.toFixed(1) + 'px,' + (-hop).toFixed(1) + 'px)';
      var leak = flag('__MTB_SHOW_LEAK', true);
      a.aura.style.opacity = leak ? (0.26 + (emo.a + 1) * 0.14).toFixed(2) : '0';
    }
    requestAnimationFrame(simulate);
  }
  function findByIdx(idx) {
    var ks = Object.keys(chars);
    for (var i = 0; i < ks.length; i++) {
      if (chars[ks[i]].idx === idx) return chars[ks[i]];
    }
    return null;
  }
  // hard collision pass — push any overlapping Butsu apart so sprites never blend
  function resolveCollisions() {
    var ids = Object.keys(chars),
      n = ids.length,
      R = 128;
    for (var iter = 0; iter < 2; iter++) {
      for (var i = 0; i < n; i++) {
        var a = chars[ids[i]];
        for (var j = i + 1; j < n; j++) {
          var b = chars[ids[j]];
          var dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.hypot(dx, dy);
          if (d < R && d > 0.001) {
            var push = (R - d) / 2,
              nx = dx / d,
              ny = dy / d;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }
      }
    }
    for (var k = 0; k < n; k++) {
      var c = chars[ids[k]];
      c.x = Math.max(FIELD.minX, Math.min(FIELD.maxX, c.x));
      c.y = Math.max(FIELD.minY, Math.min(FIELD.maxY, c.y));
    }
  }
  function quadPt(p0, c, p1, u) {
    var v = 1 - u;
    return {
      x: v * v * p0.x + 2 * v * u * c.x + u * u * p1.x,
      y: v * v * p0.y + 2 * v * u * c.y + u * u * p1.y
    };
  }
  function startPhysics() {
    requestAnimationFrame(simulate);
  }

  // ---------- ambient particles (gentle motes; density tracks realm health) ----------
  function buildParticles() {
    var p = document.getElementById('particles');
    if (!p || p.childElementCount) return;
    for (var i = 0; i < 42; i++) {
      var m = document.createElement('div');
      m.className = 'mote';
      m.style.left = (Math.random() * 100).toFixed(1) + '%';
      m.style.top = (30 + Math.random() * 70).toFixed(1) + '%';
      m.style.animationDuration = (7 + Math.random() * 9).toFixed(1) + 's';
      m.style.animationDelay = (-Math.random() * 12).toFixed(1) + 's';
      var s = (4 + Math.random() * 6).toFixed(1);
      m.style.width = s + 'px';
      m.style.height = s + 'px';
      p.appendChild(m);
    }
  }

  // ---------- atmosphere: realm health → warmth & saturation ----------
  var atmosCur = 0.62,
    atmosEl = null,
    lastNames = null;
  function applyAtmosphere() {
    if (!atmosEl) atmosEl = document.getElementById('atmos');
    var names = flag('__MTB_SHOW_NAMES', false);
    if (names !== lastNames) {
      lastNames = names;
      var labels = document.querySelectorAll('#worldLayer .home-label');
      for (var li = 0; li < labels.length; li++) labels[li].style.display = names ? '' : 'none';
    }
    var target = window.__MTB_REALM_HEALTH;
    if (typeof target !== 'number') target = 0.62;
    atmosCur += (target - atmosCur) * 0.04; // ease toward current health
    var h = atmosCur;
    // healthy: warm golden glow + full colour. stressed: cool, flat, desaturated.
    var sat = (0.55 + h * 0.6).toFixed(2),
      bright = (0.86 + h * 0.18).toFixed(2);
    scene.style.filter = 'saturate(' + sat + ') brightness(' + bright + ')';
    if (atmosEl) {
      if (h >= 0.5) {
        var warm = (h - 0.5) * 2; // 0..1
        atmosEl.style.background = 'radial-gradient(120% 90% at 50% 38%, rgba(255,214,140,' + (0.16 * warm).toFixed(3) + ') 0%, transparent 60%)';
        atmosEl.style.opacity = '1';
      } else {
        var cold = (0.5 - h) * 2; // 0..1
        atmosEl.style.background = 'linear-gradient(rgba(70,90,120,' + (0.28 * cold).toFixed(3) + '), rgba(50,60,90,' + (0.34 * cold).toFixed(3) + '))';
        atmosEl.style.opacity = '1';
      }
    }
    var pEl = document.getElementById('particles');
    if (pEl) pEl.style.opacity = (Math.max(0, h - 0.32) * 1.3).toFixed(2); // motes fade out as the realm sickens
  }
  var EMOTIONS = ['joy', 'sorrow', 'anger', 'fear', 'surprise', 'disgust'];
  var ACTIONS = ['helping', 'an alliance', 'a betrayal', 'teaching', 'a theft', 'a debt'];
  var CAMPAIGNS = ['isolation', 'discredit', 'coercion'];
  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
  var EVENT_TYPES = ['mood_express', 'mood_express', 'category', 'text', 'narrative', 'narrative', 'belief', 'perception_update', 'tension_update', 'colour_selection_update', 'colour_selection_update', 'face_read_update', 'identity_recognition', 'campaign_state_update', 'yurei_breach_event'];
  function emotionExclaim(c) {
    var e = c.emo || {
      p: 0,
      a: 0
    };
    if (e.p > 0.4 && e.a > 0.3) return pick(['ha! yes!', 'this is good', 'come closer']);
    if (e.p > 0.3) return pick(['…nice', 'i feel ' + (c.feel || 'ok'), 'stay a while']);
    if (e.p < -0.4 && e.a > 0.2) return pick(['get away', 'no — no!', 'leave me']);
    if (e.p < -0.3) return pick(['…alone now', 'so far away', 'cold here']);
    return pick(['hm.', '…', c.feel || 'still']);
  }
  function makeEvent(a, b) {
    var t = pick(EVENT_TYPES);
    switch (t) {
      case 'mood_express':
        return {
          dyad: false,
          txt: emotionExclaim(a)
        };
      case 'category':
        return {
          dyad: true,
          txt: Math.random() > 0.5 ? 'shares a warm memory' : 'shares a fearful memory'
        };
      case 'text':
        return {
          dyad: true,
          txt: 'retells it… (degraded)'
        };
      case 'narrative':
        return {
          dyad: true,
          txt: 'talks about ' + pick(ACTIONS)
        };
      case 'belief':
        return {
          dyad: true,
          txt: 'a dark rumour spreads…'
        };
      case 'perception_update':
        return {
          dyad: true,
          txt: 'forms a ' + (Math.random() > 0.5 ? 'warmer' : 'colder') + ' impression'
        };
      case 'tension_update':
        return {
          dyad: true,
          txt: 'tension rising (' + pick(['task', 'relationship', 'process']) + ')'
        };
      case 'colour_selection_update':
        {
          var jon = JONAUSKAITE[Math.floor(Math.random() * JONAUSKAITE.length)];
          setEmotion(a, jon[0], jon[1]);
          return {
            dyad: false,
            txt: 'feels ' + (a.feel || jon[0])
          };
        }
      case 'face_read_update':
        {
          var shown = pick(EMOTIONS),
            perceived = pick(EMOTIONS);
          return {
            dyad: true,
            txt: 'reads ' + perceived + (shown !== perceived ? ' (misread!)' : '')
          };
        }
      case 'identity_recognition':
        return {
          dyad: true,
          txt: pick(['recognises them', 'sees a stranger', 'mistakes their identity'])
        };
      case 'campaign_state_update':
        return {
          dyad: true,
          txt: pick(CAMPAIGNS) + ': ' + pick(['planning', 'active', 'exposed'])
        };
      case 'yurei_breach_event':
        return {
          dyad: false,
          yurei: true,
          txt: 'YUREI ' + pick(['BREACH', 'WITHDRAW', 'HOLD'])
        };
      default:
        return {
          dyad: false,
          txt: '…'
        };
    }
  }
  function startEvents() {
    if (window.__realmEvtTimer) clearInterval(window.__realmEvtTimer);
    window.__realmEvtTimer = setInterval(function () {
      if (window.__realmToken !== myToken) {
        clearInterval(window.__realmEvtTimer);
        return;
      }
      if (bubbleLayer.firstChild) bubbleLayer.innerHTML = ''; // bubbles live in wraps now; sweep any orphans
      var ids = Object.keys(chars);
      var a = chars[pick(ids)],
        b = chars[pick(ids)];
      while (b === a && ids.length > 1) b = chars[pick(ids)];
      var ev = makeEvent(a, b);
      var who = ev.yurei ? 'Pineaple Yurei' : ev.dyad ? a.name + ' \u2192 ' + b.name : a.name;
      // a real Yurei BREACH brings the Yurei itself down onto the breached Butsu
      if (ev.yurei && /BREACH/.test(ev.txt)) {
        triggerSpecial('yurei', a.x, a.y - 40, 560);
      }
      showBubble(a, who, ev.txt, ev.yurei);
    }, 2200);
    // periodic goodwill visits from the Tanuki (observer) and Sukeruton (host)
    if (window.__realmVisitTimer) clearInterval(window.__realmVisitTimer);
    window.__realmVisitTimer = setInterval(function () {
      if (window.__realmToken !== myToken) {
        clearInterval(window.__realmVisitTimer);
        return;
      }
      var ids = Object.keys(chars);
      if (!ids.length) return;
      var spot = chars[pick(ids)];
      triggerSpecial(Math.random() < 0.5 ? 'tanuki' : 'sukeruton', spot.x + (Math.random() - 0.5) * 300, spot.y - 30, 620);
    }, 14000);
  }
  function showBubble(speaker, who, txt, isYurei) {
    var el = document.createElement('div');
    el.className = 'bubble';
    var inner = document.createElement('div');
    inner.className = 'bubble-inner';
    if (isYurei) {
      inner.style.background = 'var(--despair-deep)';
      inner.style.color = '#fff';
      inner.style.borderColor = 'var(--despair-deep)';
    }
    var whoEl = document.createElement('div');
    whoEl.className = 'bubble-who';
    whoEl.textContent = who;
    inner.appendChild(whoEl);
    inner.appendChild(document.createTextNode(txt));
    el.appendChild(inner);
    // Anchor the bubble INSIDE the speaker's wrap so it inherits the avatar's
    // exact position + the CSS left-transition — it can never drift off-character.
    var img = speaker.img;
    var cx = img.offsetLeft + img.offsetWidth / 2 || 0;
    el.style.left = cx + 'px';
    el.style.bottom = img.offsetHeight + 6 + bubbles.length % 3 * 26 + 'px';
    el.style.transform = 'translateX(-50%)';
    speaker.wrap.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add('show');
    });
    var timer = setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () {
        el.remove();
      }, 400);
    }, 4000);
    bubbles.push({
      el: el,
      speaker: speaker,
      timer: timer
    });
    while (bubbles.length > 2) {
      var old = bubbles.shift();
      clearTimeout(old.timer);
      old.el.remove();
    }
  }

  // ---------- pan / zoom ----------
  var minZoom = 0.2;
  // smooth view: we ease the live view (zoom/panX/panY) toward target values
  // every frame, so wheel-zoom glides and pan has a little momentum.
  var tZoom = 1,
    tPanX = 0,
    tPanY = 0,
    panVX = 0,
    panVY = 0;
  function initView() {
    var vw = viewport.clientWidth,
      vh = viewport.clientHeight;
    // fully zoomed out shows the whole realm; default lands on the neighbourhood
    minZoom = Math.min(vw / SCENE_W, vh / SCENE_H);
    zoom = Math.max(minZoom, Math.min(6, 0.62)); // ~default Sims "lot cluster" zoom
    // centre on the cluster of Butsu so the default view lands on the action
    var fx = SCENE_W / 2,
      fy = SCENE_H / 2,
      ids = Object.keys(chars);
    if (ids.length) {
      var sx = 0,
        sy = 0;
      for (var i = 0; i < ids.length; i++) {
        sx += chars[ids[i]].x;
        sy += chars[ids[i]].y;
      }
      fx = sx / ids.length;
      fy = sy / ids.length;
    }
    panX = vw / 2 - fx * zoom;
    panY = vh / 2 - fy * zoom;
    tZoom = zoom;
    tPanX = panX;
    tPanY = panY;
    panVX = panVY = 0;
    applyTransform();
  }
  function clampVals(px, py, z) {
    var vw = viewport.clientWidth,
      vh = viewport.clientHeight,
      sw = SCENE_W * z,
      sh = SCENE_H * z;
    px = sw <= vw ? (vw - sw) / 2 : Math.min(0, Math.max(vw - sw, px));
    py = sh <= vh ? (vh - sh) / 2 : Math.min(0, Math.max(vh - sh, py));
    return [px, py];
  }
  function clampPan() {
    var c = clampVals(panX, panY, zoom);
    panX = c[0];
    panY = c[1];
  }
  function clampTargets() {
    var c = clampVals(tPanX, tPanY, tZoom);
    tPanX = c[0];
    tPanY = c[1];
  }
  function applyTransform() {
    clampPan();
    scene.style.transform = 'translate(' + panX.toFixed(2) + 'px,' + panY.toFixed(2) + 'px) scale(' + zoom.toFixed(4) + ')';
    // three reads: neighbourhood (out) · walking + bubbles (mid) · one zone (in)
    var rel = minZoom > 0 ? zoom / minZoom : 1;
    viewport.setAttribute('data-zoom', rel < 1.7 ? 'out' : rel > 4 ? 'in' : 'mid');
  }
  // eased every frame from simulate()
  function smoothView() {
    if (!isPanning && (Math.abs(panVX) > 0.1 || Math.abs(panVY) > 0.1)) {
      tPanX += panVX;
      tPanY += panVY;
      panVX *= 0.9;
      panVY *= 0.9;
      clampTargets();
    }
    zoom += (tZoom - zoom) * 0.2;
    if (Math.abs(tZoom - zoom) < 0.0004) zoom = tZoom;
    panX += (tPanX - panX) * 0.25;
    panY += (tPanY - panY) * 0.25;
    if (Math.abs(tPanX - panX) < 0.4) panX = tPanX;
    if (Math.abs(tPanY - panY) < 0.4) panY = tPanY;
    applyTransform();
  }
  var lastMX = 0,
    lastMY = 0;
  viewport.addEventListener('mousedown', function (e) {
    isPanning = true;
    didPan = false;
    panVX = panVY = 0;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panBaseX = panX;
    panBaseY = panY;
    lastMX = e.clientX;
    lastMY = e.clientY;
    viewport.classList.add('panning');
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!isPanning) return;
    if (Math.abs(e.clientX - panStartX) + Math.abs(e.clientY - panStartY) > 4) didPan = true;
    // direct 1:1 drag (no lag); track last delta for release momentum
    panVX = e.clientX - lastMX;
    panVY = e.clientY - lastMY;
    lastMX = e.clientX;
    lastMY = e.clientY;
    panX = panBaseX + (e.clientX - panStartX);
    panY = panBaseY + (e.clientY - panStartY);
    tPanX = panX;
    tPanY = panY;
    clampTargets();
    applyTransform();
  });
  window.addEventListener('mouseup', function () {
    isPanning = false;
    viewport.classList.remove('panning');
    setTimeout(function () {
      didPan = false;
    }, 0);
  });
  // wheel zoom — eased toward a target, anchored on the cursor for fine control
  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect = viewport.getBoundingClientRect(),
      mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    var factor = Math.exp(-e.deltaY * 0.0014); // proportional, smooth on wheel & trackpad
    var nz = Math.max(minZoom, Math.min(6, tZoom * factor));
    // keep the world point under the cursor fixed as we zoom
    var wx = (mx - panX) / zoom,
      wy = (my - panY) / zoom;
    tZoom = nz;
    tPanX = mx - wx * nz;
    tPanY = my - wy * nz;
    panVX = panVY = 0;
    clampTargets();
  }, {
    passive: false
  });
  window.addEventListener('resize', initView);
  // double-click empty space eases back to the default neighbourhood view
  viewport.addEventListener('dblclick', function (e) {
    if (e.target.classList && e.target.classList.contains('broll')) return;
    var vw = viewport.clientWidth,
      vh = viewport.clientHeight;
    tZoom = Math.max(minZoom, Math.min(6, 0.62));
    var fx = SCENE_W / 2,
      fy = SCENE_H / 2,
      ids = Object.keys(chars);
    if (ids.length) {
      var sx = 0,
        sy = 0;
      for (var i = 0; i < ids.length; i++) {
        sx += chars[ids[i]].x;
        sy += chars[ids[i]].y;
      }
      fx = sx / ids.length;
      fy = sy / ids.length;
    }
    tPanX = vw / 2 - fx * tZoom;
    tPanY = vh / 2 - fy * tZoom;
    panVX = panVY = 0;
    clampTargets();
  });
  function init() {
    charLayer.innerHTML = '';
    bubbleLayer.innerHTML = '';
    chars = {};
    bubbles = [];
    var stray = document.querySelectorAll('.bubble');
    for (var q = 0; q < stray.length; q++) stray[q].remove();
    buildScene();
    buildSpecials();
    buildParticles();
    startPhysics();
    initView();
    startEvents();
  }

  // If an API base is set, try to load the live cast first; fall back to default.
  if (API !== null) {
    fetch(API + '/api/realm/avatars').then(function (r) {
      if (!r.ok) throw 0;
      return r.json();
    }).then(function (d) {
      if (d && d.avatars && d.avatars.length) {
        CAST = d.avatars.map(function (a) {
          return [a.avatar, a.character_name, a.character_id];
        });
      }
    }).catch(function () {}).then(function () {
      init();
    });
  } else {
    init();
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "realm-visualiser/realmSim.js", error: String((e && e.message) || e) }); }

// ui_kits/engine-laboratory/EngineLaboratory.jsx
try { (() => {
/* global React */
const {
  useState,
  useRef,
  useEffect,
  useCallback
} = React;
const DS = window.MutaibutsuDesignSystem_a89d6f;
const {
  Button,
  Badge,
  StatusDot,
  MonoLabel,
  StatCard,
  EngineRow,
  Terminal,
  Toast,
  CharacterInspector
} = DS;
const TOOLBAR = [{
  id: 'engines',
  label: 'Engines',
  icon: '⚡'
}, {
  id: 'test',
  label: 'Tests',
  icon: '🧪'
}, {
  id: 'config',
  label: 'Config',
  icon: '⚙️'
}, {
  id: 'char',
  label: 'Characters',
  icon: '👤'
}, {
  id: 'db',
  label: 'Database',
  icon: '🗄️'
}, {
  id: 'valid',
  label: 'Validators',
  icon: '✅'
}, {
  id: 'visualiser',
  label: 'Visualiser',
  icon: '👁️'
}, {
  id: 'tools',
  label: 'Tools',
  icon: '🔧'
}];
const PANEL_TITLES = {
  engines: '⚡ ENGINE LABORATORY ⚡',
  test: '🧪 TEST RUNNER',
  config: '⚙️ CONFIGURATION (read-only)',
  char: '👤 CHARACTERS',
  db: '🗄️ DATABASE RESET',
  valid: '✅ VALIDATORS',
  visualiser: '👁️ BICAMERAL VISUALISER',
  tools: '🔧 TOOLS'
};
const DB_ELI5 = {
  academic: "The clean-slate reset runs resetDatabase.js inside a single transaction. It disables foreign-key constraints, truncates all 21 run-data tables, restores all 50 B-Roll characters to genesis (source_monitoring = 0, developmental_stage = pre_verbal, PAD reset to OCEAN-derived baselines), resets every hex ID range and the 53 PostgreSQL sequences to range_start, re-enables constraints, then verifies. A run from the same seed and config reproduces identically.",
  gaming: "This wipes the save back to a fresh start. Every character forgets everything, drops to their newborn pre-verbal state, and their mood resets to factory personality defaults. All gossip, rumours, grudges, and karma are cleared. The fixed personalities never change — only what accumulated during play.",
  layperson: "This empties the database and puts everything back to the very beginning. 50 characters who lived a whole story are returned to the moment they were born — knowing nothing, feeling only their basic nature. A fresh, identical start every time."
};
function useSheet() {
  const [panel, setPanel] = useState(null);
  const [closing, setClosing] = useState(false);
  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setPanel(null);
      setClosing(false);
    }, 300);
  }, []);
  const open = useCallback(id => setPanel(p => p === id ? null : id), []);
  return {
    panel,
    closing,
    open,
    close,
    setPanel
  };
}

/* ---------- the engine list (panel body) ---------- */
function EngineList({
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, window.MTB_ENGINES.map(grp => /*#__PURE__*/React.createElement("div", {
    key: grp.group
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--lab-text-mute)',
      textAlign: 'center',
      margin: '0 0 8px',
      paddingBottom: 6,
      borderBottom: '1px solid var(--lab-line)'
    }
  }, grp.group), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, grp.items.map(e => /*#__PURE__*/React.createElement(EngineRow, {
    key: e.name,
    index: e.idx,
    status: e.status,
    role: e.role,
    name: e.kanji ? `${e.name} (${e.kanji})` : e.name,
    desc: e.desc,
    onClick: () => onPick(e)
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: 10,
      fontSize: 11,
      color: 'var(--lab-text-mute)',
      fontFamily: 'var(--font-mono)',
      borderTop: '1px solid var(--lab-line)',
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, window.MTB_STATUS_LEGEND.map(s => /*#__PURE__*/React.createElement("span", {
    key: s.key,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: s.key,
    size: 9
  }), " ", s.label))));
}
function MockBtn({
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement(Button, {
    world: "lab",
    variant: "secondary",
    onClick: onClick,
    style: {
      width: '100%',
      justifyContent: 'flex-start',
      background: 'var(--lab-hover)'
    }
  }, children);
}

/* ---------- panel bodies ---------- */
function PanelBody({
  panel,
  run,
  onPickEngine,
  onPickChar
}) {
  if (panel === 'engines') return /*#__PURE__*/React.createElement(EngineList, {
    onPick: onPickEngine
  });
  if (panel === 'char') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--lab-text-mute)'
    }
  }, "18 of 100 B-Roll characters have avatars \xB7 live state from bicameral_sweep_17"), (window.MTB_ROSTER || []).map(r => {
    const ch = (window.MTB_CHARACTERS || {})[r[0]];
    const hex = ch && ch.colour ? ch.colour.selected_hex : 'var(--lab-line)';
    return /*#__PURE__*/React.createElement("button", {
      key: r[0],
      onClick: () => onPickChar(r[0]),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        textAlign: 'left',
        background: 'var(--lab-hover)',
        border: '1px solid var(--lab-line)',
        borderRadius: 'var(--r-sm)',
        padding: '9px 12px',
        cursor: 'pointer',
        color: 'var(--lab-text)',
        fontFamily: 'var(--font-ui)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: `../../assets/broll/${r[2]}.png`,
      alt: "",
      style: {
        width: 28,
        height: 28,
        objectFit: 'contain'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, r[1]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--lab-text-mute)'
      }
    }, r[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        width: 13,
        height: 13,
        borderRadius: '50%',
        background: hex,
        border: '1px solid var(--lab-line-2)'
      }
    }));
  }));
  if (panel === 'test') return /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('runUnitTests')
  }, "\u25B6 Run all unit tests (284 assertions)"), /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('runSmoke')
  }, "\uD83C\uDF2B\uFE0F Run smoke test (5000 ticks, adversarial)"), /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('runGossamer')
  }, "\u2728 Gossamer Closure Suite (Q1\u2013Q7)"), /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('abort')
  }, "\u23F9\uFE0F Abort current job"));
  if (panel === 'config') return /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('showConfig')
  }, "Show current config (bicameral)"));
  if (panel === 'db') return /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('dryRun')
  }, "\uD83E\uDDF9 Dry-run: clear reconciliation_log"), /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('clearConfirm')
  }, "\u26A0\uFE0F Confirm clear reconciliation_log"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--lab-line)',
      margin: '8px 0'
    }
  }), /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('fullReset')
  }, "\u26A0\uFE0F Full Clean-Slate Reset"));
  if (panel === 'valid') return /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('validator')
  }, "Run validatePirandelloVectors.js"));
  if (panel === 'tools') return /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('injectTeaching')
  }, "Inject teaching event"), /*#__PURE__*/React.createElement(MockBtn, {
    onClick: () => run('exportCult')
  }, "Export Cult run"));
  if (panel === 'visualiser') return /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--lab-text-mute)',
      fontFamily: 'var(--font-mono)'
    }
  }, "Real-time PAD-space observation instrument. Requires the Vite dev server (:5173)."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 320,
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-sm)',
      background: '#080c12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 10,
      color: 'var(--lab-text-mute)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      opacity: .4
    }
  }, "\uD83D\uDC41\uFE0F"), /*#__PURE__*/React.createElement(PADScatter, null)));
  return null;
}
function Col({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, children);
}

/* a tiny faux PAD-space scatter so the visualiser reads as a real instrument */
function PADScatter() {
  const dots = React.useMemo(() => Array.from({
    length: 28
  }, (_, i) => {
    const v = Math.sin(i * 1.7) * 0.5 + 0.5;
    const a = Math.cos(i * 2.3) * 0.5 + 0.5;
    const hue = v > .55 ? 'var(--valence-pos)' : v < .4 ? 'var(--valence-neg)' : 'var(--valence-neu)';
    return {
      x: 8 + v * 84,
      y: 8 + a * 78,
      c: hue,
      s: 5 + i % 3 * 2
    };
  }), []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '70%',
      height: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      border: '1px solid var(--lab-line)',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: 1,
      background: 'var(--lab-line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: 1,
      background: 'var(--lab-line)'
    }
  }), dots.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      left: d.x + '%',
      top: d.y + '%',
      width: d.s,
      height: d.s,
      borderRadius: '50%',
      background: d.c,
      transform: 'translate(-50%,-50%)',
      boxShadow: `0 0 6px ${d.c}`
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -16,
      left: 0,
      fontSize: 9
    }
  }, "pleasure\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -16,
      right: 0,
      fontSize: 9
    }
  }, "pleasure+"));
}

/* ---------- the bottom sheet ---------- */
function Sheet({
  panel,
  closing,
  onClose,
  run,
  onPickEngine,
  onPickChar
}) {
  const [explainOpen, setExplainOpen] = useState(false);
  const [level, setLevel] = useState(null);
  useEffect(() => {
    setExplainOpen(false);
    setLevel(null);
  }, [panel]);
  if (!panel) return null;
  const eli5 = panel === 'db' ? DB_ELI5 : null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--lab-panel)',
      width: '100%',
      height: '85vh',
      borderRadius: '24px 24px 0 0',
      borderTop: '1px solid var(--lab-line-2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: closing ? 'mtbDown .3s cubic-bezier(.5,0,.75,0) forwards' : 'mtbUp .36s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      background: 'var(--lab-line-2)',
      borderRadius: 2,
      margin: '12px auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 28,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      cursor: 'pointer',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--phosphor)',
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, PANEL_TITLES[panel]), eli5 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setExplainOpen(o => !o),
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'var(--lab-hover)',
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-sm)',
      padding: '3px 9px',
      fontSize: 16,
      cursor: 'pointer'
    }
  }, "\uD83E\uDD21")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      padding: '8px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement(PanelBody, {
    panel: panel,
    run: run,
    onPickEngine: onPickEngine,
    onPickChar: onPickChar
  })), eli5 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--lab-panel)',
      overflowY: 'auto',
      padding: '16px 20px 24px',
      transform: explainOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform .36s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 16
    }
  }, ['academic', 'gaming', 'layperson'].map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => setLevel(l),
    style: {
      flex: 1,
      background: level === l ? 'var(--phosphor-glow)' : 'var(--lab-hover)',
      border: `1px solid ${level === l ? 'var(--phosphor)' : 'var(--lab-line)'}`,
      borderRadius: 'var(--r-sm)',
      padding: '12px 6px',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'var(--font-ui)',
      color: level === l ? 'var(--phosphor)' : 'var(--lab-text-2)',
      cursor: 'pointer',
      textTransform: 'capitalize'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.65,
      color: 'var(--lab-text)'
    }
  }, level ? eli5[level] : 'Tap a level above to see this explained.')))));
}

/* ---------- root ---------- */
function EngineLaboratory() {
  const {
    panel,
    closing,
    open,
    close
  } = useSheet();
  const [lines, setLines] = useState([{
    text: '> Dashboard ready.',
    tone: 'out'
  }]);
  const [status, setStatus] = useState('idle');
  const [toast, setToast] = useState(null);
  const [cmd, setCmd] = useState('');
  const [detail, setDetail] = useState(null);
  const [charDetail, setCharDetail] = useState(null);
  const toastTimer = useRef(null);
  const append = useCallback((text, tone = 'out') => setLines(ls => [...ls, {
    text,
    tone
  }]), []);
  const showToast = useCallback((message, state) => {
    setToast({
      message,
      state
    });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (state !== 'running') toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  const run = useCallback(action => {
    const acts = {
      runUnitTests: () => {
        append('⚙️ Executing: runUnitTests');
        append('Job started: 4f2a');
        setStatus('running: 4f2a');
        showToast('Running unit tests', 'running');
        setTimeout(() => {
          append('✓ 284/284 assertions passed', 'ok');
          append('Job 4f2a finished: completed');
          setStatus('idle');
          showToast('Unit tests complete', 'success');
        }, 1600);
      },
      runSmoke: () => {
        append('⚙️ Smoke test: 5000 ticks, adversarial');
        setStatus('running: smoke');
        showToast('Running smoke test', 'running');
        setTimeout(() => {
          append('✓ 5000 ticks · 0 invariant breaks', 'ok');
          setStatus('idle');
          showToast('Smoke test complete', 'success');
        }, 1800);
      },
      runGossamer: () => {
        append('🧪 Running Gossamer suite (Q1–Q7)');
        setTimeout(() => append('✓ All Q1–Q7 passed: UPDATE observed', 'ok'), 600);
      },
      abort: () => append('Abort current job', 'warn'),
      showConfig: () => append('config: restoring_force=0.01, MIN_THRESHOLD=0.3 (read-only)'),
      resetPAD: () => append('♻️ Reset all 50 characters PAD to OCEAN baseline'),
      updateCandidates: () => append('👥 Batch created: 5 UPDATE candidates'),
      dryRun: () => append('Dry-run: would delete 1,284 rows from reconciliation_log.'),
      clearConfirm: () => {
        append('✓ reconciliation_log cleared', 'ok');
        showToast('Log cleared', 'success');
      },
      fullReset: () => {
        append('⚠️ Executing full clean-slate reset…', 'warn');
        setStatus('running: reset');
        showToast('Running database reset', 'running');
        setTimeout(() => {
          append('✓ 21 tables truncated · 50 characters → genesis · sequences reset', 'ok');
          setStatus('idle');
          showToast('Database reset complete', 'success');
        }, 1800);
      },
      validator: () => append('Running validatePirandelloVectors.js … all pass', 'ok'),
      injectTeaching: () => append('Teaching event injected'),
      exportCult: () => append('Export Cult run → cult_run_4f2a.json')
    };
    (acts[action] || (() => append('Unknown action: ' + action, 'warn')))();
  }, [append, showToast]);
  const onPickEngine = useCallback(e => {
    setDetail(e);
  }, []);
  const onPickChar = useCallback(id => {
    setCharDetail(id);
    close();
  }, [close]);
  const sendCmd = useCallback(() => {
    const c = cmd.trim();
    if (!c) return;
    append(`💬 you: ${c}`, 'you');
    const l = c.toLowerCase();
    if (l.includes('run unit tests')) run('runUnitTests');else if (l.includes('clear reconciliation')) run('clearConfirm');else if (l.includes('smoke')) run('runSmoke');else if (l.includes('reset')) run('fullReset');else append('❓ Unknown command. Try "run unit tests", "run smoke", "clear reconciliation log".', 'warn');
    setCmd('');
  }, [cmd, append, run]);
  return /*#__PURE__*/React.createElement("div", {
    className: "mtb-lab",
    style: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes mtbUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes mtbDown{from{transform:translateY(0)}to{transform:translateY(100%)}}
      `), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: '12px 16px 4px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pop)',
      fontSize: 14,
      letterSpacing: '.06em',
      color: 'var(--phosphor)'
    }
  }, "Mutaibutsu \u7121\u4F53\u7269"), /*#__PURE__*/React.createElement(MonoLabel, {
    style: {
      fontSize: 9
    }
  }, "Observe \xB7 Tune \xB7 Hold \xB7 Return")), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: '8px 16px 12px',
      borderBottom: '1px solid var(--lab-line)',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8
    }
  }, TOOLBAR.map(t => /*#__PURE__*/React.createElement(Button, {
    key: t.id,
    world: "lab",
    variant: panel === t.id ? 'primary' : 'secondary',
    size: "sm",
    icon: t.icon,
    onClick: () => open(t.id)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "realm wellness (RWI)",
    value: "0.34",
    sub: "obs_run_summaries"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "political stress (PSI)",
    value: "0.08",
    sub: "suppressed 50% \xB7 ff_stub",
    tone: "dayoff"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "population",
    value: "100",
    sub: "50 origin \xB7 50 FE-v2",
    tone: "travel"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "myth fragments held",
    value: "12",
    sub: "character_myths"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Yurei mode",
    value: "WITHDRAWN",
    sub: "hunger 20,000",
    tone: "error"
  })), charDetail && (window.MTB_CHARACTERS || {})[charDetail] && /*#__PURE__*/React.createElement(CharacterInspector, {
    character: window.MTB_CHARACTERS[charDetail],
    avatarSrc: `../../assets/broll/${window.MTB_CHARACTERS[charDetail].profile.avatar}.png`,
    onClose: () => setCharDetail(null)
  }), /*#__PURE__*/React.createElement(Terminal, {
    status: status,
    lines: lines,
    maxHeight: 300
  }), detail && /*#__PURE__*/React.createElement(EngineDetail, {
    engine: detail,
    onClose: () => setDetail(null),
    onRun: () => {
      run('runSmoke');
      setDetail(null);
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      borderTop: '1px solid var(--lab-line)',
      padding: '12px 16px',
      display: 'flex',
      gap: 8,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: cmd,
    onChange: e => setCmd(e.target.value),
    rows: 1,
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCmd();
      }
    },
    placeholder: "Type a command: run unit tests, clear reconciliation log, show db status\u2026",
    style: {
      flex: 1,
      background: 'var(--lab-panel)',
      border: '1px solid var(--lab-line)',
      borderRadius: 24,
      padding: '10px 16px',
      fontSize: 14,
      color: 'var(--lab-text)',
      fontFamily: 'var(--font-ui)',
      resize: 'none',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    world: "lab",
    variant: "primary",
    onClick: sendCmd,
    style: {
      borderRadius: 40
    }
  }, "Send")), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    show: true,
    state: toast.state,
    message: toast.message
  })), /*#__PURE__*/React.createElement(Sheet, {
    panel: panel,
    closing: closing,
    onClose: close,
    run: run,
    onPickEngine: onPickEngine,
    onPickChar: onPickChar
  }));
}

/* added feature: engine detail card */
function EngineDetail({
  engine,
  onClose,
  onRun
}) {
  const eli5 = window.MTB_ELI5[engine.name];
  const [level, setLevel] = useState('gaming');
  const badgeTone = {
    wired: 'show',
    built: 'dayoff',
    designed: 'travel',
    stub: 'neutral',
    concept: 'neutral',
    orphan: 'error'
  }[engine.status] || 'neutral';
  const roleColor = {
    ACT: 'var(--lab-show)',
    PER: 'var(--lab-travel)',
    NAR: 'var(--lab-dayoff)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--lab-panel)',
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-md)',
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: engine.status,
    pulse: engine.status === 'wired'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pop)',
      fontSize: 18,
      color: 'var(--lab-text)'
    }
  }, engine.idx != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lab-text-mute)',
      fontFamily: 'var(--font-mono)'
    }
  }, "#", engine.idx, " "), "The ", engine.name, " Engine ", engine.kanji && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--phosphor)'
    }
  }, engine.kanji)), engine.role && /*#__PURE__*/React.createElement("span", {
    title: window.MTB_ROLES[engine.role],
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: roleColor[engine.role] || 'var(--lab-text-mute)',
      border: `1px solid ${roleColor[engine.role] || 'var(--lab-line)'}`,
      borderRadius: 3,
      padding: '1px 5px'
    }
  }, engine.role), /*#__PURE__*/React.createElement(Badge, {
    world: "lab",
    tone: badgeTone,
    style: {
      marginLeft: 'auto'
    }
  }, engine.status), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--lab-text-mute)',
      fontSize: 18,
      cursor: 'pointer'
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--lab-text-2)',
      fontSize: 14,
      marginBottom: 12
    }
  }, engine.desc), engine.note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      lineHeight: 1.55,
      color: 'var(--lab-text-mute)',
      background: 'var(--lab-bg)',
      border: '1px solid var(--lab-line)',
      borderRadius: 'var(--r-sm)',
      padding: '8px 10px',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--phosphor-dim)'
    }
  }, "internals \xB7 "), engine.note), eli5 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    }
  }, ['academic', 'gaming', 'layperson'].map(l => /*#__PURE__*/React.createElement(Button, {
    key: l,
    world: "lab",
    size: "sm",
    variant: level === l ? 'primary' : 'secondary',
    onClick: () => setLevel(l),
    style: {
      textTransform: 'capitalize',
      flex: 1,
      justifyContent: 'center'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.65,
      color: 'var(--lab-text)'
    }
  }, eli5[level])) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--lab-text-mute)',
      fontFamily: 'var(--font-mono)'
    }
  }, "No ELI5 written yet for this engine."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    world: "lab",
    variant: "primary",
    icon: "\uD83C\uDF2B\uFE0F",
    onClick: onRun,
    disabled: engine.status !== 'wired'
  }, "Run in smoke test"), /*#__PURE__*/React.createElement(Button, {
    world: "lab",
    variant: "ghost",
    size: "md",
    onClick: onClose
  }, "Close")));
}
window.EngineLaboratory = EngineLaboratory;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/engine-laboratory/EngineLaboratory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/engine-laboratory/characterData.js
try { (() => {
// Character records shaped like GET /api/realm/character/:id (Artefact ②).
// Jack Bateman (#700005) uses the EXACT values from the artefact example.
// The other 17 are real-SHAPED but synthesised (no live server in the kit).
(function () {
  var ROSTER = [['#700005', 'Jack Bateman', 'pill'], ['#70000F', 'Larry Greims', 'cube'], ['#70001A', 'Pete Runs', 'cassette'], ['#70002A', 'Jake Rennick', 'boombox'], ['#70002B', 'Bernie Carteez', 'dialphone'], ['#70002C', 'Johnny Crackow', 'lighter'], ['#70002D', 'Billy Quayle', 'inhaler'], ['#70002E', 'Lem Wells', 'desktop'], ['#70002F', 'Rodney Gillen', 'colours'], ['#700030', 'Edsel Farkus', 'lipstick'], ['#700031', 'Abe Polonski', 'phone'], ['#700032', 'Steve Tregaskis', 'pager'], ['#700033', 'Guy Prince', 'letters'], ['#700034', 'Chopper Miller', 'matches'], ['#700035', 'Nick Rowland', 'eightball'], ['#700050', 'Dino Dynamite', 'fizz'], ['#700051', 'Nelly Nose', 'ramen'], ['#700052', 'Sanchez Swan', 'vendingmachine']];
  var JON = [['red', '#D93636'], ['orange', '#E8842A'], ['yellow', '#F5C542'], ['green', '#3A9E5C'], ['turquoise', '#2AADAD'], ['blue', '#2E6EB5'], ['purple', '#7A3EAD'], ['pink', '#E88BA7'], ['brown', '#7A5230'], ['white', '#FFFFFF'], ['grey', '#808080'], ['black', '#000000']];
  var STAGES = ['pre_verbal', 'pre_verbal', 'holophrastic', 'two_word'];
  var ACTS = ['FIGHT', 'COMPOSITE', 'FLEE', 'COMFORT', 'ASK', 'HELP', 'GIVE', 'INSULT', 'STEAL'];
  var PHASES = ['adaptation', 'alarm', 'resistance', 'exhaustion'];
  var SAL_POOL = ['gossip', 'threat', 'bond', 'novelty', 'conflict', 'colour'];
  var TRENDS = ['rising', 'stable', 'falling'];
  var EMO = ['neutral', 'sadness', 'anger', 'joy', 'fear', 'disgust'];
  var CC_STATUS = ['planning', 'active', 'resilience_blocked'];
  var SELF_FACTS = [['name', 'Your name is {name}'], ['colour', 'You wear {colour}'], ['friend', 'You have made a friend'], ['fear', 'Something watches from the sky']];

  // deterministic pseudo-random from a string seed (so records are stable)
  function seed(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
    return h;
  }
  function rng(n) {
    return function () {
      n = n * 1103515245 + 12345 & 0x7fffffff;
      return n / 0x7fffffff;
    };
  }
  var DB = {};
  ROSTER.forEach(function (r, idx) {
    var id = r[0],
      name = r[1],
      avatar = r[2];
    var rand = rng(seed(id));
    var p = rand() * 2 - 1,
      a = rand() * 2 - 1,
      d = rand() * 2 - 1;
    var jon = JON[Math.floor(rand() * JON.length)];
    DB[id] = {
      id: id,
      profile: {
        name: name,
        avatar: avatar,
        developmental_stage: STAGES[Math.floor(rand() * STAGES.length)]
      },
      personality: {
        openness: Math.round(rand() * 100),
        conscientiousness: Math.round(rand() * 100),
        extraversion: Math.round(rand() * 100),
        agreeableness: Math.round(rand() * 100),
        neuroticism: Math.round(rand() * 100),
        source_monitoring: +(rand() * 0.25).toFixed(4),
        working_memory_capacity: 5 + Math.floor(rand() * 4)
      },
      mood: {
        p: p.toFixed(3),
        a: a.toFixed(3),
        d: d.toFixed(3),
        sample_count: 10 + Math.floor(rand() * 40)
      },
      colour: {
        selected_colour: jon[0],
        selected_hex: jon[1],
        pad_p: p.toFixed(3),
        pad_a: a.toFixed(3),
        pad_d: d.toFixed(3),
        tick: 100 + Math.floor(rand() * 100)
      },
      yurei: {
        mode: 'WITHDRAWN',
        hunger: 20000,
        tick: 1
      },
      pirandello: {
        theirViewOfOthers: Array(Math.floor(rand() * 6)).fill(0),
        othersViewOfThem: Array(Math.floor(rand() * 6)).fill(0)
      },
      conflicts: Array(Math.floor(rand() * 3)).fill(0),
      karma: {
        asActor: Math.floor(rand() * 12),
        asTarget: Math.floor(rand() * 12)
      },
      creepyCrawly: function () {
        function camp(idK, nmK) {
          var w = ROSTER[Math.floor(rand() * ROSTER.length)],
            o = {
              campaign_type: 'reputation',
              status: CC_STATUS[Math.floor(rand() * CC_STATUS.length)],
              raw_potency: rand().toFixed(4),
              campaign_potency: rand().toFixed(4),
              impact_debility: (rand() * 0.5).toFixed(4),
              impact_dependency: (rand() * 0.5).toFixed(4),
              impact_dread: (rand() * 0.5).toFixed(4),
              tick: 90 + Math.floor(rand() * 60)
            };
          o[idK] = w[0];
          o[nmK] = w[1];
          return o;
        }
        var ap = [],
          av = [],
          np = Math.floor(rand() * 2),
          nv = Math.floor(rand() * 2);
        for (var i = 0; i < np; i++) ap.push(camp('target_id', 'target_name'));
        for (var j = 0; j < nv; j++) av.push(camp('perpetrator_id', 'perpetrator_name'));
        return {
          asPerpetrator: ap,
          asVictim: av
        };
      }(),
      knowledgeSummary: {
        total: Math.floor(rand() * 12),
        mastered: 0,
        avg_retrievability: +(0.8 + rand() * 0.2).toFixed(2)
      },
      myths: Array(Math.floor(rand() * 4)).fill(0),
      // expansion sections — REAL endpoint shapes (Artefact ②). PG NUMERIC arrives as
      // strings; counts as numbers. Synthetic chars populate every section so the kit
      // preview exercises them; Jack Bateman (#700005) uses exact API values below.
      narrativeActions: ACTS.map(function (t) {
        return {
          action_type: t,
          count: Math.floor(rand() * 6)
        };
      }).filter(function (x) {
        return x.count > 0;
      }).sort(function (a, b) {
        return b.count - a.count;
      }),
      allostatic: {
        reserve: rand().toFixed(3),
        adaptive_capacity: (0.3 + rand() * 0.7).toFixed(3),
        load: rand().toFixed(3),
        phase: PHASES[Math.floor(rand() * PHASES.length)]
      },
      salience: {
        buffer: function () {
          var out = [],
            n = Math.floor(rand() * 4);
          for (var i = 0; i < n; i++) out.push({
            what: SAL_POOL[Math.floor(rand() * SAL_POOL.length)],
            weight: rand().toFixed(2)
          });
          return out;
        }()
      },
      passion: function () {
        var ho = rand() * 0.6,
          ob = rand() * 0.6;
        return {
          harmonious_passion: ho.toFixed(3),
          obsessive_passion: ob.toFixed(3),
          passion_ratio: (ho / Math.max(0.01, ho + ob)).toFixed(3),
          trend_direction: TRENDS[Math.floor(rand() * TRENDS.length)],
          source_domains: {}
        };
      }(),
      faceReads: function () {
        var out = [],
          n = Math.floor(rand() * 3);
        for (var i = 0; i < n; i++) {
          var o = ROSTER[Math.floor(rand() * ROSTER.length)];
          out.push({
            observer_id: o[0],
            observer_name: o[1],
            tick: 40 + Math.floor(rand() * 120),
            true_emotion: EMO[Math.floor(rand() * EMO.length)],
            displayed_emotion: 'neutral',
            perceived_emotion: EMO[Math.floor(rand() * EMO.length)]
          });
        }
        return out;
      }(),
      selfKnowledge: function () {
        var out = [],
          n = 1 + Math.floor(rand() * 3);
        for (var i = 0; i < n && i < SELF_FACTS.length; i++) out.push({
          fact_key: SELF_FACTS[i][0],
          fact_text: SELF_FACTS[i][1].replace('{name}', name).replace('{colour}', jon[0]),
          taught_at_tick: 100 + Math.floor(rand() * 80)
        });
        return out;
      }()
    };
  });

  // EXACT artefact values for Jack Bateman (#700005)
  DB['#700005'].profile.developmental_stage = 'pre_verbal';
  DB['#700005'].personality = {
    openness: 35,
    conscientiousness: 20,
    extraversion: 85,
    agreeableness: 59,
    neuroticism: 100,
    source_monitoring: 0.0408,
    pad_baseline_p: -0.98,
    pad_baseline_a: 1.0,
    pad_baseline_d: -0.74,
    working_memory_capacity: 7
  };
  DB['#700005'].mood = {
    p: '0.202',
    a: '0.999',
    d: '0.497',
    sample_count: 26
  };
  DB['#700005'].colour = {
    selected_colour: 'turquoise',
    selected_hex: '#2AADAD',
    pad_p: '0.202',
    pad_a: '0.999',
    pad_d: '0.497',
    tick: 145
  };
  DB['#700005'].knowledgeSummary = {
    total: 9,
    mastered: 0,
    forgotten: 0,
    unseen: 0,
    avg_retrievability: 0.92
  };
  // Jack Bateman — EXACT values from GET /api/realm/character/%23700005.
  DB['#700005'].narrativeActions = [{
    action_type: 'FIGHT',
    count: 6
  }, {
    action_type: 'COMPOSITE',
    count: 5
  }, {
    action_type: 'FLEE',
    count: 5
  }, {
    action_type: 'COMFORT',
    count: 4
  }, {
    action_type: 'ASK',
    count: 4
  }, {
    action_type: 'HELP',
    count: 4
  }, {
    action_type: 'GIVE',
    count: 3
  }, {
    action_type: 'INSULT',
    count: 1
  }, {
    action_type: 'STEAL',
    count: 1
  }];
  DB['#700005'].allostatic = null; // null for Jack in this run
  DB['#700005'].salience = null; // null for Jack in this run
  DB['#700005'].passion = {
    harmonious_passion: '0.251',
    obsessive_passion: '0.364',
    passion_ratio: '0.408',
    trend_direction: 'stable',
    source_domains: {}
  };
  // faceReads were truncated in the pull — these are illustrative but correctly shaped.
  DB['#700005'].faceReads = [{
    observer_id: '#70002B',
    observer_name: 'Bernie Carteez',
    tick: 45,
    true_emotion: 'sadness',
    displayed_emotion: 'neutral',
    perceived_emotion: 'anger'
  }, {
    observer_id: '#70002A',
    observer_name: 'Jake Rennick',
    tick: 88,
    true_emotion: 'fear',
    displayed_emotion: 'neutral',
    perceived_emotion: 'anger'
  }];
  DB['#700005'].selfKnowledge = [{
    fact_key: 'name',
    fact_text: 'Your name is Jack Bateman',
    taught_at_tick: 139
  }];
  DB['#700005'].creepyCrawly = {
    asPerpetrator: [{
      target_id: '#700038',
      target_name: 'Carlos Perro',
      campaign_type: 'reputation',
      status: 'resilience_blocked',
      raw_potency: '0.0000',
      campaign_potency: '0.0000',
      impact_debility: '0.0000',
      impact_dependency: '0.0000',
      impact_dread: '0.0000',
      tick: 103
    }],
    asVictim: []
  };
  window.MTB_CHARACTERS = DB;
  window.MTB_ROSTER = ROSTER;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/engine-laboratory/characterData.js", error: String((e && e.message) || e) }); }

// ui_kits/engine-laboratory/engineData.js
try { (() => {
// Mutaibutsu — engine roster. GROUND TRUTH from Artefact ① (Engine Status
// Registry, 24 Jun 2026). Status: wired|built|designed|stub|concept|orphan.
// Role (EarWig): ACT | PER | NAR. EarWig itself is infrastructure, not an engine.
// `note` carries verified internals surfaced in the engine-detail card.
window.MTB_ENGINES = [{
  group: '1 · Character Genesis',
  items: [{
    idx: 1,
    name: 'Fracture',
    role: 'PER',
    status: 'wired',
    desc: 'Separation trauma / OCEAN genesis',
    note: 'FractureEngine_v2.js — thin wrapper assessor but runs at character birth. Bonanno recovery trajectories.'
  }, {
    idx: 2,
    name: 'Chaos',
    role: 'NAR',
    status: 'stub',
    desc: 'Death, rebirth, karma banking, seeding'
  }, {
    idx: 3,
    name: 'Kechimyaku',
    kanji: '血脈',
    role: 'NAR',
    status: 'stub',
    desc: 'Lineage, bloodlines, kinship'
  }]
}, {
  group: '2 · Individual Cognition & Development',
  items: [{
    idx: 4,
    name: 'Bicameral',
    role: 'ACT',
    status: 'wired',
    desc: 'Gossip, Bartlett, source monitoring',
    note: 'Core of the tick loop (76-line assessor). Lives under bicameralEngine/, not engines/. Reconciliation + serial reproduction.'
  }, {
    idx: 5,
    name: 'TSE',
    role: 'PER',
    status: 'stub',
    desc: 'FSRS teaching / belt progression',
    note: 'Assessor returns not_implemented, BUT UnifiedTeachingEngine.js (943 lines) runs live via seedTanukiTeaching(). FSRS core + constants ARE imported by the live pipeline. Formal TSE loop (~4,000 lines) unwired.'
  }, {
    idx: 6,
    name: 'Interoception',
    role: 'PER',
    status: 'wired',
    desc: 'Allostatic load / adaptive capacity',
    note: 'Verified in runs D300F5/F6/F8. 37/50 chars reached resistance phase in a 10K-tick stress run.'
  }, {
    idx: 7,
    name: 'Kizuki',
    kanji: '気づき',
    role: 'PER',
    status: 'wired',
    desc: 'Salience network / noticing',
    note: 'Wired ~2026-06-15. Gossamer improved 4.5→6.5/14. Tests 7,8,10 still failing (weight-factor bias).'
  }, {
    idx: 8,
    name: 'Ockham',
    role: 'PER',
    status: 'stub',
    desc: 'Parsimony / Gigerenzer toolbox'
  }, {
    idx: 9,
    name: 'Dōtoku',
    kanji: '道徳',
    role: 'PER',
    status: 'wired',
    desc: 'Moral barometer',
    note: '26/26 smoke tests. obs_moral_assessments: 21,276 rows verified.'
  }, {
    idx: 10,
    name: 'Hansei',
    kanji: '反省',
    role: 'PER',
    status: 'stub',
    desc: 'Self-reflection, dream processing'
  }, {
    idx: 11,
    name: 'Yomi',
    kanji: '読み',
    role: 'PER',
    status: 'stub',
    desc: 'Theory of mind, recursive mentalising'
  }]
}, {
  group: '3 · Social Dynamics',
  items: [{
    idx: 12,
    name: 'Conflict',
    role: 'ACT',
    status: 'wired',
    desc: 'Jehn typology, grudge tracking'
  }, {
    idx: 13,
    name: 'Pirandello',
    role: 'PER',
    status: 'wired',
    desc: 'Directed asymmetric perception edges',
    note: '2,450 edges live. Beta priors, OCEAN-modulated decay. Legacy run_id=\'LEGACY\' bug found and fixed.'
  }, {
    idx: 14,
    name: 'Giri',
    kanji: '義理',
    role: 'ACT',
    status: 'stub',
    desc: 'Duty / obligation (Bandura, Bem)'
  }, {
    idx: 15,
    name: 'Cult',
    role: 'ACT',
    status: 'stub',
    desc: 'Bounded choice, identity fusion'
  }, {
    idx: 16,
    name: 'Omiyage',
    kanji: 'お土産',
    role: 'NAR',
    status: 'stub',
    desc: 'Gift giving, generosity as observation'
  }, {
    idx: 17,
    name: 'Art of War',
    role: 'PER',
    status: 'stub',
    desc: 'GOAP planning, coalitions, secrecy',
    note: 'Registered as PERCEPTION, not ACTION.'
  }]
}, {
  group: '4 · Witness Response',
  items: [{
    idx: 18,
    name: 'Shogen',
    role: 'ACT',
    status: 'wired',
    desc: 'Witness reaction (flee/help/fight/gossip)',
    note: 'NOT in master 53 list — only in EarWig registry.'
  }]
}, {
  group: '5 · Moral & Consequence',
  items: [{
    idx: 19,
    name: 'Sator',
    role: 'PER',
    status: 'wired',
    desc: 'Karma ledger, KFI, Spearman ρ',
    note: '75/75 tests. Dual execution path (EarWig Phase 5 + direct import).'
  }, {
    idx: 20,
    name: 'Ikigai',
    role: 'PER',
    status: 'wired',
    desc: 'SDT contentment → character_sdt_state',
    note: 'Assessor quarantined (T1.1: reads overall_ikigai instead of composite C). 20 defects fixed; D8, D17 blocked.'
  }]
}, {
  group: '6 · Population & Realm',
  items: [{
    idx: 21,
    name: 'Cliodynamics',
    role: 'NAR',
    status: 'wired',
    desc: 'Realm Wellness / PSI (Turchin)',
    note: 'Thin wrapper assessor BUT TurchinCalculator(354)+turchinConfig(378)+validateTurchinVectors(257)=989 lines backend in engines/turchinEngine/. Produces RWI/PSI via CaptureHub.finaliseRun().'
  }, {
    idx: 22,
    name: 'Kome',
    kanji: '米',
    role: 'NAR',
    status: 'stub',
    desc: 'Economy, scarcity, exchange'
  }, {
    idx: 23,
    name: 'Fūdo',
    kanji: '風土',
    role: 'PER',
    status: 'stub',
    desc: 'Climate, geography, place attachment'
  }, {
    idx: 24,
    name: 'Door',
    role: 'ACT',
    status: 'stub',
    desc: 'Moral capability ratchet, locks & keys',
    note: 'Thin wrapper (30 lines). Backend status unverified.'
  }]
}, {
  group: '7 · Expression & Telemetry',
  items: [{
    idx: 25,
    name: 'Valence',
    role: 'NAR',
    status: 'stub',
    desc: 'Musical soundtrack, tone generation',
    note: 'v2 Soundscape Engine (audio/realm-audio.js): deterministic PAD + 15-signal → 13-layer generative score, wired into the Realm Observer (template: Valence · The Singing Realm). obs_run_summaries feed. Ready to promote stub→wired.'
  }, {
    idx: 26,
    name: 'Colour',
    role: 'NAR',
    status: 'wired',
    desc: 'PAD→colour, Jonauskaite 12-palette',
    note: 'obs_colour_selections live. ColourCalculator(101)+ColourTanukiProbe(85)+colourConfig(65) behind the assessor.'
  }, {
    idx: 27,
    name: 'Slang',
    role: 'NAR',
    status: 'stub',
    desc: 'Language drift, dialects, in-group markers'
  }, {
    idx: 28,
    name: 'Sigil',
    role: 'NAR',
    status: 'stub',
    desc: 'Symbol creation, own-myth genesis'
  }, {
    idx: 54,
    name: 'Shigetaka',
    role: null,
    status: 'designed',
    desc: 'Deterministic PAD→geometric emoji glyph',
    note: 'Unregistered. engines/shigetakaEngine/ShigetakaAssessor.js + config/shigetakaConfig.js. Named after Shigetaka Kurita (first 176 emoji, 1999). 12 von Petzinger primitives, stubbed for 32. v0.2 reviewed (30/30 tests). Registry + ChangesetTypes wiring not yet applied.'
  }]
}, {
  group: '8 · Predation',
  items: [{
    idx: 29,
    name: 'Tsujigiri',
    kanji: '辻斬り',
    role: 'ACT',
    status: 'stub',
    desc: 'Crossroads killing, witness avoidance'
  }]
}, {
  group: '9 · Narrative Engines',
  items: [{
    idx: 30,
    name: 'Kisū',
    kanji: '帰趨',
    role: 'NAR',
    status: 'stub',
    desc: 'Fate convergence (read-only tracker)'
  }, {
    idx: 31,
    name: 'Kishōtenketsu',
    kanji: '起承転結',
    role: 'NAR',
    status: 'stub',
    desc: 'Four-part structure, beat selection'
  }]
}, {
  group: '10 · Entity Engines',
  items: [{
    idx: 32,
    name: 'B-Roll Chaos',
    role: 'ACT',
    status: 'stub',
    desc: 'General population controller'
  }, {
    idx: 33,
    name: 'Angry Slice',
    role: 'ACT',
    status: 'stub',
    desc: 'Cult soldiers, photocopy degradation',
    note: 'No simulation path exists (Runner is B-Roll only).'
  }, {
    idx: 34,
    name: 'Mutai',
    role: 'NAR',
    status: 'stub',
    desc: 'Intangible realm entities',
    note: 'Blueprint v0.2 (Yurei) confirms: NOT BUILT.'
  }]
}, {
  group: '11 · Principal Character Engines',
  items: [{
    idx: 35,
    name: 'Yurei',
    role: 'ACT',
    status: 'wired',
    desc: 'Antagonist — The Expanse',
    note: 'v1.1 recode. All five files pass smoke at 150 and 5,000 ticks. Breach/withdraw/hold branches verified. yurei_presence_state table live. Two go-live items open.'
  }, {
    idx: 36,
    name: 'Piza Sukeruton',
    role: 'ACT',
    status: 'stub',
    desc: 'Protagonist, Patient Zero, reverse-PTSD',
    note: 'Yurei Round 2 synthesis confirms: NOT BUILT.'
  }, {
    idx: 37,
    name: 'Claude the Tanuki',
    role: 'NAR',
    status: 'stub',
    desc: 'Guide / narrator / teacher',
    note: 'Teaching runs via UnifiedTeachingEngine.js, not this assessor.'
  }]
}, {
  group: '12 · Psychological Operations',
  items: [{
    idx: 38,
    name: 'CreepyCrawly',
    role: 'ACT',
    status: 'wired',
    desc: 'Campaign planner',
    note: '874 lines. 3 self-test assertion failures unfixed. campaign_state table live (346 rows in 100-tick test).'
  }]
}, {
  group: '13 · Perception & Identity',
  proposed: true,
  items: [{
    idx: 39,
    name: 'RBF',
    role: 'PER',
    status: 'wired',
    desc: 'Resting Bitch Face — facial confusion kernel',
    note: 'Du & Martinez 2011. face_read_state table live (692 rows in 100-tick test). DB table + exhaustive harness deferred.'
  }, {
    idx: 44,
    name: 'Lois',
    role: 'PER',
    status: 'wired',
    desc: 'Face recognition (Bruce & Young)',
    note: 'FRU storage in character_recognition_memory. perceived_id routing not yet implemented (scapegoating cascades not testable).'
  }]
}, {
  group: '14 · Belief & Mythology',
  proposed: true,
  items: [{
    idx: 40,
    name: 'Theogenesis',
    kanji: '神生',
    role: null,
    status: 'wired',
    desc: 'God-genesis detector',
    note: 'Unregistered — runs through a separate pathway. Producing Observatory data.'
  }, {
    idx: 41,
    name: 'Superstition',
    role: null,
    status: 'wired',
    desc: 'Superstition formation',
    note: 'Unregistered. SuperstitionAssessor.js (200 lines). Producing Observatory data.'
  }, {
    idx: 42,
    name: 'Divination',
    role: null,
    status: 'built',
    desc: 'Divination practices',
    note: 'DivinationAssessor.js(281)+smoke(203). Two research briefs + adversarial dialogue brief done. Not wired.'
  }]
}, {
  group: '15 · Candidate Engines',
  proposed: true,
  items: [{
    idx: 43,
    name: 'Conundrum',
    role: null,
    status: 'concept',
    desc: 'Design phase'
  }, {
    idx: 45,
    name: 'Sōkoku',
    kanji: '相克',
    role: null,
    status: 'concept',
    desc: 'Blueprint v0.1 (blocked)'
  }, {
    idx: 46,
    name: 'Hakone',
    role: null,
    status: 'concept',
    desc: 'Puzzles (blueprint exists)'
  }, {
    idx: 47,
    name: 'Non-Verbal Communication',
    role: null,
    status: 'concept',
    desc: 'Knapp taxonomy, proxemics, chameleon effect'
  }, {
    idx: 48,
    name: 'Memory Distortion',
    role: null,
    status: 'concept',
    desc: 'DRM / false-memory paradigm'
  }, {
    idx: 49,
    name: 'Ninjō',
    kanji: '人情',
    role: null,
    status: 'concept',
    desc: 'What the heart wants'
  }, {
    idx: 50,
    name: 'Lifecycle',
    role: null,
    status: 'concept',
    desc: 'Erikson psychosocial stages'
  }, {
    idx: 51,
    name: 'Justice / Punishment',
    role: null,
    status: 'concept',
    desc: 'Axelrod metanorms; retributive vs restorative'
  }, {
    idx: 52,
    name: 'Motive Composer',
    role: null,
    status: 'concept',
    desc: 'Why are they asking or doing this?'
  }, {
    idx: 53,
    name: 'Emotional Regulation',
    role: null,
    status: 'concept',
    desc: 'Gross process model'
  }, {
    idx: 55,
    name: 'Addiction / Compulsion',
    role: null,
    status: 'concept',
    desc: 'Model-free / model-based RL transition'
  }]
}];

// Status legend (Artefact ① taxonomy)
window.MTB_STATUS_LEGEND = [{
  key: 'wired',
  glyph: '🟢',
  label: 'WIRED',
  desc: 'in production tick loop'
}, {
  key: 'built',
  glyph: '🟡',
  label: 'BUILT',
  desc: 'passes tests, not wired'
}, {
  key: 'designed',
  glyph: '🔵',
  label: 'DESIGNED',
  desc: 'blueprint approved'
}, {
  key: 'stub',
  glyph: '◐',
  label: 'STUB',
  desc: 'returns not_implemented'
}, {
  key: 'concept',
  glyph: '⚪',
  label: 'CONCEPT',
  desc: 'no code'
}, {
  key: 'orphan',
  glyph: '✕',
  label: 'ORPHAN',
  desc: 'code, no live path'
}];

// EarWig role definitions
window.MTB_ROLES = {
  ACT: 'ACTION — exports assess()/review()/receiveOutcome(); competes in Phase 1 action selection.',
  PER: 'PERCEPTION — receiveOutcome() only; passive belief updater in Phase 5 broadcast.',
  NAR: 'NARRATIVE — receiveOutcome() only; story scheduler / telemetry producer in Phase 5.'
};

// ELI5 three-tier explanations (Academic → Gaming → Layperson)
window.MTB_ELI5 = {
  'Bicameral': {
    academic: "Models self-awareness emergence and language spread via Julian Jaynes' bicameral mind theory. Pre-conscious NPCs hear an inner voice and obey; as source monitoring develops they learn to question it. Stories mutate through Bartlett's Serial Reproduction Paradigm, with four reconciliation strategies (reject, update, hold_both, syncretic) handling contradictory information.",
    gaming: "Characters start out hearing voices in their head and just doing what they're told. As they grow up they start asking 'wait, who said that?' — and they gossip, mishear, and retell stories so the lore drifts over time. They can invent their own myths.",
    layperson: "Picture someone who, at first, can't tell their own thoughts from an outside command — so they just obey. Slowly they wake up to the fact that the voice is their own. Along the way the stories they tell each other change in the retelling, like a game of telephone."
  },
  'Sator': {
    academic: "An objective action ledger recording only witnessed actions (if nobody saw it, it didn't happen), computing whether consequences return to originators. The Karma Functional Index measures whether a realm correctly links actions to consequences, feeding institutional-health signal to Cliodynamics.",
    gaming: "The game's truth-keeper. It writes down what characters actually did — but only if someone saw it — and tracks whether what goes around comes around. If bad guys get admired and good guys get punished, this engine notices.",
    layperson: "A ledger of what really happened, and whether people got their just deserts. It quietly measures whether the world is fair."
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/engine-laboratory/engineData.js", error: String((e && e.message) || e) }); }

// ui_kits/realm-observer/realmSim.js
try { (() => {
// Realm Observer — self-contained port of realm.html (no API; faked event stream).
//
// ⚠ DETERMINISM DEPARTURE (demo only): this standalone port uses Math.random()
// for character placement, the faked event stream, and idle motion. The real
// Mutaibutsu engines are FULLY DETERMINISTIC — no Math.random() anywhere; every
// control value is a pure function of (run data, tick). This file fakes a live
// run for preview purposes only; do not mistake its randomness for engine
// behaviour. Wire to the real /api/observatory feed for true deterministic state.
(function () {
  'use strict';

  var scene = document.getElementById('scene');
  var charLayer = document.getElementById('charLayer');
  var bubbleLayer = document.getElementById('bubbleLayer');
  var viewport = document.getElementById('viewport');
  // No-op if loaded outside its own page (e.g. evaluated by a bundler).
  if (!scene || !charLayer || !bubbleLayer || !viewport) return;
  var chars = {},
    bubbles = [];
  var panX = 0,
    panY = 0,
    zoom = 1;
  var isPanning = false,
    panStartX = 0,
    panStartY = 0,
    panBaseX = 0,
    panBaseY = 0;

  // The cast — the 29 B-Roll characters WITH avatars (Artefact ⑥ ground truth:
  // character_profiles, category 'B-Roll Chaos'). [avatar, name, id].
  var CAST = [['pill', 'Jack Bateman', '#700005'], ['cube', 'Larry Greims', '#70000F'], ['cassette', 'Pete Runs', '#70001A'], ['boombox', 'Jake Rennick', '#70002A'], ['dialphone', 'Bernie Carteez', '#70002B'], ['lighter', 'Johnny Crackow', '#70002C'], ['inhaler', 'Billy Quayle', '#70002D'], ['desktop', 'Lem Wells', '#70002E'], ['colours', 'Rodney Gillen', '#70002F'], ['lipstick', 'Edsel Farkus', '#700030'], ['phone', 'Abe Polonski', '#700031'], ['pager', 'Steve Tregaskis', '#700032'], ['letters', 'Guy Prince', '#700033'], ['matches', 'Chopper Miller', '#700034'], ['eightball', 'Nick Rowland', '#700035'], ['fizz', 'Dino Dynamite', '#700050'], ['ramen', 'Nelly Nose', '#700051'], ['vendingmachine', 'Sanchez Swan', '#700052'],
  // +11 new arrivals — fills the 6 named placeholders, then 5 fresh faces.
  ['d20', 'Ravetti Hearts', '#700053'], ['ouija', 'Ronald Shadow', '#700054'], ['jerrycan', 'Terrance Machine', '#700055'], ['condom', 'Mr. Smith', '#700056'], ['fries', 'Clem Hunger', '#700057'], ['telescope', 'Russel Reality', '#700058'], ['sixdie', 'Vinnie Boxcars', '#700059'], ['anchor', 'Barnacle Briggs', '#70005A'], ['compass', 'Trudy North', '#70005B'], ['lantern', 'Wick Hollis', '#70005C'], ['spraycan', 'Rusto Vega', '#70005D']];
  // The Colour Engine's 12 Jonauskaite hexes (Artefact ④) — what a Butsu "wears".
  var JONAUSKAITE = [['red', '#D93636'], ['orange', '#E8842A'], ['yellow', '#F5C542'], ['green', '#3A9E5C'], ['turquoise', '#2AADAD'], ['blue', '#2E6EB5'], ['purple', '#7A3EAD'], ['pink', '#E88BA7'], ['brown', '#7A5230'], ['white', '#FFFFFF'], ['grey', '#808080'], ['black', '#000000']];
  function init() {
    var n = CAST.length;
    CAST.forEach(function (c, i) {
      var pct = 3 + 82 / (n - 1) * i;
      var wrap = document.createElement('div');
      wrap.className = 'broll-wrap';
      wrap.style.left = pct + '%';
      var img = document.createElement('img');
      img.className = 'broll';
      img.src = '../../assets/broll/' + c[0] + '.png';
      img.alt = c[1];
      img.style.animationDuration = (3.0 + i % 5 * 0.15).toFixed(2) + 's';
      img.style.animationDelay = (-(i * 0.37)).toFixed(2) + 's';
      var tip = document.createElement('div');
      tip.className = 'broll-tooltip';
      tip.textContent = c[1];
      wrap.appendChild(tip);
      wrap.appendChild(img);
      charLayer.appendChild(wrap);
      var jon = JONAUSKAITE[i % JONAUSKAITE.length];
      chars[c[0]] = {
        id: c[0],
        cid: c[2],
        wrap: wrap,
        pct: pct,
        vel: 0,
        homePct: pct,
        name: c[1],
        mood: jon[1]
      };
    });
    document.getElementById('hudCount').textContent = n;
    startPhysics();
    initView();
    startEvents();
  }

  // ---- gentle drift physics (warmth attraction / separation) ----
  var SEP = 5,
    SEP_K = 0.10,
    HOME_K = 0.0015,
    DAMP = 0.84;
  function simulate() {
    var ids = Object.keys(chars),
      n = ids.length;
    for (var i = 0; i < n; i++) {
      var a = chars[ids[i]],
        force = 0;
      for (var j = 0; j < n; j++) {
        if (i === j) continue;
        var b = chars[ids[j]];
        var dx = b.pct - a.pct,
          dist = Math.abs(dx) || 0.01,
          dir = dx > 0 ? 1 : -1;
        if (dist < SEP) force -= dir * (SEP - dist) * SEP_K;
        // faint social warmth: same mood pulls together
        if (a.mood === b.mood && dist > SEP) force += dir * 0.012;
      }
      force += (a.homePct - a.pct) * HOME_K;
      a.vel = (a.vel + force) * DAMP;
      a.pct = Math.max(1, Math.min(97, a.pct + a.vel * 0.25));
      a.wrap.style.left = a.pct + '%';
    }
    requestAnimationFrame(simulate);
  }
  function startPhysics() {
    requestAnimationFrame(simulate);
  }

  // ---- event stream → speech bubbles ----
  // Real taxonomy (Artefact ③): show-worthy types only. src=speaker, dst=listener.
  var EMOTIONS = ['joy', 'sorrow', 'anger', 'fear', 'surprise', 'disgust'];
  var ACTIONS = ['helping', 'an alliance', 'a betrayal', 'teaching', 'a theft', 'a debt'];
  var CAMPAIGNS = ['isolation', 'discredit', 'coercion'];
  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }

  // weighted toward the social fabric (the 4 gossip types) like the real realm
  var EVENT_TYPES = ['category', 'category', 'text', 'narrative', 'narrative', 'belief', 'perception_update', 'tension_update', 'colour_selection_update', 'face_read_update', 'identity_recognition', 'campaign_state_update', 'yurei_breach_event'];
  function makeEvent(a, b) {
    var t = pick(EVENT_TYPES);
    switch (t) {
      case 'category':
        return {
          dyad: true,
          txt: Math.random() > 0.5 ? 'shares a warm memory' : 'shares a fearful memory'
        };
      case 'text':
        return {
          dyad: true,
          txt: 'retells it… (degraded)'
        };
      case 'narrative':
        return {
          dyad: true,
          txt: 'talks about ' + pick(ACTIONS)
        };
      case 'belief':
        return {
          dyad: true,
          txt: 'a dark rumour spreads…'
        };
      case 'perception_update':
        return {
          dyad: true,
          txt: 'forms a ' + (Math.random() > 0.5 ? 'warmer' : 'colder') + ' impression'
        };
      case 'tension_update':
        return {
          dyad: true,
          txt: 'tension rising (' + pick(['task', 'relationship', 'process']) + ')'
        };
      case 'colour_selection_update':
        {
          var jon = JONAUSKAITE[Math.floor(Math.random() * JONAUSKAITE.length)];
          a.mood = jon[1]; // the Butsu changes the colour it wears
          return {
            dyad: false,
            txt: 'feels ' + jon[0]
          };
        }
      case 'face_read_update':
        {
          var shown = pick(EMOTIONS),
            perceived = pick(EMOTIONS);
          return {
            dyad: true,
            txt: 'reads ' + perceived + (shown !== perceived ? ' (misread!)' : '')
          };
        }
      case 'identity_recognition':
        return {
          dyad: true,
          txt: pick(['recognises them', 'sees a stranger', 'mistakes their identity'])
        };
      case 'campaign_state_update':
        return {
          dyad: true,
          txt: pick(CAMPAIGNS) + ': ' + pick(['planning', 'active', 'exposed'])
        };
      case 'yurei_breach_event':
        return {
          dyad: false,
          yurei: true,
          txt: 'YUREI ' + pick(['BREACH', 'WITHDRAW', 'HOLD'])
        };
      default:
        return {
          dyad: false,
          txt: '…'
        };
    }
  }
  function startEvents() {
    setInterval(function () {
      var ids = Object.keys(chars);
      var a = chars[pick(ids)];
      var b = chars[pick(ids)];
      while (b === a && ids.length > 1) b = chars[pick(ids)];
      var ev = makeEvent(a, b);
      var who = ev.yurei ? 'Pineaple Yurei' : ev.dyad ? a.name + ' \u2192 ' + b.name : a.name;
      showBubble(a, who, ev.txt, ev.yurei);
    }, 2200);
  }
  function showBubble(speaker, who, txt, isYurei) {
    var el = document.createElement('div');
    el.className = 'bubble';
    var inner = document.createElement('div');
    inner.className = 'bubble-inner';
    if (isYurei) {
      inner.style.background = 'var(--despair-deep)';
      inner.style.color = '#fff';
      inner.style.borderColor = 'var(--despair-deep)';
    }
    var whoEl = document.createElement('div');
    whoEl.className = 'bubble-who';
    whoEl.textContent = who;
    inner.appendChild(whoEl);
    inner.appendChild(document.createTextNode(txt));
    el.appendChild(inner);
    el.style.left = speaker.pct + '%';
    el.style.bottom = 55 + bubbles.length % 5 * 7 + '%';
    bubbleLayer.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add('show');
    });
    var timer = setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () {
        el.remove();
      }, 400);
    }, 4000);
    bubbles.push({
      el: el,
      timer: timer
    });
    while (bubbles.length > 2) {
      var old = bubbles.shift();
      clearTimeout(old.timer);
      old.el.remove();
    }
  }

  // ---- pan / zoom (clamped) ----
  function initView() {
    var vw = viewport.clientWidth,
      vh = viewport.clientHeight;
    zoom = Math.min(vw / 4000, vh / 772);
    panX = (vw - 4000 * zoom) / 2;
    panY = (vh - 772 * zoom) / 2;
    applyTransform();
  }
  function clampPan() {
    var vw = viewport.clientWidth,
      vh = viewport.clientHeight,
      sw = 4000 * zoom,
      sh = 772 * zoom;
    panX = sw <= vw ? (vw - sw) / 2 : Math.min(0, Math.max(vw - sw, panX));
    panY = sh <= vh ? (vh - sh) / 2 : Math.min(0, Math.max(vh - sh, panY));
  }
  function applyTransform() {
    clampPan();
    scene.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoom + ')';
  }
  viewport.addEventListener('mousedown', function (e) {
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panBaseX = panX;
    panBaseY = panY;
    viewport.classList.add('panning');
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!isPanning) return;
    panX = panBaseX + (e.clientX - panStartX);
    panY = panBaseY + (e.clientY - panStartY);
    applyTransform();
  });
  window.addEventListener('mouseup', function () {
    isPanning = false;
    viewport.classList.remove('panning');
  });
  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    var oldZoom = zoom,
      factor = e.deltaY < 0 ? 1.12 : 0.89;
    zoom = Math.max(0.15, Math.min(4, zoom * factor));
    var rect = viewport.getBoundingClientRect(),
      mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    panX = mx - (mx - panX) * (zoom / oldZoom);
    panY = my - (my - panY) * (zoom / oldZoom);
    applyTransform();
  }, {
    passive: false
  });
  window.addEventListener('resize', initView);
  init();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/realm-observer/realmSim.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.MonoLabel = __ds_scope.MonoLabel;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.MutaiWisp = __ds_scope.MutaiWisp;

__ds_ns.YureiPresence = __ds_scope.YureiPresence;

__ds_ns.CharacterInspector = __ds_scope.CharacterInspector;

__ds_ns.EngineRow = __ds_scope.EngineRow;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Terminal = __ds_scope.Terminal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.BeatTimeline = __ds_scope.BeatTimeline;

__ds_ns.BlueprintCard = __ds_scope.BlueprintCard;

__ds_ns.FunctionTag = __ds_scope.FunctionTag;

__ds_ns.HeuristicCard = __ds_scope.HeuristicCard;

__ds_ns.SpeechLadder = __ds_scope.SpeechLadder;

__ds_ns.CharacterChip = __ds_scope.CharacterChip;

__ds_ns.SpeechBubble = __ds_scope.SpeechBubble;

})();
