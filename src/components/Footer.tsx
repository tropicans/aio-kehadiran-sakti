
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold font-poppins">AIO ABSENSI</h3>
            <p className="text-primary-200 font-poppins">Sistem Absensi Modern & Terpercaya</p>
          </div>
          
          <div className="border-t border-primary-700 pt-4">
            <p className="flex items-center justify-center space-x-2 text-primary-200 font-poppins">
              <span>Dibuat dengan</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>oleh <strong className="text-white">Yudhi</strong> © 2025</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
