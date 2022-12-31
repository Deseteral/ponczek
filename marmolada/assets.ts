import textureList from '../assets/textures.json';

type HTMLDrawable = HTMLCanvasElement | HTMLImageElement | ImageBitmap | OffscreenCanvas;

export interface Texture {
  image: HTMLDrawable,
  width: number,
  height: number,
}

export abstract class Assets {
  static textures: Map<string, Texture> = new Map();

  public static async loadAssets(): Promise<void> {
    (await Promise.all(
      textureList
        .map((textureName) => `assets/textures/${textureName}.png`)
        .map((textureUrl) => this.loadTextureFromUrl(textureUrl)),
    )).forEach((texture, idx) => this.textures.set(textureList[idx], texture));
  }

  public static texture(name: string): Texture {
    const t = this.textures.get(name);
    if (!t) throw new Error(`Texture ${name} is not loaded`);
    return t;
  }

  private static async loadTextureFromUrl(url: string): Promise<Texture> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve({ image, width: image.width, height: image.height });
      image.src = url;
    });
  }
}
