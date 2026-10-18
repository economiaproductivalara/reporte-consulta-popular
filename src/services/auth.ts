const AUTH_STORAGE_KEY = 'mppapt_dashboard_auth_token';

class AuthService {
  /**
   * Obtiene la contraseña configurada en la variable de entorno del sistema
   */
  private getTargetPassword(): string {
    return import.meta.env.VITE_DASHBOARD_PASSWORD || 'MPPAPT2026';
  }

  /**
   * Verifica si la sesión del dashboard ya fue autorizada
   */
  public isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
    } catch {
      return false;
    }
  }

  /**
   * Valida la contraseña ingresada contra la variable de entorno
   */
  public login(candidatePassword: string): boolean {
    const target = this.getTargetPassword().trim();
    const candidate = candidatePassword.trim();

    if (candidate === target) {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
        } catch {
          // sessionStorage fallback
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Cierra la sesión y vuelve a bloquear el Dashboard
   */
  public logout(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }
}

export const authService = new AuthService();
