import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { isAuthenticated, setToken } from '../services/auth';
import { type LoginResponse } from '../types/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      setToken(response.data.access_token);

      const nextPath =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? '/dashboard';

      navigate(nextPath, { replace: true });
    } catch {
      setError('No se pudo iniciar sesión. Revisa tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-brand">Jobdossier</h1>
          <p className="auth-description">
            Agregador de oportunidades tech. Sin ruido.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span className="auth-label">Correo electrónico</span>
              <input
                className="auth-input"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">Contraseña</span>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>

          <hr className="auth-divider" />

          <div className="auth-note">
            <span className="auth-note-dot" aria-hidden="true" />
            <p style={{ margin: 0 }}>
              Accede para guardar tus filtros de búsqueda y recibir nuevas ofertas en
              tiempo real.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
