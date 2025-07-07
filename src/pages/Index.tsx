
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AbsensiForm from '@/components/AbsensiForm';
import Footer from '@/components/Footer';

const Index = () => {
  const [showForm, setShowForm] = useState(false);

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
        <HeroSection onStartAbsensi={handleStartAbsensi} />
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
