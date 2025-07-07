
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartAbsensi: () => void;
}

const HeroSection = ({ onStartAbsensi }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-poppins">
            Selamat Datang di{' '}
            <span className="text-primary bg-clip-text bg-gradient-to-r from-primary-800 to-primary-600">
              attenda
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-poppins leading-relaxed">
          Presensi Digital Luring & Daring untuk Kegiatan PPKASN Kemensetneg.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={onStartAbsensi}
              size="lg"
              className="bg-primary hover:bg-primary-800 text-white px-8 py-3 rounded-xl font-semibold font-poppins transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Mulai Presensi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up">
            <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-poppins">Presensi dalam Hitungan Detik</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-poppins">Dukung Luring dan Daring</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-poppins">Rekap Presensi Otomatis & Akurat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
