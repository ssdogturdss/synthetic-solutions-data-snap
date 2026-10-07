import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ExecutionTask, KeyType } from '../keys/types';
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

interface ExecutionState {
  tasks: ExecutionTask[];
  startExecution: (keyId: string, keyValue: string, type: KeyType, metadata?: Record<string, string>) => ExecutionTask;
  completeExecution: (id: string, result: string) => void;
  failExecution: (id: string, error: string) => void;
  getTasksByKey: (keyId: string) => ExecutionTask[];
}

export const useExecutionStore = create<ExecutionState>()(
  persist(
    (set, get) => ({
      tasks: [],
      startExecution: (keyId, keyValue, type, metadata) => {
        const task: ExecutionTask = {
          id: Crypto.randomUUID(),
          keyId,
          keyValue,
          type,
          status: 'running',
          startedAt: new Date().toISOString(),
          completedAt: null,
          metadata,
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
        // Simulate async execution worker (production would use real background task / API call)
        setTimeout(() => {
          const success = Math.random() > 0.2;
          if (success) {
            get().completeExecution(task.id, `Execution completed successfully for ${type} key`);
          } else {
            get().failExecution(task.id, 'Worker failed: simulated transient error');
          }
        }, 1800);
        return task;
      },
      completeExecution: (id, result) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'completed', completedAt: new Date().toISOString(), result } : t)
      })),
      failExecution: (id, error) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'failed', completedAt: new Date().toISOString(), result: error } : t)
      })),
      getTasksByKey: (keyId) => get().tasks.filter(t => t.keyId === keyId),
    }),
    { name: 'execution-store', storage: createJSONStorage(() => mmkvStorage) }
  )
);