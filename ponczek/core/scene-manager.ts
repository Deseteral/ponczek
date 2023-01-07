import { Scene } from 'ponczek/core/scene';

export abstract class SceneManager {
  static sceneStack: Scene[] = [];

  static updateDepth = 1;
  static renderDepth = 2;

  static get activeScene(): (Scene | null) {
    return this.sceneStack[0] || null;
  }

  static pushScene(nextScene: Scene): void {
    SceneManager.activeScene?.onDestroy();
    SceneManager.sceneStack.unshift(nextScene);
    SceneManager.activeScene?.onActivate();
  }

  static popScene(): void {
    SceneManager.activeScene?.onDestroy();
    SceneManager.sceneStack.shift();
  }

  static backToRoot(): void {
    this.sceneStack = [this.sceneStack.at(-1)!];
  }
}
