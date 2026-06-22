'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { contactSchema, type ContactValues } from '@/lib/contact-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const labelClass = 'text-[0.82rem] font-semibold text-ink';

export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      message: '',
    },
  });

  async function onSubmit(values: ContactValues) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const message =
          (await response.json().catch(() => null))?.error ??
          'Unable to send your message.';
        toast.error(message);
        return;
      }

      toast.success('Thank you. We’ll be in touch within a day.');
      form.reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Your name</FormLabel>
                <FormControl>
                  <Input type="text" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  Phone{' '}
                  <span className="font-normal text-faint">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>
                Occasion date{' '}
                <span className="font-normal text-faint">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. 14 February, or “next week”"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>
                Tell us about the occasion
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[130px]"
                  placeholder="Who is it for, the feeling you’re after, any budget in mind…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="mt-1 self-start"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Sending…' : 'Send your message'}
        </Button>
      </form>
    </Form>
  );
}
