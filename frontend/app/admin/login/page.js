// frontend/app/admin/login/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../services/authService';
import toast from 'react-hot-toast';
import { login, verifySession } from '../../../services/authService'; // ← con llaves


/**
 * Página de login del administrador (sin bucles de redirección)
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const didOnce = useRef(false);           // evita doble ejecución en dev (StrictMode)
  const abortRef = useRef(null);

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Si ya hay sesión, redirige una sola vez al dashboard
  useEffect(() => {
    if (didOnce.current) return;
    didOnce.current = true;

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    (async () => {
      try {
        const ok = await authService.checkAuth({ signal: ctrl.signal });
        if (ok) router.replace('/admin/dashboard');
        // si no hay sesión, nos quedamos en /admin/login sin empujar de nuevo
      } catch {
        // silencio: nos quedamos en login
      }
    })();

    return () => ctrl.abort();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 handleSubmit ejecutado');
    console.log('📝 Credenciales:', credentials);
    if (isLoading) return;

    setIsLoading(true);
    console.log('⏳ isLoading = true');
    try {
      console.log('🌐 Llamando authService.login...');
      const result = await authService.login(credentials);
      console.log('📤 Resultado del login:', result);
      
      if (result.success) {
        console.log('✅ Login exitoso');
        toast.success('¡Bienvenido de vuelta!');
        router.replace('/admin/dashboard');
      } else {
        console.log('❌ Login falló:', result.message);
        toast.error(result.message || 'Error de autenticación');
      }
    } catch (error) {
      console.log('❌ Error en login:', error);
      const msg = error?.message || 'Error de autenticación';
      toast.error(msg);
    } finally {
      console.log('🏁 Finalizando, isLoading = false');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card card-dark">
              <div className="card-header text-center bg-warning">
                <div className="mb-2">
                  <i className="fas fa-user-shield fa-3x text-dark"></i>
                </div>
                <h4 className="mb-0 text-dark fw-bold">Panel de Admin</h4>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-light">
                      <i className="fas fa-user me-2"></i> Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                      autoComplete="username"
                      placeholder="Ingresa tu usuario"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-light">
                      <i className="fas fa-lock me-2"></i> Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                      placeholder="Ingresa tu contraseña"
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="card-footer text-center bg-transparent">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Acceso exclusivo para DJ Josepe
                </small>
                <br />
                <small className="text-muted">Combinación rápida: Ctrl + Alt + ñ</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
