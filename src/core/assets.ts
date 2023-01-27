import { Howl } from 'howler';
import { HTMLTextureSource, Texture } from 'ponczek/gfx/texture';
import { Sound } from 'ponczek/sound/sound';

/**
 * Definition of an asset to be used by asset loader.
 */
export type AssetDefinition = [ name: string, format: string ];

/**
 * Singleton class that manages game assets.
 */
export abstract class Assets {
  private static textures: Map<string, Texture> = new Map();
  private static sounds: Map<string, Sound> = new Map();

  /**
   * Loads assets from provided asset definitions.
   * Returns a promise that fulfils when all assets are loaded.
   */
  public static async loadAssets(textureList: AssetDefinition[], soundList: AssetDefinition[]): Promise<void> {
    await Promise.all([
      ...(textureList.map(([name, format]) => this.loadTexture(name, format))),
      ...(soundList.map(([name, format]) => this.loadSound(name, format))),
    ]);
  }

  /**
   * Returns texture with a given name.
   * Throws an error when no such texture is loaded.
   */
  public static texture(name: string): Texture {
    const t = this.textures.get(name);
    if (!t) throw new Error(`Texture ${name} is not loaded`);
    return t;
  }

  /**
   * Returns sound with a given name.
   * Throws an error when no such texture is loaded.
   */
  public static sound(name: string): Sound {
    const s = this.sounds.get(name);
    if (!s) throw new Error(`Sound ${name} is not loaded`);
    return s;
  }

  /**
   * Returns texture of default font.
   */
  public static async defaultFontTexture(): Promise<Texture> {
    const monogramDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABwAQMAAADsYuqRAAAABlBMVEX///8AAABVwtN+AAABb0lEQVR42nyQAYejTRCES3ut8ok1YvD6tNFKRLzWiWAdRv//n3V6ksUJ94DxKFV6AHZQO7eGwkr0oQuLH5G3rcRRYgOI7hwgPZHgEv+1CypBcDXlVAmWiJWg/ketNCDwhtP9nJ7uKBzapXOESeQH7sKVZppPsefJcHA7pc3NRzXahgdpZqJsJQixqfKvDsAz3by20AAQb7hPn5muNIXkuEpShES7xLeEQwpFhGi3OB4lZmjOX0m7hw7hmishUbfQVQhJL3GpN1y1Eq4akhxvTJ+eKvIUOwFJogpjsC8RJXrf2ChganoJLgBEZdWPzsbtJUT1bzFoS7icTol5sh0JfOBvGgKGE4IW9xIc04efRwBqczqgomnuH5d2SCVCOSXa7x8hRRuiXonV0Uzp+jzkeOH4Jw2LjfWY42tMFfm8VnpEk9S1kTw7pPAmHVTd/2UlrNV/jEYSA3PE/BzssiwhhOGJr5WBP6MWGAWjYBSMAgA9WDsJuJYmBQAAAABJRU5ErkJggg==';
    return Texture.createFromSource(await this.fetchImageFromUrl(monogramDataUrl));
  }

  private static async loadTexture(name: string, format: string): Promise<Texture> {
    try {
      const image = await this.fetchImageFromUrl(`/textures/${name}.${format}`);
      const texture = Texture.createFromSource(image);
      this.textures.set(name, texture);
      return texture;
    } catch (e) {
      throw new Error(`Cound not load texture ${name}`);
    }
  }

  private static async loadSound(name: string, format: string): Promise<Sound> {
    try {
      const sound = await this.fetchSoundFromUrl(`/sounds/${name}.${format}`);
      this.sounds.set(name, sound);
      return sound;
    } catch (e) {
      throw new Error(`Could not load sound ${name}`);
    }
  }

  private static fetchImageFromUrl(url: string): Promise<HTMLTextureSource> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject();
      image.src = url;
    });
  }

  private static fetchSoundFromUrl(url: string): Promise<Sound> {
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
