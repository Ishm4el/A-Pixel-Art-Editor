export default class Picture {
  width: number;
  height: number;
  pixels: string[];
  constructor(width: number, height: number, pixels: string[]) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  static empty(width: number, height: number, color: string) {
    const pixels: string[] = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  pixel(x: number, y: number) {
    return this.pixels[x + y * this.width];
  }

  draw(pixels: { x: number; y: number; color: string }[]) {
    const copy = this.pixels.slice();
    for (const { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}
