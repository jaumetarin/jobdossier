import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      navigate('/login', { replace: true });
    } catch {
      setError('No se pudo crear la cuenta. Puede que el email ya exista.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-brand">Crear cuenta</h1>
          <p className="auth-description">
            Guarda tus alertas, filtra mejor y sigue nuevas oportunidades sin perder
            el foco.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span className="auth-label">Nombre</span>
              <input
                className="auth-input"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>

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
                placeholder="Crea una contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>

          <div className="auth-mini-note">
            Después podrás crear alertas guardadas para stacks, ciudades o modalidades
            concretas.
          </div>
        </div>
      </section>
    </main>
  );
}
