export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  public get htmlString(): string {
    return `rgb(${(this.r * 255) | 0}, ${(this.g * 255) | 0}, ${(this.b * 255) | 0}, ${this.a})`;
  }

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  equals(other: Color): boolean {
    return (this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a);
  }

  copy(overwriteAlpha: number = this.a): Color {
    return new Color(this.r, this.g, this.b, overwriteAlpha);
  }

  setFromColor(color: Color): Color {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
    return this;
  }

  setFrom01(r: number, g: number, b: number, a: number = 1.0): Color {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  static from01(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r, g, b, a);
  }

  setFrom0255(r: number, g: number, b: number, a: number = 255): Color {
    this.r = r / 255;
    this.g = g / 255;
    this.b = b / 255;
    this.a = a / 255;
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
  static gray = Color.fromRGBAHex('808080');
  static black = Color.from01(0, 0, 0, 1);
  static red = Color.from01(1, 0, 0, 1);
  static green = Color.from01(0, 1, 0, 1);
  static blue = Color.from01(0, 0, 1, 1);
}
