import { Assets } from 'ponczek/core/assets';
import { Ponczek } from 'ponczek/ponczek';

export type SoundPlaybackId = number;

/**
 * Singleton class used to play audio assets.
 */
export abstract class SoundPlayer {
  private static idToName: Map<SoundPlaybackId, string> = new Map();

  /**
   * Plays sound of given name, that can be optionaly looped.
   * Returns unique id representing this specific playback (to be used e.g. for stopping).
   */
  public static playSound(name: string, loop: boolean = false): SoundPlaybackId {
    const { howl } = Assets.sound(name);
    const id = howl.play();
    howl.loop(loop, id);

    this.idToName.set(id, name);
    return id;
  }

  /**
   * Stops sound playback represented by the playback id.
   */
  public static stopSound(id: SoundPlaybackId): void {
    const name = this.idToName.get(id);

    if (!name) {
      Ponczek._log(`No sound with id ${id} was played`);
      return;
    }

    const sound = Assets.sound(name);
    sound.howl.stop(id);
  }
}
