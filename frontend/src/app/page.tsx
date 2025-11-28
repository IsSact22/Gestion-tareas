'use client'; // Necesario para el menú interactivo

import { useState } from 'react';
import { ArrowRight, Users, CheckCircle, BarChart3, Zap, Target, Sparkles, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Estado para controlar el menú en móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        
        {/* --- NAV BAR RESPONSIVE --- */}
        <nav className="relative mb-12 md:mb-16">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity z-50">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image 
                  src="https://drive.google.com/uc?export=view&id=1LOsbQcwaCFfTrprLrr-8yCE1CDP15LHM" 
                  alt="AuraTasks Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">AuraTasks</span>
            </Link>

            {/* Desktop Menu (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg font-medium"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Mobile Menu Button (Visible only on Mobile) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none z-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl mt-2 p-4 flex flex-col space-y-4 md:hidden z-40 border border-gray-100 animate-in slide-in-from-top-5">
              <Link
                href="/login"
                className="text-gray-700 font-medium p-3 hover:bg-gray-50 rounded-lg text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Comenzar Gratis
              </Link>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-5xl mx-auto mb-16 md:mb-24 px-2">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-6">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>Gestión de proyectos moderna y colaborativa</span>
          </div>
          
          {/* Títulos ajustados para móvil (text-4xl) y desktop (text-7xl) */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Gestiona tareas con{' '}
            <span className="block md:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              fluidez y en equipo
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
            Un sistema moderno de gestión de tareas y proyectos colaborativos diseñado para que tú y tu equipo trabajen con total organización.
          </p>
          
          <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-10">
            Desde un panel intuitivo y minimalista, podrás crear espacios de trabajo y tableros bajo control.
          </p>
          
          {/* Botones en columna para móvil, fila para desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 font-semibold text-lg flex items-center justify-center"
            >
              Empezar Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-lg text-center"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Con AuraTasks, administrar tus proyectos se convierte en una{' '}
            <span className="text-blue-600 block md:inline">experiencia fluida</span>
          </h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Todo lo que necesitas para fluir en tu trabajo, conectar con tu equipo y alcanzar tus metas.
          </p>
          
          {/* Grid: 1 columna en móvil, 2 en tablet, 4 en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, color: "blue", title: "Colabora en equipo", desc: "Asigna tareas, comparte avances y mantén la comunicación centralizada." },
              { icon: BarChart3, color: "purple", title: "Visualiza tu progreso", desc: "Obtén métricas claras sobre tareas activas y crecimiento semanal." },
              { icon: Zap, color: "green", title: "Optimiza tu productividad", desc: "Gestiona todo desde un solo lugar, sin perder el enfoque." },
              { icon: Target, color: "indigo", title: "Diseño limpio", desc: "Una interfaz moderna que facilita tu día a día." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-8 md:p-16 shadow-xl text-white mb-16 md:mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-center">
              Funcionalidades completas
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 md:mb-12 text-center">
              Todo lo que necesitas en un solo lugar
            </p>
            
            {/* Grid de beneficios adaptativo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                'Workspaces por proyectos',
                'Tableros Kanban',
                'Asignación de tareas',
                'Colaboración en tiempo real',
                'Métricas detalladas',
                'Gestión de equipos',
                'Interfaz minimalista',
                'Notificaciones',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-300 flex-shrink-0" />
                  <span className="text-white font-medium text-base md:text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center py-10 md:py-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Listo para fluir?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto">
            Únete a Flowly y transforma la manera en que tu equipo gestiona proyectos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 md:py-5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 font-bold text-lg md:text-xl"
            >
              Crear Cuenta Gratis
              <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-10 py-4 md:py-5 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-bold text-lg md:text-xl"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8 md:pt-12 pb-8 mt-12 md:mt-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
             <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image 
                 src="https://drive.google.com/uc?export=view&id=1LOsbQcwaCFfTrprLrr-8yCE1CDP15LHM"
                  alt="AuraTasks Logo" 
                  width={60} 
                  height={60} 
                  className="object-contain"
                />
             </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">AuraTasks</span>
          </div>
          <p className="text-center text-gray-600 text-sm md:text-base">
            © 2025 AuraTasks. Gestiona tareas con fluidez y en equipo. Todos los derechos reservados para Isaac Hung.
          </p>
        </footer>
      </div>
    </div>
  );
}