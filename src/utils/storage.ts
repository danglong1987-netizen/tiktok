import { TikTokAccount } from '../types';
import { INITIAL_ACCOUNTS } from './seedData';

const STORAGE_KEY = 'tiktok_checker_accounts_v1';
const SETTINGS_KEY = 'tiktok_checker_settings_v1';

export function loadAccountsFromStorage(): TikTokAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ACCOUNTS;
  } catch {
    return INITIAL_ACCOUNTS;
  }
}

export function saveAccountsToStorage(accounts: TikTokAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts to localStorage', err);
  }
}

export function resetToDefaultAccounts(): TikTokAccount[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
    return INITIAL_ACCOUNTS;
  } catch {
    return INITIAL_ACCOUNTS;
  }
}
