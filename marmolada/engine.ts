/*
 * TODO: Math library: Vectors, Rects etc.
 * TODO: Noise generator
 * TODO: Pathfinding
 * TODO: Stage transitions
 * TODO: Automatic conversion of sounds to webm
 * TODO: Simple GUI system (something like playdate's gridview?)
 * TODO: Timers
 * TODO: Particle system
 * TODO: Font rendering
 * TODO: Stack based scene management
 * TODO: Add support for seeding random number generator
 */

import 'marmolada/polyfills';
import { Stage } from 'marmolada/stage';
import { Input } from 'marmolada/input';
import { GraphicsDevice } from 'marmolada/graphics-device';

export abstract class Engine {
  static width: number;
  static height: number;

  static activeStage: (Stage | null) = null;

  static ticks: number = 0;
  static shouldCountTicks: boolean = true;

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

    const containerEl = document.getElementById('container');
    if (!containerEl) {
      throw new Error('Missing container element in DOM');
    }

    containerEl.innerHTML = '';
    containerEl.appendChild(canvas);
  }

  static changeStage(nextStage: Stage): void {
    this.activeStage?.onDestroy();
    this.activeStage = nextStage;
    this.activeStage.onActivate();
  }

  static tick(): void {
    const stage = Engine.activeStage!;
    stage.update();
    stage.render(this.graphicsDevice);

    Input.update();

    if (Engine.shouldCountTicks) Engine.ticks += 1;

    requestAnimationFrame(() => this.tick());
  }

  static saveData<T>(data: T, key: string = 'save'): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      console.log(`Saved data for key ${key}`);
    } catch (e) {
      console.log('Cannot save data');
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
      if (!data) throw new Error(`No save data for key ${key}`);

      console.log(`Loaded data from key ${key}`);
      return JSON.parse(data);
    } catch (e) {
      throw new Error(`Cannot load data for key ${key}`);
    }
  }
}
