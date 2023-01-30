/*
 * 1.0.0:
 * TODO: Template repository (to be used with npm/yarn create)
 * TODO: Generate favicons for examples page
 *
 * Next release:
 * TODO: Text alignment
 * TODO: Camera boundaries
 * TODO: Camera shake
 * TODO: Add loading map from texture in tilemap test scene
 * TODO: Mouse buttons support
 * TODO: Add support for triangle rendering
 * TODO: Grid view scrolling
 * TODO: Data structure for defining color palettes
 * TODO: GUI text input
 * TODO: GUI button
 * TODO: Gamepad support
 *
 * Future:
 * TODO: Remove howler dependency
 * TODO: ImGui support
 * TODO: Dithering patterns
 * TODO: Frame timing
 * TODO: Particle system
 * TODO: Loading aseprite files
 * TODO: Entity component system
 * TODO: Automatic conversion of sounds to webm
 * TODO: Support page lifecycle APIs
 * TODO: Make 2D rendering optional and tie in with three.js for 3D
 */

import 'ponczek/utils/polyfills';
import { Input } from 'ponczek/core/input';
import { Screen } from 'ponczek/gfx/screen';
import { Font } from 'ponczek/gfx/font';
import { Color } from 'ponczek/gfx/color';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Scene } from 'ponczek/core/scene';
import { PonczekSplashScreenScene } from 'ponczek/scenes/ponczek-splash-screen-scene';
import { Assets } from 'ponczek/core/assets';

/**
 * Default start up option.
 */
export const STARTUP_NORMAL = 1 << 1;

/**
 * Starts without Ponczek splash screen.
 */
export const STARTUP_SKIP_SPLASH_SCREEN = 1 << 2;

/**
 * Skips the requirement to click "▶️ Play" before running the game loop.
 * Not recommended since it may introduce problems with sound playback in some browsers.
 */
export const STARTUP_AUTOPLAY = 1 << 3;

/**
 * Singleton class for general framework options and operations.
 */
export abstract class Ponczek {
  /**
   * Number of update ticks since application start.
   */
  public static ticks: number = 0;

  /**
   * Whether updates should increase `ticks` value.
   */
  public static shouldCountTicks: boolean = true;

  /**
   * Default font used to render debug information.
   */
  public static defaultFont: Font;

  /**
   * Drawing target that will be presented to the player.
   */
  public static screen: Screen;

  /**
   * Whether Ponczek is operating in debug mode. This might display debug information like performance stats.
   * Can be toggled using F3 key.
   */
  public static debugMode: boolean = false;

  /**
   * Initializes and starts new Ponczek application.
   * `width` and `height` represent the size of video buffer that you will be drawing on.
   * `startupConfig` is a bit mask deciding how the initial scene will run.
   */
  public static async initialize(width: number, height: number, initialScene: () => Scene, startupConfig: number = STARTUP_NORMAL): Promise<void> {
    Ponczek.screen = new Screen(width, height);

    Input._initialize(Ponczek.screen._domElement);

    const monogramTexture = await Assets.defaultFontTexture();
    Ponczek.defaultFont = new Font(monogramTexture, 8, 8);
    Ponczek.defaultFont.generateColorVariants([Color.black, Color.white]);
    Ponczek.screen.font(Ponczek.defaultFont);

    if (startupConfig & STARTUP_SKIP_SPLASH_SCREEN) {
      SceneManager.pushScene(initialScene());
    } else {
      SceneManager.pushScene(new PonczekSplashScreenScene(initialScene()));
    }

    const containerEl = document.getElementById('container');
    if (!containerEl) {
      throw new Error('Missing container element in DOM');
    }

    if (startupConfig & STARTUP_AUTOPLAY) {
      Ponczek.start();
    } else {
      containerEl.innerHTML = '▶ Play';
      containerEl.style.cursor = 'pointer';
      containerEl.addEventListener('click', () => {
        containerEl.style.cursor = 'default';
        Ponczek.start();
      }, { once: true });
    }
  }

  public static _log(msg: string): void {
    console.log(`%c[ponczek] ${msg}`, 'color: palevioletred');
  }

  private static start(): void {
    const containerEl = document.getElementById('container');
    if (!containerEl) {
      throw new Error('Missing container element in DOM');
    }

    containerEl.innerHTML = '';
    containerEl.appendChild(Ponczek.screen._domElement);

    window.addEventListener('resize', () => Ponczek.onWindowResize());
    Ponczek.onWindowResize();
    Ponczek.loop();
  }

  private static loop(): void {
    const st = performance.now();

    SceneManager._update();
    SceneManager._render(Ponczek.screen);

    if (Input.getKeyDown('F3')) Ponczek.debugMode = !Ponczek.debugMode;

    Input._update();

    if (Ponczek.shouldCountTicks) Ponczek.ticks += 1;

    if (Ponczek.debugMode) {
      const frameTime = (performance.now() - st);
      const fps = ((1000 / frameTime) | 0).toString().padStart(5, '0');
      Ponczek.screen.drawText(`${fps} fps, ${frameTime.toFixed(2)} ms`, 0, 0, Color.white);
    }

    requestAnimationFrame(Ponczek.loop);
  }

  private static onWindowResize(): void {
    const scaleByWidth = ((window.innerWidth / Ponczek.screen.width) | 0) || 1;
    const scaleByHeight = ((window.innerHeight / Ponczek.screen.height) | 0) || 1;

    const scale = ((Ponczek.screen.height * scaleByWidth) <= window.innerHeight)
      ? scaleByWidth
      : scaleByHeight;

    const canvasWidth = Ponczek.screen.width * scale;
    Ponczek.screen._domElement.style.width = `${canvasWidth}px`;
  }
}
