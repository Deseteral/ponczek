export class Color {
  private _r: number;
  get r(): number { return this._r; }

  private _g: number;
  get g(): number { return this._g; }

  private _b: number;
  get b(): number { return this._b; }

  private _a: number;
  get a(): number { return this._a; }

  public get htmlString(): string {
    return `rgb(${(this._r * 255) | 0}, ${(this._g * 255) | 0}, ${(this._b * 255) | 0}, ${this._a})`;
  }

  constructor(r: number, g: number, b: number, a: number) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
  }

  equals(other: Color): boolean {
    return (this._r === other._r && this._g === other._g && this._b === other._b && this._a === other._a);
  }

  setFrom01(r: number, g: number, b: number, a: number = 1.0): Color {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
    return this;
  }

  static from01(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r, g, b, a);
  }

  setFrom0255(r: number, g: number, b: number, a: number = 255): Color {
    this._r = r / 255;
    this._g = g / 255;
    this._b = b / 255;
    this._a = a / 255;
    return this;
  }

  static from0255(r: number, g: number, b: number, a: number = 255): Color {
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }

  setFromRGBA(rgba: number): Color {
    const hex = rgba.toString(16);
    return this.setFromRGBAHex(hex);
  }

  static fromRGBA(rgba: number): Color {
    const hex = rgba.toString(16);
    return Color.fromRGBAHex(hex);
  }

  setFromRGBAHex(hex: string): Color {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = (parseInt(hex.slice(6, 8), 16) || 255);
    return this.setFrom0255(r, g, b, a);
  }

  static fromRGBAHex(hex: string): Color {
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = (parseInt(hex.slice(6, 8), 16) || 255) / 255;
    return new Color(r, g, b, a);
  }

  static transparent = Color.from01(0, 0, 0, 0);
  static white = Color.from01(1, 1, 1, 1);
  static black = Color.from01(0, 0, 0, 1);
  static red = Color.from01(1, 0, 0, 1);
  static green = Color.from01(0, 1, 0, 1);
  static blue = Color.from01(0, 0, 1, 1);
}
