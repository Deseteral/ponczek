/*
 * TODO: Noise generator
 * TODO: Pathfinding
 * TODO: Scene transitions
 * TODO: Automatic conversion of sounds to webm
 * TODO: Simple GUI system (something like playdate's gridview?)
 * TODO: Particle system
 * TODO: Add support for seeding random number generator
 * TODO: Support page lifecycle APIs
 * TODO: Dithering patterns
 * TODO: Frame timing
 * TODO: Data structure for defining color palettes
 * TODO: Setup double buffering
 * TODO: Loading aseprite files
 * TODO: Build ECS
 * TODO: Add texture flipping
 */

import 'ponczek/polyfills';
import { Input } from 'ponczek/core/input';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Font } from 'ponczek/gfx/font';
import { Assets } from 'ponczek/core/assets';
import { Color } from 'ponczek/gfx/color';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Scene } from 'ponczek/core/scene';
import { SplashScreenScene } from 'ponczek/scenes/splash-screen-scene';

export abstract class Engine {
  public static ticks: number = 0;
  public static shouldCountTicks: boolean = true;

  public static defaultFont: Font;
  public static graphicsDevice: GraphicsDevice;

  public static initialize(width: number, height: number, initialScene: () => Scene, skipSplashScreen: boolean = false): void {
    Engine.graphicsDevice = new GraphicsDevice(width, height);

    Input.initialize(Engine.graphicsDevice.domElement);

    Engine.defaultFont = new Font(Assets.texture('monogram'), 8, 8);
    Engine.defaultFont.generateColorVariants([Color.black, Color.white]);
    Engine.graphicsDevice.font(Engine.defaultFont);

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
    containerEl.appendChild(Engine.graphicsDevice.domElement);

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
    for (let idx = 0; idx < Math.min(SceneManager.updateDepth, SceneManager.sceneStack.length); idx += 1) {
      SceneManager.sceneStack[idx].update();
    }

    for (let idx = Math.min(SceneManager.renderDepth, SceneManager.sceneStack.length - 1); idx >= 0; idx -= 1) {
      SceneManager.sceneStack[idx].render(Engine.graphicsDevice);
    }

    Input.update();

    if (Engine.shouldCountTicks) Engine.ticks += 1;

    requestAnimationFrame(Engine.loop);
  }

  private static onWindowResize(): void {
    const scaleByWidth = ((window.innerWidth / Engine.graphicsDevice.width) | 0) || 1;
    const scaleByHeight = ((window.innerHeight / Engine.graphicsDevice.height) | 0) || 1;

    const scale = ((Engine.graphicsDevice.height * scaleByWidth) <= window.innerHeight)
      ? scaleByWidth
      : scaleByHeight;

    const canvasWidth = Engine.graphicsDevice.width * scale;
    Engine.graphicsDevice.domElement.style.width = `${canvasWidth}px`;
  }
}
