'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import authService from '../services/authService';

export default function AdminAccess() {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  const [showButton, setShowButton] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const seqRef = useRef([]);
  const clearTimerRef = useRef(null);
  const navigatingRef = useRef(false);

  // Verifica sesión sólo cuando el overlay está visible
  useEffect(() => {
    let active = true;
    if (!showButton) return;
    (async () => {
      try {
        const ok = await authService.checkAuth();
        if (active) setIsAuthenticated(!!ok);
      } catch {
        if (active) setIsAuthenticated(false);
      }
    })();
    return () => { active = false; };
  }, [showButton]);

  // Clicks en logo para acceso admin
  useEffect(() => {
    if (isLogin) return;

    let logoClickCount = 0;
    let logoClickTimer = null;

    const handleLogoClick = (e) => {
      e.preventDefault();
      logoClickCount++;
      
      if (logoClickCount === 1) {
        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 3000);
      }
      
      if (logoClickCount === 5) {
        clearTimeout(logoClickTimer);
        setShowButton(true);
        setTimeout(() => setShowButton(false), 10000);
        logoClickCount = 0;
      }
    };

    const logoElement = document.querySelector('.navbar-brand');
    if (logoElement) {
      logoElement.addEventListener('click', handleLogoClick);
    }

    return () => {
      if (logoElement) {
        logoElement.removeEventListener('click', handleLogoClick);
      }
      if (logoClickTimer) clearTimeout(logoClickTimer);
    };
  }, [isLogin]);

  // Hotkeys (no se instalan en /admin/login)
  useEffect(() => {
    if (isLogin) return;

    const handleKeyDown = (e) => {

      // Evitar escribir en campos sensibles
      const active = document.activeElement;
      const sensitive = active && (
        active.type === 'password' ||
        active.type === 'email' ||
        (active.tagName === 'INPUT' && active.getAttribute('type') === 'password')
      );
      if (sensitive) return;

      // Secuencia "admin"
      seqRef.current = [...seqRef.current, e.key.toLowerCase()].slice(-5);
      if (seqRef.current.join('') === 'admin') {
        setShowButton(true);
        seqRef.current = [];
        setTimeout(() => setShowButton(false), 10000);
      }

      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearTimerRef.current = setTimeout(() => { seqRef.current = []; }, 3000);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, [isLogin]);

  // Navegación segura (sin bucles ni pushes duplicados)
  const safePush = (to) => {
    if (navigatingRef.current) return;
    if (pathname === to) { setShowButton(false); return; }
    navigatingRef.current = true;
    setShowButton(false);
    router.push(to);
    setTimeout(() => { navigatingRef.current = false; }, 500);
  };

  const goDashboard = async () => {
    try {
      const ok = await authService.checkAuth();
      safePush(ok ? '/admin/dashboard' : '/admin/login');
    } catch {
      safePush('/admin/login');
    }
  };

  const goLogin = () => safePush('/admin/login');

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setShowButton(false);
    } catch (e) { console.error(e); }
  };

  // ⛔️ El return condicional va DESPUÉS de declarar los hooks
  if (!showButton || isLogin) return null;

  return (
    <>
      <div
        className="admin-access-overlay"
        onClick={() => setShowButton(false)}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:9998, backdropFilter:'blur(2px)' }}
      />
      <div
        className="admin-access-button"
        style={{
          position:'fixed',
          top:'50%', left:'50%', transform:'translate(-50%, -50%)',
          zIndex:9999, background:'#1a1a1a', border:'2px solid #ffc107', borderRadius:12,
          padding:20, boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'fadeInScale 0.3s ease-out'
        }}
      >
        <div style={{ textAlign:'center', color:'#fff' }}>
          <div style={{ marginBottom:15 }}>
            <span style={{ fontSize:24, color:'#ffc107', display:'block', marginBottom:8 }}>🔐</span>
            <h3 style={{ margin:0, fontSize:18, color:'#ffc107' }}>Panel de Administración</h3>
          </div>

        {isAuthenticated ? (
          <div>
            <p style={{ margin:'0 0 15px 0', fontSize:14, color:'#ccc' }}>
              Sesión activa como: {authService.getUser()?.username || 'Admin'}
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button
                onClick={goDashboard}
                style={{ background:'#ffc107', color:'#000', border:'none',
                         padding:'10px 20px', borderRadius:6, cursor:'pointer',
                         fontSize:14, fontWeight:'bold' }}
              >
                Ir al Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{ background:'transparent', color:'#ffc107', border:'1px solid #ffc107',
                         padding:'10px 20px', borderRadius:6, cursor:'pointer', fontSize:14 }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ margin:'0 0 15px 0', fontSize:14, color:'#ccc' }}>
              Accede al panel de control
            </p>
            <button
              onClick={goLogin}
              style={{ background:'#ffc107', color:'#000', border:'none',
                       padding:'12px 24px', borderRadius:6, cursor:'pointer',
                       fontSize:14, fontWeight:'bold', width:'100%' }}
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        <div style={{ marginTop:15, fontSize:12, color:'#666', borderTop:'1px solid #333', paddingTop:10 }}>
          <p style={{ margin:0 }}>💡 <strong>Acceso rápido:</strong> 5 clicks en logo</p>
          <p style={{ margin:'5px 0 0 0' }}>🔢 <strong>PIN:</strong> código en esquina</p>        </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .admin-access-button:hover { transform: translate(-50%, -50%) scale(1.02); transition: transform .2s; }
        .admin-access-button button:hover { transform: translateY(-1px); transition: transform .2s; }
      `}</style>
    </>
  );
}
