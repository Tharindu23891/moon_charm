import { z } from 'zod';

// Shared by the contact form (client validation via react-hook-form) and the
// /api/contact route (server validation) so both sides stay in lockstep.
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Please tell us your name')
    .max(120, 'That name is a little too long'),
  email: z.email({ message: 'Please enter a valid email address' }),
  phone: z.string().max(40, 'That phone number looks too long').optional(),
  eventDate: z.string().max(60, 'Please keep the date short').optional(),
  message: z
    .string()
    .min(5, 'Tell us a little more so we can help')
    .max(2000, 'Please keep your message under 2000 characters'),
});

export type ContactValues = z.infer<typeof contactSchema>;
