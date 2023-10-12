import { Ponczek } from 'ponczek/ponczek';

const DEFAULT_KEY = 'gamedata';

/**
 * Singleton class representing key-value storage for game data (like saves, highscores, achievements etc.).
 */
export abstract class Datastore {
  /**
   * Writes given data to storage under specifed `key`.
   * Given data has to be JSON serializable to be written.
   */
  public static write<T>(data: T, key: string = DEFAULT_KEY): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      Ponczek._log(`Saved data for key "${key}"`);
    } catch (e) {
      Ponczek._log(`Cannot save data for key "${key}"`);
    }
  }

  /**
   * Reads data from storage for specified `key`.
   * Returns requested data or `null` when there's nothing saved for that `key`, or when data couldn't be read.
   */
  public static read<T>(key: string = DEFAULT_KEY): (T | null) {
    try {
      const data = window.localStorage.getItem(key);
      Ponczek._log(`Loaded data for key "${key}"`);
      return (data) ? JSON.parse(data) : null;
    } catch (e) {
      Ponczek._log(`Cannot load data for key "${key}"`);
      return null;
    }
  }

  /**
   * Checks if the data exists for specified `key`.
   * Returns `true` when there is something written for that `key`, `false` otherwise.
   */
  public static exists(key: string = DEFAULT_KEY): boolean {
    try {
      const data = window.localStorage.getItem(key);
      return !!data;
    } catch (e) {
      return false;
    }
  }

  /**
   * Deletes data for specified `key`. Does nothing when there is no data for that `key`.
   */
  public static delete(key: string = DEFAULT_KEY): void {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      Ponczek._log(`Could not remove data for key "${key}"`);
    }
  }
}
