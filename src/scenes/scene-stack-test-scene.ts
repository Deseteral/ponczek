import { Engine } from 'ponczek/engine';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
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

  public drawCell(item: (Item | null), _row: number, _column: number, x: number, y: number, isSelected: boolean, g: GraphicsDevice): void {
    if (!item) return;

    const selectionChar = isSelected ? '>' : ' ';
    g.drawText(`${selectionChar}${item.text}`, new Vector2(x, y), ENDESGA16PaletteIdx[6]);
  }
}

class PauseMenuScene extends Scene {
  private grid: PauseMenuGrid;
  private gridPosition: Vector2;
  private backgroundColor: Color;

  private readonly gridWidth = 120;

  constructor() {
    super();

    this.gridPosition = new Vector2(Engine.graphicsDevice.width / 2 - this.gridWidth / 2, 60);
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

  render(g: GraphicsDevice): void {
    g.color(this.backgroundColor);
    g.fillRect(0, 0, g.width, g.height);

    g.color(ENDESGA16PaletteIdx[2]);
    g.fillRect(this.gridPosition.x - 5, this.gridPosition.y - 5, this.gridWidth + 10, 48);
    this.grid.drawAt(this.gridPosition, g);
  }
}

export class SceneStackTestScene extends Scene {
  private rect: Rectangle;
  private direction: Vector2;

  private tmpVec = new Vector2();

  constructor() {
    super();
    this.rect = new Rectangle(random.nextInt(0, Engine.graphicsDevice.width / 2), random.nextInt(0, Engine.graphicsDevice.height / 2), 110, 30);

    const speed = 1;
    this.direction = new Vector2(speed, speed);
  }

  update(): void {
    const w = Engine.graphicsDevice.width;
    const h = Engine.graphicsDevice.height;

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

  render(g: GraphicsDevice): void {
    g.clearScreen(ENDESGA16PaletteIdx[9]);

    g.color(ENDESGA16PaletteIdx[10]);
    g.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

    // TODO: Convert to "draw inside rect"
    this.tmpVec.set(this.rect.x, this.rect.y + 1);
    g.drawText('Press "back"', this.tmpVec, ENDESGA16PaletteIdx[11]);

    this.tmpVec.set(this.rect.x, this.rect.y + 1 + 10);
    g.drawText('to open pause', this.tmpVec, ENDESGA16PaletteIdx[11]);

    this.tmpVec.set(this.rect.x, this.rect.y + 1 + 20);
    g.drawText('menu', this.tmpVec, ENDESGA16PaletteIdx[11]);
  }
}
