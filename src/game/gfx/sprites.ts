import { Assets, Texture } from 'marmolada/assets';
import { GameManager } from 'src/game/game-manager';

export interface Sprite {
  normal: Texture,
  inverted: Texture,
}

export abstract class Sprites {
  static sprites: Map<string, Sprite> = new Map();

  static loadSprites(): void {
    Assets.textures.forEach((texture, key) => {
      this.sprites.set(key, this.processTexture(texture));
    });
  }

  static sprite(name: string): Sprite {
    const s = this.sprites.get(name);
    if (!s) throw new Error(`Sprite ${name} does not exist`);
    return s;
  }

  private static processTexture(texture: Texture): Sprite {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const invertedCanvas = document.createElement('canvas');
    const ictx = invertedCanvas.getContext('2d')!;

    const w = texture.image.width;
    const h = texture.image.height;

    invertedCanvas.width = canvas.width = w;
    invertedCanvas.height = canvas.height = h;

    ctx.drawImage(texture.image, 0, 0);

    const pixels = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) continue; // Leave transparent pixels alone

      const isBlack = pixels[i] === 0;
      const idx = (i / 4) | 0;
      const x = (idx % w) | 0;
      const y = (idx / w) | 0;

      ctx.fillStyle = isBlack ? GameManager.primaryColor : GameManager.secondaryColor;
      ctx.fillRect(x, y, 1, 1);

      ictx.fillStyle = (!isBlack) ? GameManager.primaryColor : GameManager.secondaryColor;
      ictx.fillRect(x, y, 1, 1);
    }

    return {
      normal: { image: canvas, width: w, height: h },
      inverted: { image: invertedCanvas, width: w, height: h },
    };
  }
}