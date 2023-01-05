import { Engine } from 'marmolada/engine';
import { Vector2 } from 'marmolada/math/vector2';

export abstract class Input {
  static pointer: Vector2 = new Vector2();

  private static keyState: Map<string, boolean> = new Map();
  private static previousKeyState: Map<string, boolean> = new Map();

  private static binds: Map<string, string[]> = new Map();

  static getKey(key: string): boolean {
    return this.keyState.getOrElse(key, false);
  }

  static getKeyDown(key: string): boolean {
    return this.getKey(key) && !this.previousKeyState.getOrElse(key, false);
  }

  static getButton(action: string): boolean {
    const keys = this.binds.get(action) ?? [];
    if (keys.isEmpty()) {
      Engine.log(`Nothing bound to action ${action}`);
      return false;
    }

    return keys.some((key) => this.getKey(key));
  }

  static getButtonDown(action: string): boolean {
    const keys = this.binds.get(action) ?? [];
    if (keys.isEmpty()) {
      Engine.log(`Nothing bound to action ${action}`);
      return false;
    }

    return keys.some((key) => this.getKeyDown(key));
  }

  static bindAction(action: string, keys: string[]): void {
    this.binds.set(action, keys);
  }

  static update(): void {
    this.previousKeyState = this.keyState;
    this.keyState = new Map(this.previousKeyState);
  }

  static initialize(canvas: HTMLCanvasElement): void {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey) return;
      this.keyState.set(e.key, true);
      e.preventDefault();
    }, false);

    document.addEventListener('keyup', (e) => {
      if (e.metaKey) return;
      this.keyState.set(e.key, false);
      e.preventDefault();
    }, false);

    canvas.addEventListener('mousemove', (e) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) | 0;
      const y = (e.clientY - rect.top) | 0;
      Input.pointer.x = ((x / canvas.clientWidth) * Engine.width) | 0;
      Input.pointer.y = ((y / canvas.clientHeight) * Engine.height) | 0;
    });
  }

  static withBinds(bindings: ({ [key: string]: string[] })): void {
    this.binds = new Map(Object.entries(bindings));
  }

  static withGameBoyLikeBinds(): void {
    this.withBinds({
      up: ['ArrowUp', 'w'],
      down: ['ArrowDown', 's'],
      left: ['ArrowLeft', 'a'],
      right: ['ArrowRight', 'd'],
      a: ['Enter'],
      b: ['Escape'],
    });
  }
}
