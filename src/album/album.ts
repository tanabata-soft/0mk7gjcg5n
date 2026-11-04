// このシングルの基本情報と、裏面ノートの文章。
// エンジン（src/ のほかのファイル）は、このフォルダ（src/album/）のデータだけを差し替えれば
// 別の作品になるよう作られている。新しい作品の作り方は docs/PRODUCTION.md、
// シングルの仕様は docs/SINGLE.md を参照。

export const ALBUM: {
  title: string;
  catalog: string;
  format: string;
  layout: 'album' | 'single';
} = {
  /** 題名（表題曲と同名） */
  title: '京葉線の午後',
  /** カタログ番号 */
  catalog: 'NK-S003',
  /** 形式の呼び名 */
  format: 'デジタルシングルCD',
  /** 形: 'album'（正方形ジャケット＋ブックレット） / 'single'（短冊型ジャケット＋裏面ノート、ブックレットなし） */
  layout: 'single',
};

/** 裏ジャケット下部の表記（例: NK-S003 ／ デジタルシングルCD） */
export const FOOT_NOTE = `${ALBUM.catalog} ／ ${ALBUM.format}`;

/** 裏面ノートの本文（シングルではブックレットの代わりにジャケット裏面へ置く） */
export const NOTE: string[] = [
  '「チーマイマイマイチーマイ」――千葉の海辺で生まれた魔法の言葉を合言葉に、夕方の2曲を短冊に閉じ込めた。',
  '表題曲は、恋の予感の歌。京葉線でキミを待つ午後、海辺の街と灯り始めるポートタワー。止まらない気持ちに、魔法の言葉が奇跡を起こす。',
  'カップリングは、同じ海の別れの歌。九十九里の砂、泡のように消える恋の記憶。呪文の余韻のなかで幕は下り、ボーナストラックはその先の祭りの夜。花火の朱い光のなか、はぐれそうな手と手がやっと繋がる。',
];

/** ライナーノーツ（アルバム形態のブックレット冒頭。本文は NOTE と共通） */
export const LINER: readonly [string, string, string] = [NOTE[0], NOTE[1], NOTE[2]];

/** ライナーノーツの見出し（アルバム形態のブックレット冒頭2ページ） */
export const LINER_TITLES: readonly [string, string] = ['短冊に閉じ込めた2曲', '聴き方について'];

/** ブックレット「聴き方について」のページに置く一文（アルバム形態用） */
export const HOWTO_EXTRA = '再生画面では歌詞が曲に合わせて流れます。ジャケットをめくると、裏面にノートがあります。';

/** 奥付（シングルでは裏面ノートの下部に置く） */
export const COLOPHON: string[] = [
  `『${ALBUM.title}』（全2曲＋ボーナストラック1曲／総再生時間 約8分）`,
  `${ALBUM.catalog} ― ${ALBUM.format}`,
  '歌詞は音源の字幕をもとに収録しました。',
];
