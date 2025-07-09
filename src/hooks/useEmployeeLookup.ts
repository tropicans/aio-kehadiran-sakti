// src/hooks/useEmployeeLookup.ts
import { useState, useCallback, useRef } from 'react';
import { debounce } from '@/lib/utils'; // Import debounce dari utils
import { useToast } from '@/hooks/use-toast';

interface EmployeeData {
  full_name: string;
  unit_kerja: string;
}

export const useEmployeeLookup = () => {
  const [internalNIP, setInternalNIP] = useState('');
  const [internalName, setInternalName] = useState('');
  const [internalUnitKerja, setInternalUnitKerja] = useState('');
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [nipError, setNipError] = useState('');
  const nipInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      const response = await fetch(`http://localhost:5000/api/employees/${nip}`);
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
      if (nipInputRef.current) {
        setTimeout(() => {
          nipInputRef.current?.focus();
        }, 0);
      }
    }
  }, [toast]);

  const debouncedFetchEmployeeData = useCallback(
    debounce(fetchEmployeeData, 500),
    [fetchEmployeeData]
  );

  const resetEmployeeData = useCallback(() => {
    setInternalNIP('');
    setInternalName('');
    setInternalUnitKerja('');
    setNipError('');
  }, []);

  return {
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
  };
};