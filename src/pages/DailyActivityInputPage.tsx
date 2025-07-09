// tropicans/aio-kehadiran-sakti/aio-kehadiran-sakti-57111c6736df0d5ca77f42b627151aeeefc2f0cc/src/pages/DailyActivityInputPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DailyActivityForm from '@/components/DailyActivityForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table components
import { QrCode, PlusCircle } from 'lucide-react'; // Import QrCode icon
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // Import Dialog components
import QRCodeDisplayDialog from '@/components/QRCodeDisplayDialog'; // Akan kita buat nanti

interface DailyActivity {
  id: number;
  activity_name: string;
  activity_date: string; // Format YYYY-MM-DD
}

const DailyActivityInputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [selectedActivityForQr, setSelectedActivityForQr] = useState<DailyActivity | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Hapus status login
    navigate('/login'); // Redirect ke halaman login
    toast({
      title: "Logout Berhasil",
      description: "Anda telah berhasil keluar.",
    });
  };

  // Fungsi untuk mengambil daftar kegiatan harian
  const fetchDailyActivities = useCallback(async () => {
    setIsLoadingActivities(true);
    setErrorActivities(null);
    try {
      // Mengambil semua kegiatan, bukan hanya hari ini
      const response = await fetch(`http://localhost:5000/api/daily-activities`);
      const data = await response.json();

      if (response.ok) {
        setDailyActivities(data);
        if (data.length === 0) {
          toast({
            title: "Tidak Ada Kegiatan Tersimpan",
            description: "Belum ada kegiatan yang ditambahkan.",
            variant: "default",
          });
        }
      } else {
        setErrorActivities(data.message || "Terjadi kesalahan saat mengambil daftar kegiatan harian.");
        toast({
          title: "Gagal Mengambil Kegiatan",
          description: data.message || "Terjadi kesalahan saat mengambil daftar kegiatan harian.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching daily activities:', error);
      setErrorActivities("Tidak dapat terhubung ke server untuk daftar kegiatan.");
      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat terhubung ke server untuk daftar kegiatan.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingActivities(false);
    }
  }, [toast]);

  // Effect hook untuk memanggil fetchDailyActivities saat komponen dimuat
  useEffect(() => {
    fetchDailyActivities();
  }, [fetchDailyActivities]);

  const handleGenerateQrClick = (activity: DailyActivity) => {
    setSelectedActivityForQr(activity);
    setIsQrDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <main className="py-8">
        <div className="flex justify-between items-center max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Pengaturan Kegiatan Harian
          </h1>
          <Button onClick={handleLogout} variant="outline" className="font-poppins">
            Logout
          </Button>
        </div>

        {/* Form Input Kegiatan Harian */}
        <DailyActivityForm onActivityAdded={fetchDailyActivities} /> {/* Tambahkan prop onActivityAdded */}

        {/* Daftar Kegiatan Harian */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <CardTitle className="text-2xl font-poppins">Daftar Kegiatan Tersimpan</CardTitle>
              <CardDescription className="text-primary-100 font-poppins">
                Lihat dan kelola kegiatan yang sudah ditambahkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingActivities ? (
                <div className="text-center py-4">Memuat daftar kegiatan...</div>
              ) : errorActivities ? (
                <div className="text-center py-4 text-red-500">{errorActivities}</div>
              ) : dailyActivities.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Tidak ada kegiatan yang tersedia.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nama Kegiatan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell>{activity.activity_name}</TableCell>
                        <TableCell>{activity.activity_date}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleGenerateQrClick(activity)}
                            className="ml-2"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialog untuk menampilkan QR Code */}
        <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>QR Code Absensi</DialogTitle>
            </DialogHeader>
            {selectedActivityForQr && (
              <QRCodeDisplayDialog activity={selectedActivityForQr} />
            )}
          </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
};

export default DailyActivityInputPage;
