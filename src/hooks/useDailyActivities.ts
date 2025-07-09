// src/hooks/useDailyActivities.ts
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DailyActivity {
  id: number;
  activity_name: string;
}

export const useDailyActivities = () => {
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const fetchDailyActivities = useCallback(async () => {
    setIsLoadingActivities(true);
    try {
      const response = await fetch(`http://localhost:5000/api/daily-activities`);
      const data = await response.json();

      if (response.ok) {
        let activities: DailyActivity[] = data;
        const queryParams = new URLSearchParams(location.search);
        const activityNameFromUrl = queryParams.get('activityName');

        if (activityNameFromUrl && !activities.some(act => act.activity_name === activityNameFromUrl)) {
          activities = [...activities, { id: 0, activity_name: activityNameFromUrl }];
          toast({
            title: "Data Kegiatan Terisi Otomatis",
            description: "Jenis kegiatan dan tanggal presensi telah terisi dari QR Code.",
          });
        }
        setDailyActivities(activities);
      } else {
        toast({
          title: "Gagal Mengambil Kegiatan",
          description: data.message || "Terjadi kesalahan saat mengambil daftar kegiatan harian.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching daily activities:', error);
      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat terhubung ke server untuk daftar kegiatan.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingActivities(false);
    }
  }, [toast, location.search]);

  useEffect(() => {
    fetchDailyActivities();
  }, [fetchDailyActivities]);

  return {
    dailyActivities,
    isLoadingActivities,
    fetchDailyActivities // Allow re-fetching if needed, e.g., after adding a new activity
  };
};