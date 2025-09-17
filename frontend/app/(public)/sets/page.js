// frontend/app/(public)/sets/page.js
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '../../../components/public/Header';
import Footer from '../../../components/public/Footer';
import Loading from '../../../components/shared/Loading';
import { getMusicSets } from '../../../services/setsService';

// Lazy load del componente SetsGrid para mejorar velocidad inicial
const SetsGrid = dynamic(() => import('../../../components/public/SetsGrid'), {
  loading: () => <Loading type="bars" message="Cargando sets..." />,
  ssr: false, // Deshabilitar SSR para carga más rápida
});

// Página de Sets optimizada como Client Component
export default function SetsPage() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSets() {
      try {
        setLoading(true);
        const data = await getMusicSets();
        setSets(data);
      } catch (err) {
        console.error('Error loading sets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSets();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <section className="py-8">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Sets</h1>
            <Loading type="pulse" message="Cargando sets..." />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <section className="py-8">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Sets</h1>
            <div className="alert alert-danger">
              Error al cargar sets: {error}
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sets</h1>
          <SetsGrid sets={sets} />
        </div>
      </section>
      <Footer />
    </>
  );
}
