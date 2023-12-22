import { toString } from 'lodash';

export enum E_LOCAL_STORAGE_KEYS {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  SETTINGS = 'settings',
}

/**
 * Class for working with local storage
 */
export default class LocalStorage {
  /**
   * Set item to local storage
   * @param key - key
   * @param value - value
   */
  public static setItem(key: E_LOCAL_STORAGE_KEYS, value: unknown): void {
    let jsonValue: string;

    try {
      jsonValue = JSON.stringify(value);
    } catch (e) {
      jsonValue = toString(value);
    }

    localStorage.setItem(key, jsonValue);
  }

  /**
   * Get item from local storage
   * @param key - key
   */
  public static getItem<T>(key: E_LOCAL_STORAGE_KEYS): T | null {
    const value = localStorage.getItem(key);

    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (e) {
      return value as unknown as T;
    }
  }

  /**
   * Remove item from local storage
   * @param key - key
   */
  public static removeItem(key: E_LOCAL_STORAGE_KEYS): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear local storage
   */
  public static clear(): void {
    localStorage.clear();
  }
}
