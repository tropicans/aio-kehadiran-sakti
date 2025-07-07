// tropicans/aio-kehadiran-sakti/aio-kehadiran-sakti-57111c6736df0d5ca77f42b627151aeeefc2f0cc/src/pages/DailyActivityInputPage.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DailyActivityForm from '@/components/DailyActivityForm'; // Import komponen form

const DailyActivityInputPage = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <main className="py-8">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8 font-poppins">
          Pengaturan Kegiatan Harian
        </h1>
        <DailyActivityForm /> {/* Tampilkan form input kegiatan */}
      </main>
      <Footer />
    </div>
  );
};

export default DailyActivityInputPage;