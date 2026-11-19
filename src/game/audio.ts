// 曲の再生（Web Audio）。デコード済みのバッファは曲ごとに保持し、再プレイで再デコードしない
// （元ゲームは再プレイのたびに数MBをデコードし直していた）。
//
// iPhone で音が出ない問題への対策（v1.2.0）:
//  1. マナーモード（消音スイッチ）で Web Audio が消音される iOS の仕様への対策として、
//     Audio Session API（iOS 17+）が使える環境では navigator.audioSession.type = 'playback' にする。
//  2. ジェスチャの外で作られた AudioContext は suspended のままになることがあるため、
//     利用者の操作（pointerdown / スタートボタン）の中で unlockAudio() を呼び、
//     生成・resume・無音バッファの再生で音声を unlock する。
//  3. 再生開始の直前と、ゲーム中のタップでも resume を試みる（game.ts 側）。
// 曲とヒット音は共通のマスター GainNode 経由で destination へつなぐ（経路の一元化）。

interface AudioSessionLike {
  type: string;
}

interface NavigatorWithAudioSession {
  audioSession?: AudioSessionLike;
}

let ctx: AudioContext | undefined;
let master: GainNode | undefined;
const buffers = new Map<string, AudioBuffer>();
let current: AudioBufferSourceNode | undefined;
let unlocked = false;

/**
 * Audio Session API が使える環境（iOS 17+ の Safari）では、音声セッションを 'playback' にする。
 * これをしないと、iPhone のマナーモードで Web Audio が消音される。非対応環境では何もしない。
 */
export function applyAudioSession(): void {
  try {
    const nav = navigator as Navigator & NavigatorWithAudioSession;
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch {
    // 非対応環境では何もしない
  }
}

export function audioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    applyAudioSession();
  }
  return ctx;
}

/** 曲・効果音の共通の出口（マスター GainNode）。destination への接続はここに一元化する。 */
export function audioOutput(): AudioNode {
  const ac = audioContext();
  if (!master) {
    master = ac.createGain();
    master.gain.value = 1;
    master.connect(ac.destination);
  }
  return master;
}

export function nowSeconds(): number {
  return audioContext().currentTime;
}

/** AudioContext の状態（未生成なら 'none'）。テスト用の入口から状態を確認するために使う。 */
export function audioState(): AudioContextState | 'none' {
  return ctx ? ctx.state : 'none';
}

/** 無音バッファによる unlock が済んでいるか */
export const isUnlocked = (): boolean => unlocked;

/**
 * 音声の unlock。利用者のジェスチャの中で呼ぶこと。
 * AudioContext を生成して resume し、無音の短いバッファを1回だけ再生する
 * （iOS Safari で Web Audio を鳴らせる状態にするための定番の処理）。
 * 2回目以降は resume のみ（無音バッファは再生し直さない）。
 */
export function unlockAudio(): void {
  const ac = audioContext();
  applyAudioSession();
  try {
    void Promise.resolve(ac.resume()).catch(() => undefined);
  } catch {
    // resume できなくても続行する
  }
  if (unlocked) return;
  unlocked = true;
  try {
    const len = Math.max(1, Math.floor(ac.sampleRate * 0.05));
    const silent = ac.createBuffer(1, len, ac.sampleRate);
    const src = ac.createBufferSource();
    src.buffer = silent;
    src.connect(audioOutput());
    src.start(0);
  } catch {
    // unlock の音が出なくても続行する
  }
}

/** AudioContext を running に戻す（audioSession の設定もやり直す）。 */
export async function resumeAudio(): Promise<void> {
  const ac = audioContext();
  applyAudioSession();
  try {
    await ac.resume();
  } catch {
    // 戻せなくても続行する
  }
}

/** 曲の音源を読み込んでデコードする。2回目以降は保持したバッファを返す。 */
export async function loadBuffer(url: string): Promise<AudioBuffer> {
  const cached = buffers.get(url);
  if (cached) return cached;
  const ac = audioContext();
  await resumeAudio();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`音源を読み込めませんでした (${res.status})`);
  const buf = await ac.decodeAudioData(await res.arrayBuffer());
  buffers.set(url, buf);
  return buf;
}

/** バッファを指定時刻に再生開始する。 */
export function playBuffer(buf: AudioBuffer, when: number): AudioBufferSourceNode {
  stopCurrent();
  const src = audioContext().createBufferSource();
  src.buffer = buf;
  src.connect(audioOutput());
  src.start(when);
  current = src;
  return src;
}

export function stopCurrent(): void {
  if (!current) return;
  try {
    current.stop();
  } catch {
    // すでに止まっている
  }
  current = undefined;
}
