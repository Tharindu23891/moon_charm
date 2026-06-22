'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      eventDate: String(formData.get('eventDate') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Unable to send your message.');
      }
      setStatus('success');
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mc-label">Your name</span>
          <Input type="text" autoComplete="name" name="name" required />
        </label>
        <label className="block">
          <span className="mc-label">
            Phone <span className="font-normal text-faint">(optional)</span>
          </span>
          <Input type="tel" autoComplete="tel" name="phone" />
        </label>
      </div>
      <label className="block">
        <span className="mc-label">Email</span>
        <Input type="email" autoComplete="email" name="email" required />
      </label>
      <label className="block">
        <span className="mc-label">
          Occasion date{' '}
          <span className="font-normal text-faint">(optional)</span>
        </span>
        <Input
          type="text"
          name="eventDate"
          placeholder="e.g. 14 February, or “next week”"
        />
      </label>
      <label className="block">
        <span className="mc-label">Tell us about the occasion</span>
        <Textarea
          className="min-h-[130px]"
          name="message"
          required
          placeholder="Who is it for, the feeling you’re after, any budget in mind…"
        />
      </label>

      <Button
        type="submit"
        size="lg"
        className="mt-1 self-start"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : 'Send your message'}
      </Button>

      <p
        aria-live="polite"
        className={cn(
          'text-sm',
          status === 'success' && 'text-[var(--color-success)]',
          status === 'error' && 'text-danger',
        )}
      >
        {status === 'success'
          ? 'Thank you. We’ll be in touch within a day.'
          : null}
        {status === 'error' ? errorMessage : null}
      </p>
    </form>
  );
}
