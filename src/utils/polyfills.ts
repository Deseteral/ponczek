Math.radiansToDegrees = 180 / Math.PI;
Math.degreesToRadians = Math.PI / 180;

/**
 * Clamps given number between `min` and `max`.
 */
Math.clamp = function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
};

/**
 * Returns value for that key or `defaultValue` if there is none.
 */
Map.prototype.getOrElse = function getOr<K, V>(key: K, defaultValue: V): V { // eslint-disable-line no-extend-native
  return this.get(key) || defaultValue;
};

/**
 * Returns `true` when the array is empty (has length equal to zero).
 */
Array.prototype.isEmpty = function isEmpty(): boolean { // eslint-disable-line no-extend-native
  return this.length === 0;
};

String.prototype.capitalize = function capitalize(): string { // eslint-disable-line no-extend-native
  return this.charAt(0).toUpperCase() + this.slice(1);
};

declare global {
  interface Math {
    radiansToDegrees: number;
    degreesToRadians: number;
    clamp(num: number, min: number, max: number): number;
  }

  interface Map<K, V> {
    getOrElse(key: K, defaultValue: V): V;
  }

  interface Array<T> {
    isEmpty(): boolean;
  }

  interface String {
    capitalize(): string;
  }
}

export { };
