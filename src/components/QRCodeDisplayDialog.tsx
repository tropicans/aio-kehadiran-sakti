import React, { useEffect, useRef } from 'react';
import qrcode from 'qrcode'; // Import library qrcode
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface DailyActivity {
  id: number;
  activity_name: string;
  activity_date: string; // Format YYYY-MM-DD
}

interface QRCodeDisplayDialogProps {
  activity: DailyActivity;
}

const QRCodeDisplayDialog: React.FC<QRCodeDisplayDialogProps> = ({ activity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Base URL untuk halaman absensi di frontend Anda
  const baseUrl = window.location.origin;

  // Konstruksi URL yang akan di-encode ke dalam QR Code
  const qrCodeUrl = `${baseUrl}/?activityId=${activity.id}&activityName=${encodeURIComponent(activity.activity_name)}&activityDate=${activity.activity_date}`;

  useEffect(() => {
    if (canvasRef.current) {
      // Render QR Code ke elemen canvas
      // Menghapus imageSettings untuk memastikan rendering dasar berfungsi
      qrcode.toCanvas(canvasRef.current, qrCodeUrl, {
        width: 256, // Ukuran QR code
        margin: 2,  // Margin di sekitar QR code
        color: {
          dark: '#000000',  // Warna gelap QR code
          light: '#ffffff' // Warna terang QR code
        }
      }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
          toast({
            title: "Gagal Membuat QR Code",
            description: "Terjadi kesalahan saat menghasilkan QR Code.",
            variant: "destructive",
          });
        }
      });
    }
  }, [qrCodeUrl, toast]); // Re-render jika URL berubah

  // Fungsi untuk menyalin URL ke clipboard (menggunakan navigator.clipboard.writeText)
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      toast({
        title: "URL Disalin!",
        description: "URL QR Code berhasil disalin ke clipboard.",
      });
    } catch (err) {
      console.error('Gagal menyalin URL menggunakan navigator.clipboard:', err);
      // Fallback jika navigator.clipboard tidak tersedia atau gagal (misal: di lingkungan iframe)
      const tempInput = document.createElement('textarea');
      tempInput.value = qrCodeUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy'); // Ini adalah fallback yang kurang disarankan
      document.body.removeChild(tempInput);
      toast({
        title: "URL Disalin (Fallback)!",
        description: "URL QR Code berhasil disalin ke clipboard (metode fallback).",
        variant: "default",
      });
    }
  };

  // Fungsi untuk mencetak QR Code
  const handlePrint = () => {
    if (canvasRef.current) {
      // Konversi konten canvas menjadi Data URL (gambar)
      const imageDataUrl = canvasRef.current.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Cetak QR Code</title>');
        // Tambahkan CSS dasar untuk cetak
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: sans-serif; text-align: center; padding: 20px; }');
        printWindow.document.write('img { max-width: 100%; height: auto; margin-bottom: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 8px; }');
        printWindow.document.write('p { font-size: 14px; color: #555; word-break: break-all; }');
        printWindow.document.write('h1 { font-size: 24px; margin-bottom: 10px; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h1>QR Code Absensi</h1>`);
        printWindow.document.write(`<p><strong>Kegiatan:</strong> ${activity.activity_name}</p>`);
        printWindow.document.write(`<p><strong>Tanggal:</strong> ${activity.activity_date}</p>`);
        printWindow.document.write(`<img src="${imageDataUrl}" alt="QR Code Absensi" />`); // Masukkan gambar QR code
        printWindow.document.write(`<p>URL: ${qrCodeUrl}</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } else {
        toast({
          title: "Gagal Mencetak",
          description: "Browser memblokir pop-up. Izinkan pop-up untuk mencetak.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-sm text-center shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-xl font-poppins">QR Code untuk Kegiatan</CardTitle>
          <CardDescription className="font-poppins">{activity.activity_name}</CardDescription>
          <CardDescription className="text-sm text-gray-500 font-poppins">Tanggal: {activity.activity_date}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div id="qrcode-print-area" className="p-4 border border-gray-200 rounded-lg bg-white">
            <canvas ref={canvasRef}></canvas> {/* Elemen canvas untuk merender QR code */}
          </div>
          <p className="text-xs text-gray-600 break-all text-center">{qrCodeUrl}</p>
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleCopyUrl} variant="outline" className="font-poppins">
              Salin URL
            </Button>
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary-700 font-poppins">
              Cetak QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeDisplayDialog;
