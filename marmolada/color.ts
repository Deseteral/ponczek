export class Color {
  private r: number;
  private g: number;
  private b: number;
  private a: number;

  private cachedHtmlString: string;
  public get htmlString(): string {
    return this.cachedHtmlString;
  }

  private constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.cachedHtmlString = `rgba(${(this.r * 255) | 0},${(this.g * 255) | 0},${(this.b * 255) | 0},${(this.a * 255) | 0})`;
  }

  static from01(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r, g, b, a);
  }

  static from0255(r: number, g: number, b: number, a: number = 255): Color {
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }

  static fromRGBA(rgba: number): Color {
    const hex = rgba.toString(16);
    return Color.fromRGBAHex(hex);
  }

  static fromRGBAHex(hex: string): Color {
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = (parseInt(hex.slice(6, 8), 16) || 1.0) / 255;
    return new Color(r, g, b, a);
  }

  static transparent = Color.from01(0, 0, 0, 0);
  static white = Color.from01(1, 1, 1, 1);
  static black = Color.from01(0, 0, 0, 1);
  static aliceBlue = Color.fromRGBAHex('f0f8ff');
  static antiqueWhite = Color.fromRGBAHex('faebd7');
  static aqua = Color.fromRGBAHex('00ffff');
  static aquamarine = Color.fromRGBAHex('7fffd4');
  static azure = Color.fromRGBAHex('f0ffff');
  static beige = Color.fromRGBAHex('f5f5dc');
  static bisque = Color.fromRGBAHex('ffe4c4');
  static blanchedAlmond = Color.fromRGBAHex('ffebcd');
  static blue = Color.fromRGBAHex('0000ff');
  static blueViolet = Color.fromRGBAHex('8a2be2');
  static brown = Color.fromRGBAHex('a52a2a');
  static burlyWood = Color.fromRGBAHex('deb887');
  static cadetBlue = Color.fromRGBAHex('5f9ea0');
  static chartreuse = Color.fromRGBAHex('7fff00');
  static chocolate = Color.fromRGBAHex('d2691e');
  static coral = Color.fromRGBAHex('ff7f50');
  static cornflowerBlue = Color.fromRGBAHex('6495ed');
  static cornsilk = Color.fromRGBAHex('fff8dc');
  static crimson = Color.fromRGBAHex('dc143c');
  static cyan = Color.fromRGBAHex('00ffff');
  static darkBlue = Color.fromRGBAHex('00008b');
  static darkCyan = Color.fromRGBAHex('008b8b');
  static darkGoldenrod = Color.fromRGBAHex('b8860b');
  static darkGray = Color.fromRGBAHex('a9a9a9');
  static darkGreen = Color.fromRGBAHex('006400');
  static darkKhaki = Color.fromRGBAHex('bdb76b');
  static darkMagenta = Color.fromRGBAHex('8b008b');
  static darkOliveGreen = Color.fromRGBAHex('556b2f');
  static darkOrange = Color.fromRGBAHex('ff8c00');
  static darkOrchid = Color.fromRGBAHex('9932cc');
  static darkRed = Color.fromRGBAHex('8b0000');
  static darkSalmon = Color.fromRGBAHex('e9967a');
  static darkSeaGreen = Color.fromRGBAHex('8fbc8b');
  static darkSlateBlue = Color.fromRGBAHex('483d8b');
  static darkSlateGray = Color.fromRGBAHex('2f4f4f');
  static darkTurquoise = Color.fromRGBAHex('00ced1');
  static darkViolet = Color.fromRGBAHex('9400d3');
  static deepPink = Color.fromRGBAHex('ff1493');
  static deepSkyBlue = Color.fromRGBAHex('00bfff');
  static dimGray = Color.fromRGBAHex('696969');
  static dodgerBlue = Color.fromRGBAHex('1e90ff');
  static firebrick = Color.fromRGBAHex('b22222');
  static floralWhite = Color.fromRGBAHex('fffaf0');
  static forestGreen = Color.fromRGBAHex('228b22');
  static fuchsia = Color.fromRGBAHex('ff00ff');
  static gainsboro = Color.fromRGBAHex('dcdcdc');
  static ghostWhite = Color.fromRGBAHex('f8f8ff');
  static gold = Color.fromRGBAHex('ffd700');
  static goldenrod = Color.fromRGBAHex('daa520');
  static gray = Color.fromRGBAHex('808080');
  static green = Color.fromRGBAHex('008000');
  static greenYellow = Color.fromRGBAHex('adff2f');
  static honeydew = Color.fromRGBAHex('f0fff0');
  static hotPink = Color.fromRGBAHex('ff69b4');
  static indianRed = Color.fromRGBAHex('cd5c5c');
  static indigo = Color.fromRGBAHex('4b0082');
  static ivory = Color.fromRGBAHex('fffff0');
  static khaki = Color.fromRGBAHex('f0e68c');
  static lavender = Color.fromRGBAHex('e6e6fa');
  static lavenderBlush = Color.fromRGBAHex('fff0f5');
  static lawnGreen = Color.fromRGBAHex('7cfc00');
  static lemonChiffon = Color.fromRGBAHex('fffacd');
  static lightBlue = Color.fromRGBAHex('add8e6');
  static lightCoral = Color.fromRGBAHex('f08080');
  static lightCyan = Color.fromRGBAHex('e0ffff');
  static lightGoldenrodYellow = Color.fromRGBAHex('fafad2');
  static lightGray = Color.fromRGBAHex('d3d3d3');
  static lightGreen = Color.fromRGBAHex('90ee90');
  static lightPink = Color.fromRGBAHex('ffb6c1');
  static lightSalmon = Color.fromRGBAHex('ffa07a');
  static lightSeaGreen = Color.fromRGBAHex('20b2aa');
  static lightSkyBlue = Color.fromRGBAHex('87cefa');
  static lightSlateGray = Color.fromRGBAHex('778899');
  static lightSteelBlue = Color.fromRGBAHex('b0c4de');
  static lightYellow = Color.fromRGBAHex('ffffe0');
  static lime = Color.fromRGBAHex('00ff00');
  static limeGreen = Color.fromRGBAHex('32cd32');
  static linen = Color.fromRGBAHex('faf0e6');
  static magenta = Color.fromRGBAHex('ff00ff');
  static maroon = Color.fromRGBAHex('800000');
  static mediumAquamarine = Color.fromRGBAHex('66cdaa');
  static mediumBlue = Color.fromRGBAHex('0000cd');
  static mediumOrchid = Color.fromRGBAHex('ba55d3');
  static mediumPurple = Color.fromRGBAHex('9370db');
  static mediumSeaGreen = Color.fromRGBAHex('3cb371');
  static mediumSlateBlue = Color.fromRGBAHex('7b68ee');
  static mediumSpringGreen = Color.fromRGBAHex('00fa9a');
  static mediumTurquoise = Color.fromRGBAHex('48d1cc');
  static mediumVioletRed = Color.fromRGBAHex('c71585');
  static midnightBlue = Color.fromRGBAHex('191970');
  static mintCream = Color.fromRGBAHex('f5fffa');
  static mistyRose = Color.fromRGBAHex('ffe4e1');
  static moccasin = Color.fromRGBAHex('ffe4b5');
  static navajoWhite = Color.fromRGBAHex('ffdead');
  static navy = Color.fromRGBAHex('000080');
  static oldLace = Color.fromRGBAHex('fdf5e6');
  static olive = Color.fromRGBAHex('808000');
  static oliveDrab = Color.fromRGBAHex('6b8e23');
  static orange = Color.fromRGBAHex('ffa500');
  static orangeRed = Color.fromRGBAHex('ff4500');
  static orchid = Color.fromRGBAHex('da70d6');
  static paleGoldenrod = Color.fromRGBAHex('eee8aa');
  static paleGreen = Color.fromRGBAHex('98fb98');
  static paleTurquoise = Color.fromRGBAHex('afeeee');
  static paleVioletRed = Color.fromRGBAHex('db7093');
  static papayaWhip = Color.fromRGBAHex('ffefd5');
  static peachPuff = Color.fromRGBAHex('ffdab9');
  static peru = Color.fromRGBAHex('cd853f');
  static pink = Color.fromRGBAHex('ffc0cb');
  static plum = Color.fromRGBAHex('dda0dd');
  static powderBlue = Color.fromRGBAHex('b0e0e6');
  static purple = Color.fromRGBAHex('800080');
  static red = Color.fromRGBAHex('ff0000');
  static rosyBrown = Color.fromRGBAHex('bc8f8f');
  static royalBlue = Color.fromRGBAHex('4169e1');
  static saddleBrown = Color.fromRGBAHex('8b4513');
  static salmon = Color.fromRGBAHex('fa8072');
  static sandyBrown = Color.fromRGBAHex('f4a460');
  static seaGreen = Color.fromRGBAHex('2e8b57');
  static seaShell = Color.fromRGBAHex('fff5ee');
  static sienna = Color.fromRGBAHex('a0522d');
  static silver = Color.fromRGBAHex('c0c0c0');
  static skyBlue = Color.fromRGBAHex('87ceeb');
  static slateBlue = Color.fromRGBAHex('6a5acd');
  static slateGray = Color.fromRGBAHex('708090');
  static snow = Color.fromRGBAHex('fffafa');
  static springGreen = Color.fromRGBAHex('00ff7f');
  static steelBlue = Color.fromRGBAHex('4682b4');
  static tan = Color.fromRGBAHex('d2b48c');
  static teal = Color.fromRGBAHex('008080');
  static thistle = Color.fromRGBAHex('d8bfd8');
  static tomato = Color.fromRGBAHex('ff6347');
  static turquoise = Color.fromRGBAHex('40e0d0');
  static violet = Color.fromRGBAHex('ee82ee');
  static wheat = Color.fromRGBAHex('f5deb3');
  static whiteSmoke = Color.fromRGBAHex('f5f5f5');
  static yellow = Color.fromRGBAHex('ffff00');
  static yellowGreen = Color.fromRGBAHex('9acd32');
}
