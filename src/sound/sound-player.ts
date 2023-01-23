import { Assets } from 'ponczek/core/assets';
import { Ponczek } from 'ponczek/ponczek';

export type SoundPlaybackId = number;

export abstract class SoundPlayer {
  private static idToName: Map<SoundPlaybackId, string> = new Map();

  static playSound(name: string, loop: boolean = false): SoundPlaybackId {
    const { howl } = Assets.sound(name);
    const id = howl.play();
    howl.loop(loop, id);

    this.idToName.set(id, name);
    return id;
  }

  static stopSound(id: SoundPlaybackId): void {
    const name = this.idToName.get(id);

    if (!name) {
      Ponczek.log(`No sound with id ${id} was played`);
      return;
    }

    const sound = Assets.sound(name);
    sound.howl.stop(id);
  }
}
