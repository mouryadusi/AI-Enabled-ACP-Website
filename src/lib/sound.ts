/**
 * A tiny, dependency-free sound system built on the Web Audio API —
 * synthesised tones rather than audio files (none are available to bundle
 * here), kept deliberately subtle: short, quiet, atmospheric clicks and
 * chimes, never music. Respects an explicit on/off preference stored in
 * localStorage, defaulting to OFF so nothing plays without the visitor
 * choosing it first.
 */
const STORAGE_KEY = "acp-sound";
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "on";
}

export function setSoundEnabled(on: boolean) {
  window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  if (on) getContext()?.resume();
}

interface ToneOptions {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  glideTo?: number;
}

function tone({ freq, duration, type = "sine", gain = 0.05, glideTo }: ToneOptions) {
  if (!isSoundEnabled()) return;
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (glideTo) osc.frequency.linearRampToValueAtTime(glideTo, audio.currentTime + duration);
  g.gain.setValueAtTime(gain, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

/** A soft, short click — flight card selection, button presses. */
export function playSelect() {
  tone({ freq: 520, duration: 0.09, type: "sine", gain: 0.045 });
}

/** A brief rising chime — a systems-check stage completing. */
export function playStageComplete() {
  tone({ freq: 380, duration: 0.18, type: "triangle", gain: 0.04, glideTo: 620 });
}

/** A low, sustained tone with upward glide — takeoff / entering the site. */
export function playTakeoff() {
  tone({ freq: 140, duration: 0.9, type: "sawtooth", gain: 0.03, glideTo: 260 });
}

/** A single soft tick — chapter/page transitions. */
export function playTick() {
  tone({ freq: 700, duration: 0.05, type: "sine", gain: 0.03 });
}
