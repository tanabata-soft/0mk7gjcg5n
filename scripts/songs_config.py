"""作品の曲設定（NK-S003）。

単位D（生成器一本化）: 生成器本体の正はテンプレート repo
（mmishina-art/digitalcd-engine）の scripts/chartgen/ パッケージ1か所。
作品側はこの SONGS メタデータと歌詞入力（src/game/data/lyrics.json）だけを
持ち、scripts/generate-charts.py（入口ブートストラップ）がテンプレートの
chartgen を参照して生成する。曲を足すときはここに1曲分を足す。
各キーの意味はテンプレート scripts/chartgen/config.py のコメント参照。
"""

SONGS = {
    # NK-S003 の収録曲。音源は src/game/assets/track0N.mp3（CD 側の MP4 から
    # 音声だけを MP3 192kbps で書き出したもの）。
    # FEVER（サビ）区間は、歌詞（src/album/sync.ts）の反復ブロックから決めた:
    # サビの歌詞ブロックの先頭行の開始秒を開始、末尾行の歌唱が終わる頃を終了とし、
    # 波形の RMS の盛り上がり（-13dB 台が続く区間）とも一致することを確認した。
    "keiyo": {
        "title": "京葉線の午後",
        "audio": "src/game/assets/track01.mp3",
        # サビ「恋する気持ちが止まらない奇跡みたいに〜チーマイマイマイチーマイ
        # 魔法をかけてよ／奇跡を起こして」の反復ブロック（歌詞 67.8〜83.9秒と
        # 148.0〜161.0秒）。1番は次の Aメロ（97.5秒）の手前まで、2番は末尾行の
        # 歌唱終わり（約167秒）まで
        "fever": [[67.8, 90.0], [148.0, 167.0]],
        "chart_v5": True,
        # サビは歌に合わせてタッチできるよう主レイヤーをボーカルに寄せる（オーナー指示 2026-11-20）
        "chorus_layer": "vocal",
        "chorus_bonus": 0.5,
        "flick": True,
        "flick_budget": {"easy": 9, "normal": 12, "hard": 14},
    },
    "umi": {
        "title": "千葉の海に溶けてゆく",
        "audio": "src/game/assets/track02.mp3",
        # サビ「恋の記憶は泡のよう〜千葉の海に溶けてゆく〜サヨナラの言葉も
        # 言えずに」の反復ブロック（歌詞 29.8〜53.9秒と 76.3〜99.9秒）。
        # 終了は次の Aメロ（59.0秒／104.4秒）の手前
        "fever": [[29.8, 57.0], [76.3, 102.0]],
        "chart_v5": True,
        # サビは歌に合わせてタッチできるよう主レイヤーをボーカルに寄せる（オーナー指示 2026-11-20）
        "chorus_layer": "vocal",
        "chorus_bonus": 0.5,
        "flick": True,
        "flick_budget": {"easy": 9, "normal": 17, "hard": 24},
    },
    "yoru": {
        "title": "繋いだ手と朱い夜",
        "audio": "src/game/assets/track03.mp3",
        # サビ「回る回る世界の中心で〜チーマイマイマイチーマイ〜ハートがもう
        # 止まらないんだから」の反復ブロック（歌詞 50.8〜70.2秒と
        # 127.5〜147.1秒）。1番は約74秒からの器楽の間奏の手前まで、
        # 2番は曲の終わり近く（RMS が落ちる 152秒）まで
        "fever": [[50.8, 74.0], [127.5, 152.0]],
        "chart_v5": True,
        # サビは歌に合わせてタッチできるよう主レイヤーをボーカルに寄せる（オーナー指示 2026-11-20）
        "chorus_layer": "vocal",
        "chorus_bonus": 0.5,
        "flick": True,
        "flick_budget": {"easy": 8, "normal": 11, "hard": 11},
    },
}
