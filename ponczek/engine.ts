/*
 * TODO: Noise generator
 * TODO: Pathfinding
 * TODO: Scene transitions
 * TODO: Automatic conversion of sounds to webm
 * TODO: Simple GUI system (something like playdate's gridview?)
 * TODO: Particle system
 * TODO: Font rendering
 * TODO: Stack based scene management
 * TODO: Add support for seeding random number generator
 * TODO: Support page lifecycle APIs
 * TODO: Rendering text inside rectangle
 */

import 'ponczek/polyfills';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Font } from 'ponczek/gfx/font';
import { Assets } from 'ponczek/core/assets';
import { Color } from 'ponczek/gfx/color';

export abstract class Engine {
  static width: number;
  static height: number;

  static activeScene: (Scene | null) = null;

  static ticks: number = 0;
  static shouldCountTicks: boolean = true;

  static defaultFont: Font;

  static context: CanvasRenderingContext2D;
  static graphicsDevice: GraphicsDevice;

  static initialize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('An error occured while creating canvas context');
    }

    this.context = ctx;
    this.context.imageSmoothingEnabled = false;
    this.graphicsDevice = new GraphicsDevice(this.context);

    Input.initialize(canvas);

    this.defaultFont = new Font(Assets.texture('monogram'), 8, 8);
    this.defaultFont.generateColorVariants([Color.black, Color.white]);

    const containerEl = document.getElementById('container');
    if (!containerEl) {
      throw new Error('Missing container element in DOM');
    }

    containerEl.innerHTML = '';
    containerEl.appendChild(canvas);

    window.addEventListener('resize', () => this.onWindowResize());
    this.onWindowResize();
  }

  static changeScene(nextScene: Scene): void {
    this.activeScene?.onDestroy();
    this.activeScene = nextScene;
    this.activeScene.onActivate();
  }

  static loop(): void {
    const scene = Engine.activeScene!;
    scene.update();
    scene.render(this.graphicsDevice);

    Input.update();

    if (Engine.shouldCountTicks) Engine.ticks += 1;

    requestAnimationFrame(() => this.loop());
  }

  static saveData<T>(data: T, key: string = 'save'): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      Engine.log(`Saved data for key "${key}"`);
    } catch (e) {
      Engine.log('Cannot save data');
    }
  }

  static hasSavedData(key: string = 'save'): boolean {
    try {
      const data = window.localStorage.getItem(key);
      return !!data;
    } catch (e) {
      return false;
    }
  }

  static loadData<T>(key: string = 'save'): T {
    try {
      const data = window.localStorage.getItem(key);
      if (!data) throw new Error(`No save data for key "${key}"`);

      Engine.log(`Loaded data for key "${key}"`);
      return JSON.parse(data);
    } catch (e) {
      throw new Error(`Cannot load data for key "${key}"`);
    }
  }

  static log(msg: string): void {
    console.log(`%c[ponczek] ${msg}`, 'color: palevioletred');
  }

  private static onWindowResize(): void {
    const windowWidth = window.innerWidth;
    const scale = ((windowWidth / this.width) | 0) || 1;
    const canvasWidth = this.width * scale;
    this.graphicsDevice.ctx.canvas.style.width = `${canvasWidth}px`;
  }
}
