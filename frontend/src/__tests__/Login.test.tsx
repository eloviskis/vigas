import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../pages/Login';
import { useAuthStore } from '../store/authStore';

// Mock da store
vi.mock('../store/authStore');

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar formulário de login', () => {
    render(<Login />);
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
  });

  it('deve validar campos vazios', async () => {
    render(<Login />);
    const button = screen.getByText(/Entrar/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('deve fazer login com credenciais válidas', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ token: 'abc123' });
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
    } as any);

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'teste@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText(/Entrar/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('teste@example.com', '123456');
    });
  });
});
