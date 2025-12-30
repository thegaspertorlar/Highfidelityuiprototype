import { Button } from './ui/button';
import { Users, TrendingUp, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-sm">DaxyCosty</span>
          </div>
          <Button
            onClick={() => onNavigate('login')}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs shadow-md"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                <span className="text-indigo-700 text-xs font-medium">AI-Powered Estimation</span>
              </div>
              
              <h1 className="text-slate-900 leading-tight">
                Smart Resource Planning for Software Teams
              </h1>
              
              <p className="text-slate-600 leading-relaxed text-sm">
                Define your team composition and project timeline. Get instant, accurate cost projections with Best Case, Most Likely, and Worst Case scenarios—powered by industry-standard methodologies.
              </p>

              {/* Quick Benefits */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="text-slate-700 text-xs">Resource-driven cost modeling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="text-slate-700 text-xs">PMI/COCOMO aligned methodologies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="text-slate-700 text-xs">Export-ready Excel reports</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
              <div className="relative overflow-hidden rounded-xl border border-slate-200/50 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1764690690771-b4522d66b433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nJTIwY3Jvd2RlZCUyMG9mZmljZXxlbnwxfHx8fDE3NjcxMTczNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Team collaboration and meeting"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 mb-1 font-semibold text-xs">Team-Based Costing</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Define roles, hourly rates, and allocation percentages. Let the system handle burn rate calculations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 mb-1 font-semibold text-xs">Multi-Scenario Analysis</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Instantly compare Best Case, Most Likely, and Worst Case projections with configurable risk buffers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 mb-1 font-semibold text-xs">Industry Standards</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Built on PMI and COCOMO methodologies. Generate executive-ready Excel reports instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3 text-white"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                </svg>
              </div>
              <span className="text-slate-500 text-xs">© 2025 DaxyCosty</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}