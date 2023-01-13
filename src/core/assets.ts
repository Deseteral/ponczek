import { Howl } from 'howler';
import { HTMLTextureSource, Texture } from 'ponczek/gfx/texture';

export type AssetDefinition = [ name: string, format: string ];

export interface Sound {
  howl: Howl,
}

export abstract class Assets {
  static textures: Map<string, Texture> = new Map();
  static sounds: Map<string, Sound> = new Map();

  public static async loadAssets(textureList: AssetDefinition[], soundList: AssetDefinition[]): Promise<void> {
    await Promise.all([
      ...(textureList.map(([name, format]) => this.loadTexture(name, format))),
      ...(soundList.map(([name, format]) => this.loadSound(name, format))),
    ]);
  }

  public static texture(name: string): Texture {
    const t = this.textures.get(name);
    if (!t) throw new Error(`Texture ${name} is not loaded`);
    return t;
  }

  public static sound(name: string): Sound {
    const s = this.sounds.get(name);
    if (!s) throw new Error(`Sound ${name} is not loaded`);
    return s;
  }

  public static async loadTexture(name: string, format: string): Promise<Texture> {
    try {
      const image = await this.fetchImageFromUrl(`/textures/${name}.${format}`);
      const texture = Texture.createFromSource(image);
      this.textures.set(name, texture);
      return texture;
    } catch (e) {
      throw new Error(`Cound not load texture ${name}`);
    }
  }

  public static async loadSound(name: string, format: string): Promise<Sound> {
    try {
      const sound = await this.fetchSoundFromUrl(`/sounds/${name}.${format}`);
      this.sounds.set(name, sound);
      return sound;
    } catch (e) {
      throw new Error(`Could not load sound ${name}`);
    }
  }

  public static fetchImageFromUrl(url: string): Promise<HTMLTextureSource> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject();
      image.src = url;
    });
  }

  public static fetchSoundFromUrl(url: string): Promise<Sound> {
    return new Promise((resolve, reject) => {
      const howl: Howl = new Howl({
        src: [url],
        preload: true,
        onload: () => resolve({ howl }),
        onloaderror: () => reject(),
      });
    });
  }
}