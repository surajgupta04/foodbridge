import { z } from 'zod';

export const createFoodSchema = z.object({
  quantity:       z.string().min(1, 'Quantity is required'),
  address:        z.string().min(5, 'Enter a valid pickup address'),
  expiryDuration: z.string()
    .refine(val => !isNaN(parseInt(val)), 'Expiry duration must be a number')
    .refine(val => {
      const num = parseInt(val);
      return num >= 60 && num <= 720;
    }, 'Expiry must be between 1 hour and 12 hours'),
});

export const editFoodSchema = z.object({
  quantity:       z.string().min(1, 'Quantity is required'),
  address:        z.string().min(5, 'Enter a valid pickup address'),
  expiryDuration: z.string()
    .refine(val => !isNaN(parseInt(val)), 'Expiry duration must be a number')
    .optional(),
});