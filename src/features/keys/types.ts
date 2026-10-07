import { z } from 'zod';

export const KeyTypeSchema = z.enum(['promo', 'paid', 'api']);
export type KeyType = z.infer<typeof KeyTypeSchema>;

export const KeyStatusSchema = z.enum(['active', 'used', 'expired', 'revoked']);
export type KeyStatus = z.infer<typeof KeyStatusSchema>;

export const KeySchema = z.object({
  id: z.string(),
  type: KeyTypeSchema,
  value: z.string(),
  prefix: z.string(),
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
  maxUses: z.number(),
  uses: z.number(),
  status: KeyStatusSchema,
  metadata: z.record(z.string()).optional(),
});
export type Key = z.infer<typeof KeySchema>;

export const KeyGenerationConfigSchema = z.object({
  type: KeyTypeSchema,
  prefix: z.string().min(1).max(8),
  length: z.number().min(8).max(32),
  charset: z.string(),
  expiresInDays: z.number().min(0),
  maxUses: z.number().min(1),
  metadata: z.record(z.string()).optional(),
});
export type KeyGenerationConfig = z.infer<typeof KeyGenerationConfigSchema>;

export const ExecutionTaskSchema = z.object({
  id: z.string(),
  keyId: z.string(),
  keyValue: z.string(),
  type: KeyTypeSchema,
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  result: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});
export type ExecutionTask = z.infer<typeof ExecutionTaskSchema>;