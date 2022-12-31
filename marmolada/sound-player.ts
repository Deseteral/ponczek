import { Assets } from 'marmolada/assets';

export type SoundPlaybackId = number;

export interface PlaySoundOptions {
  loop: boolean,
}

const defaultPlaySoundOptions: (() => PlaySoundOptions) = () => ({
  loop: false,
});

export abstract class SoundPlayer {
  private static idToName: Map<SoundPlaybackId, string> = new Map();

  static playSound(name: string, options: PlaySoundOptions = defaultPlaySoundOptions()): SoundPlaybackId {
    const { howl } = Assets.sound(name);
    const id = howl.play();
    howl.loop(options.loop, id);

    this.idToName.set(id, name);
    return id;
  }

  static stopSound(id: SoundPlaybackId): void {
    const name = this.idToName.get(id);
    if (!name) throw new Error(`No sound with id ${id} was played`);
    const sound = Assets.sound(name);
    sound.howl.stop(id);
  }
}
