import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { Header } from '../Header';

// The auth mock is already defined in setup.ts

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />);

    expect(screen.getByText('LezzetKeşif')).toBeInTheDocument();
    expect(screen.getByText('Restoranlar')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('Yönetim')).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    render(<Header />);

    expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
  });

  it('opens search modal when search button is clicked', () => {
    render(<Header />);

    // Find the search button by its position (first button without aria-label)
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(
      button => !button.getAttribute('aria-label')
    );
    expect(searchButton).toBeTruthy();

    if (searchButton) {
      fireEvent.click(searchButton);
      expect(
        screen.getByPlaceholderText(/Restoran, mutfak veya konum ara/i)
      ).toBeInTheDocument();
    }
  });

  it('has correct styling classes', () => {
    render(<Header />);

    const logo = screen.getByText('L');
    expect(logo.parentElement).toHaveClass('bg-emerald-600');

    const loginButton = screen.getByText('Giriş Yap');
    expect(loginButton).toHaveClass('bg-emerald-600');
  });
});
