/*
 * 1.0.0:
 * TODO: Add support for seeding random number generator
 * TODO: Noise generator
 * TODO: Pathfinding
 * TODO: Some data structure to represent "texture tiles"
 * TODO: Scene transitions
 * TODO: Documentation
 * TODO: Template repository (to be used with npm/yarn create)
 *
 * Next release:
 * TODO: Add support for triangle rendering
 * TODO: Grid view scrolling
 * TODO: Data structure for defining color palettes
 * TODO: GUI text input
 * TODO: GUI button
 *
 * Future:
 * TODO: ImGui support
 * TODO: Dithering patterns
 * TODO: Frame timing
 * TODO: Particle system
 * TODO: Loading aseprite files
 * TODO: Entity component system
 * TODO: Automatic conversion of sounds to webm
 * TODO: Support page lifecycle APIs
 */

import 'ponczek/polyfills';
import { Input } from 'ponczek/core/input';
import { Screen } from 'ponczek/gfx/screen';
import { Font } from 'ponczek/gfx/font';
import { Assets } from 'ponczek/core/assets';
import { Color } from 'ponczek/gfx/color';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Scene } from 'ponczek/core/scene';
import { SplashScreenScene } from 'ponczek/scenes/splash-screen-scene';
import { Texture } from 'ponczek/gfx/texture';

const monogramDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABwAQMAAADsYuqRAAAABlBMVEX///8AAABVwtN+AAABb0lEQVR42nyQAYejTRCES3ut8ok1YvD6tNFKRLzWiWAdRv//n3V6ksUJ94DxKFV6AHZQO7eGwkr0oQuLH5G3rcRRYgOI7hwgPZHgEv+1CypBcDXlVAmWiJWg/ketNCDwhtP9nJ7uKBzapXOESeQH7sKVZppPsefJcHA7pc3NRzXahgdpZqJsJQixqfKvDsAz3by20AAQb7hPn5muNIXkuEpShES7xLeEQwpFhGi3OB4lZmjOX0m7hw7hmishUbfQVQhJL3GpN1y1Eq4akhxvTJ+eKvIUOwFJogpjsC8RJXrf2ChganoJLgBEZdWPzsbtJUT1bzFoS7icTol5sh0JfOBvGgKGE4IW9xIc04efRwBqczqgomnuH5d2SCVCOSXa7x8hRRuiXonV0Uzp+jzkeOH4Jw2LjfWY42tMFfm8VnpEk9S1kTw7pPAmHVTd/2UlrNV/jEYSA3PE/BzssiwhhOGJr5WBP6MWGAWjYBSMAgA9WDsJuJYmBQAAAABJRU5ErkJggg==';

// TODO: Maybe rename to Ponczek?
export abstract class Engine {
  public static ticks: number = 0;
  public static shouldCountTicks: boolean = true;

  public static defaultFont: Font;
  public static screen: Screen;

  public static debugMode: boolean = false;

  public static async initialize(width: number, height: number, initialScene: () => Scene, skipSplashScreen: boolean = false): Promise<void> {
    Engine.screen = new Screen(width, height);

    Input.initialize(Engine.screen.domElement);

    const monogramTexture = Texture.createFromSource(await Assets.fetchImageFromUrl(monogramDataUrl));
    Engine.defaultFont = new Font(monogramTexture, 8, 8);
    Engine.defaultFont.generateColorVariants([Color.black, Color.white]);
    Engine.screen.font(Engine.defaultFont);

    if (skipSplashScreen) {
      SceneManager.pushScene(initialScene());
    } else {
      SceneManager.pushScene(new SplashScreenScene(initialScene()));
    }

    const containerEl = document.getElementById('container');
    if (!containerEl) {
      throw new Error('Missing container element in DOM');
    }

    containerEl.innerHTML = '';
    containerEl.appendChild(Engine.screen.domElement);

    window.addEventListener('resize', () => Engine.onWindowResize());
    Engine.onWindowResize();
  }

  public static start(): void {
    Engine.loop();
  }

  public static log(msg: string): void {
    console.log(`%c[ponczek] ${msg}`, 'color: palevioletred');
  }

  private static loop(): void {
    const st = performance.now();

    for (let idx = 0; idx < Math.min(SceneManager.updateDepth, SceneManager.sceneStack.length); idx += 1) {
      SceneManager.sceneStack[idx].update();
    }

    for (let idx = Math.min(SceneManager.renderDepth, SceneManager.sceneStack.length - 1); idx >= 0; idx -= 1) {
      SceneManager.sceneStack[idx].render(Engine.screen);
    }

    if (Input.getKeyDown('F3')) Engine.debugMode = !Engine.debugMode;

    Input.update();

    if (Engine.shouldCountTicks) Engine.ticks += 1;

    if (Engine.debugMode) {
      const frameTime = (performance.now() - st);
      const fps = ((1000 / frameTime) | 0).toString().padStart(5, '0');
      Engine.screen.drawText(`${fps} fps, ${frameTime.toFixed(2)} ms`, 0, 0, Color.white);
    }

    requestAnimationFrame(Engine.loop);
  }

  private static onWindowResize(): void {
    const scaleByWidth = ((window.innerWidth / Engine.screen.width) | 0) || 1;
    const scaleByHeight = ((window.innerHeight / Engine.screen.height) | 0) || 1;

    const scale = ((Engine.screen.height * scaleByWidth) <= window.innerHeight)
      ? scaleByWidth
      : scaleByHeight;

    const canvasWidth = Engine.screen.width * scale;
    Engine.screen.domElement.style.width = `${canvasWidth}px`;
  }
}
