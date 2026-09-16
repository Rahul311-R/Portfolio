import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

/**
 * Integration test for the RHF + zod + UI stack end-to-end:
 * labels → inputs → validation → error announcements → success state.
 */
describe('ContactForm', () => {
  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText(/your name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/your email/i), 'ada@example.com');
    await user.type(
      screen.getByLabelText(/message content/i),
      'Hello Rahul, I would love to discuss a collaboration.',
    );
  };

  it('associates labels with inputs', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message content/i)).toBeInTheDocument();
  });

  it('shows validation errors and aria-invalid when submitted empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument();
    });
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Message must be at least 10 characters long.')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/your name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/your name/i)).toHaveAccessibleDescription(
      'Name must be at least 2 characters.',
    );
  });

  it('clears errors and shows the validated state on a successful submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('FORM VALIDATED')).toBeInTheDocument();
    });
    expect(screen.queryByText('Name must be at least 2 characters.')).not.toBeInTheDocument();
  });

  it('returns to the empty form when "Send Another Message" is clicked', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    await screen.findByText('FORM VALIDATED');

    await user.click(screen.getByRole('button', { name: /send another message/i }));
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  });
});
