import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Timer } from 'ponczek/core/timer';
import { TransitionEffect } from 'ponczek/effects/transition-effect';
import { Color } from 'ponczek/gfx/color';
import { Screen } from 'ponczek/gfx/screen';
import { Texture } from 'ponczek/gfx/texture';

const WAIT_TIME_MS = 200;

enum TransitionState {
  FadeOut,
  Waiting,
  FadeIn,
}

/**
 * Scene that renders in-and-out transition effect with user defined action in between.
 */
export class TransitionScene extends Scene {
  private action: () => void;
  private animationTimeMs: number;
  private transitionOut: Texture;
  private transitionIn: Texture;
  private color: Color;

  private effect: TransitionEffect;
  private timer: Timer;
  private state: TransitionState = TransitionState.FadeOut;

  /**
   * Creates new transition with user defined action.
   * The transition begins with `animationTimeMs` ms in-transition, a `WAIT_TIME_MS` ms waiting time and `animationTimeMs` ms out-transition.
   * User can also specify transition fill color (defaults to black).
   */
  constructor(action: () => void, animationTimeMs: number, transitionOut: Texture, transitionIn: Texture, color: Color = Color.black) {
    super();
    this.action = action;
    this.animationTimeMs = animationTimeMs;
    this.transitionOut = transitionOut;
    this.transitionIn = transitionIn;
    this.color = color;

    this.effect = new TransitionEffect(this.transitionOut);
    this.effect.transitionColor = this.color;

    this.timer = new Timer();
    this.timer.set(this.animationTimeMs);
  }

  update(): void {
    if (this.state === TransitionState.FadeOut) {
      this.effect.cutoff = this.timer.getProgress();

      if (this.timer.check()) {
        this.effect.transitionTexture = this.transitionIn;

        SceneManager.popScene();
        this.action();
        SceneManager.pushScene(this);

        this.state = TransitionState.Waiting;
        this.timer.set(WAIT_TIME_MS);
      }
    }

    if (this.state === TransitionState.Waiting) {
      if (this.timer.check()) {
        this.timer.set(this.animationTimeMs);
        this.state = TransitionState.FadeIn;
      }
    }

    if (this.state === TransitionState.FadeIn) {
      this.effect.cutoff = 1 - this.timer.getProgress();

      if (this.timer.check()) {
        SceneManager.popScene();
      }
    }
  }

  render(scr: Screen): void {
    this.effect.applyToScreen(scr);

    if (this.state === TransitionState.Waiting) {
      scr.clearScreen(this.color);
    }
  }
}
