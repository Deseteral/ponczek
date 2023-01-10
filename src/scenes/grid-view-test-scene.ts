import { Input } from 'ponczek/core/input';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { GridView } from 'ponczek/gui/grid-view';
import { Vector2 } from 'ponczek/math/vector2';
import { ENDESGA16Palette } from 'ponczek/palettes/endesga16-palette';

interface Item {
  text: string,
}

class TestGridView extends GridView<Item> {
  constructor() {
    super(45, 18);
  }

  public drawCell(item: (Item | null), _row: number, _column: number, x: number, y: number, isSelected: boolean, g: GraphicsDevice): void {
    if (!item) return;

    g.color(ENDESGA16Palette.sap);
    g.fillRect(x, y, this.cellWidth, this.cellHeight);

    const selectionColor = isSelected ? ENDESGA16Palette.fabric : ENDESGA16Palette.pine;
    g.drawText(item.text, x + 2, y + 6, selectionColor);

    g.color(selectionColor);
    g.drawRect(x, y, this.cellWidth, this.cellHeight);
  }
}

export class GridViewTestScene extends Scene {
  private gridView: TestGridView = new TestGridView();
  private gridViewWithWrap: TestGridView = new TestGridView();

  constructor() {
    super();

    this.gridView = new TestGridView();
    this.gridViewWithWrap = new TestGridView();

    this.gridView.cells = [
      [{ text: 'this' }, { text: 'is' }, { text: 'test' }, null, null, { text: 'hello' }],
      [null, { text: 'hello' }, null, { text: 'oh! this will not fit' }],
      [null, { text: 'grid' }, null, { text: 'view' }, null],
    ];

    this.gridViewWithWrap.cells = [
      ...this.gridView.cells,
      [null, { text: 'with' }, { text: 'wrap' }],
    ];

    this.gridView.cellMargin.set(-1, -1);
    this.gridViewWithWrap.cellMargin.set(3, 3);
  }

  update(): void {
    if (Input.getKeyDown('d')) {
      this.gridView.selectNextColumn();
      this.gridViewWithWrap.selectNextColumn(true);
    }
    if (Input.getKeyDown('a')) {
      this.gridView.selectPreviousColumn();
      this.gridViewWithWrap.selectPreviousColumn(true);
    }

    if (Input.getKeyDown('s')) {
      this.gridView.selectNextRow();
      this.gridViewWithWrap.selectNextRow(true);
    }
    if (Input.getKeyDown('w')) {
      this.gridView.selectPreviousRow();
      this.gridViewWithWrap.selectPreviousRow(true);
    }

    if (Input.getButtonDown('a')) {
      console.log(`Selected value on gridView: ${this.gridView.selectedValue.text}`);
      console.log(`Selected value on gridViewWithWrap: ${this.gridViewWithWrap.selectedValue.text}`);
    }

    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(ENDESGA16Palette.darkBark);

    this.gridView.drawAt(new Vector2(10, 10), g);
    this.gridViewWithWrap.drawAt(new Vector2(10, 100), g);

    g.drawText('Use WASD to move selection', 5, 225, ENDESGA16Palette.sap);
  }
}
