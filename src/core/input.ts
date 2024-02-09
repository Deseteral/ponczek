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
  public static pointerLeftPressed: boolean = false;
  public static pointerRightPressed: boolean = false;

  private static keyState: Map<string, boolean> = new Map();
  private static previousKeyState: Map<string, boolean> = new Map();

  private static binds: Map<string, string[]> = new Map();

  /**
   * Returns `true` if the key is pressed, `false` otherwise.
   *
   * See [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) for possible `key` values.
   */
  public static getKey(key: string): boolean {
    return Input.keyState.getOrElse(key, false);
  }

  /**
   * Returns `true` if the key is pressed and wasn't pressed on the previous frame, `false` otherwise.
   *
   * See [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) for possible `key` values.
   */
  public static getKeyDown(key: string): boolean {
    return Input.getKey(key) && !Input.previousKeyState.getOrElse(key, false);
  }

  /**
   * Returns `true` if the action is active, `false` otherwise.
   * Provided `action` string is an identifier representing bindable action.
   */
  public static getButton(action: string): boolean {
    const keys = Input.binds.get(action);
    if (!keys || keys.isEmpty()) {
      Ponczek._log(`Nothing bound to action ${action}`);
      return false;
    }

    for (let i = 0; i < keys.length; i += 1) {
      if (Input.getKey(keys[i])) return true;
    }
    return false;
  }

  /**
   * Returns `true` if the action is active and wasn't active on the previous frame, `false` otherwise.
   * Provided `action` string is an identifier representing bindable action.
   */
  public static getButtonDown(action: string): boolean {
    const keys = Input.binds.get(action);
    if (!keys || keys.isEmpty()) {
      Ponczek._log(`Nothing bound to action ${action}`);
      return false;
    }

    for (let i = 0; i < keys.length; i += 1) {
      if (Input.getKeyDown(keys[i])) return true;
    }
    return false;
  }

  /**
   * Creates an action with given name and assigns set of keys that will trigger that action.
   *
   * See [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) for possible `keys` values.
   */
  public static bindAction(action: string, keys: string[]): void {
    Input.binds.set(action, keys);
  }

  /**
   * Creates multiple actions with given names and assigns set of keys that will trigger those actions.
   *
   * See [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) for possible keys values.
   */
  public static bindActions(bindings: ({ [key: string]: string[] })): void {
    Input.binds = new Map(Object.entries(bindings));
  }

  /**
   * Binds GameBoy-like input bindings (`left`, `right`, `up`, `down`, `a` and `b`).
   */
  public static withGameBoyLikeBinds(): void {
    Input.bindActions({
      up: ['ArrowUp', 'KeyW'],
      down: ['ArrowDown', 'KeyS'],
      left: ['ArrowLeft', 'KeyA'],
      right: ['ArrowRight', 'KeyD'],
      a: ['Enter'],
      b: ['Escape'],
    });
  }

  public static _update(): void {
    for (const [key, value] of Input.keyState) {
      Input.previousKeyState.set(key, value);
    }
  }

  public static _initialize(canvas: HTMLCanvasElement): void {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey) return;
      Input.keyState.set(e.code, true);
      e.preventDefault();
    }, false);

    document.addEventListener('keyup', (e) => {
      if (e.metaKey) return;
      Input.keyState.set(e.code, false);
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

    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) Input.pointerLeftPressed = true;
      if (e.button === 2) Input.pointerRightPressed = true;
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) Input.pointerLeftPressed = false;
      if (e.button === 2) Input.pointerRightPressed = false;
    });
  }
}
