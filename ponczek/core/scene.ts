import { Screen } from 'ponczek/gfx/screen';

export abstract class Scene {
  abstract update(): void;
  abstract render(scr: Screen): void;
}
