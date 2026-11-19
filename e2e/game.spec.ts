import { expect, test } from '@playwright/test';

// リズムゲーム（v1.1.0 で追加）の E2E。CD 側の画面遷移（data-view）と
// リズムゲーム側の状態（data-screen / data-song / data-difficulty / data-game）の
// 両方を見て、同居が壊れていないことを確かめる。

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#view-cover')).toBeVisible();
});

test('トップの「遊ぶ」ボタンからチーマイモード画面に入れる', async ({ page }) => {
  await expect(page.locator('#btn-open-game')).toBeVisible();
  await page.locator('#btn-open-game').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'game');
  await expect(page.locator('#view-game')).toBeVisible();
  await expect(page.locator('#menu-screen')).toBeVisible();
  await expect(page.locator('#view-game h1')).toHaveText('チーマイモード');
  // 操作説明はメニューには出さない（設定の中に入れた）
  await expect(page.locator('#menu-screen')).not.toContainText('ノーツが下の枠に重なったら');
  // 収録曲3曲がカルーセルに並ぶ
  await expect(page.locator('.carousel-slide')).toHaveCount(3);
  await expect(page.locator('.carousel-slide[data-song="keiyo"]')).toBeVisible();
});

test('チーマイモードでは CD 側の再生が止まる', async ({ page }) => {
  // 先に CD 側で再生を始める
  await page.locator('#btn-play-all').click();
  await expect(page.locator('body')).toHaveAttribute('data-playing', '1');
  await page.locator('#btn-home').click();
  await page.locator('#btn-open-game').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'game');
  await expect(page.locator('body')).toHaveAttribute('data-playing', '0');
});

test('曲と難易度を選べる', async ({ page }) => {
  await page.locator('#btn-open-game').click();
  await page.locator('.carousel-slide[data-song="umi"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-song', 'umi');
  await page.locator('#diff-row [data-diff="hard"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-difficulty', 'hard');
  await expect(page.locator('#diff-row [data-diff="hard"]')).toHaveAttribute('aria-pressed', 'true');
  // ドットからも選べる
  await page.locator('.carousel-dot[data-song="yoru"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-song', 'yoru');
});

test('設定ダイアログが開閉できる', async ({ page }) => {
  await page.locator('#btn-open-game').click();
  await page.locator('#settings-open').click();
  await expect(page.locator('#settings-dialog')).toBeVisible();
  // 操作説明（遊び方）は設定の中にある
  await expect(page.locator('#settings-dialog')).toContainText('遊び方');
  await expect(page.locator('#settings-dialog')).toContainText('ノーツが下の枠に重なったらタップ');
  // オフセットの増減が保存・表示される
  await page.locator('#offset-plus').click();
  await expect(page.locator('#offset-value')).toHaveText('+10ms');
  await expect(page.locator('body')).toHaveAttribute('data-offset', '10');
  await page.locator('#settings-close-bottom').click();
  await expect(page.locator('#settings-dialog')).toBeHidden();
});

test('選択を変えると確認音が鳴る', async ({ page }) => {
  await page.locator('#btn-open-game').click();
  await page.evaluate(() => {
    const w = window as unknown as { __uiSounds: number };
    w.__uiSounds = 0;
    document.addEventListener('app:sound', (e) => {
      if ((e as CustomEvent).detail?.kind === 'ui') w.__uiSounds += 1;
    });
  });
  // 難易度を変える
  await page.locator('#diff-row [data-diff="hard"]').click();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __uiSounds: number }).__uiSounds))
    .toBeGreaterThanOrEqual(1);
  // 曲を変える
  await page.locator('.carousel-dot[data-song="umi"]').click();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __uiSounds: number }).__uiSounds))
    .toBeGreaterThanOrEqual(2);
});

test('ゲームが始まり、Canvas が表示され、左上タップでメニューに戻る', async ({ page }) => {
  await page.locator('#btn-open-game').click();
  await page.locator('#start-button').click();
  await expect(page.locator('#game-screen')).toBeVisible();
  await expect(page.locator('#game-canvas')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-game', 'playing', { timeout: 30_000 });
  // 左上の ✕ の場所をタップして中断する
  await page.locator('#game-canvas').dispatchEvent('pointerdown', { clientX: 20, clientY: 20 });
  await expect(page.locator('#menu-screen')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-game', 'menu');
});

test('チーマイモード画面からトップへ戻れる（設定の横の「戻る」ボタン）', async ({ page }) => {
  await page.locator('#btn-open-game').click();
  await expect(page.locator('#view-game')).toBeVisible();
  await page.locator('.game-back').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'cover');
  await expect(page.locator('#view-cover')).toBeVisible();
  // もう一度入っても、メニュー画面から始まる
  await page.locator('#btn-open-game').click();
  await expect(page.locator('#menu-screen')).toBeVisible();
});
