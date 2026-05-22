import { z } from 'zod';

export const createReportSchema = z.object({
  reason: z.enum(['spam', 'abuse', 'misinformation', 'inappropriate', 'other']),

  description: z
    .string()
    .max(300)
    .optional()
    .nullable()
    .default(null),

  status: z
    .enum(['pending', 'reviewed', 'dismissed'])
    .default('pending'),
});

export type CreateReportView = z.infer<typeof createReportSchema>;



export const updateReportSchema = z.object({
  reason: z.enum(['spam', 'abuse', 'misinformation', 'inappropriate', 'other']).optional(),

  description: z
    .string()
    .max(300)
    .optional()
    .nullable(),

  status: z
    .enum(['pending', 'reviewed', 'dismissed'])
    .optional()
});



export type UpdateReportView = z.infer<typeof updateReportSchema>;
