// tropicans/aio-kehadiran-sakti/aio-kehadiran-sakti-57111c6736df0d5ca77f42b627151aeeefc2f0cc/src/components/AbsensiForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Textarea masih diimpor, tapi tidak digunakan lagi di form
import { UserCheck, Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fungsi debounce utility
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

const AbsensiForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [internalNIP, setInternalNIP] = useState('');
    const [internalName, setInternalName] = useState('');
    const [internalUnitKerja, setInternalUnitKerja] = useState('');
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
    const [nipError, setNipError] = useState('');
    // State baru untuk kegiatan harian
    const [dailyActivities, setDailyActivities] = useState<{ id: number; activity_name: string }[]>([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(false);
    const [selectedActivityTypeInternal, setSelectedActivityTypeInternal] = useState('');
    const [selectedActivityTypeExternal, setSelectedActivityTypeExternal] = useState('');
    const [otherActivityNameInternal, setOtherActivityNameInternal] = useState('');
    const [otherActivityNameExternal, setOtherActivityNameExternal] = useState('');

    const { toast } = useToast();

    const nipInputRef = React.useRef<HTMLInputElement>(null);

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

    // Fungsi untuk mengambil data pegawai (dibungkus useCallback agar stabil)
    const fetchEmployeeData = useCallback(async (nip: string) => {
        if (!nip) {
            setInternalName('');
            setInternalUnitKerja('');
            setNipError('');
            return;
        }

        setIsLoadingEmployee(true);
        setNipError('');
        try {
            // Pastikan URL sesuai dengan endpoint backend Anda
            const response = await fetch(`http://localhost:5000/api/attendance/employees/${nip}`);
            const data = await response.json();

            if (response.ok) {
                setInternalName(data.full_name);
                setInternalUnitKerja(data.unit_kerja);
            } else {
                setInternalName('');
                setInternalUnitKerja('');
                setNipError(data.message || 'Data pegawai tidak ditemukan.');
                toast({
                    title: "Data Tidak Ditemukan",
                    description: data.message || "NIP tidak ditemukan dalam database.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setInternalName('');
            setInternalUnitKerja('');
            setNipError('Gagal terhubung ke server atau terjadi kesalahan.');
            toast({
                title: "Terjadi Kesalahan",
                description: "Gagal mengambil data pegawai. Coba lagi nanti.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingEmployee(false);
            // Fokus kembali pada input setelah proses fetch selesai, baik berhasil atau gagal
            if (nipInputRef.current) {
                setTimeout(() => { // Tunda fokus untuk memastikan DOM sudah update
                    nipInputRef.current?.focus();
                }, 0);
            }
        }
    }, [setInternalName, setInternalUnitKerja, setNipError, setIsLoadingEmployee, toast]);

    // Buat versi debounced dari fetchEmployeeData
    const debouncedFetchEmployeeData = useCallback(
        debounce(fetchEmployeeData, 500),
        [fetchEmployeeData]
    );

    // Fungsi untuk mengambil daftar kegiatan harian
    const fetchDailyActivities = useCallback(async () => {
        setIsLoadingActivities(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`http://localhost:5000/api/daily-activities/today?date=${today}`);
            const data = await response.json();

            if (response.ok) {
                setDailyActivities(data);
                if (data.length === 0) {
                    toast({
                        title: "Tidak Ada Kegiatan Hari Ini",
                        description: "Penyelenggara belum menambahkan kegiatan untuk hari ini.",
                        variant: "default",
                    });
                }
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
    }, [setDailyActivities, setIsLoadingActivities, toast]);

    // Effect hook untuk memanggil fetchDailyActivities saat komponen dimuat
    useEffect(() => {
        fetchDailyActivities();
    }, [fetchDailyActivities]); // Panggil sekali saat komponen dimuat

    const handleSubmit = async (e: React.FormEvent, type: 'internal' | 'external') => {
        e.preventDefault();
        setIsSubmitting(true);
        setNipError(''); // Clear NIP error on submission attempt

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        let payload: any = {
            attendance_type: type,
            notes: '', // Notes selalu kosong karena kolom dihapus
        };

        let selectedActivityType = '';
        let otherActivityName = '';

        if (type === 'internal') {
            selectedActivityType = selectedActivityTypeInternal;
            otherActivityName = otherActivityNameInternal;
        } else { // external
            selectedActivityType = selectedActivityTypeExternal;
            otherActivityName = otherActivityNameExternal;
        }

        if (selectedActivityType === 'Lainnya (diluar jadwal)') {
            payload.activity_type = otherActivityName; // Gunakan nama dari input baru
            payload.notes = ''; // Pastikan notes kosong jika "Lainnya"
        } else {
            payload.activity_type = selectedActivityType; // Gunakan jenis kegiatan yang dipilih
            payload.notes = ''; // Pastikan notes kosong jika bukan "Lainnya"
        }

        // Reformat date and time to ISO string for backend
        const rawDate = new Date(); // Get raw date object for formatting
        payload.attendance_date = rawDate.toISOString().split('T')[0]; //YYYY-MM-DD
        payload.attendance_time = rawDate.toTimeString().split(' ')[0].substring(0, 5) + ':00'; // HH:MM:00 (assuming minutes only is fine, add seconds)

        if (type === 'internal') {
            payload.nip = formData.get('nip')?.toString() || '';
            payload.full_name = formData.get('nama-internal')?.toString() || '';
            if (internalUnitKerja) { // Hanya kirim jika ada nilai
                payload.unit_kerja = internalUnitKerja;
            }

            if (!payload.nip || !payload.full_name || !selectedActivityType) {
                toast({
                    title: "Validasi Gagal",
                    description: "Pastikan NIP, Nama Lengkap, dan Jenis Kegiatan terisi untuk Pegawai Internal.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
            if (selectedActivityType === 'Lainnya (diluar jadwal)' && !otherActivityName) { // Validasi nama rapat
                toast({
                    title: "Validasi Gagal",
                    description: "Nama Rapat wajib diisi saat memilih 'Lainnya (diluar jadwal)'.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

        } else { // external
            payload.full_name = formData.get('nama-external')?.toString() || '';
            payload.instansi = formData.get('instansi')?.toString() || '';
            payload.jabatan = formData.get('jabatan')?.toString() || '';

            if (!payload.full_name || !payload.instansi || !payload.jabatan || !selectedActivityType) {
                toast({
                    title: "Validasi Gagal",
                    description: "Pastikan Nama, Instansi, Jabatan, dan Jenis Kegiatan terisi untuk Tamu Eksternal.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
            if (selectedActivityType === 'Lainnya (diluar jadwal)' && !otherActivityName) { // Validasi nama rapat
                toast({
                    title: "Validasi Gagal",
                    description: "Nama Rapat wajib diisi saat memilih 'Lainnya (diluar jadwal)'.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
        }

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
                    description: result.message || `Terima kasih, absensi ${type === 'internal' ? 'pegawai internal' : 'tamu eksternal'} Anda telah tercatat.`,
                });
                form.reset(); // Reset form only on success
                setInternalNIP(''); // Clear NIP state
                setInternalName(''); // Clear autofilled name
                setInternalUnitKerja(''); // Clear autofilled unit kerja
            } else {
                toast({
                    title: "Absensi Gagal",
                    description: result.message || "Terjadi kesalahan saat menyimpan absensi.",
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
                                                value={internalNIP}
                                                onChange={(e) => {
                                                    setInternalNIP(e.target.value);
                                                    debouncedFetchEmployeeData(e.target.value);
                                                }}
                                                disabled={isSubmitting || isLoadingEmployee}
                                                ref={nipInputRef}
                                                name="nip"
                                            />
                                            {isLoadingEmployee && <p className="text-sm text-blue-500">Mencari data pegawai...</p>}
                                            {nipError && <p className="text-sm text-red-500">{nipError}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama-internal" className="font-poppins font-medium">Nama Lengkap *</Label>
                                            <Input
                                                id="nama-internal"
                                                placeholder="Masukkan nama lengkap"
                                                required
                                                className="font-poppins"
                                                value={internalName}
                                                onChange={(e) => setInternalName(e.target.value)}
                                                disabled={isSubmitting || isLoadingEmployee}
                                                name="nama-internal"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="unit-kerja" className="font-poppins font-medium">Unit Kerja *</Label>
                                            <Select
                                                required
                                                value={internalUnitKerja}
                                                onValueChange={setInternalUnitKerja}
                                                disabled={isSubmitting || isLoadingEmployee}
                                                name="unit-kerja"
                                            >
                                                <SelectTrigger className="font-poppins">
                                                    <SelectValue placeholder="Pilih unit kerja" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Sekretariat">Sekretariat</SelectItem>
                                                    <SelectItem value="Deputi Bidang Politik">Deputi Bidang Politik</SelectItem>
                                                    <SelectItem value="Deputi Bidang Ekonomi">Deputi Bidang Ekonomi</SelectItem>
                                                    <SelectItem value="Deputi Bidang Kesra">Deputi Bidang Kesra</SelectItem>
                                                    <SelectItem value="Deputi Bidang Hukum">Deputi Bidang Hukum</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jenis-kegiatan-internal" className="font-poppins font-medium">Jenis Kegiatan *</Label>
                                            <Select
                                                required
                                                name="jenis-kegiatan-internal"
                                                disabled={isSubmitting || isLoadingActivities}
                                                value={selectedActivityTypeInternal}
                                                onValueChange={setSelectedActivityTypeInternal}
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

                                    {selectedActivityTypeInternal === 'Lainnya (diluar jadwal)' ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="otherActivityNameInternal" className="font-poppins font-medium">Nama Rapat *</Label>
                                            <Input
                                                id="otherActivityNameInternal"
                                                placeholder="Masukkan nama rapat"
                                                required
                                                value={otherActivityNameInternal}
                                                onChange={(e) => setOtherActivityNameInternal(e.target.value)}
                                                disabled={isSubmitting}
                                                className="font-poppins"
                                                name="otherActivityNameInternal"
                                            />
                                        </div>
                                    ) : null} {/* Hapus div Keterangan Kegiatan di sini */}

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
                                                name="nama-external"
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

                                    {selectedActivityTypeExternal === 'Lainnya (diluar jadwal)' ? (
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
                                    ) : null} {/* Hapus div Keterangan Kegiatan di sini */}

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