import { z } from 'zod';

export const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['restaurant', 'ngo'], { message: 'Role must be restaurant or ngo' }),
  address:  z.string().min(5, 'Enter a valid address'),
});

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});