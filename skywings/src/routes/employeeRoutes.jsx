import { Navigate } from 'react-router-dom';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeHome from '../pages/employee/EmployeeHome';
import EmployeeSchedule from '../pages/employee/EmployeeSchedule';
import FlightAssignments from '../pages/employee/FlightAssignments';
import Notifications from '../pages/employee/Notifications';
import Profile from '../pages/employee/Profile';
import Settings from '../pages/employee/Settings';

const employeeRoutes = [
  {
    path: 'employee',
    element: <EmployeeDashboard />,
    children: [
      {
        index: true,
        element: <EmployeeHome />,
      },
      {
        path: 'flights',
        element: <FlightAssignments />,
      },
      {
        path: 'schedule',
        element: <EmployeeSchedule />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      // Add more employee-specific routes here
    ],
  },
];

export default employeeRoutes;
