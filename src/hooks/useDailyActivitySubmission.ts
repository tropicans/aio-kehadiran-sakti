// src/hooks/useDailyActivitySubmission.ts
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DailyActivityPayload {
  activity_name: string;
  activity_date: string;
}

export const useDailyActivitySubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitDailyActivity = async (payload: DailyActivityPayload) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/daily-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Kegiatan Berhasil Ditambahkan!",
          description: `Kegiatan "${payload.activity_name}" telah tersimpan.`,
        });
        return { success: true, message: result.message };
      } else {
        toast({
          title: "Gagal Menambahkan Kegiatan",
          description: result.message || "Terjadi kesalahan pada server.",
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
    submitDailyActivity,
  };
};