import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Vector2 } from 'ponczek/math/vector2';

export abstract class GridView<T> {
  public cells: (T | null)[][];

  public cellWidth: number;
  public cellHeight: number;

  public selectedRow: number = 0;
  public selectedColumn: number = 0;

  public withClipping: boolean = true;

  public cellMargin: Vector2 = new Vector2();

  public get selectedValue(): T {
    return this.cells[this.selectedRow][this.selectedColumn]!;
  }

  // TODO: Cache this
  public get totalWidth(): number {
    let maxw = 0;
    for (let row = 0; row < this.cells.length; row += 1) {
      maxw = Math.max(this.cells[row].length, maxw);
    }
    return (maxw * (this.cellWidth + this.cellMargin.x));
  }

  // TODO: Cache this
  public get totalHeight(): number {
    return (this.cells.length * (this.cellHeight + this.cellMargin.y));
  }

  constructor(cellWidth: number, cellHeight: number) {
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  public drawAt(position: Vector2, g: GraphicsDevice): void {
    for (let row = 0; row < this.cells.length; row += 1) {
      for (let column = 0; column < this.cells[row].length; column += 1) {
        const isSelected = this.selectedColumn === column && this.selectedRow === row;
        if (isSelected) continue;
        this.actualDrawCell(position, column, row, false, g);
      }
    }

    this.actualDrawCell(position, this.selectedColumn, this.selectedRow, true, g);
  }

  private actualDrawCell(drawAt: Vector2, column: number, row: number, isSelected: boolean, g: GraphicsDevice): void {
    const x = drawAt.x + (column * (this.cellWidth + this.cellMargin.x));
    const y = drawAt.y + (row * (this.cellHeight + this.cellMargin.y));

    if (this.withClipping) g.clip(x, y, this.cellWidth, this.cellHeight);
    this.drawCell(this.cells[row][column], row, column, x, y, isSelected, g);
    g.clip();
  }

  public selectNextColumn(wrap: boolean = false): void {
    const max = this.cells[this.selectedRow].length - 1;

    if (this.selectedColumn === max) {
      if (wrap) {
        this.selectedColumn = -1;
      } else {
        return;
      }
    }

    let nextIdxWithValue = this.selectedColumn;
    while (nextIdxWithValue < max) {
      nextIdxWithValue += 1;

      if (this.cells[this.selectedRow][nextIdxWithValue]) {
        break;
      }
    }

    if (this.cells[this.selectedRow][nextIdxWithValue]) {
      this.selectedColumn = nextIdxWithValue;
    } else {
      if (wrap) {
        this.selectedColumn = -1;
        this.selectNextColumn();
      }
    }
  }

  public selectPreviousColumn(wrap: boolean = false): void {
    const max = this.cells[this.selectedRow].length - 1;

    if (this.selectedColumn === 0) {
      if (wrap) {
        this.selectedColumn = max + 1;
      } else {
        return;
      }
    }

    let nextIdxWithValue = this.selectedColumn;
    while (nextIdxWithValue > 0) {
      nextIdxWithValue -= 1;

      if (this.cells[this.selectedRow][nextIdxWithValue]) {
        break;
      }
    }

    if (this.cells[this.selectedRow][nextIdxWithValue]) {
      this.selectedColumn = nextIdxWithValue;
    } else {
      if (wrap) {
        this.selectedColumn = max + 1;
        this.selectPreviousColumn();
      }
    }
  }

  public selectNextRow(wrap: boolean = false): void {
    const max = this.cells.length - 1;

    if (this.selectedRow === max) {
      if (wrap) {
        this.selectedRow = -1;
      } else {
        return;
      }
    }

    let nextIdxWithValue = this.selectedRow;
    while (nextIdxWithValue < max) {
      nextIdxWithValue += 1;

      if (this.cells[nextIdxWithValue][this.selectedColumn]) {
        break;
      }
    }

    if (this.cells[nextIdxWithValue][this.selectedColumn]) {
      this.selectedRow = nextIdxWithValue;
    } else {
      if (wrap) {
        this.selectedRow = -1;
        this.selectNextRow();
      }
    }
  }

  public selectPreviousRow(wrap: boolean = false): void {
    const max = this.cells.length - 1;

    if (this.selectedRow === 0) {
      if (wrap) {
        this.selectedRow = max + 1;
      } else {
        return;
      }
    }

    let nextIdxWithValue = this.selectedRow;
    while (nextIdxWithValue > 0) {
      nextIdxWithValue -= 1;

      if (this.cells[nextIdxWithValue][this.selectedColumn]) {
        break;
      }
    }

    if (this.cells[nextIdxWithValue][this.selectedColumn]) {
      this.selectedRow = nextIdxWithValue;
    } else {
      if (wrap) {
        this.selectedRow = max + 1;
        this.selectPreviousRow();
      }
    }
  }

  public abstract drawCell(item: (T | null), row: number, column: number, x: number, y: number, isSelected: boolean, g: GraphicsDevice): void;
}
