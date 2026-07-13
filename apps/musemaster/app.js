/* Musemaster: Web MIDI input, lightweight piano synthesis, and practice logic. */
const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const ROOT_NAMES = {
  major: ["C", "D\u266d", "D", "E\u266d", "E", "F", "F\u266f", "G", "A\u266d", "A", "B\u266d", "B"],
  minor: ["C", "C\u266f", "D", "E\u266d", "E", "F", "F\u266f", "G", "G\u266f", "A", "B\u266d", "B"],
  sus: ["C", "D\u266d", "D", "E\u266d", "E", "F", "F\u266f", "G", "A\u266d", "A", "B\u266d", "B"],
};
const QUALITY = {
  maj: { label: "", intervals: [0, 4, 7] },
  min: { label: "m", intervals: [0, 3, 7] },
  dim: { label: "°", intervals: [0, 3, 6] },
  aug: { label: "+", intervals: [0, 4, 8] },
  sus2: { label: "sus2", intervals: [0, 2, 7], rootOnly: true },
  sus4: { label: "sus4", intervals: [0, 5, 7], rootOnly: true },
  "7": { label: "7", intervals: [0, 4, 7, 10] },
  maj7: { label: "maj7", intervals: [0, 4, 7, 11] },
  min7: { label: "min7", intervals: [0, 3, 7, 10] },
  minMaj7: { label: "MiMa7", intervals: [0, 3, 7, 11] },
  halfDim7: { label: "ø7", intervals: [0, 3, 6, 10] },
};

Object.assign(QUALITY, {
  maj: { label: "", intervals: [0, 4, 7], spelling: "major" },
  min: { label: "m", intervals: [0, 3, 7], spelling: "minor" },
  dim: { label: "\u00b0", intervals: [0, 3, 6], spelling: "minor", weight: 2 / 3 },
  aug: { label: "+", intervals: [0, 4, 8], spelling: "major", rootOnly: true, weight: 2 / 3 },
  sus2: { label: "sus2", intervals: [0, 2, 7], spelling: "sus", rootOnly: true, weight: 2 / 3 },
  sus4: { label: "sus4", intervals: [0, 5, 7], spelling: "sus", rootOnly: true, weight: 2 / 3 },
  add2: { label: "add2", intervals: [0, 2, 4, 7], spelling: "major", no2Or9Bass: true, allowedInversions: [0, 2], inversionOrdinals: { 0: 0, 2: 1 } },
  "7": { label: "7", intervals: [0, 4, 7, 10], spelling: "major" },
  maj7: { label: "maj7", intervals: [0, 4, 7, 11], spelling: "major" },
  min7: { label: "m7", intervals: [0, 3, 7, 10], spelling: "minor" },
  dim7: { label: "\u00b07", intervals: [0, 3, 6, 9], spelling: "minor", rootOnly: true, weight: 2 / 3 },
  minMaj7: { label: "MiMa7", intervals: [0, 3, 7, 11], spelling: "minor", weight: 2 / 3 },
  halfDim7: { label: "\u00f87", intervals: [0, 3, 6, 10], spelling: "minor" },
  "9": { label: "9", intervals: [0, 4, 7, 10, 14], spelling: "major", no2Or9Bass: true },
  maj9: { label: "maj9", intervals: [0, 4, 7, 11, 14], spelling: "major", no2Or9Bass: true },
  min9: { label: "m9", intervals: [0, 3, 7, 10, 14], spelling: "minor", no2Or9Bass: true },
});

const dom = {
  midiStatus: document.querySelector("#midi-status"), midiText: document.querySelector("#midi-status-text"), sound: document.querySelector("#sound-button"), panic: document.querySelector("#panic-button"),
  modeTabs: [...document.querySelectorAll(".mode-tab")], chordPanel: document.querySelector("#chords-panel"), earPanel: document.querySelector("#ear-panel"),
  chordSettings: document.querySelector("#chord-settings"), earSettings: document.querySelector("#ear-settings"), chordTarget: document.querySelector("#chord-target"), chordDetail: document.querySelector("#chord-detail"), chordRound: document.querySelector("#chord-round"), chordFeedback: document.querySelector("#chord-feedback"), chordNew: document.querySelector("#new-chord-button"), heldChips: document.querySelector("#held-note-chips"), chordSession: document.querySelector("#chord-session-switch"), chordReadout: document.querySelector("#chord-test-readout"), chordTestTime: document.querySelector("#chord-test-time"), chordTestScore: document.querySelector("#chord-test-score"), chordPresets: document.querySelector("#chord-presets"),
  earInstruction: document.querySelector("#ear-instruction"), earNote: document.querySelector("#ear-note-display"), earDetail: document.querySelector("#ear-detail"), earFeedback: document.querySelector("#ear-feedback"), earRound: document.querySelector("#ear-round"), earStart: document.querySelector("#start-ear-button"), earCorrect: document.querySelector("#ear-correct"), earAttempts: document.querySelector("#ear-attempts"), earAccuracy: document.querySelector("#ear-accuracy"), earSession: document.querySelector("#ear-session-switch"), earReadout: document.querySelector("#ear-test-readout"), earTestTime: document.querySelector("#ear-test-time"), earTestScore: document.querySelector("#ear-test-score"), earTestAccuracy: document.querySelector("#ear-test-accuracy"), earPracticeSettings: document.querySelector("#ear-practice-settings"), earTestSettings: document.querySelector("#ear-test-settings"), earTestDifficulties: document.querySelector("#ear-test-difficulties"), lastNote: document.querySelector("#last-note"), piano: document.querySelector("#piano"),
};

const state = {
  midi: null, audio: null, audioOutput: null, activeNotes: new Map(), voices: new Map(), displayedKeys: new Map(), mode: "chords", chord: null, previousChordRoot: null, chordRound: 0, chordSession: "practice", chordTest: { running: false, score: 0, endAt: 0, timer: null },
  earSession: "practice", ear: { running: false, phase: "idle", previous: 60, beforePrevious: null, target: null, round: 0, correct: 0, attempts: 0, notePresses: 0, accuracyPoints: 0, timer: null, endAt: 0, testTimer: null, testIntervals: [1, 2, 3, 4, 5, 6, 7] },
};

const pc = midi => ((midi % 12) + 12) % 12;
const noteName = midi => `${NOTE_NAMES[pc(midi)]}${Math.floor(midi / 12) - 1}`;
const chordPitchName = (pitchClass, spelling) => ROOT_NAMES[spelling][pc(pitchClass)];
const chordRootName = (pitchClass, spelling) => {
  const root = pc(pitchClass);
  if (root === 3 && Math.random() < 1 / 3) return "D\u266f";
  if (root === 6 && Math.random() < 1 / 3) return "G\u266d";
  return chordPitchName(root, spelling);
};
const midiToFrequency = midi => 440 * Math.pow(2, (midi - 69) / 12);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const TEST_DURATION_MS = 120000;
const formatClock = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const correctBlip = new Audio("sound/blip.wav");
correctBlip.preload = "auto";
function playCorrectBlip() { const sound = correctBlip.cloneNode(); sound.volume = .25; sound.play().catch(() => {}); }
const setFeedback = (element, text, kind = "") => {
  element.className = `feedback${kind ? ` is-${kind}` : ""}`;
  element.innerHTML = `<span class="feedback-symbol">${kind === "success" ? "✓" : kind === "error" ? "!" : kind === "listening" ? "♪" : "↘"}</span><span>${text}</span>`;
};

function ensureAudio() {
  if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
  const setSoundLabel = () => {
    if (state.audio?.state !== "running") return;
    if (dom.sound) {
      dom.sound.setAttribute("aria-pressed", "true");
      dom.sound.innerHTML = '<span class="sound-icon">♪</span> Sound on';
    }
  };
  if (state.audio.state === "suspended") state.audio.resume().then(setSoundLabel).catch(() => {});
  else setSoundLabel();
  return state.audio;
}

function playPiano(midi, velocity = 0.8, duration = null) {
  const ctx = ensureAudio();
  // Browsers can suspend Web Audio until a page gesture. Never queue notes in
  // that state, otherwise old MIDI inputs would erupt together after a click.
  if (ctx.state !== "running") {
    ctx.resume().then(() => {
      if (ctx.state === "running" && (state.activeNotes.has(midi) || duration)) playPiano(midi, velocity, duration);
    }).catch(() => {});
    return;
  }
  stopPiano(midi);
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  const body = ctx.createOscillator();
  const bell = ctx.createOscillator();
  const warmth = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const master = ctx.createGain();
  body.type = "triangle"; body.frequency.value = midiToFrequency(midi);
  bell.type = "sine"; bell.frequency.value = midiToFrequency(midi) * 2.01;
  warmth.type = "sine"; warmth.frequency.value = midiToFrequency(midi) * .5;
  filter.type = "lowpass"; filter.frequency.setValueAtTime(2600, now); filter.frequency.exponentialRampToValueAtTime(850, now + 1.1);
  gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(Math.max(.04, velocity) * .24, now + .012); gain.gain.exponentialRampToValueAtTime(Math.max(.015, velocity * .065), now + .55);
  master.gain.value = .82;
  body.connect(gain); bell.connect(gain); warmth.connect(gain); gain.connect(filter); filter.connect(master); master.connect(ctx.destination);
  body.start(now); bell.start(now); warmth.start(now);
  const voice = { body, bell, warmth, gain, filter, master, stopping: false };
  state.voices.set(midi, voice);
  if (duration) setTimeout(() => stopPiano(midi), duration);
}

function stopPiano(midi) {
  const voice = state.voices.get(midi);
  if (!voice || voice.stopping || !state.audio) return;
  voice.stopping = true;
  const now = state.audio.currentTime;
  voice.gain.gain.cancelScheduledValues(now);
  if (voice.gain.gain.cancelAndHoldAtTime) voice.gain.gain.cancelAndHoldAtTime(now);
  voice.gain.gain.setTargetAtTime(.0001, now, .025);
  [voice.body, voice.bell, voice.warmth].forEach(osc => osc.stop(now + .21));
  setTimeout(() => { if (state.voices.get(midi) === voice) state.voices.delete(midi); }, 250);
}

function stopAllSound() {
  [...state.voices.keys()].forEach(stopPiano);
  state.activeNotes.clear(); renderHeldNotes();
  state.displayedKeys.forEach(key => key.classList.remove("is-down"));
  dom.lastNote.textContent = "All notes stopped";
}

function triggerDemoNote(midi, length = 720) { playPiano(midi, .78, length); flashKey(midi, length); }

function flashKey(midi, length) {
  const key = state.displayedKeys.get(midi);
  if (!key) return;
  key.classList.add("is-down");
  setTimeout(() => { if (!state.activeNotes.has(midi)) key.classList.remove("is-down"); }, length);
}

function noteOn(midi, velocity = 100, source = "midi") {
  if (state.activeNotes.has(midi)) return;
  state.activeNotes.set(midi, { source, velocity });
  playPiano(midi, velocity / 127);
  state.displayedKeys.get(midi)?.classList.add("is-down");
  dom.lastNote.textContent = `${noteName(midi)} · ${source === "midi" ? "MIDI input" : "on-screen"}`;
  renderHeldNotes();
  assessCurrentPlay("on");
}

function noteOff(midi) {
  if (!state.activeNotes.has(midi)) return;
  state.activeNotes.delete(midi); stopPiano(midi); state.displayedKeys.get(midi)?.classList.remove("is-down"); renderHeldNotes();
  if (state.activeNotes.size) assessCurrentPlay("off");
  else if (state.mode === "chords" && state.chord) setFeedback(dom.chordFeedback, "Play all notes together");
  else if (state.mode === "ear" && state.ear.running && state.ear.phase === "await-release") { state.ear.notePresses = 0; beginEarRound(false); }
}

function renderHeldNotes() {
  const held = [...state.activeNotes.keys()].sort((a, b) => a - b);
  dom.heldChips.innerHTML = held.length ? held.map(n => `<span class="note-chip">${noteName(n)}</span>`).join("") : '<span class="empty-chips">Waiting for a key…</span>';
}

function selectedValues(selector) { return [...document.querySelectorAll(selector)].filter(input => input.checked).map(input => input.value); }
function randomItem(items) { return items[Math.floor(Math.random() * items.length)]; }
function weightedItem(items, getWeight) {
  const total = items.reduce((sum, item) => sum + getWeight(item), 0); let roll = Math.random() * total;
  for (const item of items) { roll -= getWeight(item); if (roll <= 0) return item; }
  return items[items.length - 1];
}

const PRESETS = {
  light: { qualities: ["maj", "min", "dim", "aug"], inversions: [0] },
  medium: { qualities: ["maj", "min", "dim", "aug", "sus2", "sus4", "7", "maj7", "min7"], inversions: [0] },
  hard: { qualities: Object.keys(QUALITY), inversions: [0] },
  expert: { qualities: Object.keys(QUALITY), inversions: [0, 1, 2, 3] },
};

function applyPreset(name) {
  const preset = PRESETS[name]; if (!preset) return;
  document.querySelectorAll('input[name="quality"]').forEach(input => { input.checked = preset.qualities.includes(input.value); });
  document.querySelectorAll("#inversion-controls input").forEach(input => { input.checked = preset.inversions.includes(Number(input.value)); });
  dom.chordPresets.querySelectorAll("button").forEach(button => button.classList.toggle("is-active", button.dataset.preset === name));
  newChord();
}

function setChordSession(session) {
  state.chordSession = session;
  dom.chordSession.querySelectorAll("button").forEach(button => button.classList.toggle("is-active", button.dataset.session === session));
  dom.chordPanel.classList.toggle("is-test-active", session === "test");
  if (state.chordTest.running) stopChordTest();
  dom.chordNew.innerHTML = session === "test" ? 'Start 120-second test <span>→</span>' : 'New chord <span>→</span>';
  updateChordTestReadout();
}

function updateChordTestReadout() {
  const test = state.chordTest;
  const seconds = test.endAt ? Math.max(0, Math.ceil((test.endAt - Date.now()) / 1000)) : 120;
  dom.chordTestTime.textContent = formatClock(seconds);
  dom.chordTestScore.textContent = test.score;
}

function stopChordTest(finished = false) {
  clearInterval(state.chordTest.timer); state.chordTest.running = false;
  dom.chordNew.innerHTML = 'Start 120-second test <span>↻</span>';
  if (finished) { dom.chordTarget.textContent = "Time!"; dom.chordTarget.classList.add("is-game-over"); }
}

function startChordTest() {
  state.chordTest.score = 0; state.chordTest.running = true; state.chordTest.endAt = Date.now() + TEST_DURATION_MS; dom.chordTarget.classList.remove("is-game-over");
  updateChordTestReadout(); newChord();
  clearInterval(state.chordTest.timer);
  state.chordTest.timer = setInterval(() => {
    updateChordTestReadout();
    if (Date.now() >= state.chordTest.endAt) { updateChordTestReadout(); stopChordTest(true); }
  }, 150);
}

function newChord() {
  const qualities = selectedValues('input[name="quality"]');
  const selectedInversions = selectedValues("#inversion-controls input").map(Number);
  if (!qualities.length) { setFeedback(dom.chordFeedback, "Choose at least one chord type", "error"); return; }
  const qualityId = weightedItem(qualities, id => QUALITY[id].weight ?? 1); const quality = QUALITY[qualityId];
  const validInversions = quality.rootOnly ? [0] : selectedInversions.filter(i => i < quality.intervals.length && (!quality.allowedInversions || quality.allowedInversions.includes(i)) && (!quality.no2Or9Bass || ![2, 14].includes(quality.intervals[i])));
  const inversion = randomItem(validInversions.length ? validInversions : [0]);
  const displayInversion = quality.inversionOrdinals?.[inversion] ?? inversion;
  const rootCandidates = Array.from({ length: 12 }, (_, pitchClass) => pitchClass).filter(pitchClass => pitchClass !== state.chord?.root && pitchClass !== state.previousChordRoot);
  const root = randomItem(rootCandidates); const notes = quality.intervals.map(interval => pc(root + interval));
  const bassPc = notes[inversion];
  const rootLabel = chordRootName(root, quality.spelling);
  state.previousChordRoot = state.chord?.root ?? null;
  state.chord = { root, rootLabel, quality, notes, inversion, bassPc, complete: false };
  state.chordRound += 1;
  dom.chordRound.textContent = `Round ${String(state.chordRound).padStart(2, "0")}`;
  const hasSeventh = quality.intervals.some(interval => interval === 10 || interval === 11);
  const figures = hasSeventh ? ["7", "6/5", "4/3", "4/2"] : ["5/3", "6/3", "6/4"];
  const figure = inversion === 0 ? "" : (figures[inversion] ?? "");
  const ordinal = ["", "1st inv.", "2nd inv.", "3rd inv."][displayInversion];
  const notation = document.querySelector('input[name="inversion-notation"]:checked').value;
  const suffix = inversion === 0 ? "" : notation === "ordinal"
    ? `<span class="inversion-name">${ordinal}</span>`
    : notation === "figure"
      ? `<span class="figured-bass">${figure}</span>`
      : `<span class="inversion-name">${ordinal}</span><span class="figured-bass">${figure}</span>`;
  dom.chordTarget.innerHTML = `${rootLabel}${quality.label ? `<span class="quality">${quality.label}</span>` : ""}${suffix}`;
  dom.chordTarget.dataset.inversion = displayInversion;
  const inversionLabels = ["Root position (5/3)", "1st inversion (6/3)", "2nd inversion (6/4)", "3rd inversion (4/2)"];
  dom.chordDetail.textContent = `${inversionLabels[displayInversion].replace(/ \(.+\)/, "")} · bass ${chordPitchName(bassPc, quality.spelling)}`;
  setFeedback(dom.chordFeedback, "Play all notes together");
}

function assessChord() {
  const chord = state.chord; if (!chord || chord.complete) return;
  const held = [...state.activeNotes.keys()].sort((a, b) => a - b); if (!held.length) return;
  const heldPcs = [...new Set(held.map(pc))]; const targetPcs = new Set(chord.notes);
  const hasOnlyTargetNotes = heldPcs.length === targetPcs.size && heldPcs.every(n => targetPcs.has(n));
  const correctBass = pc(held[0]) === chord.bassPc;
  if (hasOnlyTargetNotes && correctBass) {
    chord.complete = true;
    if (state.chordSession === "test" && state.chordTest.running) { state.chordTest.score += 1; updateChordTestReadout(); }
    playCorrectBlip();
    dom.chordTarget.classList.add("is-correct");
    setTimeout(() => {
      dom.chordTarget.classList.remove("is-correct");
      if (state.mode === "chords" && (state.chordSession === "practice" || state.chordTest.running)) newChord();
    }, 300);
  } else if (heldPcs.some(n => !targetPcs.has(n))) setFeedback(dom.chordFeedback, "There is an extra note in the voicing", "error");
  else if (heldPcs.length >= targetPcs.size && !correctBass) setFeedback(dom.chordFeedback, `Put ${NOTE_NAMES[chord.bassPc]} in the bass`, "error");
  else setFeedback(dom.chordFeedback, "Keep building the chord…", "listening");
}

function nextEarTarget() {
  const ear = state.ear;
  const candidates = [], fallbackCandidates = [];
  const intervals = state.earSession === "test" ? ear.testIntervals : selectedValues('input[name="ear-interval"]').map(Number);
  const activeIntervals = intervals.length ? intervals : [1];
  for (let note = 48; note <= 84; note += 1) if (activeIntervals.includes(Math.abs(note - ear.previous))) {
    fallbackCandidates.push(note);
    if (note !== ear.beforePrevious) candidates.push(note);
  }
  ear.target = randomItem(candidates.length ? candidates : fallbackCandidates); ear.round += 1;
  dom.earRound.textContent = `Round ${String(ear.round).padStart(2, "0")}`;
}

async function beginEarRound(playReference = true) {
  const ear = state.ear; if (!ear.running || (state.earSession === "test" && Date.now() >= ear.endAt)) return;
  clearTimeout(ear.timer); nextEarTarget();
  const anchor = ear.previous;
  if (playReference) {
    ear.phase = "anchor"; dom.earInstruction.textContent = "This is your reference note."; dom.earNote.textContent = noteName(anchor); dom.earNote.classList.remove("is-mystery"); dom.earDetail.textContent = "Listen, then hold the next note alone.";
    setFeedback(dom.earFeedback, "Reference note playing", "listening"); playPiano(anchor, .78, 520);
    await delay(650); if (!ear.running) return;
  }
  ear.phase = "target"; dom.earInstruction.textContent = "Now find the note you just heard."; dom.earNote.textContent = "Listen"; dom.earNote.classList.add("is-mystery"); dom.earDetail.textContent = "Octave does not matter. Hold only one pitch class.";
  setFeedback(dom.earFeedback, "Mystery note playing", "listening"); playPiano(ear.target, .78, 560);
  await delay(500); if (!ear.running) return;
  ear.phase = "answer"; dom.earNote.textContent = "Your turn"; setFeedback(dom.earFeedback, "Find the mystery note — octave is free", ""); assessEar();
}

function updateEarStats() {
  const ear = state.ear; dom.earCorrect.textContent = ear.correct; dom.earAttempts.textContent = ear.attempts; dom.earAccuracy.textContent = ear.attempts ? `${Math.round(ear.correct / ear.attempts * 100)}%` : "—";
}

function updateEarTestReadout() {
  const ear = state.ear;
  const seconds = ear.endAt ? Math.max(0, Math.ceil((ear.endAt - Date.now()) / 1000)) : 120;
  dom.earTestTime.textContent = formatClock(seconds);
  dom.earTestScore.textContent = ear.correct;
  dom.earTestAccuracy.textContent = ear.correct ? `${Math.round(ear.accuracyPoints / ear.correct * 100)}%` : "—";
}

function stopEarSession(finished = false) {
  const ear = state.ear; clearTimeout(ear.timer); clearInterval(ear.testTimer); ear.running = false; ear.phase = "idle";
  dom.earStart.innerHTML = state.earSession === "test" ? 'Start 120-second test <span>↻</span>' : 'Start listening <span>→</span>';
  if (finished) { dom.earNote.textContent = "Time!"; dom.earNote.classList.remove("is-mystery"); dom.earNote.classList.add("is-game-over"); }
}

function startEarSession() {
  const ear = state.ear; ensureAudio(); clearTimeout(ear.timer); clearInterval(ear.testTimer);
  ear.running = true; ear.phase = "idle"; ear.previous = 60; ear.beforePrevious = null; ear.round = 0; ear.correct = 0; ear.attempts = 0; ear.notePresses = 0; ear.accuracyPoints = 0;
  if (state.earSession === "test") {
    ear.endAt = Date.now() + TEST_DURATION_MS; updateEarTestReadout();
    ear.testTimer = setInterval(() => { updateEarTestReadout(); if (Date.now() >= ear.endAt) { updateEarTestReadout(); stopEarSession(true); } }, 150);
  }
  dom.earNote.classList.remove("is-game-over");
  dom.earStart.innerHTML = state.earSession === "test" ? 'Restart 120-second test <span>↻</span>' : 'Restart listening <span>↻</span>';
  beginEarRound(true);
}

function setEarSession(session) {
  state.earSession = session; stopEarSession();
  dom.earSession.querySelectorAll("button").forEach(button => button.classList.toggle("is-active", button.dataset.session === session));
  dom.earPanel.classList.toggle("is-test-active", session === "test");
  dom.earPracticeSettings.classList.toggle("is-hidden", session !== "practice"); dom.earTestSettings.classList.toggle("is-hidden", session !== "test");
  updateEarTestReadout();
}

function assessEar(trigger = "on") {
  const ear = state.ear; if (!ear.running || ear.phase !== "answer") return;
  const held = [...state.activeNotes.keys()].sort((a, b) => a - b); if (!held.length) return;
  if (trigger === "on") ear.notePresses += 1;
  const heldPcs = [...new Set(held.map(pc))];
  if (held.length === 1 && held[0] === ear.target) {
    ear.attempts += 1; ear.correct += 1;
    if (state.earSession === "test") ear.accuracyPoints += ear.notePresses === 1 ? 1 : ear.notePresses === 2 ? .5 : ear.notePresses === 3 ? .25 : 0;
    updateEarStats(); updateEarTestReadout(); ear.phase = "await-release"; dom.earNote.textContent = noteName(ear.target); dom.earNote.classList.remove("is-mystery"); setFeedback(dom.earFeedback, "Correct — release to continue", "success"); ear.beforePrevious = ear.previous; ear.previous = ear.target;
  } else if (trigger === "on") {
    ear.attempts += 1; updateEarStats(); setFeedback(dom.earFeedback, heldPcs.length > 1 ? "One note at a time — try again" : "Not that one — listen for it again", "error");
  }
}

function assessCurrentPlay(trigger) { if (state.mode === "chords") assessChord(); else assessEar(trigger); }

function setMode(mode) {
  state.mode = mode;
  dom.modeTabs.forEach(tab => tab.classList.toggle("is-active", tab.dataset.mode === mode));
  dom.chordPanel.classList.toggle("is-hidden", mode !== "chords"); dom.earPanel.classList.toggle("is-hidden", mode !== "ear"); dom.chordSettings.classList.toggle("is-hidden", mode !== "chords"); dom.earSettings.classList.toggle("is-hidden", mode !== "ear");
}

function buildPiano() {
  const start = 48, end = 84; const whites = [];
  for (let midi = start; midi <= end; midi += 1) if (![1, 3, 6, 8, 10].includes(pc(midi))) whites.push(midi);
  whites.forEach(midi => { const key = document.createElement("button"); key.type = "button"; key.className = "piano-key"; key.dataset.midi = midi; key.innerHTML = `<span class="key-label">${NOTE_NAMES[pc(midi)]}${pc(midi) === 0 ? Math.floor(midi / 12) - 1 : ""}</span>`; bindPointerKey(key, midi); dom.piano.append(key); state.displayedKeys.set(midi, key); });
  for (let midi = start; midi <= end; midi += 1) if ([1, 3, 6, 8, 10].includes(pc(midi))) {
    const key = document.createElement("button"); key.type = "button"; key.className = "black-key"; key.dataset.midi = midi;
    const precedingWhite = whites.filter(n => n < midi).length; key.style.left = `${precedingWhite / whites.length * 100}%`; key.innerHTML = `<span class="key-label">${NOTE_NAMES[pc(midi)]}</span>`; bindPointerKey(key, midi); dom.piano.append(key); state.displayedKeys.set(midi, key);
  }
}

function bindPointerKey(key, midi) {
  const end = event => { if (event.pointerId !== undefined && key.hasPointerCapture?.(event.pointerId)) key.releasePointerCapture(event.pointerId); noteOff(midi); };
  key.addEventListener("pointerdown", event => { event.preventDefault(); key.setPointerCapture?.(event.pointerId); noteOn(midi, 96, "on-screen"); });
  key.addEventListener("pointerup", end); key.addEventListener("pointercancel", end); key.addEventListener("lostpointercapture", () => noteOff(midi)); key.addEventListener("pointerleave", event => { if (event.buttons) end(event); });
}

async function connectMidi() {
  if (!navigator.requestMIDIAccess) { dom.midiText.textContent = "Web MIDI not supported"; dom.midiStatus.classList.add("is-error"); return; }
  try {
    state.midi = await navigator.requestMIDIAccess();
    ensureAudio();
    const connectInputs = () => {
      const inputs = [...state.midi.inputs.values()];
      inputs.forEach(input => { input.onmidimessage = onMidiMessage; });
      dom.midiText.textContent = inputs.length ? `${inputs.length} MIDI controller${inputs.length > 1 ? "s" : ""} ready` : "MIDI ready · connect a controller";
      dom.midiStatus.classList.toggle("is-connected", inputs.length > 0);
    };
    state.midi.onstatechange = connectInputs; connectInputs();
  } catch (error) { dom.midiText.textContent = "MIDI permission was not granted"; dom.midiStatus.classList.add("is-error"); }
}

function onMidiMessage(event) {
  const [status, note, velocity = 0] = event.data; const command = status & 0xf0;
  if (command === 0x90 && velocity > 0) noteOn(note, velocity, "midi");
  if (command === 0x80 || (command === 0x90 && velocity === 0)) noteOff(note);
}

if (dom.sound) dom.sound.addEventListener("click", ensureAudio);
if (dom.panic) dom.panic.addEventListener("click", stopAllSound);
dom.modeTabs.forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
dom.chordNew.addEventListener("click", () => state.chordSession === "test" ? startChordTest() : newChord());
dom.chordSession.querySelectorAll("button").forEach(button => button.addEventListener("click", () => setChordSession(button.dataset.session)));
dom.chordPresets.querySelectorAll("button").forEach(button => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
document.querySelectorAll('input[name="quality"], #inversion-controls input, input[name="inversion-notation"]').forEach(input => input.addEventListener("change", newChord));
dom.earStart.addEventListener("click", startEarSession);
dom.earSession.querySelectorAll("button").forEach(button => button.addEventListener("click", () => setEarSession(button.dataset.session)));
dom.earTestDifficulties.querySelectorAll("button").forEach(button => button.addEventListener("click", () => { const max = Number(button.dataset.interval); state.ear.testIntervals = Array.from({ length: max }, (_, index) => index + 1); dom.earTestDifficulties.querySelectorAll("button").forEach(item => item.classList.toggle("is-active", item === button)); }));

buildPiano(); applyPreset("light"); setChordSession("practice"); setEarSession("practice"); connectMidi();
window.addEventListener("pointerup", () => [...state.activeNotes.entries()].filter(([, data]) => data.source === "on-screen").forEach(([midi]) => noteOff(midi)));
window.addEventListener("blur", stopAllSound);
