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
  dailyActivities: { id: number; activity_name: string }[];
  isLoadingActivities: boolean;
  selectedActivityTypeInternal: string;
  setSelectedActivityTypeInternal: (type: string) => void;
  otherActivityNameInternal: string;
  setOtherActivityNameInternal: (name: string) => void;
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
  dailyActivities,
  isLoadingActivities,
  selectedActivityTypeInternal,
  setSelectedActivityTypeInternal,
  otherActivityNameInternal,
  setOtherActivityNameInternal,
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

        <div className="space-y-2">
          <Label htmlFor="jenis-kegiatan-internal" className="font-poppins font-medium">Jenis Kegiatan *</Label>
          <Select
            required
            name="jenis-kegiatan-internal"
            disabled={isSubmitting || isLoadingActivities}
            value={selectedActivityTypeInternal}
            onValueChange={setSelectedActivityTypeInternal}
          >
            <SelectTrigger className="font-poppins" type="button">
              <SelectValue placeholder={isLoadingActivities ? "Memuat kegiatan..." : "Pilih jenis kegiatan"} />
            </SelectTrigger>
            <SelectContent>
              {dailyActivities.length > 0 ? (
                dailyActivities.map(activity => (
                  <SelectItem key={activity.id} value={activity.activity_name}>
                    {activity.activity_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-activities" disabled>Tidak ada kegiatan hari ini</SelectItem>
              )}
              <SelectItem value="Lainnya (diluar jadwal)">Lainnya (diluar jadwal)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedActivityTypeInternal === 'Lainnya (diluar jadwal)' && (
        <div className="space-y-2">
          <Label htmlFor="otherActivityNameInternal" className="font-poppins font-medium">Nama Rapat *</Label>
          <Input
            id="otherActivityNameInternal"
            placeholder="Masukkan nama rapat"
            required
            value={otherActivityNameInternal}
            onChange={(e) => setOtherActivityNameInternal(e.target.value)}
            disabled={isSubmitting}
            className="font-poppins"
            name="otherActivityNameInternal"
          />
        </div>
      )}
    </div>
  );
};

export default InternalEmployeeForm;