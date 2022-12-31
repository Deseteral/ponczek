import { Howl } from 'howler';

import textureList from '../assets/textures.json';
import soundList from '../assets/sounds.json';

type HTMLDrawable = HTMLCanvasElement | HTMLImageElement | ImageBitmap | OffscreenCanvas;

export interface Texture {
  image: HTMLDrawable,
  width: number,
  height: number,
}

export interface Sound {
  howl: Howl,
}

// TODO: Export name and url in asset list

export abstract class Assets {
  static textures: Map<string, Texture> = new Map();
  static sounds: Map<string, Sound> = new Map();

  public static async loadAssets(): Promise<void> {
    await Promise.all([
      ...(textureList.map((textureName) => this.loadTexture(textureName))),
      ...(soundList.map((soundName) => this.loadSound(soundName))),
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

  static async loadTexture(name: string): Promise<Texture> {
    try {
      const image = await this.loadImageFromUrl(`assets/textures/${name}.png`);
      const texture = { image, width: image.width, height: image.height };
      this.textures.set(name, texture);
      return texture;
    } catch (e) {
      throw new Error(`Cound not load texture ${name}`);
    }
  }

  static async loadSound(name: string): Promise<Sound> {
    try {
      const sound = await this.loadSoundFromUrl(`/assets/sounds/${name}.wav`);
      this.sounds.set(name, sound);
      return sound;
    } catch (e) {
      throw new Error(`Could not load sound ${name}`);
    }
  }

  private static loadImageFromUrl(url: string): Promise<HTMLDrawable> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject();
      image.src = url;
    });
  }

  private static loadSoundFromUrl(url: string): Promise<Sound> {
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
