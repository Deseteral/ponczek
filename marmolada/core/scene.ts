import { GraphicsDevice } from 'marmolada/gfx/graphics-device';

export abstract class Scene {
  abstract onActivate(): void;
  abstract update(): void;
  abstract render(g: GraphicsDevice): void;
  abstract onDestroy(): void;
}
