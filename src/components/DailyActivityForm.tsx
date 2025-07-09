// tropicans/aio-kehadiran-sakti/aio-kehadiran-sakti-57111c6736df0d5ca77f42b627151aeeefc2f0cc/src/components/DailyActivityForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface DailyActivityFormProps {
  onActivityAdded: () => void; // Tambahkan prop ini
}

const DailyActivityForm: React.FC<DailyActivityFormProps> = ({ onActivityAdded }) => {
  const [activityName, setActivityName] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!activityName || !activityDate) {
      toast({
        title: "Validasi Gagal",
        description: "Nama Kegiatan dan Tanggal wajib diisi.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      activity_name: activityName,
      activity_date: activityDate,
    };

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
          description: `Kegiatan "${activityName}" telah tersimpan.`,
        });
        setActivityName('');
        setActivityDate('');
        onActivityAdded(); // Panggil callback setelah berhasil menambahkan kegiatan
      } else {
        toast({
          title: "Gagal Menambahkan Kegiatan",
          description: result.message || "Terjadi kesalahan pada server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              <div className="space-y-2">
                <Label htmlFor="activityName" className="font-poppins font-medium">Nama Kegiatan *</Label>
                <Input
                  id="activityName"
                  placeholder="Contoh: Rapat Koordinasi Mingguan"
                  required
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  disabled={isSubmitting}
                  className="font-poppins"
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
