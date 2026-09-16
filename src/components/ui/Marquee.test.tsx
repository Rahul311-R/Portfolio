import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Marquee } from './Marquee';
import { renderWithProviders } from '@/test/utils';

describe('Marquee', () => {
  it('renders every item (and its animation duplicate)', () => {
    renderWithProviders(<Marquee items={['AI', 'DATA', 'CODE']} />);
    // The track duplicates items for the seamless loop: 3 items → 6 spans.
    expect(screen.getAllByText('AI')).toHaveLength(2);
    expect(screen.getAllByText('DATA')).toHaveLength(2);
    expect(screen.getAllByText('CODE')).toHaveLength(2);
  });

  it('marks animation duplicates aria-hidden so screen readers hear each item once', () => {
    renderWithProviders(<Marquee items={['AI']} />);
    const copies = screen.getAllByText('AI');
    expect(copies[0]).not.toHaveAttribute('aria-hidden', 'true');
    expect(copies[1]).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes a labelled region for assistive tech', () => {
    renderWithProviders(<Marquee items={['AI']} label="Stack" />);
    expect(screen.getByLabelText('Stack')).toBeInTheDocument();
  });

  it('renders an empty track without crashing', () => {
    const { container } = renderWithProviders(<Marquee items={[]} />);
    expect(container.querySelector('.marquee-track')).toBeInTheDocument();
  });

  it('applies custom class names to the wrapper', () => {
    const { container } = renderWithProviders(<Marquee items={['X']} className="mt-8" />);
    expect(container.firstElementChild?.className).toContain('mt-8');
  });
});
