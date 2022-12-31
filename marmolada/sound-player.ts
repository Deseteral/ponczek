import { Assets } from 'marmolada/assets';

export abstract class SoundPlayer {
  static playSound(name: string): void {
    const sound = Assets.sound(name);
    sound.howl.play();
  }
}
