// eslint-disable-next-line no-extend-native
Math.clamp = function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
};

Math.randomRange = function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

declare global {
  interface Math {
    clamp(num: number, min: number, max: number): number;
    randomRange(min: number, max: number): number;
  }
}

export {};
