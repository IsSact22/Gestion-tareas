/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('¡Bienvenido de nuevo!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 lg:bg-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* --- FONDO EXCLUSIVO MÓVIL (AURAS) --- */}
      {/* Estos orbes solo se ven en pantallas pequeñas (lg:hidden) */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-purple-500/20 rounded-full blur-[80px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]" />
      </div>

      {/* --- COLUMNA IZQUIERDA (FORMULARIO) --- */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[480px] xl:w-[550px] z-10">
        
        {/* Contenedor tipo "Tarjeta" en Móvil vs "Plano" en Desktop */}
        <div className="mx-auto w-full max-w-sm lg:w-96 p-8 lg:p-0 bg-white/70 backdrop-blur-xl lg:bg-transparent rounded-3xl lg:rounded-none shadow-2xl lg:shadow-none border border-white/50 lg:border-none">
          
          {/* Logo & Header */}
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                 A
               </div>
               <span className="font-bold text-xl text-gray-900 tracking-tight">AuraTasks</span>
            </Link>
            
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Empieza gratis hoy
              </Link>
            </p>
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                placeholder="nombre@empresa.com"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="w-4 h-4 text-gray-400" />}
                autoComplete="email"
                className="bg-white/50 lg:bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />

              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                  autoComplete="current-password"
                  className="bg-white/50 lg:bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
                <div className="flex justify-end mt-1">
                  <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200 py-3 rounded-xl font-medium transform active:scale-95 transition-all"
                isLoading={isLoading}
              >
                Iniciar Sesión <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent lg:bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            {/* Social Login Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                 <svg className="h-5 w-5 mr-2 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                 </svg>
                 GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA (Sigue igual, visible solo en LG) --- */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gray-900 overflow-hidden">
         {/* Fondo animado */}
         <div className="absolute inset-0">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px]" />
         </div>

         <div className="relative h-full flex flex-col justify-center items-center p-12 text-center z-10">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                     <LayoutDashboard className="text-gray-900" size={24} />
                  </div>
                  <div className="text-left">
                     <div className="h-2.5 w-24 bg-white/50 rounded mb-2"></div>
                     <div className="h-2 w-16 bg-white/30 rounded"></div>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="h-2 w-full bg-white/20 rounded"></div>
                  <div className="h-2 w-full bg-white/20 rounded"></div>
                  <div className="h-2 w-3/4 bg-white/20 rounded"></div>
               </div>
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">Organiza tu flujo de trabajo.</h3>
            <p className="text-gray-400 text-lg max-w-sm">
               La productividad no se trata de hacer más cosas, sino de hacer las cosas correctas en el momento adecuado.
            </p>
         </div>
      </div>
    </div>
  );
}