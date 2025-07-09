import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DialogFooter } from '@/components/ui/dialog';

interface User {
    id: string;
    username: string;
    role: string;
}

interface UserFormDialogProps {
    user: User | null; // Null if adding new user, User object if editing
    onSuccess: () => void;
    onCancel: () => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ user, onSuccess, onCancel }) => {
    const [username, setUsername] = useState(user ? user.username : '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(user ? user.role : 'Pegawai'); // Default role
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setRole(user.role);
            setPassword(''); // Password should not be pre-filled when editing
        } else {
            setUsername('');
            setRole('Pegawai');
            setPassword('');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!username || (!user && !password)) { // Password hanya wajib untuk user baru
            toast({
                title: "Validasi Gagal",
                description: "Username dan Password (untuk user baru) wajib diisi.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            username,
            password: password || undefined, // Hanya kirim password jika disediakan (untuk user baru atau jika diubah)
            role,
        };

        try {
            const url = user ? `http://localhost:5000/api/users/${user.id}` : 'http://localhost:5000/api/users';
            const method = user ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Jika Anda mengimplementasikan JWT, kirim token di sini:
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                onSuccess(); // Panggil onSuccess dari parent component untuk refresh tabel dan menutup dialog
            } else {
                throw new Error(result.message || 'Gagal menyimpan pengguna.');
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            toast({
                title: user ? "Gagal Memperbarui" : "Gagal Menambah Pengguna",
                description: error.message || "Terjadi kesalahan saat menyimpan pengguna. Pastikan backend berjalan dan API sudah diimplementasikan.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
            </div>
            {/* Password hanya wajib untuk user baru atau jika ingin diubah */}
            <div className="space-y-2">
                <Label htmlFor="password">{user ? 'Password (Kosongkan jika tidak diubah)' : 'Password *'}</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={user ? '*****' : 'Masukkan password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required={!user} // Password is required only for new users
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Pegawai">Pegawai</SelectItem>
                        <SelectItem value="Tamu">Tamu</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : (user ? 'Simpan Perubahan' : 'Tambah Pengguna')}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default UserFormDialog;