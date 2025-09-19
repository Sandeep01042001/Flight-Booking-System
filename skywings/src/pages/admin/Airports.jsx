import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  MapPinIcon,
  GlobeAltIcon,
  ClockIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import Card from '../../components/common/Card';
import Input from '../../components/ui/forms/Input';
import Select from '../../components/ui/forms/Select';
import Button from '../../components/ui/buttons/Button';
import { toast } from 'react-toastify';

export default function AdminAirports() {
  // State for airports data and UI
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [airportToEdit, setAirportToEdit] = useState(null);
  const [addForm, setAddForm] = useState({
    name: '',
    iata: '',
    icao: '',
    city: '',
    country: '',
    timezone: '',
    latitude: '',
    longitude: '',
    terminals: 1,
    runways: 1,
    status: 'active',
    isInternational: false,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    iata: '',
    icao: '',
    city: '',
    country: '',
    timezone: '',
    latitude: '',
    longitude: '',
    terminals: 1,
    runways: 1,
    status: 'active',
    isInternational: false,
  });
  
  // Mock data generation
  useEffect(() => {
    const mockAirports = [
      {
        id: 'AP001',
        name: 'John F. Kennedy International Airport',
        iata: 'JFK',
        icao: 'KJFK',
        city: 'New York',
        country: 'United States',
        timezone: 'America/New_York',
        latitude: 40.6413,
        longitude: -73.7781,
        terminals: 6,
        runways: 4,
        status: 'active',
        isInternational: true,
        hubFor: ['Delta', 'American Airlines', 'JetBlue']
      },
      // Add more mock data as needed
    ];
    
    setAirports(mockAirports);
    setFilteredAirports(mockAirports);
    setLoading(false);
  }, []);

  // Apply search
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = airports.filter(airport => 
        airport.name.toLowerCase().includes(term) ||
        airport.iata.toLowerCase().includes(term) ||
        airport.city.toLowerCase().includes(term) ||
        airport.country.toLowerCase().includes(term)
      );
      setFilteredAirports(filtered);
    } else {
      setFilteredAirports(airports);
    }
  }, [searchTerm, airports]);

  // Toggle selection
  const toggleAirportSelection = (id) => {
    setSelectedAirports(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Toggle status
  const toggleStatus = (id) => {
    setAirports(prev => 
      prev.map(airport => 
        airport.id === id 
          ? { ...airport, status: airport.status === 'active' ? 'inactive' : 'active' }
          : airport
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
          <h1 className="text-2xl font-bold text-gray-900">Airports</h1>
          <p className="mt-1 text-sm text-gray-500">Manage airport information and details.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setShowAddModal(true)} leftIcon={<PlusIcon className="h-5 w-5" />}>Add Airport</Button>
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
                placeholder="Search airports..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} leftIcon={<FunnelIcon className="h-5 w-5" />}>{showFilters ? 'Hide Filters' : 'Filters'}</Button>
          </div>
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">No advanced filters yet.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Airports Table */}
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
                  Airport
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Codes
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
              {filteredAirports.map((airport) => (
                <tr key={airport.id} className="hover:bg-gray-50">
                  <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                      checked={selectedAirports.includes(airport.id)}
                      onChange={() => toggleAirportSelection(airport.id)}
                    />
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{airport.name}</div>
                        <div className="text-gray-500">{airport.city}, {airport.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span>{airport.latitude}, {airport.longitude}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span>{airport.timezone}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>IATA: <span className="font-medium">{airport.iata}</span></div>
                      <div>ICAO: <span className="font-medium">{airport.icao}</span></div>
                      <div className="text-xs text-gray-500">
                        {airport.terminals} terminal{airport.terminals !== 1 ? 's' : ''} • {airport.runways} runway{airport.runways !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        airport.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {airport.status}
                      </span>
                      {airport.isInternational && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          International
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => toggleStatus(airport.id)}
                        title={airport.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {airport.status === 'active' ? (
                          <XCircleIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                        onClick={() => {
                          setAirportToEdit(airport);
                          setEditForm({
                            name: airport.name || '',
                            iata: airport.iata || '',
                            icao: airport.icao || '',
                            city: airport.city || '',
                            country: airport.country || '',
                            timezone: airport.timezone || '',
                            latitude: airport.latitude ?? '',
                            longitude: airport.longitude ?? '',
                            terminals: airport.terminals ?? 1,
                            runways: airport.runways ?? 1,
                            status: airport.status || 'active',
                            isInternational: !!airport.isInternational,
                          });
                          setShowEditModal(true);
                        }}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => {
                          setAirports(prev => prev.filter(a => a.id !== airport.id));
                          setFilteredAirports(prev => prev.filter(a => a.id !== airport.id));
                          toast.success(`Airport ${airport.name} deleted.`);
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredAirports.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No airports found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Airport Modal */}
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
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">Add Airport</DialogTitle>
                      <p className="mt-1 text-sm text-gray-500">Create a new airport with the details below.</p>
                    </div>
                  </div>

                  <form
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!addForm.name || !addForm.iata || !addForm.city || !addForm.country) {
                        toast.error('Please fill in Name, IATA, City and Country.');
                        return;
                      }
                      if (airports.some(a => a.iata.toUpperCase() === addForm.iata.toUpperCase())) {
                        toast.error('IATA code already exists.');
                        return;
                      }
                      const newAirport = {
                        id: `AP${Date.now()}`,
                        name: addForm.name,
                        iata: addForm.iata.toUpperCase(),
                        icao: addForm.icao?.toUpperCase() || '',
                        city: addForm.city,
                        country: addForm.country,
                        timezone: addForm.timezone,
                        latitude: parseFloat(addForm.latitude) || 0,
                        longitude: parseFloat(addForm.longitude) || 0,
                        terminals: parseInt(addForm.terminals) || 1,
                        runways: parseInt(addForm.runways) || 1,
                        status: addForm.status,
                        isInternational: !!addForm.isInternational,
                      };
                      setAirports(prev => [...prev, newAirport]);
                      setFilteredAirports(prev => [...prev, newAirport]);
                      setShowAddModal(false);
                      setAddForm({ name: '', iata: '', icao: '', city: '', country: '', timezone: '', latitude: '', longitude: '', terminals: 1, runways: 1, status: 'active', isInternational: false });
                      toast.success(`Airport ${newAirport.name} created.`);
                    }}
                  >
                    <Input label="Name *" name="name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
                    <Input label="IATA *" name="iata" value={addForm.iata} onChange={(e) => setAddForm({ ...addForm, iata: e.target.value })} required />
                    <Input label="ICAO" name="icao" value={addForm.icao} onChange={(e) => setAddForm({ ...addForm, icao: e.target.value })} />
                    <Input label="City *" name="city" value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} required />
                    <Input label="Country *" name="country" value={addForm.country} onChange={(e) => setAddForm({ ...addForm, country: e.target.value })} required />
                    <Input label="Timezone" name="timezone" value={addForm.timezone} onChange={(e) => setAddForm({ ...addForm, timezone: e.target.value })} />
                    <Input label="Latitude" name="latitude" type="number" step="0.0001" value={addForm.latitude} onChange={(e) => setAddForm({ ...addForm, latitude: e.target.value })} />
                    <Input label="Longitude" name="longitude" type="number" step="0.0001" value={addForm.longitude} onChange={(e) => setAddForm({ ...addForm, longitude: e.target.value })} />
                    <Input label="Terminals" name="terminals" type="number" min="1" value={addForm.terminals} onChange={(e) => setAddForm({ ...addForm, terminals: e.target.value })} />
                    <Input label="Runways" name="runways" type="number" min="1" value={addForm.runways} onChange={(e) => setAddForm({ ...addForm, runways: e.target.value })} />
                    <Select label="Status" name="status" value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                    <div className="flex items-center space-x-2">
                      <input id="isInternationalAdd" type="checkbox" checked={addForm.isInternational} onChange={(e) => setAddForm({ ...addForm, isInternational: e.target.checked })} />
                      <label htmlFor="isInternationalAdd" className="text-sm text-gray-700">International Airport</label>
                    </div>

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

      {/* Edit Airport Modal */}
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
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PencilSquareIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">Edit Airport</DialogTitle>
                      <p className="mt-1 text-sm text-gray-500">Update airport details.</p>
                    </div>
                  </div>

                  <form
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!airportToEdit) return;
                      if (!editForm.name || !editForm.iata || !editForm.city || !editForm.country) {
                        toast.error('Please fill in Name, IATA, City and Country.');
                        return;
                      }
                      if (editForm.iata.toUpperCase() !== airportToEdit.iata.toUpperCase() &&
                          airports.some(a => a.iata.toUpperCase() === editForm.iata.toUpperCase())) {
                        toast.error('IATA code already exists.');
                        return;
                      }
                      const updated = {
                        ...airportToEdit,
                        name: editForm.name,
                        iata: editForm.iata.toUpperCase(),
                        icao: editForm.icao?.toUpperCase() || '',
                        city: editForm.city,
                        country: editForm.country,
                        timezone: editForm.timezone,
                        latitude: parseFloat(editForm.latitude) || 0,
                        longitude: parseFloat(editForm.longitude) || 0,
                        terminals: parseInt(editForm.terminals) || 1,
                        runways: parseInt(editForm.runways) || 1,
                        status: editForm.status,
                        isInternational: !!editForm.isInternational,
                      };
                      setAirports(prev => prev.map(a => a.id === airportToEdit.id ? updated : a));
                      setFilteredAirports(prev => prev.map(a => a.id === airportToEdit.id ? updated : a));
                      setShowEditModal(false);
                      toast.success(`Airport ${updated.name} updated.`);
                    }}
                  >
                    <Input label="Name *" name="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                    <Input label="IATA *" name="iata" value={editForm.iata} onChange={(e) => setEditForm({ ...editForm, iata: e.target.value })} required />
                    <Input label="ICAO" name="icao" value={editForm.icao} onChange={(e) => setEditForm({ ...editForm, icao: e.target.value })} />
                    <Input label="City *" name="city" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required />
                    <Input label="Country *" name="country" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} required />
                    <Input label="Timezone" name="timezone" value={editForm.timezone} onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })} />
                    <Input label="Latitude" name="latitude" type="number" step="0.0001" value={editForm.latitude} onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })} />
                    <Input label="Longitude" name="longitude" type="number" step="0.0001" value={editForm.longitude} onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })} />
                    <Input label="Terminals" name="terminals" type="number" min="1" value={editForm.terminals} onChange={(e) => setEditForm({ ...editForm, terminals: e.target.value })} />
                    <Input label="Runways" name="runways" type="number" min="1" value={editForm.runways} onChange={(e) => setEditForm({ ...editForm, runways: e.target.value })} />
                    <Select label="Status" name="status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                    <div className="flex items-center space-x-2">
                      <input id="isInternationalEdit" type="checkbox" checked={editForm.isInternational} onChange={(e) => setEditForm({ ...editForm, isInternational: e.target.checked })} />
                      <label htmlFor="isInternationalEdit" className="text-sm text-gray-700">International Airport</label>
                    </div>

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
