import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Timer } from 'ponczek/core/timer';
import { TransitionEffect } from 'ponczek/effects/transition-effect';
import { Color } from 'ponczek/gfx/color';
import { Screen } from 'ponczek/gfx/screen';
import { Texture } from 'ponczek/gfx/texture';

enum TransitionState {
  FadeOut,
  Waiting,
  FadeIn,
}

export class TransitionScene extends Scene {
  private nextScene: Scene;
  private animationTimeMs: number;
  private transitionOut: Texture;
  private transitionIn: Texture;
  private color: Color;

  private effect: TransitionEffect;
  private timer: Timer;
  private state: TransitionState = TransitionState.FadeOut;

  constructor(nextScene: Scene, animationTimeMs: number, transitionOut: Texture, transitionIn: Texture, color: Color = Color.black) {
    super();
    this.nextScene = nextScene;
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
        SceneManager.putSceneBehindActive(this.nextScene);
        this.state = TransitionState.Waiting;
        this.timer.set(200);
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
