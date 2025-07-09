// src/components/AbsensiFormComponents/InternalEmployeeForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InternalEmployeeFormProps {
  internalNIP: string;
  setInternalNIP: (nip: string) => void;
  internalName: string;
  setInternalName: (name: string) => void;
  internalUnitKerja: string;
  setInternalUnitKerja: (unit: string) => void;
  isLoadingEmployee: boolean;
  nipError: string;
  debouncedFetchEmployeeData: (nip: string) => void;
  nipInputRef: React.RefObject<HTMLInputElement>;
  
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

const InternalEmployeeForm: React.FC<InternalEmployeeFormProps> = ({
  internalNIP,
  setInternalNIP,
  internalName,
  setInternalName,
  internalUnitKerja,
  setInternalUnitKerja,
  isLoadingEmployee,
  nipError,
  debouncedFetchEmployeeData,
  nipInputRef,
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
          <Label htmlFor="nip" className="font-poppins font-medium">NIP *</Label>
          <Input
            id="nip"
            placeholder="Masukkan NIP Anda"
            required
            className="font-poppins"
            value={internalNIP}
            onChange={(e) => {
              setInternalNIP(e.target.value);
              debouncedFetchEmployeeData(e.target.value);
            }}
            disabled={isSubmitting || isLoadingEmployee}
            ref={nipInputRef}
            name="nip"
          />
          {isLoadingEmployee && <p className="text-sm text-blue-500">Mencari data pegawai...</p>}
          {nipError && <p className="text-sm text-red-500">{nipError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nama-internal" className="font-poppins font-medium">Nama Lengkap *</Label>
          <Input
            id="nama-internal"
            placeholder="Masukkan nama lengkap"
            required
            className="font-poppins"
            value={internalName}
            onChange={(e) => setInternalName(e.target.value)}
            disabled={isSubmitting || isLoadingEmployee}
            name="nama-internal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="unit-kerja" className="font-poppins font-medium">Unit Kerja *</Label>
          <Select
            required
            value={internalUnitKerja}
            onValueChange={setInternalUnitKerja}
            disabled={isSubmitting || isLoadingEmployee}
            name="unit-kerja"
          >
            <SelectTrigger className="font-poppins">
              <SelectValue placeholder="Pilih unit kerja" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sekretariat">Sekretariat</SelectItem>
              <SelectItem value="Deputi Bidang Politik">Deputi Bidang Politik</SelectItem>
              <SelectItem value="Deputi Bidang Ekonomi">Deputi Bidang Ekonomi</SelectItem>
              <SelectItem value="Deputi Bidang Kesra">Deputi Bidang Kesra</SelectItem>
              <SelectItem value="Deputi Bidang Hukum">Deputi Bidang Hukum</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default InternalEmployeeForm;