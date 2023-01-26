import { Ponczek } from 'ponczek/ponczek';
import { Vector2 } from 'ponczek/math/vector2';

/**
 * Singleton class representing all input methods available for the player.
 */
export abstract class Input {
  /**
   * Pointer position in screen space.
   */
  public static readonly pointer: Vector2 = new Vector2();

  private static keyState: Map<string, boolean> = new Map();
  private static previousKeyState: Map<string, boolean> = new Map();

  private static binds: Map<string, string[]> = new Map();

  /**
   * @param key `KeyboardEvent.code` representing a physical key on the keyboard.
   * @returns `true` if the key is pressed, `false` otherwise.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
   */
  public static getKey(key: string): boolean {
    return this.keyState.getOrElse(key, false);
  }

  /**
   * @param key `KeyboardEvent.code` representing a physical key on the keyboard.
   * @returns `true` if the key is pressed and wasn't pressed on the previous frame, `false` otherwise.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
   */
  public static getKeyDown(key: string): boolean {
    return this.getKey(key) && !this.previousKeyState.getOrElse(key, false);
  }

  /**
   * @param action string representing bindable action.
   * @returns `true` if the action is active, `false` otherwise.
   */
  public static getButton(action: string): boolean {
    const keys = this.binds.get(action) ?? [];
    if (keys.isEmpty()) {
      Ponczek.log(`Nothing bound to action ${action}`);
      return false;
    }

    return keys.some((key) => this.getKey(key));
  }

  /**
   * @param action string representing bindable action.
   * @returns `true` if the action is active and wasn't active on the previous frame, `false` otherwise.
   */
  public static getButtonDown(action: string): boolean {
    const keys = this.binds.get(action) ?? [];
    if (keys.isEmpty()) {
      Ponczek.log(`Nothing bound to action ${action}`);
      return false;
    }

    return keys.some((key) => this.getKeyDown(key));
  }

  /**
   * Creates an action with given name and assigns set of keys that will trigger that action.
   * @param action name of the action.
   * @param keys array of `KeyboardEvent.code` that will be associated with this action.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
   */
  public static bindAction(action: string, keys: string[]): void {
    this.binds.set(action, keys);
  }

  /**
   * Creates multiple actions with given names and assigns set of keys that will trigger those actions.
   * @param bindings key-value object where `key` is an action name and `value` is array of `KeyboardEvent.code` associated with this action.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
   */
  public static bindActions(bindings: ({ [key: string]: string[] })): void {
    this.binds = new Map(Object.entries(bindings));
  }

  /**
   * Binds GameBoy-like input bindings (`left`, `right`, `up`, `down`, `a` and `b`).
   */
  public static withGameBoyLikeBinds(): void {
    this.bindActions({
      up: ['ArrowUp', 'KeyW'],
      down: ['ArrowDown', 'KeyS'],
      left: ['ArrowLeft', 'KeyA'],
      right: ['ArrowRight', 'KeyD'],
      a: ['Enter'],
      b: ['Escape'],
    });
  }

  public static _update(): void {
    // TODO: This might generate GC hits
    this.previousKeyState = this.keyState;
    this.keyState = new Map(this.previousKeyState);
  }

  public static _initialize(canvas: HTMLCanvasElement): void {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey) return;
      this.keyState.set(e.code, true);
      e.preventDefault();
    }, false);

    document.addEventListener('keyup', (e) => {
      if (e.metaKey) return;
      this.keyState.set(e.code, false);
      e.preventDefault();
    }, false);

    canvas.addEventListener('mousemove', (e) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) | 0;
      const y = (e.clientY - rect.top) | 0;
      Input.pointer.set(
        ((x / canvas.clientWidth) * canvas.width) | 0,
        ((y / canvas.clientHeight) * canvas.height) | 0,
      );
    });
  }
}
