import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import Input from '../../components/ui/forms/Input';
import Select from '../../components/ui/forms/Select';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import { toast } from 'react-toastify';

export default function AdminAirlines() {
  const [airlines, setAirlines] = useState([]);
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [airlineToEdit, setAirlineToEdit] = useState(null);
  const [addForm, setAddForm] = useState({
    name: '',
    code: '',
    country: '',
    status: 'active',
    logo: '',
    email: '',
    phone: '',
    fleetSize: 0,
    foundedYear: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    country: '',
    status: 'active',
    logo: '',
    email: '',
    phone: '',
    fleetSize: 0,
    foundedYear: ''
  });
  
  // Generate mock data
  useEffect(() => {
    const mockAirlines = [
      {
        id: 'AL1001',
        name: 'SkyWings Airlines',
        code: 'SW',
        country: 'United States',
        status: 'active',
        logo: 'https://via.placeholder.com/100',
        contact: {
          email: 'contact@skywings.com',
          phone: '+1 (555) 123-4567'
        },
        fleetSize: 125,
        foundedYear: 1995
      },
      // Add more mock data as needed
    ];
    
    setAirlines(mockAirlines);
    setFilteredAirlines(mockAirlines);
    setLoading(false);
  }, []);

  // Apply search
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = airlines.filter(airline => 
        airline.name.toLowerCase().includes(term) ||
        airline.code.toLowerCase().includes(term) ||
        airline.country.toLowerCase().includes(term)
      );
      setFilteredAirlines(filtered);
    } else {
      setFilteredAirlines(airlines);
    }
  }, [searchTerm, airlines]);

  // Toggle selection
  const toggleAirlineSelection = (id) => {
    setSelectedAirlines(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Toggle status
  const toggleStatus = (id) => {
    setAirlines(prev => 
      prev.map(airline => 
        airline.id === id 
          ? { ...airline, status: airline.status === 'active' ? 'inactive' : 'active' }
          : airline
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Airlines</h1>
          <p className="mt-1 text-sm text-gray-500">Manage airline information and details.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setShowAddModal(true)} leftIcon={<PlusIcon className="h-5 w-5" />}>Add Airline</Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                name="search"
                type="text"
                placeholder="Search airlines..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} leftIcon={<FunnelIcon className="h-5 w-5" />}>{showFilters ? 'Hide Filters' : 'Filters'}</Button>
          </div>
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              {/* Placeholder for future filters */}
              <p className="text-sm text-gray-500">No advanced filters yet.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Airlines Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                  />
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Airline
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Details
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAirlines.map((airline) => (
                <tr key={airline.id} className="hover:bg-gray-50">
                  <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                      checked={selectedAirlines.includes(airline.id)}
                      onChange={() => toggleAirlineSelection(airline.id)}
                    />
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={airline.logo} 
                          alt={airline.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{airline.name}</div>
                        <div className="text-gray-500">{airline.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span>{airline.country}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span>{airline.contact.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      airline.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {airline.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => toggleStatus(airline.id)}
                      >
                        {airline.status === 'active' ? (
                          <XCircleIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => {
                          setAirlineToEdit(airline);
                          setEditForm({
                            name: airline.name || '',
                            code: airline.code || '',
                            country: airline.country || '',
                            status: airline.status || 'active',
                            logo: airline.logo || '',
                            email: airline.contact?.email || '',
                            phone: airline.contact?.phone || '',
                            fleetSize: airline.fleetSize ?? 0,
                            foundedYear: airline.foundedYear ? String(airline.foundedYear) : ''
                          });
                          setShowEditModal(true);
                        }}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          setAirlines(prev => prev.filter(a => a.id !== airline.id));
                          toast.success(`Airline ${airline.name} deleted.`);
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Airline Modal */}
      <Transition appear show={showAddModal}>
        <Dialog as="div" className="relative z-10" onClose={setShowAddModal}>
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">Add Airline</DialogTitle>
                      <p className="mt-1 text-sm text-gray-500">Create a new airline with the details below.</p>
                    </div>
                  </div>

                  <form
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Basic validation
                      if (!addForm.name || !addForm.code || !addForm.country) {
                        toast.error('Please fill in Name, Code and Country.');
                        return;
                      }
                      if (airlines.some(a => a.code.toUpperCase() === addForm.code.toUpperCase())) {
                        toast.error('Airline code already exists.');
                        return;
                      }
                      const newAirline = {
                        id: `AL${Date.now()}`,
                        name: addForm.name,
                        code: addForm.code.toUpperCase(),
                        country: addForm.country,
                        status: addForm.status,
                        logo: addForm.logo || 'https://via.placeholder.com/100',
                        contact: { email: addForm.email, phone: addForm.phone },
                        fleetSize: parseInt(addForm.fleetSize) || 0,
                        foundedYear: addForm.foundedYear ? parseInt(addForm.foundedYear) : null,
                      };
                      setAirlines(prev => [...prev, newAirline]);
                      setFilteredAirlines(prev => [...prev, newAirline]);
                      setShowAddModal(false);
                      setAddForm({ name: '', code: '', country: '', status: 'active', logo: '', email: '', phone: '', fleetSize: 0, foundedYear: '' });
                      toast.success(`Airline ${newAirline.name} created.`);
                    }}
                  >
                    <Input label="Name *" name="name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
                    <Input label="Code *" name="code" value={addForm.code} onChange={(e) => setAddForm({ ...addForm, code: e.target.value })} helperText="2-3 letter airline code" required />
                    <Input label="Country *" name="country" value={addForm.country} onChange={(e) => setAddForm({ ...addForm, country: e.target.value })} required />
                    <Select label="Status" name="status" value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                    <Input label="Logo URL" name="logo" value={addForm.logo} onChange={(e) => setAddForm({ ...addForm, logo: e.target.value })} />
                    <Input label="Contact Email" name="email" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                    <Input label="Contact Phone" name="phone" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} />
                    <Input label="Fleet Size" name="fleetSize" type="number" min="0" value={addForm.fleetSize} onChange={(e) => setAddForm({ ...addForm, fleetSize: e.target.value })} />
                    <Input label="Founded Year" name="foundedYear" type="number" min="1900" max={new Date().getFullYear()} value={addForm.foundedYear} onChange={(e) => setAddForm({ ...addForm, foundedYear: e.target.value })} />

                    <div className="md:col-span-2 mt-2 sm:flex sm:flex-row-reverse">
                      <Button type="submit" className="w-full sm:ml-3 sm:w-auto">Create</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">Cancel</Button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Airline Modal */}
      <Transition appear show={showEditModal}>
        <Dialog as="div" className="relative z-10" onClose={setShowEditModal}>
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PencilSquareIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">Edit Airline</DialogTitle>
                      <p className="mt-1 text-sm text-gray-500">Update airline details.</p>
                    </div>
                  </div>

                  <form
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!airlineToEdit) return;
                      if (!editForm.name || !editForm.code || !editForm.country) {
                        toast.error('Please fill in Name, Code and Country.');
                        return;
                      }
                      if (editForm.code.toUpperCase() !== airlineToEdit.code.toUpperCase() &&
                          airlines.some(a => a.code.toUpperCase() === editForm.code.toUpperCase())) {
                        toast.error('Airline code already exists.');
                        return;
                      }
                      const updated = {
                        ...airlineToEdit,
                        name: editForm.name,
                        code: editForm.code.toUpperCase(),
                        country: editForm.country,
                        status: editForm.status,
                        logo: editForm.logo || 'https://via.placeholder.com/100',
                        contact: { email: editForm.email, phone: editForm.phone },
                        fleetSize: parseInt(editForm.fleetSize) || 0,
                        foundedYear: editForm.foundedYear ? parseInt(editForm.foundedYear) : null,
                      };
                      setAirlines(prev => prev.map(a => a.id === airlineToEdit.id ? updated : a));
                      setFilteredAirlines(prev => prev.map(a => a.id === airlineToEdit.id ? updated : a));
                      setShowEditModal(false);
                      toast.success(`Airline ${updated.name} updated.`);
                    }}
                  >
                    <Input label="Name *" name="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                    <Input label="Code *" name="code" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} required />
                    <Input label="Country *" name="country" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} required />
                    <Select label="Status" name="status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                    <Input label="Logo URL" name="logo" value={editForm.logo} onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })} />
                    <Input label="Contact Email" name="email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                    <Input label="Contact Phone" name="phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                    <Input label="Fleet Size" name="fleetSize" type="number" min="0" value={editForm.fleetSize} onChange={(e) => setEditForm({ ...editForm, fleetSize: e.target.value })} />
                    <Input label="Founded Year" name="foundedYear" type="number" min="1900" max={new Date().getFullYear()} value={editForm.foundedYear} onChange={(e) => setEditForm({ ...editForm, foundedYear: e.target.value })} />

                    <div className="md:col-span-2 mt-2 sm:flex sm:flex-row-reverse">
                      <Button type="submit" className="w-full sm:ml-3 sm:w-auto">Save Changes</Button>
                      <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">Cancel</Button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
