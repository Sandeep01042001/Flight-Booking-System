import { Navigate } from 'react-router-dom';
import AirlineDashboard from '../pages/airline/AirlineDashboard';
import ManageFlights from '../pages/airline/ManageFlights';
import ManageAircrafts from '../pages/airline/ManageAircrafts';
import ManageEmployees from '../pages/airline/ManageEmployees';

const airlineRoutes = [
  {
    path: 'airline',
    element: <AirlineDashboard />,
    children: [
      {
        index: true,
        element: <Navigate to="flights" replace />,
      },
      {
        path: 'flights',
        element: <ManageFlights />,
      },
      {
        path: 'flights/:id',
        element: <div>Flight Details</div>,
      },
      {
        path: 'flights/new',
        element: <div>New Flight</div>,
      },
      {
        path: 'aircrafts',
        element: <ManageAircrafts />,
      },
      {
        path: 'aircrafts/:id',
        element: <div>Aircraft Details</div>,
      },
      {
        path: 'aircrafts/new',
        element: <div>New Aircraft</div>,
      },
      {
        path: 'employees',
        element: <ManageEmployees />,
      },
      {
        path: 'employees/:id',
        element: <div>Employee Details</div>,
      },
      {
        path: 'employees/new',
        element: <div>New Employee</div>,
      },
      {
        path: 'schedule',
        element: <div>Schedule Management</div>,
      },
      {
        path: 'reports',
        element: <div>Reports & Analytics</div>,
      },
      {
        path: 'settings',
        element: <div>Airline Settings</div>,
      },
    ],
  },
];

export default airlineRoutes;
