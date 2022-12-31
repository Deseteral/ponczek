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
    (await Promise.all(textureList.map((textureName) => this.loadTexture(textureName))))
      .forEach((texture, idx) => this.textures.set(textureList[idx], texture));
  }

  public static texture(name: string): Texture {
    const t = this.textures.get(name);
    if (!t) throw new Error(`Texture ${name} is not loaded`);
    return t;
  }

  static async loadTexture(name: string): Promise<Texture> {
    const image = await this.loadImageFromUrl(`assets/textures/${name}.png`);
    return { image, width: image.width, height: image.height };
  }

  private static async loadImageFromUrl(url: string): Promise<HTMLDrawable> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = url;
    });
  }
}
