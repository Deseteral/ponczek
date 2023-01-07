import { Input } from 'ponczek/core/input';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Engine } from 'ponczek/engine';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { GridView } from 'ponczek/gui/grid-view';
import { Vector2 } from 'ponczek/math/vector2';
import { ENDESGA16Palette, ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { CameraTestScene } from 'src/scenes/camera-test-scene';
import { EffectsTestScene } from 'src/scenes/effects-test-scene';
import { FontRenderingTestScene } from 'src/scenes/font-rendering-test-scene';
import { GridViewTestScene } from 'src/scenes/grid-view-test-scene';
import { SceneStackTestScene } from 'src/scenes/scene-stack-test-scene';

interface Item {
  text: string,
  scene: () => Scene,
}

class DemoScenesGridView extends GridView<Item> {
  constructor() {
    super(120, 10);
  }

  public drawCell(item: (Item | null), _row: number, _column: number, x: number, y: number, isSelected: boolean, g: GraphicsDevice): void {
    if (!item) return;

    const selectionChar = isSelected ? '>' : ' ';
    g.drawText(`${selectionChar}${item.text}`, new Vector2(x, y), ENDESGA16PaletteIdx[6]);
  }
}

export class MainMenuScene extends Scene {
  private demoScenesGridView: DemoScenesGridView;

  constructor() {
    super();
    Engine.defaultFont.generateColorVariants(ENDESGA16PaletteIdx);

    this.demoScenesGridView = new DemoScenesGridView();
    this.demoScenesGridView.cells = [
      [{ text: 'Camera', scene: () => new CameraTestScene() }],
      [{ text: 'Effects', scene: () => new EffectsTestScene() }],
      [{ text: 'Font rendering', scene: () => new FontRenderingTestScene() }],
      [{ text: 'Grid view', scene: () => new GridViewTestScene() }],
      [{ text: 'Scene stack', scene: () => new SceneStackTestScene() }],
    ];
  }

  update(): void {
    if (Input.getButtonDown('up')) this.demoScenesGridView.selectPreviousRow(true);
    if (Input.getButtonDown('down')) this.demoScenesGridView.selectNextRow(true);
    if (Input.getButtonDown('a')) SceneManager.pushScene(this.demoScenesGridView.selectedValue.scene());
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(ENDESGA16PaletteIdx[4]);
    g.drawText('Ponczek', new Vector2(5, 5), ENDESGA16Palette.white);
    this.demoScenesGridView.drawAt(new Vector2(5, 20), g);
  }
}
