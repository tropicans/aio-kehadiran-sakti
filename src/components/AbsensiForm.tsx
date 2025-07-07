
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AbsensiForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, type: 'internal' | 'external') => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Absensi Berhasil!",
      description: `Terima kasih, absensi ${type === 'internal' ? 'pegawai internal' : 'tamu eksternal'} Anda telah tercatat.`,
    });
    
    setIsSubmitting(false);
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Form Absensi</h2>
          <p className="text-gray-600 font-poppins">Pilih kategori absensi sesuai status Anda</p>
          
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-poppins">{date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-poppins">{time}</span>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-poppins">Formulir Kehadiran</CardTitle>
            <CardDescription className="text-primary-100 font-poppins">
              Isi data dengan lengkap dan benar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs defaultValue="internal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="internal" className="flex items-center space-x-2 font-poppins">
                  <UserCheck className="h-4 w-4" />
                  <span>Pegawai Internal</span>
                </TabsTrigger>
                <TabsTrigger value="external" className="flex items-center space-x-2 font-poppins">
                  <Users className="h-4 w-4" />
                  <span>Tamu Eksternal</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="internal">
                <form onSubmit={(e) => handleSubmit(e, 'internal')} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nip" className="font-poppins font-medium">NIP *</Label>
                      <Input 
                        id="nip" 
                        placeholder="Masukkan NIP Anda" 
                        required 
                        className="font-poppins"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nama-internal" className="font-poppins font-medium">Nama Lengkap *</Label>
                      <Input 
                        id="nama-internal" 
                        placeholder="Masukkan nama lengkap" 
                        required 
                        className="font-poppins"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="unit-kerja" className="font-poppins font-medium">Unit Kerja *</Label>
                      <Select required>
                        <SelectTrigger className="font-poppins">
                          <SelectValue placeholder="Pilih unit kerja" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sekretariat">Sekretariat</SelectItem>
                          <SelectItem value="deputi-1">Deputi Bidang Politik</SelectItem>
                          <SelectItem value="deputi-2">Deputi Bidang Ekonomi</SelectItem>
                          <SelectItem value="deputi-3">Deputi Bidang Kesra</SelectItem>
                          <SelectItem value="deputi-4">Deputi Bidang Hukum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jenis-kegiatan-internal" className="font-poppins font-medium">Jenis Kegiatan *</Label>
                      <Select required>
                        <SelectTrigger className="font-poppins">
                          <SelectValue placeholder="Pilih jenis kegiatan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rapat">Rapat</SelectItem>
                          <SelectItem value="zoom">Zoom Meeting</SelectItem>
                          <SelectItem value="kunjungan">Kunjungan Kerja</SelectItem>
                          <SelectItem value="koordinasi">Koordinasi</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keterangan-internal" className="font-poppins font-medium">Keterangan Kegiatan</Label>
                    <Textarea 
                      id="keterangan-internal" 
                      placeholder="Jelaskan detail kegiatan (opsional)"
                      className="font-poppins"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-800 font-poppins font-semibold py-3 transition-all duration-300"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Submit Absensi'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="external">
                <form onSubmit={(e) => handleSubmit(e, 'external')} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nama-external" className="font-poppins font-medium">Nama Lengkap *</Label>
                      <Input 
                        id="nama-external" 
                        placeholder="Masukkan nama lengkap" 
                        required 
                        className="font-poppins"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instansi" className="font-poppins font-medium">Asal Instansi *</Label>
                      <Input 
                        id="instansi" 
                        placeholder="Masukkan nama instansi" 
                        required 
                        className="font-poppins"
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
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jenis-kegiatan-external" className="font-poppins font-medium">Jenis Kegiatan *</Label>
                      <Select required>
                        <SelectTrigger className="font-poppins">
                          <SelectValue placeholder="Pilih jenis kegiatan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rapat">Rapat Koordinasi</SelectItem>
                          <SelectItem value="zoom">Zoom Meeting</SelectItem>
                          <SelectItem value="kunjungan">Kunjungan Kerja</SelectItem>
                          <SelectItem value="konsultasi">Konsultasi</SelectItem>
                          <SelectItem value="presentasi">Presentasi</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keterangan-external" className="font-poppins font-medium">Keterangan Kegiatan</Label>
                    <Textarea 
                      id="keterangan-external" 
                      placeholder="Jelaskan detail kegiatan (opsional)"
                      className="font-poppins"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-800 font-poppins font-semibold py-3 transition-all duration-300"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Submit Absensi'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AbsensiForm;
