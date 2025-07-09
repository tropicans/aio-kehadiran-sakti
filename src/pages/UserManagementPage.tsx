import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserFormDialog from '@/components/UserFormDialog'; // Akan kita buat nanti

interface User {
    id: string;
    username: string;
    role: string;
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { toast } = useToast();

    // Mock data for demonstration purposes. In a real app, this would come from a backend API.
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/users', { // Panggil API backend untuk mendapatkan daftar pengguna
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Jika Anda mengimplementasikan JWT, kirim token di sini:
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(data);
            } else {
                setError(data.message || 'Gagal memuat data pengguna dari server.');
                toast({
                    title: "Error",
                    description: data.message || "Gagal memuat data pengguna.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
            toast({
                title: "Kesalahan Jaringan",
                description: "Tidak dapat terhubung ke server untuk data pengguna.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUserClick = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUserClick = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        // TODO: Ganti window.confirm dengan modal kustom jika tidak ingin menggunakan alert browser
        if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
          try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                // TODO: Jika Anda mengimplementasikan JWT, kirim token di sini:
                // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
            });
      
            const result = await response.json();
      
            if (response.ok) {
              // Hapus pengguna dari state lokal setelah berhasil dihapus dari backend
              setUsers(users.filter(user => user.id !== userId));
              toast({
                title: "Pengguna Dihapus",
                description: result.message || "Pengguna berhasil dihapus.",
              });
            } else {
              throw new Error(result.message || 'Gagal menghapus pengguna.');
            }
          } catch (error: any) {
            console.error('Error deleting user:', error);
            toast({
              title: "Gagal Menghapus",
              description: error.message || "Terjadi kesalahan saat menghapus pengguna. Pastikan backend berjalan dan API sudah diimplementasikan.",
              variant: "destructive",
            });
          }
        }
      };

    const handleFormSubmitSuccess = () => {
        setIsFormOpen(false);
        fetchUsers(); // Refresh daftar pengguna setelah berhasil
        toast({
            title: "Sukses",
            description: editingUser ? "Pengguna berhasil diperbarui." : "Pengguna baru berhasil ditambahkan.",
        });
    };

    return (
        <div className="min-h-screen bg-white font-poppins">
            <Header />
            <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="bg-primary text-white rounded-t-lg flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-poppins">Manajemen Pengguna</CardTitle>
                                <CardDescription className="text-primary-100 font-poppins">
                                    Kelola daftar pengguna aplikasi.
                                </CardDescription>
                            </div>
                            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={handleAddUserClick} className="bg-primary-600 hover:bg-primary-700 font-poppins">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
                                    </DialogHeader>
                                    <UserFormDialog
                                        user={editingUser}
                                        onSuccess={handleFormSubmitSuccess}
                                        onCancel={() => setIsFormOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isLoading ? (
                                <div className="text-center py-4">Memuat pengguna...</div>
                            ) : error ? (
                                <div className="text-center py-4 text-red-500">{error}</div>
                            ) : users.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">Tidak ada pengguna.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">ID</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.id}</TableCell>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditUserClick(user)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
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
            </main>
            <Footer />
        </div>
    );
};

export default UserManagementPage;