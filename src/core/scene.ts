import { Screen } from 'ponczek/gfx/screen';

/**
 * Data structure representing a single unit of your game.
 * This is where every game object is stored, updated and rendered.
 *
 * Examples of scenes are: options screen, pause sceen, single level, overworld map etc.
 */
export abstract class Scene {
  /**
   * Called every frame. This is where game logic should be handled - physics, input processing etc.
   */
  abstract update(): void;

  /**
   * Called every frame. This is where all of rendering code should be called.
   * Rendering happens using provided `Screen` object that draws to current video buffer.
   */
  abstract render(scr: Screen): void;
}
