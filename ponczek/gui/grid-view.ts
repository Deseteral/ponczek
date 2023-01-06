import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Vector2 } from 'ponczek/math/vector2';

export abstract class GridView<T> {
  public cells: (T | null)[][];

  public cellWidth: number;
  public cellHeight: number;

  public selectedRow: number;
  public selectedColumn: number;

  constructor(cellWidth: number, cellHeight: number) {
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.selectedRow = 0;
    this.selectedColumn = 0;
  }

  public drawAt(position: Vector2, g: GraphicsDevice): void {
    for (let row = 0; row < this.cells.length; row += 1) {
      for (let column = 0; column < this.cells[row].length; column += 1) {
        const isSelected = this.selectedColumn === column && this.selectedRow === row;
        if (isSelected) continue;
        const x = position.x + (column * (this.cellWidth - 1));
        const y = position.y + (row * (this.cellHeight - 1));
        this.drawCell(this.cells[row][column], row, column, x, y, false, g);
      }
    }

    this.drawCell(
      this.cells[this.selectedRow][this.selectedColumn],
      this.selectedRow,
      this.selectedColumn,
      (position.x + (this.selectedColumn * (this.cellWidth - 1))),
      (position.y + (this.selectedRow * (this.cellHeight - 1))),
      true,
      g,
    );
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
