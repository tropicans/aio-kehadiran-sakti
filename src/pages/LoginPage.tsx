import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', { // Asumsi endpoint login adalah /api/auth/login
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Asumsi backend mengembalikan token atau status sukses
                localStorage.setItem('isAuthenticated', 'true'); // Simpan status login
                // TODO: Jika backend mengembalikan token JWT, simpan token tersebut di localStorage juga:
                // localStorage.setItem('authToken', result.token);
                toast({
                    title: "Login Berhasil",
                    description: result.message || "Anda berhasil masuk.",
                });
                navigate('/admin/activities'); // Redirect ke halaman admin
            } else {
                toast({
                    title: "Login Gagal",
                    description: result.message || "Username atau password salah.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: "Kesalahan Jaringan",
                description: "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
                variant: "destructive",
            });
        }
        setIsAuthenticating(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full space-y-8 shadow-xl border-0">
                <CardHeader className="bg-primary text-white rounded-t-lg text-center">
                    <CardTitle className="text-3xl font-bold font-poppins">Login Admin</CardTitle>
                    <CardDescription className="text-primary-100 font-poppins">
                        Masuk untuk mengakses pengaturan kegiatan harian
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    placeholder="Masukkan username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isAuthenticating}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isAuthenticating}
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                disabled={isAuthenticating}
                            >
                                {isAuthenticating ? 'Authenticating...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;