import { Scene } from 'ponczek/core/scene';

export abstract class SceneManager {
  static sceneStack: Scene[] = [];

  static updateDepth = 1;
  static renderDepth = 2;

  static get activeScene(): Scene {
    return this.sceneStack[0]; // TODO: Loose typechecking
  }

  static pushScene(nextScene: Scene): void {
    SceneManager.sceneStack.unshift(nextScene);
  }

  static popScene(): void {
    SceneManager.sceneStack.shift();
  }

  static replaceScene(nextScene: Scene): void {
    this.sceneStack = [nextScene];
  }

  static backToRoot(): void {
    this.replaceScene(this.sceneStack.at(-1)!);
  }
}
