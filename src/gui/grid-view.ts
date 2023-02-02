import { Screen } from 'ponczek/gfx/screen';
import { Vector2 } from 'ponczek/math/vector2';

/**
 * Table-like UI component composed from user defined cells.
 */
export abstract class GridView<T> {
  /**
   * Two dimensional collection of cells.
   */
  public cells: (T | null)[][];

  /**
   * Width of a single cell in pixels.
   */
  public cellWidth: number;

  /**
   * Height of a single cell in pixels.
   */
  public cellHeight: number;

  /**
   * Controls whether drawing single cell contents will be clipped by its width and height.
   */
  public withCellClipping: boolean = true;

  /**
   * Drawing margin of a single cell (in pixels).
   */
  public cellMargin: Vector2 = new Vector2();

  /**
   * Reference to selected cell-value.
   */
  public get selectedValue(): T {
    return this.cells[this.selectedRow][this.selectedColumn]!;
  }

  /**
   * Drawing width of entire gridview (in pixels).
   */
  public get totalWidth(): number { // TODO: Cache this
    let maxw = 0;
    for (let row = 0; row < this.cells.length; row += 1) {
      maxw = Math.max(this.cells[row].length, maxw);
    }
    return (maxw * (this.cellWidth + this.cellMargin.x));
  }

  /**
   * Drawing height of entire gridview (in pixels).
   */
  public get totalHeight(): number { // TODO: Cache this
    return (this.cells.length * (this.cellHeight + this.cellMargin.y));
  }

  private selectedRow: number = 0;
  private selectedColumn: number = 0;

  /**
   * Creates new gridview with specified cell width and height.
   */
  constructor(cellWidth: number, cellHeight: number) {
    this.cells = [[]];
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  /**
   * Draws single cell for given cell item, located at `row` and `column` of the grid.
   * The cell should be drawn at given `x`, `y` position (cells upper-left corner).
   * Cells selection state is reflected by `isSelected` value.
   */
  public abstract drawCell(item: (T | null), row: number, column: number, x: number, y: number, isSelected: boolean, scr: Screen): void;

  /**
   * Draws entire gridview with its upper-left corner at specified position.
   */
  public drawAt(position: Vector2, scr: Screen): void {
    for (let row = 0; row < this.cells.length; row += 1) {
      for (let column = 0; column < this.cells[row].length; column += 1) {
        const isSelected = this.selectedColumn === column && this.selectedRow === row;
        if (isSelected) continue;
        this.actualDrawCell(position, column, row, false, scr);
      }
    }

    this.actualDrawCell(position, this.selectedColumn, this.selectedRow, true, scr);
  }

  /**
   * Selects cell to the right of currently selected cell.
   * If `wrap` is `true` it will select first value in this row when called on the last item.
   */
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

  /**
   * Selects cell to the left of currently selected cell.
   * If `wrap` is `true` it will select last value in this row when called on the first item.
   */
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

  /**
   * Selects cell below currently selected cell.
   * If `wrap` is `true` it will select first value in this column when called on the last item.
   */
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

  /**
   * Selects cell above currently selected cell.
   * If `wrap` is `true` it will select last value in this row when called on the first item.
   */
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

  private actualDrawCell(drawAt: Vector2, column: number, row: number, isSelected: boolean, scr: Screen): void {
    const x = drawAt.x + (column * (this.cellWidth + this.cellMargin.x));
    const y = drawAt.y + (row * (this.cellHeight + this.cellMargin.y));

    if (this.withCellClipping) scr.clip(x, y, this.cellWidth, this.cellHeight);
    this.drawCell(this.cells[row][column], row, column, x, y, isSelected, scr);
    scr.clip();
  }
}
