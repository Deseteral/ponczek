/*
 * TODO: Noise generator
 * TODO: Pathfinding
 * TODO: Scene transitions
 * TODO: Automatic conversion of sounds to webm
 * TODO: Simple GUI system (something like playdate's gridview?)
 * TODO: Particle system
 * TODO: Font rendering
 * TODO: Add support for seeding random number generator
 * TODO: Support page lifecycle APIs
 * TODO: Rendering text inside rectangle
 * TODO: Dithering patterns
 * TODO: Frame timing
 * TODO: Data structure for defining color palettes
 * TODO: Setup double buffering
 */

import 'ponczek/polyfills';
import { Input } from 'ponczek/core/input';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Font } from 'ponczek/gfx/font';
import { Assets } from 'ponczek/core/assets';
import { Color } from 'ponczek/gfx/color';
import { SceneManager } from 'ponczek/core/scene-manager';

export abstract class Engine {
  public static width: number;
  public static height: number;

  public static ticks: number = 0;
  public static shouldCountTicks: boolean = true;

  public static defaultFont: Font;
  public static graphicsDevice: GraphicsDevice;

  public static initialize(width: number, height: number): void {
    Engine.width = width;
    Engine.height = height;

    const canvas = document.createElement('canvas');
    canvas.width = Engine.width;
    canvas.height = Engine.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('An error occured while creating canvas context');
    }

    ctx.imageSmoothingEnabled = false;
    Engine.graphicsDevice = new GraphicsDevice(ctx);

    Input.initialize(canvas);

    Engine.defaultFont = new Font(Assets.texture('monogram'), 8, 8);
    Engine.defaultFont.generateColorVariants([Color.black, Color.white]);
    Engine.graphicsDevice.font(Engine.defaultFont);

    const containerEl = document.getElementById('container');
    if (!containerEl) {
      throw new Error('Missing container element in DOM');
    }

    containerEl.innerHTML = '';
    containerEl.appendChild(canvas);

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
    const windowWidth = window.innerWidth;
    const scale = ((windowWidth / Engine.width) | 0) || 1;
    const canvasWidth = Engine.width * scale;
    Engine.graphicsDevice.ctx.canvas.style.width = `${canvasWidth}px`;
  }
}
