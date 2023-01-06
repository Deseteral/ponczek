import { Input } from 'ponczek/core/input';
import { Scene } from 'ponczek/core/scene';
import { Engine } from 'ponczek/engine';
import { Color } from 'ponczek/gfx/color';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { GridView } from 'ponczek/gui/grid-view';
import { Vector2 } from 'ponczek/math/vector2';

interface Item {
  text: string,
}

class TestGridView extends GridView<Item> {
  constructor() {
    super(45, 18);
  }

  public drawCell(item: (Item | null), _row: number, _column: number, x: number, y: number, isSelected: boolean, g: GraphicsDevice): void {
    if (!item) return;
    g.drawText(item.text, new Vector2(x, y + 6), Color.black);
    g.color(isSelected ? Color.red : Color.darkSlateGray);
    g.drawRect(x, y, this.cellWidth, this.cellHeight);
  }
}

export class GridViewTestScene extends Scene {
  gridView = new TestGridView();
  gridViewWithWrap = new TestGridView();

  onActivate(): void {
    Engine.graphicsDevice.font(Engine.defaultFont);

    this.gridView.cells = [
      [{ text: 'this' }, { text: 'is' }, { text: 'test' }, null, null, { text: 'hello' }],
      [null, { text: 'hello' }, null, { text: 'oh! this will not fit' }],
      [null, { text: 'grid' }, null, { text: 'view' }, null],
    ];

    this.gridViewWithWrap.cells = [
      ...this.gridView.cells,
      [null, { text: 'with' }, { text: 'wrap' }],
    ];
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
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(Color.cornflowerBlue);
    this.gridView.drawAt(new Vector2(10, 10), g);

    this.gridViewWithWrap.drawAt(new Vector2(10, 100), g);
  }

  onDestroy(): void { }
}
