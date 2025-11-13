import { ArrowRight, Users, CheckCircle, BarChart3, Zap, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex items-center justify-between mb-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo/logo-aura.svg" 
              alt="AuraTasks Logo" 
              width={60} 
              height={60}
              className="w-35 h-35"
            />
            <span className="text-2xl font-bold text-gray-900">AuraTasks</span>
          </Link>
          <div className="flex items-center space-x-4">
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
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-5xl mx-auto mb-24">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Gestión de proyectos moderna y colaborativa</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Gestiona tareas con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              fluidez y en equipo
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
            Un sistema moderno de gestión de tareas y proyectos colaborativos diseñado para que tú y tu equipo trabajen con total organización y claridad.
          </p>
          
          <p className="text-lg text-gray-500 mb-10">
            Desde un panel intuitivo y minimalista, podrás crear espacios de trabajo, tableros y tareas para mantener cada objetivo bajo control.
          </p>
          
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 font-semibold text-lg flex items-center"
            >
              Empezar Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-lg"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Con AuraTasks, administrar tus proyectos se convierte en una{' '}
            <span className="text-blue-600">experiencia fluida</span>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Todo lo que necesitas para fluir en tu trabajo, conectar con tu equipo y alcanzar tus metas con orden y eficiencia.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                👥 Colabora en equipo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Asigna tareas, comparte avances y mantén la comunicación centralizada.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                📊 Visualiza tu progreso
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Obtén métricas claras sobre tareas activas, completadas y crecimiento semanal.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ⚙️ Optimiza tu productividad
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gestiona todo desde un solo lugar, sin perder el enfoque.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🌐 Diseño limpio y eficiente
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Una interfaz moderna que facilita tu día a día.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 shadow-xl text-white mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Funcionalidades completas para tu equipo
            </h2>
            <p className="text-xl text-blue-100 mb-12 text-center">
              Todo lo que necesitas en un solo lugar
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Workspaces organizados por proyectos',
                'Tableros Kanban personalizables',
                'Asignación y seguimiento de tareas',
                'Colaboración en tiempo real',
                'Métricas y estadísticas detalladas',
                'Gestión de equipos y permisos',
                'Interfaz intuitiva y minimalista',
                'Notificaciones y recordatorios',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <span className="text-white font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center py-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            ¿Listo para fluir en tu trabajo?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Únete a Flowly y transforma la manera en que tu equipo gestiona proyectos. 
            Comienza gratis hoy mismo.
          </p>
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center bg-blue-600 text-white px-10 py-5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 font-bold text-xl"
            >
              Crear Cuenta Gratis
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-bold text-xl"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12 pb-8 mt-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
             <Image 
              src="/logo/logo-aura.svg" 
              alt="AuraTasks Logo" 
              width={60} 
              height={60}
              className="w-35 h-35"
            />
            <span className="text-xl font-bold text-gray-900">AuraTasks</span>
          </div>
          <p className="text-center text-gray-600">
            © 2025 AuraTasks. Gestiona tareas con fluidez y en equipo.
          </p>
        </footer>
      </div>
    </div>
  );
}
