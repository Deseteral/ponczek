import { Ponczek } from 'ponczek/ponczek';

const DEFAULT_KEY = 'gamedata';

export abstract class Datastore {
  public static write<T>(data: T, key: string = DEFAULT_KEY): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      Ponczek.log(`Saved data for key "${key}"`);
    } catch (e) {
      Ponczek.log(`Cannot save data for key "${key}"`);
    }
  }

  public static read<T>(key: string = DEFAULT_KEY): (T | null) {
    try {
      const data = window.localStorage.getItem(key);
      Ponczek.log(`Loaded data for key "${key}"`);
      return (data) ? JSON.parse(data) : null;
    } catch (e) {
      Ponczek.log(`Cannot load data for key "${key}"`);
      return null;
    }
  }

  public exists(key: string = DEFAULT_KEY): boolean {
    try {
      const data = window.localStorage.getItem(key);
      return !!data;
    } catch (e) {
      return false;
    }
  }

  public delete(key: string = DEFAULT_KEY): void {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      Ponczek.log(`Could not remove data for key "${key}"`);
    }
  }
}
