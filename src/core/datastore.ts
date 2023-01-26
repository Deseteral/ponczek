import { Ponczek } from 'ponczek/ponczek';

const DEFAULT_KEY = 'gamedata';

/**
 * Singleton class representing key-value storage for game data (like saves, highscores, achievements etc.).
 */
export abstract class Datastore {
  /**
   * Writes given data to storage under specifed `key`.
   * @param data JSON serializable data to be written.
   * @param key *(optional)* data identifier.
   */
  public static write<T>(data: T, key: string = DEFAULT_KEY): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      Ponczek.log(`Saved data for key "${key}"`);
    } catch (e) {
      Ponczek.log(`Cannot save data for key "${key}"`);
    }
  }

  /**
   * Reads data from storage for specified `key`.
   * @param key *(optional)* data identifier.
   * @returns requested data or `null` when there's nothing saved for that `key`, or data couldn't be read.
   */
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

  /**
   * Checks if the data exists for specified `key`.
   * @param key *(optional)* data identifier.
   * @returns `true` when there is something written for that `key`. `false` otherwise.
   */
  public exists(key: string = DEFAULT_KEY): boolean {
    try {
      const data = window.localStorage.getItem(key);
      return !!data;
    } catch (e) {
      return false;
    }
  }

  /**
   * Deletes data for specified `key`. Does nothing when there is no data for that `key`.
   * @param key *(optional)* data identifier.
   */
  public delete(key: string = DEFAULT_KEY): void {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      Ponczek.log(`Could not remove data for key "${key}"`);
    }
  }
}
