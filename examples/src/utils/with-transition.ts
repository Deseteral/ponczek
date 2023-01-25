import { Assets } from 'ponczek/core/assets';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Random } from 'ponczek/math/random';
import { TransitionScene } from 'ponczek/scenes/transition-scene';

const random = Random.default;

export function withTransition(action: () => void): void {
  const transitionTextures = [
    Assets.texture('transition_circle'),
    Assets.texture('transition_fan'),
    Assets.texture('transition_left_right'),
    Assets.texture('transition_noise'),
  ];

  SceneManager.pushScene(new TransitionScene(
    action,
    400,
    random.pickOne(transitionTextures),
    random.pickOne(transitionTextures),
  ));
}
