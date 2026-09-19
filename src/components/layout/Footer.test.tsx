import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Footer CTA', () => {
  it('navigates to contact when arrow button is clicked', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const btn = screen.getByLabelText(/Go to contact page/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockedNavigate).toHaveBeenCalledWith('/contact');
  });
});
