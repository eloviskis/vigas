import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../store/authStore';
import * as authService from '../services/authService';

vi.mock('../services/authService');

describe('useAuthStore Hook', () => {
  beforeEach(() => {
    // Limpar localStorage
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve inicializar com usuário null', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.usuario).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve fazer login e atualizar estado', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      token: 'abc123',
      usuario: { id: '1', email: 'teste@example.com', tipo: 'CLIENTE' },
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('teste@example.com', '123456');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.usuario?.email).toBe('teste@example.com');
  });

  it('deve fazer logout e limpar estado', async () => {
    localStorage.setItem('token', 'abc123');

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.usuario).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('deve restaurar sessão do localStorage', async () => {
    const token = 'abc123';
    localStorage.setItem('token', token);

    vi.mocked(authService.validarToken).mockResolvedValue({
      id: '1',
      email: 'teste@example.com',
      tipo: 'CLIENTE',
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.restaurarSessao();
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('deve retornar false ao validar token inválido', async () => {
    vi.mocked(authService.validarToken).mockRejectedValue(
      new Error('Token inválido')
    );

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.restaurarSessao();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
