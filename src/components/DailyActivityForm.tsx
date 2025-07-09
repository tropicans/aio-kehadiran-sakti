// src/components/DailyActivityForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components
import { useToast } from '@/hooks/use-toast';
import { useDailyActivitySubmission } from '@/hooks/useDailyActivitySubmission';

interface DailyActivityFormProps {
  onActivityAdded: () => void;
}

const DailyActivityForm: React.FC<DailyActivityFormProps> = ({ onActivityAdded }) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [activityDetailName, setActivityDetailName] = useState('');
  const [activityDate, setActivityDate] = useState(''); // Tetap gunakan ini untuk tanggal

  // Definisi kategori dan sub-kategori statis (sesuai AbsensiForm)
  const activityCategories: { [key: string]: string[] } = {
    'Luring': ['Rapat', 'Kunjungan', 'Bimbingan Teknis', 'Sosialisasi', 'Diskusi Kelompok', 'Lainnya Luring'],
    'Daring': ['Webinar', 'Zoom Meeting', 'Pelatihan Online', 'Kuliah Umum', 'Lainnya Daring']
  };

  const { toast } = useToast();
  const { isSubmitting, submitDailyActivity } = useDailyActivitySubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field baru
    if (!selectedMainCategory || !selectedSubCategory || !activityDetailName || !activityDate) {
      toast({
        title: "Validasi Gagal",
        description: "Kategori Utama, Sub Kategori Kegiatan, Nama Kegiatan, dan Tanggal wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    // Bangun activity_name dengan format baru
    // Sesuaikan format ini sesuai dengan yang Anda harapkan backend
    const combinedActivityName = `${selectedMainCategory} - ${selectedSubCategory} - ${activityDetailName}`;

    const payload = {
      activity_name: combinedActivityName,
      activity_date: activityDate,
      // Jika backend Anda siap untuk kolom terpisah, Anda bisa tambahkan ini:
      // main_category: selectedMainCategory,
      // sub_category: selectedSubCategory,
      // activity_detail_name: activityDetailName,
    };

    const response = await submitDailyActivity(payload);
    if (response.success) {
      // Reset state form setelah submit berhasil
      setSelectedMainCategory('');
      setSelectedSubCategory('');
      setActivityDetailName('');
      setActivityDate('');
      onActivityAdded();
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle className="text-2xl font-poppins">Input Kegiatan Harian</CardTitle>
            <CardDescription className="text-primary-100 font-poppins">
              Tambahkan daftar kegiatan yang akan berlangsung hari ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dropdown Kategori Utama */}
              <div className="space-y-2">
                <Label htmlFor="mainCategory" className="font-poppins font-medium">Kategori Utama *</Label>
                <Select
                  required
                  name="mainCategory"
                  value={selectedMainCategory}
                  onValueChange={(value) => {
                    setSelectedMainCategory(value);
                    setSelectedSubCategory(''); // Reset sub-kategori saat kategori utama berubah
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="font-poppins" type="button">
                    <SelectValue placeholder="Pilih kategori utama" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(activityCategories).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dropdown Sub Kategori Kegiatan (tergantung Kategori Utama) */}
              <div className="space-y-2">
                <Label htmlFor="subCategory" className="font-poppins font-medium">Sub Kategori Kegiatan *</Label>
                <Select
                  required
                  name="subCategory"
                  value={selectedSubCategory}
                  onValueChange={setSelectedSubCategory}
                  disabled={isSubmitting || !selectedMainCategory} // Disable jika kategori utama belum dipilih
                >
                  <SelectTrigger className="font-poppins" type="button">
                    <SelectValue placeholder="Pilih sub kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMainCategory && activityCategories[selectedMainCategory].map(subCat => (
                      <SelectItem key={subCat} value={subCat}>
                        {subCat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input Nama Kegiatan Spesifik */}
              <div className="space-y-2">
                <Label htmlFor="activityDetailName" className="font-poppins font-medium">Nama Kegiatan *</Label>
                <Input
                  id="activityDetailName"
                  placeholder="Contoh: Rapat Koordinasi Mingguan Divisi A"
                  required
                  value={activityDetailName}
                  onChange={(e) => setActivityDetailName(e.target.value)}
                  disabled={isSubmitting}
                  className="font-poppins"
                  name="activityDetailName"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityDate" className="font-poppins font-medium">Tanggal Kegiatan *</Label>
                <Input
                  id="activityDate"
                  type="date"
                  required
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  disabled={isSubmitting}
                  className="font-poppins"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-800 font-poppins font-semibold py-3 transition-all duration-300"
              >
                {isSubmitting ? 'Menyimpan...' : 'Tambahkan Kegiatan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DailyActivityForm;