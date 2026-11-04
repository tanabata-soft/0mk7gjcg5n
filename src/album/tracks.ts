// 曲目と解説（このシングルのデータ）。src は歌詞データ（src/album/sync.ts）のキー。
// 並びが曲順。1曲目が表題曲、2曲目がカップリング（docs/SINGLE.md）。
import type { TrackMeta } from '../logic';

export const TRACKS: TrackMeta[] = [
  { src: '京葉線の午後', title: '京葉線の午後', genre: 'Seaside Pop', time: '3:00', note: '京葉線に揺られてキミを待つ午後。魔法の言葉が奇跡を起こす表題曲。' },
  { src: '千葉の海に溶けてゆく', title: '千葉の海に溶けてゆく', genre: 'Seafoam Ballad', time: '2:37', note: '九十九里の波に消える恋の記憶。泡のような想いを歌うバラード。' },
];
