'use client';

import { useState } from 'react';

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
        throw new Error(data?.error ?? 'Unable to send request.');
      }

      setStatus('success');
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="mc-input"
          placeholder="Full name"
          type="text"
          autoComplete="name"
          name="name"
          required
        />
        <input
          className="mc-input"
          placeholder="Phone number"
          type="tel"
          autoComplete="tel"
          name="phone"
        />
      </div>
      <input
        className="mc-input"
        placeholder="Email address"
        type="email"
        autoComplete="email"
        name="email"
        required
      />
      <input className="mc-input" placeholder="Event date" type="text" name="eventDate" />
      <textarea
        className="mc-input min-h-[120px] resize-none"
        placeholder="Tell us about the occasion"
        name="message"
        required
      />
      <button type="submit" className="mc-btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send request'}
      </button>

      <div aria-live="polite" className="text-xs text-neutral-600">
        {status === 'success' ? 'Thanks! We will get back to you shortly.' : null}
        {status === 'error' ? errorMessage : null}
      </div>
    </form>
  );
}
