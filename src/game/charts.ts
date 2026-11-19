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

/**
 * 演奏画面の背景ジャケットの切り抜き方（ジャケット内座標への割合 0..1 で指定する）。
 * 曲選択カルーセルの寄せ方向（game.css の object-position）と同じ知見で決める。
 */
export interface JacketCrop {
  /** 横の寄せ: 0=左端、0.5=中央、1=右端 */
  x: number;
  /** 縦の寄せ: 0=上端、0.5=中央、1=下端 */
  y: number;
  /**
   * 絵の中のタイトルが収まる窓の幅（ジャケット幅への割合）。
   * 指定した曲は、その窓を画面の横幅いっぱいに敷く層を重ねて、タイトルが切れないようにする
   * （縦長の画面では cover 切り抜きの窓がタイトルより狭く、右端が切れてしまうため）
   */
  titleWidth?: number;
}

export interface SongEntry {
  id: SongId;
  data: SongData;
  /** 音源ファイルの URL（ビルドで assets に出力され、Service Worker の precache に入る） */
  audioUrl: string;
  /** ジャケット絵の URL */
  jacketUrl: string;
  /** 演奏画面の背景ジャケットの切り抜き方 */
  bgCrop: JacketCrop;
  /**
   * タイトル帯（主表示の cover とは別にタイトルを収める組み立て）:
   * 主表示は bgCrop の cover で全面に敷き（絵の見せたい部分に合わせる）、
   * 下部にこの帯を重ねてタイトルを収める。width は帯の窓の幅（ジャケット幅への
   * 割合、タイトルが収まる幅）、top は帯の始まる縦位置（ジャケット高さへの割合）。
   * 主表示側のタイトルが帯の不透明部で隠れる高さになるよう top を決める。
   */
  titleBand?: { width: number; top: number };
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
    // タイトル（横 0.50〜0.94、上部）は cover 窓（約0.46）より広いのでポスター層で収める。
    // 窓は横 0.42〜1.00（titleWidth 0.58 を右寄せ）
    bgCrop: { x: 1, y: 0, titleWidth: 0.58 },
    album: 'NK-S003 京葉線の午後',
    genre: 'Seaside Pop',
  },
  {
    id: 'umi',
    data: songs.umi,
    lyrics: lyrics.umi ?? [],
    audioUrl: umiAudio,
    jacketUrl: umiJacket,
    // タイトル（横 0.55〜0.90、下部）が収まるよう右寄せ。波は全面に広がるので左右どちらでも成立する
    bgCrop: { x: 0.75, y: 0.5 },
    album: 'NK-S003 京葉線の午後',
    genre: 'Seafoam Ballad',
  },
  {
    id: 'yoru',
    data: songs.yoru,
    lyrics: lyrics.yoru ?? [],
    audioUrl: yoruAudio,
    jacketUrl: yoruJacket,
    // タイトル（縦書き、横 0.46〜0.60）は中央寄せの cover 窓にそのまま収まる
    bgCrop: { x: 0.5, y: 0.5 },
    album: 'NK-S003 京葉線の午後',
    genre: 'Festival Pop',
  },
];

export const songById = (id: SongId): SongEntry => SONGS.find((s) => s.id === id) ?? SONGS[0];
