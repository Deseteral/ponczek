import { GraphicsDevice } from 'ponczek/gfx/graphics-device';

export abstract class Scene {
  abstract update(): void;
  abstract render(g: GraphicsDevice): void;
}
