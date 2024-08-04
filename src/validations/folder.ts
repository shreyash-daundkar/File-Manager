import { z } from 'zod';

export const addFolderValidation = z.object({
    name: z.string(),
    userId: z.number(),
});
