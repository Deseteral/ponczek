Math.clamp = function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
};

// eslint-disable-next-line no-extend-native
Map.prototype.getOrElse = function getOr<K, V>(key: K, defaultValue: V): V {
  return this.get(key) || defaultValue;
};

// eslint-disable-next-line no-extend-native
Array.prototype.isEmpty = function isEmpty(): boolean {
  return this.length === 0;
};

declare global {
  interface Math {
    clamp(num: number, min: number, max: number): number;
  }

  interface Map<K, V> {
    getOrElse(key: K, defaultValue: V): V;
  }

  interface Array<T> {
    isEmpty(): boolean;
  }
}

export {};
