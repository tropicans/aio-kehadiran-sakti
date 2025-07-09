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
  const [activityNameFromUrl, setActivityNameFromUrl] = useState<string>(''); // State baru untuk activityName dari URL
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
        const nameFromUrl = queryParams.get('activityName'); // Gunakan variabel lokal

        if (nameFromUrl) { // Simpan nilai dari URL ke state baru
          setActivityNameFromUrl(nameFromUrl);
          if (!activities.some(act => act.activity_name === nameFromUrl)) {
            activities = [...activities, { id: 0, activity_name: nameFromUrl }];
            // Toast ini sudah dipindahkan ke AbsensiForm untuk menghindari duplikasi
          }
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
    activityNameFromUrl, // KEMBALIKAN activityNameFromUrl DI SINI
    fetchDailyActivities
  };
};