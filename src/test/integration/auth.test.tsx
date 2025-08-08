import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { AuthModal } from '@/components/AuthModal'
import { useAuth } from '@/lib/auth'

// Mock the auth hook
vi.mock('@/lib/auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Default mock implementation
    mockUseAuth.mockReturnValue({
      user: null,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      loading: false
    })
  })

  describe('Authentication Flow', () => {
    it('should handle complete login flow', async () => {
      const mockSignIn = vi.fn()
      const mockOnSuccess = vi.fn()
      
      mockUseAuth.mockReturnValue({
        user: null,
        signIn: mockSignIn,
        signUp: vi.fn(),
        signOut: vi.fn(),
        loading: false
      })

      render(
        <AuthModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={mockOnSuccess}
        />
      )

      // Fill in login form
      const emailInput = screen.getByLabelText('E-posta')
      const passwordInput = screen.getByLabelText('Şifre')
      const submitButton = screen.getByRole('button', { name: 'Giriş Yap' })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    })

    it('should handle registration flow', async () => {
      const mockSignUp = vi.fn()
      
      mockUseAuth.mockReturnValue({
        user: null,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
        loading: false
      })

      render(
        <AuthModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()}
        />
      )

      // Switch to registration mode
      const switchButton = screen.getByText('Hesabınız yok mu? Kayıt olun')
      fireEvent.click(switchButton)

      // Fill in registration form
      const emailInput = screen.getByLabelText('E-posta')
      const passwordInput = screen.getByLabelText('Şifre')
      const submitButton = screen.getByRole('button', { name: 'Kayıt Ol' })

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'newpassword123'
        })
      })
    })

    it('should handle Google OAuth flow', async () => {
      render(
        <AuthModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()}
        />
      )

      const googleButton = screen.getByText(/Google ile Giriş Yap/)
      expect(googleButton).toBeInTheDocument()

      fireEvent.click(googleButton)
      
      // Note: In a real integration test, we would mock the OAuth redirect
      // For now, we just verify the button is present and clickable
    })

    it('should show error messages for invalid credentials', async () => {
      render(
        <AuthModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()}
        />
      )

      const emailInput = screen.getByLabelText('E-posta')
      const passwordInput = screen.getByLabelText('Şifre')
      const submitButton = screen.getByRole('button', { name: 'Giriş Yap' })

      // Submit empty form
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(emailInput).toBeInvalid()
        expect(passwordInput).toBeInvalid()
      })
    })
  })

  describe('Authenticated User Flow', () => {
    it('should show user profile when authenticated', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' }
      }

      mockUseAuth.mockReturnValue({
        user: mockUser,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        loading: false
      })

      render(
        <AuthModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()}
        />
      )

      // Modal should not be visible when user is authenticated
      expect(screen.queryByText('Giriş Yap')).not.toBeInTheDocument()
    })
  })
}) 