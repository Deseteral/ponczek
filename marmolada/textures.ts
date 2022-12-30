const tableUrl = 'assets/table.png';
const burningUrl = 'assets/burning.png';
const cuttingUrl = 'assets/cutting.png';
const enchantingUrl = 'assets/enchanting.png';
const grindingUrl = 'assets/grinding.png';
const enchantingKeyUpUrl = 'assets/enchanting_keyup.png';
const enchantingKeyRightUrl = 'assets/enchanting_keyright.png';
const enchantingKeyDownUrl = 'assets/enchanting_keydown.png';
const enchantingKeyLeftUrl = 'assets/enchanting_keyleft.png';
const cauldronUrl = 'assets/cauldron.png';
const frameUrl = 'assets/frame.png';
const bubbleSmallUrl = 'assets/bubble_small.png';
const bubbleLargeUrl = 'assets/bubble_large.png';
const fireUrl = 'assets/fire.png';
const flowerUrl = 'assets/flower.png';
const herbUrl = 'assets/herb.png';
const knifeUrl = 'assets/knife.png';
const mortarUrl = 'assets/mortar.png';
const mushroomUrl = 'assets/mushroom.png';
const spellUrl = 'assets/spell.png';
const stoneUrl = 'assets/stone.png';
const xUrl = 'assets/x.png';
const bookUrl = 'assets/book.png';
const listPointerRightUrl = 'assets/list_pointer_right.png';
const coinUrl = 'assets/coin.png';
const circleUrl = 'assets/circle.png';
const menuLogoUrl = 'assets/menu_logo.png';
const fontUrl = 'assets/font.png';
const fontSmallUrl = 'assets/font_small.png';

export interface Texture {
  normal: HTMLCanvasElement,
  inverted: HTMLCanvasElement,
}

export abstract class Textures {
  static burningTexture: Texture;
  static cuttingTexture: Texture;
  static enchantingTexture: Texture;
  static grindingTexture: Texture;
  static tableTexture: Texture;
  static enchantingKeyUpTexture: Texture;
  static enchantingKeyRightTexture: Texture;
  static enchantingKeyDownTexture: Texture;
  static enchantingKeyLeftTexture: Texture;
  static cauldronTexture: Texture;
  static frameTexture: Texture;
  static bubbleSmallTexture: Texture;
  static bubbleLargeTexture: Texture;
  static fireTexture: Texture;
  static flowerTexture: Texture;
  static herbTexture: Texture;
  static knifeTexture: Texture;
  static mortarTexture: Texture;
  static mushroomTexture: Texture;
  static spellTexture: Texture;
  static stoneTexture: Texture;
  static xTexture: Texture;
  static bookTexture: Texture;
  static listPointerRightTexture: Texture;
  static coinTexture: Texture;
  static circleTexture: Texture;
  static menuLogoTexture: Texture;
  static fontTexture: Texture;
  static fontSmallTexture: Texture;

  static async loadTextures(): Promise<void> {
    Textures.burningTexture = await Textures.load(burningUrl);
    Textures.cuttingTexture = await Textures.load(cuttingUrl);
    Textures.enchantingTexture = await Textures.load(enchantingUrl);
    Textures.grindingTexture = await Textures.load(grindingUrl);
    Textures.tableTexture = await Textures.load(tableUrl);
    Textures.enchantingKeyUpTexture = await Textures.load(enchantingKeyUpUrl);
    Textures.enchantingKeyRightTexture = await Textures.load(enchantingKeyRightUrl);
    Textures.enchantingKeyDownTexture = await Textures.load(enchantingKeyDownUrl);
    Textures.enchantingKeyLeftTexture = await Textures.load(enchantingKeyLeftUrl);
    Textures.cauldronTexture = await Textures.load(cauldronUrl);
    Textures.frameTexture = await Textures.load(frameUrl);
    Textures.bubbleSmallTexture = await Textures.load(bubbleSmallUrl);
    Textures.bubbleLargeTexture = await Textures.load(bubbleLargeUrl);
    Textures.fireTexture = await Textures.load(fireUrl);
    Textures.flowerTexture = await Textures.load(flowerUrl);
    Textures.herbTexture = await Textures.load(herbUrl);
    Textures.knifeTexture = await Textures.load(knifeUrl);
    Textures.mortarTexture = await Textures.load(mortarUrl);
    Textures.mushroomTexture = await Textures.load(mushroomUrl);
    Textures.spellTexture = await Textures.load(spellUrl);
    Textures.stoneTexture = await Textures.load(stoneUrl);
    Textures.xTexture = await Textures.load(xUrl);
    Textures.bookTexture = await Textures.load(bookUrl);
    Textures.listPointerRightTexture = await Textures.load(listPointerRightUrl);
    Textures.coinTexture = await Textures.load(coinUrl);
    Textures.circleTexture = await Textures.load(circleUrl);
    Textures.menuLogoTexture = await Textures.load(menuLogoUrl);
    Textures.fontTexture = await Textures.load(fontUrl);
    Textures.fontSmallTexture = await Textures.load(fontSmallUrl);
  }

  private static async load(url: string): Promise<Texture> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(Textures.processTexture(img));
      img.src = url;
    });
  }

  private static processTexture(img: HTMLImageElement): Texture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const invertedCanvas = document.createElement('canvas');
    const ictx = invertedCanvas.getContext('2d')!;

    const w = img.width;
    const h = img.height;

    invertedCanvas.width = canvas.width = w;
    invertedCanvas.height = canvas.height = h;

    ctx.drawImage(img, 0, 0);

    const pixels = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) continue; // Leave transparent pixels alone

      const isBlack = pixels[i] === 0;
      const idx = (i / 4) | 0;
      const x = (idx % w) | 0;
      const y = (idx / w) | 0;

      // ctx.fillStyle = isBlack ? GameManager.primaryColor : GameManager.secondaryColor;
      ctx.fillStyle = isBlack ? 'black' : 'white';
      ctx.fillRect(x, y, 1, 1);

      // ictx.fillStyle = (!isBlack) ? GameManager.primaryColor : GameManager.secondaryColor;
      ictx.fillStyle = (!isBlack) ? 'white' : 'black';
      ictx.fillRect(x, y, 1, 1);
    }

    return { normal: canvas, inverted: invertedCanvas };
  }
}
