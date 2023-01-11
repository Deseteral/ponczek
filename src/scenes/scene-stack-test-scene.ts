import { Engine } from 'ponczek/engine';
import { Screen } from 'ponczek/gfx/screen';
import { Vector2 } from 'ponczek/math/vector2';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Rectangle } from 'ponczek/math/rectangle';
import { Random } from 'ponczek/math/random';
import { GridView } from 'ponczek/gui/grid-view';
import { Color } from 'ponczek/gfx/color';

const random = Random.default;

interface Item {
  text: string,
  action: () => void,
}

class PauseMenuGrid extends GridView<Item> {
  constructor(width: number) {
    super(width, 10);
  }

  public drawCell(item: (Item | null), _row: number, _column: number, x: number, y: number, isSelected: boolean, scr: Screen): void {
    if (!item) return;

    const selectionChar = isSelected ? '>' : ' ';
    scr.drawText(`${selectionChar}${item.text}`, x, y, ENDESGA16PaletteIdx[6]);
  }
}

class PauseMenuScene extends Scene {
  private grid: PauseMenuGrid;
  private gridPosition: Vector2;
  private backgroundColor: Color;

  private readonly gridWidth = 120;

  constructor() {
    super();

    this.gridPosition = new Vector2(Engine.screen.width / 2 - this.gridWidth / 2, 60);
    this.backgroundColor = ENDESGA16PaletteIdx[3].copy(0.9);

    this.grid = new PauseMenuGrid(this.gridWidth);
    this.grid.cells = [
      [{ text: 'Resume', action: () => SceneManager.popScene() }],
      [{ text: 'Some action', action: () => console.log('Some action') }],
      [{ text: 'Some submenu', action: () => console.log('Some submenu') }],
      [{ text: 'Return to menu', action: () => SceneManager.backToRoot() }],
    ];
  }

  update(): void {
    if (Input.getButtonDown('up')) this.grid.selectPreviousRow(true);
    if (Input.getButtonDown('down')) this.grid.selectNextRow(true);
    if (Input.getButtonDown('a')) this.grid.selectedValue.action();
    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(scr: Screen): void {
    scr.color(this.backgroundColor);
    scr.fillRect(0, 0, scr.width, scr.height);

    scr.color(ENDESGA16PaletteIdx[2]);
    scr.fillRect(this.gridPosition.x - 5, this.gridPosition.y - 5, this.gridWidth + 10, 48);
    this.grid.drawAt(this.gridPosition, scr);
  }
}

export class SceneStackTestScene extends Scene {
  private rect: Rectangle;
  private direction: Vector2;

  constructor() {
    super();
    this.rect = new Rectangle(random.nextInt(0, Engine.screen.width / 2), random.nextInt(0, Engine.screen.height / 2), 110, 30);

    const speed = 1;
    this.direction = new Vector2(speed, speed);
  }

  update(): void {
    const w = Engine.screen.width;
    const h = Engine.screen.height;

    const nx = this.rect.x + this.direction.x;
    const ny = this.rect.y + this.direction.y;
    const isColliding = nx <= 0 || ny <= 0 || nx >= (w - this.rect.width) || ny >= (h - this.rect.height);

    if (isColliding) {
      this.direction.rotateDeg(random.nextInt(80, 90)).normalize();
    } else {
      this.rect.x = nx;
      this.rect.y = ny;
    }

    if (Input.getButtonDown('b')) SceneManager.pushScene(new PauseMenuScene());
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[9]);

    scr.color(ENDESGA16PaletteIdx[10]);
    scr.fillRectR(this.rect);
    scr.drawTextInRectR('Press "back" to open pause menu', this.rect, ENDESGA16PaletteIdx[11]);
  }
}
