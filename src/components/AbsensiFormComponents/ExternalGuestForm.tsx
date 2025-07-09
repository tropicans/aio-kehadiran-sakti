// src/components/AbsensiFormComponents/ExternalGuestForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExternalGuestFormProps {
  dailyActivities: { id: number; activity_name: string }[];
  isLoadingActivities: boolean;
  selectedActivityTypeExternal: string;
  setSelectedActivityTypeExternal: (type: string) => void;
  otherActivityNameExternal: string;
  setOtherActivityNameExternal: (name: string) => void;
  isSubmitting: boolean;
}

const ExternalGuestForm: React.FC<ExternalGuestFormProps> = ({
  dailyActivities,
  isLoadingActivities,
  selectedActivityTypeExternal,
  setSelectedActivityTypeExternal,
  otherActivityNameExternal,
  setOtherActivityNameExternal,
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

        <div className="space-y-2">
          <Label htmlFor="jenis-kegiatan-external" className="font-poppins font-medium">Jenis Kegiatan *</Label>
          <Select
            required
            name="jenis-kegiatan-external"
            disabled={isSubmitting || isLoadingActivities}
            value={selectedActivityTypeExternal}
            onValueChange={setSelectedActivityTypeExternal}
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

      {selectedActivityTypeExternal === 'Lainnya (diluar jadwal)' && (
        <div className="space-y-2">
          <Label htmlFor="otherActivityNameExternal" className="font-poppins font-medium">Nama Rapat *</Label>
          <Input
            id="otherActivityNameExternal"
            placeholder="Masukkan nama rapat"
            required
            value={otherActivityNameExternal}
            onChange={(e) => setOtherActivityNameExternal(e.target.value)}
            disabled={isSubmitting}
            className="font-poppins"
            name="otherActivityNameExternal"
          />
        </div>
      )}
    </div>
  );
};

export default ExternalGuestForm;