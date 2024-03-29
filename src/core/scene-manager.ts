import { Scene } from 'ponczek/core/scene';
import { Screen } from 'ponczek/gfx/screen';

/**
 * Singleton class for `Scene` hierarchy management.
 * Scenes are stored using stack data structure, with the active scene on top.
 */
export abstract class SceneManager {
  /**
   * How many scenes should be updated each frame.
   */
  public static updateDepth = 1;

  /**
   * How many scenes should be rendered each frame.
   */
  public static renderDepth = 2;

  private static sceneStack: Scene[] = [];

  /**
   * Returns active scene.
   * Throws an error when no scene is active.
   */
  public static getActiveScene(): Scene {
    if (SceneManager.sceneStack.isEmpty()) {
      throw new Error('No active scene');
    }

    return SceneManager.sceneStack.at(0)!;
  }

  /**
   * Pushes given scene to the top of scene stack, making it the active scene.
   */
  public static pushScene(nextScene: Scene): void {
    SceneManager.sceneStack.unshift(nextScene);
  }

  /**
   * Removes scene from the top of scene stack.
   */
  public static popScene(): void {
    SceneManager.sceneStack.shift();
  }

  /**
   * Removes all scenes from the stack and makes `nextScene` next active scene.
   */
  public static clearStack(nextScene: Scene): void {
    while (SceneManager.sceneStack.length > 0) {
      SceneManager.popScene();
    }
    SceneManager.pushScene(nextScene);
  }

  /**
   * Removes all scenes except the oldest one, which will be the next active scene.
   */
  public static backToRoot(): void {
    while (SceneManager.sceneStack.length > 1) {
      SceneManager.popScene();
    }
  }

  public static _update(): void {
    for (let idx = 0; idx < Math.min(SceneManager.updateDepth, SceneManager.sceneStack.length); idx += 1) {
      SceneManager.sceneStack[idx].update();
    }
  }

  public static _render(screen: Screen): void {
    for (let idx = Math.min(SceneManager.renderDepth, SceneManager.sceneStack.length - 1); idx >= 0; idx -= 1) {
      SceneManager.sceneStack[idx].render(screen);
    }
  }
}
