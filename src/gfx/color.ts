/**
 * Data structure representing RGBA color.
 */
export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  /**
   * CSS respresentation of color.
   */
  public get cssString(): string {
    return `rgb(${(this.r * 255) | 0}, ${(this.g * 255) | 0}, ${(this.b * 255) | 0}, ${this.a})`;
  }

  /**
   * Creates new color from RGBA values that are number in range [0, 1].
   */
  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Returns true when colors are the same.
   */
  public equals(other: Color): boolean {
    return (this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a);
  }

  /**
   * Creates new color with the same values.
   * Allows for optional alpha channel overwrite.
   */
  public copy(overwriteAlpha: number = this.a): Color {
    return new Color(this.r, this.g, this.b, overwriteAlpha);
  }

  /**
   * Sets values from other color.
   */
  public setFromColor(color: Color): Color {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
    return this;
  }

  /**
   * Sets values from RGBA values in range [0, 1].
   */
  public setFrom01(r: number, g: number, b: number, a: number = 1.0): Color {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  /**
   * Creates new color from RGBA values that are number in range [0, 1].
   */
  public static from01(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r, g, b, a);
  }

  /**
   * Sets values from RGBA values in range [0, 255].
   */
  public setFrom0255(r: number, g: number, b: number, a: number = 255): Color {
    this.r = r / 255;
    this.g = g / 255;
    this.b = b / 255;
    this.a = a / 255;
    return this;
  }

  /**
   * Creates new color from RGBA values that are number in range [0, 255].
   */
  public static from0255(r: number, g: number, b: number, a: number = 255): Color {
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }

  /**
   * Sets values from 32-bit number representing RGBA values.
   */
  public setFromRGBA(rgba: number): Color {
    const hex = rgba.toString(16);
    return this.setFromRGBAHex(hex);
  }

  /**
   * Creates new color from 32-bit number representing RGBA values.
   */
  public static fromRGBA(rgba: number): Color {
    const hex = rgba.toString(16);
    return Color.fromRGBAHex(hex);
  }

  /**
   * Sets values from a string representing 32-bit RGBA value.
   */
  public setFromRGBAHex(hex: string): Color {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = (parseInt(hex.slice(6, 8), 16) || 255);
    return this.setFrom0255(r, g, b, a);
  }

  /**
   * Creates new color from a string representing 32-bit RGBA value.
   */
  public static fromRGBAHex(hex: string): Color {
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = (parseInt(hex.slice(6, 8), 16) || 255) / 255;
    return new Color(r, g, b, a);
  }

  /**
   * Linearly interpolates between colors `a` and `b` by `t`, and writes the resulting values into `out`.
   * `t` is a number in range [0, 1].
   */
  public static lerp(a: Color, b: Color, t: number, out: Color): void {
    const tt = Math.clamp(t, 0, 1);
    out.setFrom01(a.r + (b.r - a.r) * tt, a.g + (b.g - a.g) * tt, a.b + (b.b - a.b) * tt, a.a + (b.a - a.a) * tt);
  }

  // public static alphaBlend(f: Color, b: Color, out: Color): void {
  //   const alpha = 0.2;
  //   out.setFrom01(
  //     Math.clamp((alpha * f.r) + ((1 - alpha) * b.r), 0, 1),
  //     Math.clamp((alpha * f.g) + ((1 - alpha) * b.g), 0, 1),
  //     Math.clamp((alpha * f.b) + ((1 - alpha) * b.b), 0, 1),
  //     Math.clamp((alpha * f.a) + ((1 - alpha) * b.a), 0, 1),
  //   )
  // }

  public static transparent = Color.from01(0, 0, 0, 0);
  public static white = Color.from01(1, 1, 1, 1);
  public static gray = Color.fromRGBAHex('808080');
  public static black = Color.from01(0, 0, 0, 1);
  public static red = Color.from01(1, 0, 0, 1);
  public static green = Color.from01(0, 1, 0, 1);
  public static blue = Color.from01(0, 0, 1, 1);
}
