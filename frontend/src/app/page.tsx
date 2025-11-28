'use client';

import { useState } from 'react';
import { 
  ArrowRight, 
  Users, 
  BarChart3, 
  Zap, 
  Target, 
  Sparkles, 
  Menu, 
  X, 
  CheckCircle2,
  Layout,
  KanbanSquare,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- FONDO AMBIENTAL (AURAS) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px]" />
      </div>

      {/* --- NAVBAR STICKY GLASS --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* Usamos un div placeholder o tu imagen local si ya la arreglaste */}
            <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
               A
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              AuraTasks
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-200"
            >
              Comenzar Gratis
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col gap-3 md:hidden shadow-xl animate-in slide-in-from-top-5">
            <Link href="/login" className="p-3 text-center text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="p-3 text-center bg-indigo-600 text-white rounded-xl font-medium">
              Comenzar Gratis
            </Link>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-32 pb-16 container mx-auto px-4 md:px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6 uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Gestión inteligente v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
            Organiza tu trabajo con <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient">
              fluidez y estilo.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            AuraTasks es la plataforma donde los equipos modernos planifican, colaboran y ejecutan sus proyectos sin fricción.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-black hover:scale-105 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
            >
              Empezar ahora <ArrowRight size={18} />
            </Link>
            <Link
              href="/demo" // Puedes cambiar esto a un video o más info
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
            >
              Ver Demo
            </Link>
          </div>

          {/* --- CSS MOCKUP (Representación del Dashboard) --- */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-t-3xl border border-gray-200 bg-white/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 overflow-hidden p-2 pb-0">
               {/* Header falso */}
               <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-400/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                   <div className="w-3 h-3 rounded-full bg-green-400/80" />
                 </div>
                 <div className="ml-4 w-32 h-2 bg-gray-100 rounded-full" />
               </div>
               
               <div className="flex h-[300px] md:h-[500px] bg-gray-50/50">
                  {/* Sidebar falso */}
                  <div className="w-16 md:w-64 border-r border-gray-200 hidden md:flex flex-col p-4 gap-3 bg-white">
                     <div className="w-full h-8 bg-gray-100 rounded-lg mb-4" />
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-full h-6 bg-gray-50 rounded-md" />
                     ))}
                  </div>
                  {/* Contenido Kanban falso */}
                  <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                     {[1,2,3].map(col => (
                       <div key={col} className="flex-1 bg-gray-100/50 rounded-xl p-3 flex flex-col gap-3 border border-gray-200/50">
                          <div className="w-20 h-4 bg-gray-200 rounded mb-2" />
                          <div className="w-full h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                             <div className="w-3/4 h-3 bg-gray-100 rounded mb-2" />
                             <div className="w-1/2 h-2 bg-gray-50 rounded" />
                          </div>
                          <div className="w-full h-24 bg-white rounded-lg shadow-sm border border-gray-100 opacity-60" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
            {/* Decoración detrás del mockup */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur-2xl opacity-20 -z-10" />
          </div>
        </div>

        {/* --- FEATURES BENTO GRID --- */}
        <div className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para <span className="text-indigo-600">fluir</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Diseñado para eliminar el caos y potenciar la productividad de tu equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card Grande 1 */}
            <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                 <Layout size={24} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-3">Espacios de Trabajo Flexibles</h3>
               <p className="text-gray-500 mb-6">Organiza tus proyectos en Workspaces dedicados. Separa marketing, desarrollo y diseño en entornos únicos pero conectados.</p>
               <div className="w-full h-32 bg-white rounded-xl border border-gray-200/60 shadow-inner overflow-hidden relative">
                  <div className="absolute top-4 left-4 right-4 h-2 bg-gray-100 rounded-full" />
                  <div className="absolute top-9 left-4 w-1/3 h-2 bg-gray-50 rounded-full" />
               </div>
            </div>

            {/* Card Pequeña 1 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
               <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-purple-600 group-hover:rotate-12 transition-transform">
                 <KanbanSquare size={24} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Tableros Kanban</h3>
               <p className="text-gray-500 text-sm">Visualiza el progreso con arrastrar y soltar. Simple, potente y bonito.</p>
            </div>

            {/* Card Pequeña 2 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
               <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-green-600 group-hover:scale-110 transition-transform">
                 <Users size={24} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Colaboración Real</h3>
               <p className="text-gray-500 text-sm">Invita a tu equipo, asigna tareas y comenta en tiempo real.</p>
            </div>

            {/* Card Grande 2 */}
            <div className="md:col-span-2 bg-gray-900 rounded-3xl p-8 border border-gray-800 text-white hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                   <ShieldCheck size={24} className="text-indigo-300" />
                 </div>
                 <h3 className="text-2xl font-bold mb-3">Seguridad y Control</h3>
                 <p className="text-gray-400 mb-6 max-w-md">Roles granulares de administrador y miembro. Mantén el control total de quién ve y edita tus proyectos importantes.</p>
               </div>
               {/* Decoración fondo card oscura */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- LISTA DE BENEFICIOS --- */}
        <div className="py-20 bg-gradient-to-b from-white to-blue-50/50 rounded-[3rem] my-10">
           <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Por qué elegir AuraTasks?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  'Interfaz ultra-rápida sin recargas',
                  'Actualizaciones en tiempo real',
                  'Diseño minimalista que no distrae',
                  'Gestión de roles y permisos',
                  'Notificaciones inteligentes',
                  'Modo oscuro (Próximamente)'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* --- CTA FINAL --- */}
        <div className="text-center py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 blur-3xl -z-10 rounded-full opacity-60" />
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empieza a organizar tu éxito.
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Únete a AuraTasks hoy y transforma la manera en que tu equipo alcanza sus objetivos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="font-bold text-gray-900">AuraTasks</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            © 2025 AuraTasks. Gestiona tareas con fluidez y en equipo. <br />
            Desarrollado por Isaac Hung.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-gray-600">Privacidad</Link>
            <Link href="#" className="hover:text-gray-600">Términos</Link>
            <Link href="#" className="hover:text-gray-600">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}