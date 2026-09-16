import { describe, expect, it } from 'vitest';
import { contactSchema } from './contact';

describe('contactSchema', () => {
  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Hello Rahul, I would like to discuss a collaboration on a computer vision project.',
  };

  it('accepts valid submission data', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = contactSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name must be at least 2 characters.');
    }
  });

  it('rejects an invalid email address', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Please enter a valid email address.');
    }
  });

  it('rejects a message shorter than 10 characters', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'too short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Message must be at least 10 characters long.');
    }
  });

  it('accepts a 10-character message (boundary)', () => {
    const result = contactSchema.safeParse({ ...valid, message: '0123456789' });
    expect(result.success).toBe(true);
  });

  it('rejects missing fields', () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(3);
    }
  });
});
