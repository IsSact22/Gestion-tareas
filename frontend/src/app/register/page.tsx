/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Requerido';
    if (!formData.email.trim()) newErrors.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Inválido';
    if (!formData.password) newErrors.password = 'Requerido';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'No coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 lg:bg-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* --- FONDO EXCLUSIVO MÓVIL (AURAS) --- */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-purple-400/30 rounded-full blur-[80px]" />
         <div className="absolute bottom-[-5%] right-[-10%] w-72 h-72 bg-indigo-400/30 rounded-full blur-[80px]" />
      </div>

      {/* --- COLUMNA IZQUIERDA (FORMULARIO) --- */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[480px] xl:w-[550px] z-10">
        
        {/* Tarjeta Glass en Móvil vs Plano en Desktop */}
        <div className="mx-auto w-full max-w-sm lg:w-96 p-8 lg:p-0 bg-white/70 backdrop-blur-xl lg:bg-transparent rounded-3xl lg:rounded-none shadow-2xl lg:shadow-none border border-white/50 lg:border-none">
          
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
               <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform">
                 A
               </div>
               <span className="font-bold text-xl text-gray-900 tracking-tight">AuraTasks</span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Crear cuenta nueva</h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Ya eres miembro?{' '}
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              name="name"
              placeholder="Ej: Ana García"
              value={formData.name}
              onChange={handleChange}
              icon={<User className="w-4 h-4 text-gray-400" />}
              error={errors.name}
              className="bg-white/50 lg:bg-gray-50 border-gray-200 focus:bg-white transition-all"
            />

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              error={errors.email}
              className="bg-white/50 lg:bg-gray-50 border-gray-200 focus:bg-white transition-all"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contraseña"
                name="password"
                type="password"
                placeholder="Mínimo 6"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock className="w-4 h-4 text-gray-400" />}
                error={errors.password}
                className="bg-white/50 lg:bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
              <Input
                label="Confirmar"
                name="confirmPassword"
                type="password"
                placeholder="Repetir"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<Lock className="w-4 h-4 text-gray-400" />}
                error={errors.confirmPassword}
                className="bg-white/50 lg:bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start pt-2">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                Acepto los <Link href="#" className="underline hover:text-gray-900">Términos</Link> y la <Link href="#" className="underline hover:text-gray-900">Política de Privacidad</Link>.
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 py-3 rounded-xl font-medium transform active:scale-95 transition-all"
              isLoading={isLoading}
            >
              Comenzar ahora <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          
          <div className="mt-6 text-center">
             <p className="text-[10px] text-gray-400">
               Protegido por reCAPTCHA y sujeto a la Política de Privacidad de Google.
             </p>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA (VISUAL DESKTOP) --- */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden">
         <div className="absolute inset-0 z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]" />
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px]" />
         </div>

         <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-center text-white">
             {/* Icono flotante con efecto cristal */}
             <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl animate-float">
                <ShieldCheck size={64} className="text-indigo-200" />
             </div>
             
             <h3 className="text-4xl font-bold mb-4">Empieza con seguridad.</h3>
             <p className="text-lg text-indigo-200 max-w-md leading-relaxed">
               Únete a miles de usuarios que ya gestionan sus proyectos de forma inteligente, rápida y segura con AuraTasks.
             </p>
         </div>
      </div>
    </div>
  );
}