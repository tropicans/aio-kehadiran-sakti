// src/components/AbsensiForm.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentDateTime } from '@/lib/utils';
import { useEmployeeLookup } from '@/hooks/useEmployeeLookup';
import { useDailyActivities } from '@/hooks/useDailyActivities';
import { useAbsensiSubmission } from '@/hooks/useAbsensiSubmission.ts'; // Gunakan jalur alias
import InternalEmployeeForm from './AbsensiFormComponents/InternalEmployeeForm';
import ExternalGuestForm from './AbsensiFormComponents/ExternalGuestForm';

const AbsensiForm = () => {
    const location = useLocation();
    const [selectedMainCategory, setSelectedMainCategory] = useState(''); // State baru untuk kategori utama (Luring/Daring)
    const [selectedSubCategory, setSelectedSubCategory] = useState(''); // State baru untuk sub-kategori
    const [activityDetailName, setActivityDetailName] = useState(''); // State baru untuk nama kegiatan spesifik

    // Definisi kategori dan sub-kategori statis
    const activityCategories: { [key: string]: string[] } = {
      'Luring': ['Rapat', 'Kunjungan', 'Bimbingan Teknis', 'Sosialisasi', 'Diskusi Kelompok', 'Lainnya Luring'],
      'Daring': ['Webinar', 'Zoom Meeting', 'Pelatihan Online', 'Kuliah Umum', 'Lainnya Daring']
    };

    const { toast } = useToast();
    const { date, time } = getCurrentDateTime();

    const {
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
        resetEmployeeData,
    } = useEmployeeLookup();

    const { dailyActivities, isLoadingActivities, activityNameFromUrl } = useDailyActivities();

    // Gunakan custom hook untuk logika submit
    const { isSubmitting, submitAbsensi } = useAbsensiSubmission();

    // Effect untuk mengatur kategori dan sub-kategori terpilih saat activityNameFromUrl tersedia
    useEffect(() => {
        if (activityNameFromUrl) {
            // Coba pisahkan activityNameFromUrl menjadi MainCategory dan SubCategory
            let foundMainCategory = '';
            let foundSubCategory = '';

            // Iterasi untuk menemukan kategori dan sub-kategori yang cocok
            for (const mainCat in activityCategories) {
              const subCats = activityCategories[mainCat];
              if (subCats.includes(activityNameFromUrl)) {
                foundMainCategory = mainCat;
                foundSubCategory = activityNameFromUrl;
                break;
              }
            }

            // Jika tidak ditemukan sebagai Sub Kategori yang sudah ada, mungkin itu adalah nama kegiatan spesifik
            if (foundMainCategory && foundSubCategory) {
              setSelectedMainCategory(foundMainCategory);
              setSelectedSubCategory(foundSubCategory);
              setActivityDetailName(activityNameFromUrl); // Set nama detail juga
            } else if (activityNameFromUrl) {
              // Jika activityNameFromUrl tidak cocok dengan sub-kategori yang dikenal,
              // anggap itu sebagai nama kegiatan spesifik dan set 'Lainnya' jika ada.
              setActivityDetailName(activityNameFromUrl);

              // Coba set default ke 'Lainnya Luring' atau 'Lainnya Daring' jika ada
              if (activityCategories['Luring'] && activityCategories['Luring'].includes('Lainnya Luring')) {
                setSelectedMainCategory('Luring');
                setSelectedSubCategory('Lainnya Luring');
              } else if (activityCategories['Daring'] && activityCategories['Daring'].includes('Lainnya Daring')) {
                setSelectedMainCategory('Daring');
                setSelectedSubCategory('Lainnya Daring');
              } else {
                // Jika tidak ada 'Lainnya', biarkan kategori dan sub-kategori kosong
                setSelectedMainCategory('');
                setSelectedSubCategory('');
              }
            }

            toast({
                title: "Data Kegiatan Terisi Otomatis",
                description: "Jenis kegiatan dan tanggal presensi telah terisi dari QR Code.",
            });
        }
    }, [activityNameFromUrl, toast]); // Dependency ke activityNameFromUrl dan toast

    const handleSubmit = async (e: React.FormEvent, type: 'internal' | 'external') => {
        e.preventDefault();

        let payload: any = {
            attendance_type: type,
            notes: '', // Notes selalu kosong
        };

        const mainCategory = selectedMainCategory;
        const subCategory = selectedSubCategory;
        const detailName = activityDetailName;

        // Validasi awal untuk kategori dan nama kegiatan
        if (!mainCategory || !subCategory || !detailName) {
            toast({
                title: "Validasi Gagal",
                description: "Kategori Utama, Sub Kategori Kegiatan, dan Nama Kegiatan wajib diisi.",
                variant: "destructive",
            });
            return;
        }

        // Membangun activity_type untuk payload
        // Sesuaikan format ini sesuai dengan yang diharapkan backend
        payload.activity_type = `${mainCategory} - ${subCategory}`;
        payload.activity_name_detail = detailName; // Nama kegiatan spesifik

        const queryParams = new URLSearchParams(location.search);
        const activityDateFromUrl = queryParams.get('activityDate');
        const rawDate = new Date();
        payload.attendance_date = activityDateFromUrl || rawDate.toISOString().split('T')[0];
        payload.attendance_time = rawDate.toTimeString().split(' ')[0].substring(0, 5) + ':00';

        // Validasi data spesifik untuk internal/external
        if (type === 'internal') {
            payload.nip = internalNIP;
            payload.full_name = internalName;
            payload.unit_kerja = internalUnitKerja;

            if (!payload.nip || !payload.full_name || !payload.unit_kerja) {
                toast({
                    title: "Validasi Gagal",
                    description: "Pastikan NIP, Nama Lengkap, dan Unit Kerja terisi untuk Pegawai Internal.",
                    variant: "destructive",
                });
                return;
            }

        } else { // external
            // Ambil nilai dari event target form untuk field external
            const targetForm = e.target as HTMLFormElement;
            payload.full_name = (targetForm.elements.namedItem('nama-external') as HTMLInputElement)?.value || '';
            payload.instansi = (targetForm.elements.namedItem('instansi') as HTMLInputElement)?.value || '';
            payload.jabatan = (targetForm.elements.namedItem('jabatan') as HTMLInputElement)?.value || '';

            if (!payload.full_name || !payload.instansi || !payload.jabatan) {
                toast({
                    title: "Validasi Gagal",
                    description: "Pastikan Nama, Instansi, dan Jabatan terisi untuk Tamu Eksternal.",
                    variant: "destructive",
                });
                return;
            }
        }

        const response = await submitAbsensi(payload);
        if (response.success) {
            // Reset semua state yang dikelola React
            resetEmployeeData();
            setActivityDetailName('');
            setSelectedMainCategory('');
            setSelectedSubCategory('');

            // Reset field form eksternal yang tidak dikelola oleh state React
            if (type === 'external') {
              const targetForm = e.target as HTMLFormElement;
              (targetForm.elements.namedItem('nama-external') as HTMLInputElement).value = '';
              (targetForm.elements.namedItem('instansi') as HTMLInputElement).value = '';
              (targetForm.elements.namedItem('jabatan') as HTMLInputElement).value = '';
            }
        }
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Form Presensi</h2>
                    <p className="text-gray-600 font-poppins">Pilih kategori presensi sesuai status Anda</p>

                    <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-poppins">{date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
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
                                    <InternalEmployeeForm
                                        internalNIP={internalNIP}
                                        setInternalNIP={setInternalNIP}
                                        internalName={internalName}
                                        setInternalName={setInternalName}
                                        internalUnitKerja={internalUnitKerja}
                                        setInternalUnitKerja={setInternalUnitKerja}
                                        isLoadingEmployee={isLoadingEmployee}
                                        nipError={nipError}
                                        debouncedFetchEmployeeData={debouncedFetchEmployeeData}
                                        nipInputRef={nipInputRef}
                                        activityCategories={activityCategories} // Teruskan prop baru
                                        selectedMainCategory={selectedMainCategory}
                                        setSelectedMainCategory={setSelectedMainCategory}
                                        selectedSubCategory={selectedSubCategory}
                                        setSelectedSubCategory={setSelectedSubCategory}
                                        activityDetailName={activityDetailName}
                                        setActivityDetailName={setActivityDetailName}
                                        isSubmitting={isSubmitting}
                                    />
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
                                    <ExternalGuestForm
                                        activityCategories={activityCategories} // Teruskan prop baru
                                        selectedMainCategory={selectedMainCategory}
                                        setSelectedMainCategory={setSelectedMainCategory}
                                        selectedSubCategory={selectedSubCategory}
                                        setSelectedSubCategory={setSelectedSubCategory}
                                        activityDetailName={activityDetailName}
                                        setActivityDetailName={setActivityDetailName}
                                        isSubmitting={isSubmitting}
                                    />
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

export { AbsensiForm }; // Menggunakan named export