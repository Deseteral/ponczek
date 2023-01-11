import { Assets } from 'ponczek/core/assets';
import { Input } from 'ponczek/core/input';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ReplaceColorEffect } from 'ponczek/effects/replace-color-effect';
import { Engine } from 'ponczek/engine';
import { Color } from 'ponczek/gfx/color';
import { Screen } from 'ponczek/gfx/screen';
import { Texture } from 'ponczek/gfx/texture';
import { GridView } from 'ponczek/gui/grid-view';
import { Vector2 } from 'ponczek/math/vector2';
import { ENDESGA16Palette, ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { CameraTestScene } from 'src/scenes/camera-test-scene';
import { DrawingTestScene } from 'src/scenes/drawing-test-scene';
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

  public drawCell(item: (Item | null), _row: number, _column: number, x: number, y: number, isSelected: boolean, scr: Screen): void {
    if (!item) return;

    const selectionChar = isSelected ? '>' : ' ';
    scr.drawText(`${selectionChar}${item.text}`, x, y, ENDESGA16PaletteIdx[6]);
  }
}

export class MainMenuScene extends Scene {
  private demoScenesGridView: DemoScenesGridView;
  private frameTexture: Texture;

  private gridPosition = new Vector2(13, 25);

  constructor() {
    super();
    Engine.defaultFont.generateColorVariants(ENDESGA16PaletteIdx);

    this.demoScenesGridView = new DemoScenesGridView();
    this.demoScenesGridView.cells = [
      [{ text: 'Camera', scene: () => new CameraTestScene() }],
      [{ text: 'Drawing', scene: () => new DrawingTestScene() }],
      [{ text: 'Effects', scene: () => new EffectsTestScene() }],
      [{ text: 'Font rendering', scene: () => new FontRenderingTestScene() }],
      [{ text: 'Grid view', scene: () => new GridViewTestScene() }],
      [{ text: 'Scene stack', scene: () => new SceneStackTestScene() }],
    ];

    this.frameTexture = Texture.copy(Assets.texture('frame'));

    const replaceColorEffect = new ReplaceColorEffect(Color.white, Color.transparent);
    replaceColorEffect.applyToTexture(this.frameTexture);

    replaceColorEffect.set(Color.gray, ENDESGA16PaletteIdx[6]);
    replaceColorEffect.applyToTexture(this.frameTexture);

    replaceColorEffect.set(Color.black, ENDESGA16PaletteIdx[3]);
    replaceColorEffect.applyToTexture(this.frameTexture);
  }

  update(): void {
    if (Input.getButtonDown('up')) this.demoScenesGridView.selectPreviousRow(true);
    if (Input.getButtonDown('down')) this.demoScenesGridView.selectNextRow(true);
    if (Input.getButtonDown('a')) SceneManager.pushScene(this.demoScenesGridView.selectedValue.scene());
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[4]);

    scr.drawText('Ponczek', 5, 5, ENDESGA16Palette.white);

    scr.color(ENDESGA16PaletteIdx[2]);
    scr.fillRect(this.gridPosition.x - 3, this.gridPosition.y - 2, this.demoScenesGridView.totalWidth + 9, this.demoScenesGridView.totalHeight + 4);

    scr.drawNineSlice(this.frameTexture, this.gridPosition.x, this.gridPosition.y, this.demoScenesGridView.totalWidth, this.demoScenesGridView.totalHeight, 8, 8);
    this.demoScenesGridView.drawAt(this.gridPosition, scr);
  }
}
