import { GraphicsDevice } from 'marmolada/graphics-device';

export abstract class Table {
  onNextTableCb: () => void;
  onPreviousTableCb: () => void;
  openBook: () => void;

  constructor(onNextTableCb: () => void, onPreviousTableCb: () => void, openBook: () => void) {
    this.onNextTableCb = onNextTableCb;
    this.onPreviousTableCb = onPreviousTableCb;
    this.openBook = openBook;
  }

  abstract update(isSelected: boolean, ticksUntilDayOver: number): void;
  abstract render(g: GraphicsDevice): void;
}
