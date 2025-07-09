// src/pages/Index.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { AbsensiForm } from '@/components/AbsensiForm'; // Menggunakan named import
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  // Effect hook untuk memeriksa parameter URL saat komponen dimuat
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const activityNameFromUrl = queryParams.get('activityName');
    const activityIdFromUrl = queryParams.get('activityId');

    // Jika ada parameter kegiatan di URL, langsung tampilkan form
    if (activityNameFromUrl || activityIdFromUrl) {
      setShowForm(true);
      // Opsional: scroll ke form setelah dirender
      setTimeout(() => {
        document.getElementById('absensi-form')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 0); // Timeout 0ms agar scroll terjadi setelah render
    }
  }, [location.search]); // Bergantung pada perubahan query params

  const handleStartAbsensi = () => {
    setShowForm(true);
    // Smooth scroll to form
    setTimeout(() => {
      document.getElementById('absensi-form')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <main>
        {/* Tampilkan HeroSection hanya jika form belum ditampilkan secara otomatis */}
        {!showForm && (
          <HeroSection onStartAbsensi={handleStartAbsensi} />
        )}
        {showForm && (
          <div id="absensi-form">
            <AbsensiForm />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;