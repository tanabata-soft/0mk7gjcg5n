// 曲と譜面のデータ（正本は src/game/data/charts.json。scripts/generate-charts.py が音源解析で生成する）。
// 歌詞は src/game/data/lyrics.json（曲 ID → 行の列。scripts/gen-game-lyrics.mjs が
// CD 側の検証済み歌詞同期データ src/album/sync.ts から変換して生成する）。
// 曲の音源は CD 側の src/album/assets/audio/track0N.mp4 から音声だけを書き出した MP3
// （src/game/assets/track0N.mp3）。ジャケットは CD 側の曲ジャケット（1024×1024）のコピー。
import type { LyricLine, SongData, SongId } from './logic';
import raw from './data/charts.json';
import lyricsRaw from './data/lyrics.json';
import keiyoAudio from './assets/track01.mp3';
import keiyoJacket from './assets/track01.jpg';
import umiAudio from './assets/track02.mp3';
import umiJacket from './assets/track02.jpg';
import yoruAudio from './assets/track03.mp3';
import yoruJacket from './assets/track03.jpg';

export interface SongEntry {
  id: SongId;
  data: SongData;
  /** 音源ファイルの URL（ビルドで assets に出力され、Service Worker の precache に入る） */
  audioUrl: string;
  /** ジャケット絵の URL */
  jacketUrl: string;
  /**
   * ジャケット絵の四辺に焼き込まれた紙枠の幅（実画像ピクセル。絵は 1024×1024）。
   * 演奏画面の背景では、この枠を除いた内側の絵だけを幅いっぱいの正方形で敷く
   * （枠をなくして背景になじませる、オーナー決定 2026-11-20）。
   * メニューのカルーセルや CD 側のジャケット表示には使わない（枠も含めて見せる）。
   * 実測（2026-11-20）: keiyo 14 / umi 32 / yoru 0（枠なし）
   */
  frameInset: number;
  /** 収録アルバム名（表示用） */
  album: string;
  genre: string;
  /** 歌詞行（尺まで。無い曲は空配列） */
  lyrics: LyricLine[];
}

const songs = raw as unknown as Record<SongId, SongData>;
const lyrics = lyricsRaw as unknown as Record<SongId, LyricLine[]>;

export const SONGS: SongEntry[] = [
  {
    id: 'keiyo',
    data: songs.keiyo,
    lyrics: lyrics.keiyo ?? [],
    audioUrl: keiyoAudio,
    jacketUrl: keiyoJacket,
    frameInset: 14,
    album: 'NK-S003 京葉線の午後',
    genre: 'Seaside Pop',
  },
  {
    id: 'umi',
    data: songs.umi,
    lyrics: lyrics.umi ?? [],
    audioUrl: umiAudio,
    jacketUrl: umiJacket,
    frameInset: 32,
    album: 'NK-S003 京葉線の午後',
    genre: 'Seafoam Ballad',
  },
  {
    id: 'yoru',
    data: songs.yoru,
    lyrics: lyrics.yoru ?? [],
    audioUrl: yoruAudio,
    jacketUrl: yoruJacket,
    frameInset: 0,
    album: 'NK-S003 京葉線の午後',
    genre: 'Festival Pop',
  },
];

export const songById = (id: SongId): SongEntry => SONGS.find((s) => s.id === id) ?? SONGS[0];
