import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Key, KeyGenerationConfig, KeyStatus, KeyType } from './types';
import { storage } from '../../lib/mmkv';
import * as Crypto from 'expo-crypto';

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

function generateSecureKey(config: KeyGenerationConfig): string {
  const bytes = Crypto.getRandomBytes(config.length);
  const charset = config.charset;
  let result = config.prefix;
  for (let i = 0; i < config.length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}

interface KeysState {
  keys: Key[];
  generateKey: (config: KeyGenerationConfig) => Key;
  revokeKey: (id: string) => void;
  incrementUse: (id: string) => void;
  searchKeys: (query: string, type?: KeyType, status?: KeyStatus) => Key[];
}

export const useKeysStore = create<KeysState>()(
  persist(
    (set, get) => ({
      keys: [],
      generateKey: (config) => {
        const now = new Date();
        const expiresAt = config.expiresInDays > 0 
          ? new Date(now.getTime() + config.expiresInDays * 86400000).toISOString() 
          : null;
        
        const key: Key = {
          id: Crypto.randomUUID(),
          type: config.type,
          value: generateSecureKey(config),
          prefix: config.prefix,
          createdAt: now.toISOString(),
          expiresAt,
          maxUses: config.maxUses,
          uses: 0,
          status: 'active',
          metadata: config.metadata,
        };
        
        set((state) => ({ keys: [key, ...state.keys] }));
        return key;
      },
      revokeKey: (id) => set((state) => ({
        keys: state.keys.map(k => k.id === id ? { ...k, status: 'revoked' as KeyStatus } : k)
      })),
      incrementUse: (id) => set((state) => ({
        keys: state.keys.map(k => {
          if (k.id === id) {
            const uses = k.uses + 1;
            const status = uses >= k.maxUses ? 'used' as KeyStatus : k.status;
            return { ...k, uses, status };
          }
          return k;
        })
      })),
      searchKeys: (query, type, status) => {
        const { keys } = get();
        return keys.filter(k => {
          const matchesQuery = !query || k.value.toLowerCase().includes(query.toLowerCase()) || (k.metadata && Object.values(k.metadata).some(v => v.toLowerCase().includes(query.toLowerCase())));
          const matchesType = !type || k.type === type;
          const matchesStatus = !status || k.status === status;
          return matchesQuery && matchesType && matchesStatus;
        });
      },
    }),
    { name: 'keys-store', storage: createJSONStorage(() => mmkvStorage) }
  )
);