import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Assets, Input, SceneManager } from 'ponczek/core';
import { Color, Texture } from 'ponczek/gfx';
import { withTransition } from 'examples/utils/with-transition';
import { XNAPalette } from 'ponczek/palettes';
import { Random, Vector2 } from 'ponczek/math';
import { Ponczek } from 'ponczek/ponczek';

interface TestSprite {
  position: Vector2,
  velocity: Vector2,
}

export class SpriteDrawingStressTestScene extends Scene {
  private texture: Texture;
  private sprites: TestSprite[];
  private gravity: Vector2 = new Vector2(0, -0.5);

  constructor() {
    super();
    this.texture = Assets.texture('ponczek_sprite');
    this.sprites = [];
    Ponczek.debugMode = true;
  }

  update(): void {
    // Simulate physics
    for (let i = 0; i < this.sprites.length; i += 1) {
      const s = this.sprites[i];
      s.position.add(s.velocity);
      s.velocity.sub(this.gravity);

      if ((Ponczek.screen.height - s.position.y) <= 16) {
        s.velocity.y = Random.default.nextInt(-15, -10);
        s.velocity.x = Random.default.nextInt(-5, 5);
      }

      if (s.position.x <= 0 || (s.position.x + 16) >= Ponczek.screen.width) {
        s.velocity.x = -s.velocity.x;
        s.position.x = Math.clamp(s.position.x, 0, Ponczek.screen.width);
      }
    }

    // Add new sprites
    let amount = 0;
    if (Input.getKey('KeyE')) amount = 1;
    if (Input.getKey('KeyR')) amount = 10;

    for (let i = 0; i < amount; i += 1) {
      this.sprites.push({ position: new Vector2(Ponczek.screen.width / 2, 5), velocity: Vector2.zero() });
    }

    // Back to main menu
    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());
  }

  render(scr: Screen): void {
    scr.clearScreen(XNAPalette.cornflowerBlue);

    for (let i = 0; i < this.sprites.length; i += 1) {
      const pos = this.sprites[i].position;
      scr.drawTexture(this.texture, pos.x, pos.y, 16, 16);
    }

    scr.drawText(`${this.sprites.length} sprites`, 0, 10, Color.white);
    scr.drawText('E adds 1\nR adds 10', 247, 0, Color.white);
  }
}
