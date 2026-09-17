import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (_data: ContactFormData) => {
    setSubmitted(true);
    reset();
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-10 rounded-lg space-y-6">
      {/* Backend connection notice */}
      <div className="p-3 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)] rounded flex items-center gap-2">
        <Info className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
        <span>Form backend not connected yet. This form only validates input and does not send messages.</span>
      </div>

      {submitted ? (
        <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[var(--tone-emerald)] mx-auto" />
          <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
            FORM VALIDATED
          </h3>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Your message has not been sent because a form backend is not connected yet.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent-color)]"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
              YOUR NAME <span className="text-[var(--accent-color)]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder="e.g. Alex Morgan"
              {...register('name')}
              className={`w-full bg-[var(--bg-surface-secondary)] border rounded px-4 py-3 text-sm text-[var(--text-primary)] font-body focus:outline-none transition-colors ${
                errors.name
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-[var(--border-color)] focus:border-[var(--accent-color)]'
              }`}
            />
            {errors.name && (
              <p id="name-error" className="text-xs font-mono text-[var(--tone-rose)] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
              YOUR EMAIL <span className="text-[var(--accent-color)]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="e.g. alex@example.com"
              {...register('email')}
              className={`w-full bg-[var(--bg-surface-secondary)] border rounded px-4 py-3 text-sm text-[var(--text-primary)] font-body focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-[var(--border-color)] focus:border-[var(--accent-color)]'
              }`}
            />
            {errors.email && (
              <p id="email-error" className="text-xs font-mono text-[var(--tone-rose)] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
              MESSAGE CONTENT <span className="text-[var(--accent-color)]">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={5}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              placeholder="Briefly describe your project, inquiry, or potential opportunity..."
              {...register('message')}
              className={`w-full bg-[var(--bg-surface-secondary)] border rounded px-4 py-3 text-sm text-[var(--text-primary)] font-body focus:outline-none transition-colors ${
                errors.message
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-[var(--border-color)] focus:border-[var(--accent-color)]'
              }`}
            />
            {errors.message && (
              <p id="message-error" className="text-xs font-mono text-[var(--tone-rose)] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.message.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            variant="primary"
            className="w-full sm:w-auto"
            icon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
          </Button>
        </form>
      )}
    </div>
  );
};
