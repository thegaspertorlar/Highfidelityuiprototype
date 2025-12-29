import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Search,
  EllipsisVertical,
  Eye,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface AllProjectsProps {
  onNavigate: (view: string) => void;
  projects: Project[];
  onDeleteProject: (id: number) => void;
}

interface Project {
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

export function AllProjects({ onNavigate, projects: savedProjects, onDeleteProject }: AllProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const itemsPerPage = 10;

  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'E-Commerce Platform Rebuild',
      client: 'RetailCo Inc.',
      status: 'active',
      budget: '€85,000',
      spent: '€42,500',
      scenario: 'Realistic',
      startDate: '2025-12-15',
      endDate: '2026-06-15',
      duration: '6 months',
      progress: 50,
    },
    {
      id: 2,
      name: 'Mobile App - iOS & Android',
      client: 'TechStart Ltd.',
      status: 'draft',
      budget: '€120,000',
      spent: '€0',
      scenario: 'Pessimistic',
      startDate: '2025-12-20',
      endDate: '2026-08-20',
      duration: '8 months',
      progress: 0,
    },
    {
      id: 3,
      name: 'API Integration Service',
      client: 'DataFlow Systems',
      status: 'completed',
      budget: '€42,000',
      spent: '€38,500',
      scenario: 'Optimistic',
      startDate: '2025-09-10',
      endDate: '2025-12-10',
      duration: '3 months',
      progress: 100,
    },
    {
      id: 4,
      name: 'Dashboard Analytics Tool',
      client: 'Analytics Pro',
      status: 'active',
      budget: '€55,000',
      spent: '€27,500',
      scenario: 'Realistic',
      startDate: '2025-12-18',
      endDate: '2026-04-18',
      duration: '4 months',
      progress: 50,
    },
    {
      id: 5,
      name: 'CRM System Upgrade',
      client: 'SalesPro Inc.',
      status: 'draft',
      budget: '€68,000',
      spent: '€0',
      scenario: 'Realistic',
      startDate: '2025-12-22',
      endDate: '2026-05-22',
      duration: '5 months',
      progress: 0,
    },
    {
      id: 6,
      name: 'Cloud Migration Project',
      client: 'EnterpriseTech',
      status: 'active',
      budget: '€95,000',
      spent: '€71,250',
      scenario: 'Pessimistic',
      startDate: '2025-10-01',
      endDate: '2026-03-01',
      duration: '5 months',
      progress: 75,
    },
    {
      id: 7,
      name: 'Security Audit & Implementation',
      client: 'SecureBank',
      status: 'on-hold',
      budget: '€78,000',
      spent: '€19,500',
      scenario: 'Realistic',
      startDate: '2025-11-15',
      endDate: '2026-04-15',
      duration: '5 months',
      progress: 25,
    },
    {
      id: 8,
      name: 'AI Chatbot Integration',
      client: 'CustomerFirst',
      status: 'active',
      budget: '€52,000',
      spent: '€31,200',
      scenario: 'Optimistic',
      startDate: '2025-11-20',
      endDate: '2026-02-20',
      duration: '3 months',
      progress: 60,
    },
    {
      id: 9,
      name: 'Website Redesign',
      client: 'BrandCo',
      status: 'completed',
      budget: '€35,000',
      spent: '€33,800',
      scenario: 'Realistic',
      startDate: '2025-08-01',
      endDate: '2025-11-01',
      duration: '3 months',
      progress: 100,
    },
    {
      id: 10,
      name: 'Microservices Architecture',
      client: 'ScaleTech',
      status: 'active',
      budget: '€145,000',
      spent: '€58,000',
      scenario: 'Pessimistic',
      startDate: '2025-12-01',
      endDate: '2026-09-01',
      duration: '9 months',
      progress: 40,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Completed</Badge>;
      case 'on-hold':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">On Hold</Badge>;
      default:
        return null;
    }
  };

  // Filter projects
  const filteredProjects = savedProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteProject = (id: number) => {
    // Add delete logic here
    console.log('Deleting project:', id);
    setDeleteProjectId(null);
    onDeleteProject(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-1">All Projects</h1>
          <p className="text-slate-500">Manage and track all your project estimates</p>
        </div>
        <Button onClick={() => onNavigate('new-project')} className="bg-indigo-600 hover:bg-indigo-700">
          Create New Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search projects or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500">Project</th>
                  <th className="text-left py-3 px-4 text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500">Budget / Spent</th>
                  <th className="text-left py-3 px-4 text-slate-500">Duration</th>
                  <th className="text-left py-3 px-4 text-slate-500">Start Date</th>
                  <th className="text-left py-3 px-4 text-slate-500">Progress</th>
                  <th className="text-right py-3 px-4 text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-slate-900 font-medium">{project.name}</p>
                        <p className="text-slate-500 text-xs">{project.client}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(project.status)}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-slate-900 font-mono text-sm">{project.budget}</p>
                        <p className="text-slate-500 font-mono text-xs">{project.spent} spent</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-600 text-sm">
                        {new Date(project.startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden max-w-[80px]">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-slate-600 text-xs font-mono">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onNavigate('results')}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteProjectId(project.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No projects found matching your filters</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setCurrentPage(1);
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="text-slate-600 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteProjectId !== null} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteProject(deleteProjectId!)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}