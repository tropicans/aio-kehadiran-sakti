// src/components/AbsensiFormComponents/ExternalGuestForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExternalGuestFormProps {
  // Props baru untuk kategori dan nama kegiatan
  activityCategories: { [key: string]: string[] }; // Objek kategori statis
  selectedMainCategory: string;
  setSelectedMainCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  activityDetailName: string;
  setActivityDetailName: (name: string) => void;

  isSubmitting: boolean;
}

const ExternalGuestForm: React.FC<ExternalGuestFormProps> = ({
  activityCategories, // Destrukturisasi props baru
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  activityDetailName,
  setActivityDetailName,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nama-external" className="font-poppins font-medium">Nama Lengkap *</Label>
          <Input
            id="nama-external"
            placeholder="Masukkan nama lengkap"
            required
            className="font-poppins"
            name="nama-external"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instansi" className="font-poppins font-medium">Asal Instansi *</Label>
          <Input
            id="instansi"
            placeholder="Masukkan nama instansi"
            required
            className="font-poppins"
            name="instansi"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="jabatan" className="font-poppins font-medium">Jabatan *</Label>
          <Input
            id="jabatan"
            placeholder="Masukkan jabatan"
            required
            className="font-poppins"
            name="jabatan"
            disabled={isSubmitting}
          />
        </div>

        {/* Dropdown Kategori Utama */}
        <div className="space-y-2">
            <Label htmlFor="mainCategoryExternal" className="font-poppins font-medium">Kategori Utama *</Label>
            <Select
                required
                name="mainCategoryExternal"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropdown Sub Kategori Kegiatan (tergantung Kategori Utama) */}
        <div className="space-y-2">
            <Label htmlFor="subCategoryExternal" className="font-poppins font-medium">Sub Kategori Kegiatan *</Label>
            <Select
                required
                name="subCategoryExternal"
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
            <Label htmlFor="activityDetailNameExternal" className="font-poppins font-medium">Nama Kegiatan *</Label>
            <Input
                id="activityDetailNameExternal"
                placeholder="Contoh: Diskusi Teknologi A"
                required
                value={activityDetailName}
                onChange={(e) => setActivityDetailName(e.target.value)}
                disabled={isSubmitting}
                className="font-poppins"
                name="activityDetailNameExternal"
            />
        </div>
      </div>
    </div>
  );
};

export default ExternalGuestForm;