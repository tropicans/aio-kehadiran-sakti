
import { Clock, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary font-poppins">AIO ABSENSI</h1>
              <p className="text-xs text-gray-600 font-poppins">Sistem Absensi Modern</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span className="font-poppins">Kemensetneg</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
