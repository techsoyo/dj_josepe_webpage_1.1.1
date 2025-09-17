// frontend/app/(public)/sets/page.js
import SetsGrid from '../../../components/public/SetsGrid';
import Header from '../../../components/public/Header';
import Footer from '../../../components/public/Footer';
import { getMusicSets } from '../../../services/setsService';

// Página de Sets (Server Component)
export default async function SetsPage() {
  // Recuperar los sets desde el servicio
  const sets = await getMusicSets();

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
