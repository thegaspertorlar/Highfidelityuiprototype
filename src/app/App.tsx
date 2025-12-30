import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { Dashboard } from './components/dashboard';
import { Employees } from './components/employees';
import { NewProject } from './components/new-project';
import { ResultsNew } from './components/results-new-fixed';
import { Settings } from './components/settings';
import { AllProjects } from './components/all-projects';
import { Login } from './components/auth/login';
import { Register } from './components/auth/register';
import { Landing } from './components/landing';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface User {
  name: string;
  email: string;
}

interface Employee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  compensationType: 'hourly' | 'monthly';
  rate: number;
  techStack: string[];
  availability: 'available' | 'busy' | 'offline';
}

interface ProjectData {
  features: Array<{
    id: number;
    name: string;
    complexity: 'Low' | 'Medium' | 'High';
    storyPoints: number;
  }>;
  teamMembers: Array<{
    id: number;
    name: string;
    role: string;
    compensationType: 'hourly' | 'monthly';
    costValue: number;
    allocationPercentage: number;
    computedMonthlyCost: number;
  }>;
  duration: number;
  projectName: string;
  clientName?: string;
}

interface SavedProject {
  id: number;
  name: string;
  client: string;
  status: 'active' | 'draft' | 'completed' | 'on-hold';
  budget: string;
  spent: string;
  scenario: string;
  startDate: string;
  endDate: string;
  duration: string;
  progress: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Employee data shared between Employees and NewProject
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Frontend Developer',
      compensationType: 'hourly',
      rate: 85,
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      availability: 'available',
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      role: 'Backend Developer',
      compensationType: 'hourly',
      rate: 90,
      techStack: ['Node.js', 'Python', 'PostgreSQL'],
      availability: 'available',
    },
    {
      id: 3,
      name: 'Emma Williams',
      avatar: 'EW',
      role: 'Project Manager',
      compensationType: 'monthly',
      rate: 6000,
      techStack: ['Agile', 'Scrum', 'Jira'],
      availability: 'busy',
    },
    {
      id: 4,
      name: 'David Martinez',
      avatar: 'DM',
      role: 'Full Stack Developer',
      compensationType: 'hourly',
      rate: 88,
      techStack: ['React', 'Node.js', 'MongoDB'],
      availability: 'available',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      avatar: 'LA',
      role: 'UI/UX Designer',
      compensationType: 'monthly',
      rate: 5500,
      techStack: ['Figma', 'Adobe XD', 'Sketch'],
      availability: 'available',
    },
    {
      id: 6,
      name: 'James Wilson',
      avatar: 'JW',
      role: 'DevOps Engineer',
      compensationType: 'hourly',
      rate: 92,
      techStack: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      availability: 'available',
    },
    {
      id: 7,
      name: 'Sophia Brown',
      avatar: 'SB',
      role: 'QA Engineer',
      compensationType: 'hourly',
      rate: 75,
      techStack: ['Selenium', 'Jest', 'Cypress'],
      availability: 'available',
    },
    {
      id: 8,
      name: 'Robert Taylor',
      avatar: 'RT',
      role: 'Project Manager',
      compensationType: 'monthly',
      rate: 6500,
      techStack: ['Agile', 'Product Management', 'Jira'],
      availability: 'busy',
    },
    {
      id: 9,
      name: 'Olivia Garcia',
      avatar: 'OG',
      role: 'Mobile Developer',
      compensationType: 'hourly',
      rate: 87,
      techStack: ['React Native', 'Swift', 'Kotlin'],
      availability: 'available',
    },
    {
      id: 10,
      name: 'William Lee',
      avatar: 'WL',
      role: 'Backend Developer',
      compensationType: 'monthly',
      rate: 5800,
      techStack: ['Java', 'Spring Boot', 'MySQL'],
      availability: 'offline',
    },
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, validate against backend
    setUser({
      name: email.split('@')[0],
      email: email,
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Mock registration - in real app, send to backend
    setUser({
      name: name,
      email: email,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleSaveProject = (scenario: 'Optimistic' | 'Realistic' | 'Pessimistic') => {
    if (!projectData) return;

    const monthlyBurnRate = projectData.teamMembers.reduce((acc, member) => acc + member.computedMonthlyCost, 0);
    const baseCost = monthlyBurnRate * projectData.duration;
    
    // Calculate cost based on selected scenario
    let selectedCost: number;
    let costMultiplier: number;
    
    switch (scenario) {
      case 'Optimistic':
        selectedCost = baseCost;
        costMultiplier = 1.0;
        break;
      case 'Realistic':
        selectedCost = baseCost * 1.25;
        costMultiplier = 1.25;
        break;
      case 'Pessimistic':
        selectedCost = baseCost * 1.30;
        costMultiplier = 1.30;
        break;
      default:
        selectedCost = baseCost * 1.25;
        costMultiplier = 1.25;
    }

    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + projectData.duration);

    const newProject: SavedProject = {
      id: savedProjects.length + 1,
      name: projectData.projectName,
      client: projectData.clientName || 'Not specified',
      status: 'draft',
      budget: `€${Math.round(selectedCost).toLocaleString()}`,
      spent: '€0',
      scenario: scenario,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      duration: `${projectData.duration} month${projectData.duration > 1 ? 's' : ''}`,
      progress: 0,
    };

    setSavedProjects([newProject, ...savedProjects]);
  };

  // Show auth screens if user is not logged in
  if (!user) {
    // Show landing page first
    if (currentView === 'landing') {
      return <Landing onNavigate={setCurrentView} />;
    }
    
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onNavigateToRegister={() => { setAuthView('register'); setCurrentView('register'); }} />;
    } else {
      return <Register onRegister={handleRegister} onNavigateToLogin={() => { setAuthView('login'); setCurrentView('login'); }} />;
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'employees':
        return <Employees employees={employees} onUpdateEmployees={setEmployees} />;
      case 'new-project':
        return <NewProject onNavigate={setCurrentView} onSaveProjectData={setProjectData} employees={employees} />;
      case 'results':
        return <ResultsNew onNavigate={setCurrentView} projectData={projectData} onSaveProject={handleSaveProject} />;
      case 'settings':
        return <Settings />;
      case 'all-projects':
        return <AllProjects onNavigate={setCurrentView} projects={savedProjects} onDeleteProject={(id) => setSavedProjects(savedProjects.filter(p => p.id !== id))} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />
      
      {/* Mobile Menu Button */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-20 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-white"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </motion.div>
          <span className="text-slate-900">DaxyCosty</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Sidebar - Desktop and Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <Sidebar 
          currentView={currentView} 
          onNavigate={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }} 
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="lg:ml-64 p-4 sm:p-6 pt-20 lg:pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}