import { GraphicsDevice } from 'marmolada/graphics-device';
import { Sprites } from 'src/game/gfx/sprites';

// TODO: Convert to generic draw 9patch
export function drawFrame(x: number, y: number, w: number, h: number, g: GraphicsDevice, clippingRegion: () => void): void {
  const patchSize = 9;

  // top-left corner
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    0,
    0,
    patchSize,
    patchSize,
    x - patchSize,
    y - patchSize,
    patchSize,
    patchSize,
  );

  // top-right corner
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    patchSize * 2,
    0,
    patchSize,
    patchSize,
    x + w,
    y - patchSize,
    patchSize,
    patchSize,
  );

  // bottom-left corner
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    0,
    patchSize * 2,
    patchSize,
    patchSize,
    x - patchSize,
    y + h,
    patchSize,
    patchSize,
  );

  // bottom-right corner
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    patchSize * 2,
    patchSize * 2,
    patchSize,
    patchSize,
    x + w,
    y + h,
    patchSize,
    patchSize,
  );

  // top border
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    patchSize,
    0,
    patchSize,
    patchSize,
    x,
    y - patchSize,
    w,
    patchSize,
  );

  // bottom border
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    patchSize,
    patchSize * 2,
    patchSize,
    patchSize,
    x,
    y + h,
    w,
    patchSize,
  );

  // left border
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    0,
    patchSize,
    patchSize,
    patchSize,
    x - patchSize,
    y,
    patchSize,
    h,
  );

  // right border
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    patchSize * 2,
    patchSize,
    patchSize,
    patchSize,
    x + w,
    y,
    patchSize,
    h,
  );

  // middle
  g.drawTexturePart(
    Sprites.sprite('frame').normal,
    patchSize,
    patchSize,
    patchSize,
    patchSize,
    x,
    y,
    w,
    h,
  );

  // Clipping content inside
  g.ctx.save();
  g.ctx.beginPath();
  g.ctx.rect(x, y, w, h);
  g.ctx.clip();
  clippingRegion();
  g.ctx.restore();
}
