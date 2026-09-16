import { z } from 'zod';

/**
 * Contact form validation — the single source of truth shared by the form
 * component and its tests. Extracted from ContactForm so the rules can be
 * unit-tested directly and reused (e.g. by a future server action).
 */
export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
