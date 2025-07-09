// src/components/AbsensiForm.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentDateTime } from '@/lib/utils';
import { useEmployeeLookup } from '@/hooks/useEmployeeLookup';
import { useDailyActivities } from '@/hooks/useDailyActivities';
import { useAbsensiSubmission } from '@/hooks/useAbsensiSubmission'; // Import hook baru
import InternalEmployeeForm from './AbsensiFormComponents/InternalEmployeeForm'; // Import komponen baru
import ExternalGuestForm from './AbsensiFormComponents/ExternalGuestForm'; // Import komponen baru

const AbsensiForm = () => {
    const location = useLocation();
    const [selectedActivityTypeInternal, setSelectedActivityTypeInternal] = useState('');
    const [selectedActivityTypeExternal, setSelectedActivityTypeExternal] = useState('');
    const [otherActivityNameInternal, setOtherActivityNameInternal] = useState('');
    const [otherActivityNameExternal, setOtherActivityNameExternal] = useState('');

    const { toast } = useToast();
    const { date, time } = getCurrentDateTime();

    // Gunakan custom hook untuk logika pegawai
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

    // Gunakan custom hook untuk logika kegiatan
    const { dailyActivities, isLoadingActivities } = useDailyActivities();

    // Gunakan custom hook untuk logika submit
    const { isSubmitting, submitAbsensi } = useAbsensiSubmission();

    const handleSubmit = async (e: React.FormEvent, type: 'internal' | 'external') => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        let payload: any = {
            attendance_type: type,
            notes: '',
        };

        let currentSelectedActivityType = '';
        let currentOtherActivityName = '';

        if (type === 'internal') {
            currentSelectedActivityType = selectedActivityTypeInternal;
            currentOtherActivityName = otherActivityNameInternal;
        } else {
            currentSelectedActivityType = selectedActivityTypeExternal;
            currentOtherActivityName = otherActivityNameExternal;
        }

        if (currentSelectedActivityType === 'Lainnya (diluar jadwal)') {
            payload.activity_type = currentOtherActivityName;
        } else {
            payload.activity_type = currentSelectedActivityType;
        }

        const queryParams = new URLSearchParams(location.search);
        const activityDateFromUrl = queryParams.get('activityDate');
        const rawDate = new Date();
        payload.attendance_date = activityDateFromUrl || rawDate.toISOString().split('T')[0];
        payload.attendance_time = rawDate.toTimeString().split(' ')[0].substring(0, 5) + ':00';

        // Validasi
        if (type === 'internal') {
            payload.nip = internalNIP;
            payload.full_name = internalName;
            payload.unit_kerja = internalUnitKerja;

            if (!payload.nip || !payload.full_name || !payload.unit_kerja || !currentSelectedActivityType) {
                toast({
                    title: "Validasi Gagal",
                    description: "Pastikan NIP, Nama Lengkap, Unit Kerja, dan Jenis Kegiatan terisi untuk Pegawai Internal.",
                    variant: "destructive",
                });
                return;
            }
            if (currentSelectedActivityType === 'Lainnya (diluar jadwal)' && !currentOtherActivityName) {
                toast({
                    title: "Validasi Gagal",
                    description: "Nama Rapat wajib diisi saat memilih 'Lainnya (diluar jadwal)'.",
                    variant: "destructive",
                });
                return;
            }
        } else { // external
            payload.full_name = formData.get('nama-external')?.toString() || '';
            payload.instansi = formData.get('instansi')?.toString() || '';
            payload.jabatan = formData.get('jabatan')?.toString() || '';

            if (!payload.full_name || !payload.instansi || !payload.jabatan || !currentSelectedActivityType) {
                toast({
                    title: "Validasi Gagal",
                    description: "Pastikan Nama, Instansi, Jabatan, dan Jenis Kegiatan terisi untuk Tamu Eksternal.",
                    variant: "destructive",
                });
                return;
            }
            if (currentSelectedActivityType === 'Lainnya (diluar jadwal)' && !currentOtherActivityName) {
                toast({
                    title: "Validasi Gagal",
                    description: "Nama Rapat wajib diisi saat memilih 'Lainnya (diluar jadwal)'.",
                    variant: "destructive",
                });
                return;
            }
        }

        const response = await submitAbsensi(payload);
        if (response.success) {
            form.reset();
            resetEmployeeData();
            setSelectedActivityTypeInternal('');
            setSelectedActivityTypeExternal('');
            setOtherActivityNameInternal('');
            setOtherActivityNameExternal('');
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
                                        dailyActivities={dailyActivities}
                                        isLoadingActivities={isLoadingActivities}
                                        selectedActivityTypeInternal={selectedActivityTypeInternal}
                                        setSelectedActivityTypeInternal={setSelectedActivityTypeInternal}
                                        otherActivityNameInternal={otherActivityNameInternal}
                                        setOtherActivityNameInternal={setOtherActivityNameInternal}
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
                                        dailyActivities={dailyActivities}
                                        isLoadingActivities={isLoadingActivities}
                                        selectedActivityTypeExternal={selectedActivityTypeExternal}
                                        setSelectedActivityTypeExternal={setSelectedActivityTypeExternal}
                                        otherActivityNameExternal={otherActivityNameExternal}
                                        setOtherActivityNameExternal={setOtherActivityNameExternal}
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

export default AbsensiForm;