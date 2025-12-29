import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pencil, Trash2, Plus, AlertTriangle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'motion/react';

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

// Available roles
const availableRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'Project Manager',
  'QA Engineer',
  'Mobile Developer',
  'Data Engineer',
];

// Available tech stacks
const availableTechStacks = [
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Java',
  'C#',
  '.NET',
  'PHP',
  'Ruby',
  'Go',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Terraform',
  'Jenkins',
  'GitHub Actions',
  'Tailwind CSS',
  'SASS',
  'Figma',
  'Adobe XD',
  'Sketch',
  'REST API',
  'GraphQL',
  'Microservices',
  'Swift',
  'Kotlin',
  'React Native',
  'Flutter',
];

interface EmployeesProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

export function Employees({ employees, onUpdateEmployees }: EmployeesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: number; name: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rate: '',
  });
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [compensationType, setCompensationType] = useState<'hourly' | 'monthly'>('hourly');

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Generate avatar from name
  const generateAvatar = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Add new employee
  const handleAddEmployee = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter employee name');
      return;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }
    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }
    if (selectedTechStacks.length === 0) {
      toast.error('Please select at least one tech stack');
      return;
    }

    // Find the proper role name from availableRoles
    const properRole = availableRoles.find((r) => r.toLowerCase() === formData.role) || formData.role;

    const newEmployee: Employee = {
      id: Date.now(),
      name: formData.name.trim(),
      avatar: generateAvatar(formData.name),
      role: properRole,
      compensationType,
      rate: parseFloat(formData.rate),
      techStack: [...selectedTechStacks],
      availability: 'available',
    };

    onUpdateEmployees([...employees, newEmployee]);
    
    // Reset form
    setFormData({ name: '', role: '', rate: '' });
    setSelectedTechStacks([]);
    setCompensationType('hourly');
    setDialogOpen(false);

    toast.success(`${newEmployee.name} added successfully!`, {
      description: `${newEmployee.role} - €${newEmployee.rate}${compensationType === 'hourly' ? '/hr' : '/mo'}`,
    });
  };

  // Open edit dialog with employee data
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role.toLowerCase(),
      rate: employee.rate.toString(),
    });
    setSelectedTechStacks([...employee.techStack]);
    setCompensationType(employee.compensationType);
    setDialogOpen(true);
  };

  // Save edited employee
  const handleSaveEmployee = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter employee name');
      return;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }
    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }
    if (selectedTechStacks.length === 0) {
      toast.error('Please select at least one tech stack');
      return;
    }

    // Find the proper role name from availableRoles
    const properRole = availableRoles.find((r) => r.toLowerCase() === formData.role) || formData.role;

    if (editingEmployee) {
      // Update existing employee
      const updatedEmployee: Employee = {
        ...editingEmployee,
        name: formData.name.trim(),
        avatar: generateAvatar(formData.name),
        role: properRole,
        compensationType,
        rate: parseFloat(formData.rate),
        techStack: [...selectedTechStacks],
      };

      onUpdateEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? updatedEmployee : emp)));

      toast.success(`${updatedEmployee.name} updated successfully!`, {
        description: `${updatedEmployee.role} - €${updatedEmployee.rate}${compensationType === 'hourly' ? '/hr' : '/mo'}`,
      });
    }

    // Reset form
    setFormData({ name: '', role: '', rate: '' });
    setSelectedTechStacks([]);
    setCompensationType('hourly');
    setEditingEmployee(null);
    setDialogOpen(false);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteConfirm = (id: number, name: string) => {
    setEmployeeToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  // Confirm delete employee
  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      onUpdateEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      toast.success(`${employeeToDelete.name} removed from team`);
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ name: '', role: '', rate: '' });
      setSelectedTechStacks([]);
      setCompensationType('hourly');
      setEditingEmployee(null);
    }
  };

  const toggleTechStack = (tech: string) => {
    setSelectedTechStacks((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Frontend Developer':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Backend Developer':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Full Stack Developer':
        return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100';
      case 'UI/UX Designer':
        return 'bg-pink-100 text-pink-700 hover:bg-pink-100';
      case 'DevOps Engineer':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
      case 'Project Manager':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'QA Engineer':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'Mobile Developer':
        return 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100';
      case 'Data Engineer':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  const getAvailabilityStatus = (availability: string) => {
    switch (availability) {
      case 'available':
        return { color: 'bg-green-500', label: 'Available' };
      case 'busy':
        return { color: 'bg-amber-500', label: 'Busy' };
      case 'offline':
        return { color: 'bg-slate-400', label: 'Offline' };
      default:
        return { color: 'bg-slate-400', label: 'Unknown' };
    }
  };

  // Calculate hourly rate from monthly salary
  const calculateHourlyRate = (employee: Employee) => {
    if (employee.compensationType === 'hourly') {
      return employee.rate;
    }
    // Monthly to hourly: 1 month = 20 days * 8 hours = 160 hours
    return employee.rate / 160;
  };

  // Filter and search employees
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = employee.name.toLowerCase().includes(query);
    const roleMatch = employee.role.toLowerCase().includes(query);
    const techStackMatch = employee.techStack.some((tech) => tech.toLowerCase().includes(query));
    const searchMatch = nameMatch || roleMatch || techStackMatch;
    
    const filterMatch = roleFilter === 'all' || employee.role.toLowerCase() === roleFilter;
    
    return searchMatch && filterMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-1">Team Resources</h1>
          <p className="text-slate-500">Manage your team members and their expertise.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter employee name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role.toLowerCase()}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="compensationType">Compensation Type</Label>
                <Select
                  value={compensationType}
                  onValueChange={(value) => setCompensationType(value as 'hourly' | 'monthly')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select compensation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="monthly">Monthly Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">
                  {compensationType === 'hourly' ? 'Hourly Rate (€)' : 'Monthly Salary (€)'}
                </Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder={compensationType === 'hourly' ? '85' : '5500'}
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (select multiple)</Label>
                <div className="border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {availableTechStacks.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={selectedTechStacks.includes(tech)}
                        onCheckedChange={() => toggleTechStack(tech)}
                      />
                      <label
                        htmlFor={tech}
                        className="text-sm text-slate-700 cursor-pointer select-none"
                      >
                        {tech}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedTechStacks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedTechStacks.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-indigo-600 border-indigo-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={editingEmployee ? handleSaveEmployee : handleAddEmployee}
              >
                {editingEmployee ? 'Save Employee' : 'Add Employee'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-slate-900">Team Members</CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, role, or tech stack..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1); // Reset to first page on filter
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role.toLowerCase()}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500">Name</th>
                  <th className="text-left py-3 px-4 text-slate-500">Role</th>
                  <th className="text-left py-3 px-4 text-slate-500">Tech Stack</th>
                  <th className="text-left py-3 px-4 text-slate-500">Rate</th>
                  <th className="text-left py-3 px-4 text-slate-500">Availability</th>
                  <th className="text-right py-3 px-4 text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee) => {
                  const status = getAvailabilityStatus(employee.availability);
                  return (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                          {employee.avatar}
                        </div>
                        <span className="text-slate-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleBadgeClass(employee.role)}>{employee.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {employee.techStack.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-slate-600 border-slate-300"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900">
                        €{calculateHourlyRate(employee).toFixed(2)}/hr
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <span className="text-slate-600">{status.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Pencil className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          onClick={() => handleOpenDeleteConfirm(employee.id, employee.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of{' '}
                {filteredEmployees.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Are you sure you want to remove {employeeToDelete?.name} from the team?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-4">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> This action cannot be undone. The employee will be permanently removed from all projects and reports.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}