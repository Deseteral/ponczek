import { GraphicsDevice } from 'marmolada/graphics-device';

export abstract class Stage {
  abstract onActivate(): void;
  abstract update(): void;
  abstract render(g: GraphicsDevice): void;
  abstract onDestroy(): void;
}
