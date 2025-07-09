// src/hooks/useAbsensiSubmission.ts
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AbsensiPayload {
  attendance_type: 'internal' | 'external';
  notes: string;
  activity_type: string;
  attendance_date: string;
  attendance_time: string;
  // Internal specific fields
  nip?: string;
  full_name: string;
  unit_kerja?: string;
  // External specific fields
  instansi?: string;
  jabatan?: string;
}

export const useAbsensiSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitAbsensi = async (payload: AbsensiPayload) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Absensi Berhasil!",
          description: result.message || `Terima kasih, absensi Anda telah tercatat.`,
        });
        return { success: true, message: result.message };
      } else {
        toast({
          title: "Absensi Gagal",
          description: result.message || "Terjadi kesalahan saat menyimpan absensi.",
          variant: "destructive",
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
        variant: "destructive",
      });
      return { success: false, message: "Tidak dapat terhubung ke server." };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitAbsensi,
  };
};