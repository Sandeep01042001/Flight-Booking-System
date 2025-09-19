// Mock data for Airline Admin Dashboard

export const airlineInfo = {
  id: 'AL-1001',
  name: 'SkyWings Airlines',
  code: 'SW',
  iataCode: 'SW',
  icaoCode: 'SWA',
  type: 'Scheduled',
  hub: 'DEL - Indira Gandhi International Airport',
  founded: 2020,
  fleetSize: 24,
  destinations: 45,
  employees: 1560,
  contact: {
    email: 'contact@skywings.com',
    phone: '+91 11 12345678',
    address: 'Terminal 3, Indira Gandhi International Airport, New Delhi, 110037',
    website: 'https://skywings.com'
  },
  socialMedia: {
    facebook: 'skywingsairlines',
    twitter: 'skywings_air',
    instagram: 'skywings_airlines',
    linkedin: 'skywings-airlines'
  }
};

export const flights = [
  {
    id: 'SW-101',
    flightNumber: 'SW101',
    origin: 'DEL',
    destination: 'BOM',
    departureTime: '2023-11-15T08:00:00',
    arrivalTime: '2023-11-15T10:15:00',
    status: 'Scheduled',
    aircraft: 'Boeing 737-800',
    economySeats: 150,
    businessSeats: 20,
    firstClassSeats: 10,
    availableSeats: 165,
    price: 4500,
    duration: '2h 15m'
  },
  {
    id: 'SW-205',
    flightNumber: 'SW205',
    origin: 'BOM',
    destination: 'BLR',
    departureTime: '2023-11-15T14:30:00',
    arrivalTime: '2023-11-15T16:15:00',
    status: 'On Time',
    aircraft: 'Airbus A320',
    economySeats: 140,
    businessSeats: 15,
    firstClassSeats: 8,
    availableSeats: 140,
    price: 5200,
    duration: '1h 45m'
  },
  {
    id: 'SW-312',
    flightNumber: 'SW312',
    origin: 'BLR',
    destination: 'DEL',
    departureTime: '2023-11-15T18:00:00',
    arrivalTime: '2023-11-15T20:30:00',
    status: 'Delayed',
    delay: '45m',
    aircraft: 'Boeing 787-9',
    economySeats: 200,
    businessSeats: 30,
    firstClassSeats: 12,
    availableSeats: 180,
    price: 6800,
    duration: '2h 30m'
  }
];

export const aircrafts = [
  {
    id: 'AC-1001',
    registration: 'VT-SWA',
    model: 'Boeing 737-800',
    capacity: 180,
    economySeats: 150,
    businessSeats: 20,
    firstClassSeats: 10,
    year: 2019,
    lastMaintenance: '2023-10-15',
    nextMaintenance: '2023-12-20',
    status: 'Active',
    totalFlights: 245,
    totalHours: 1250
  },
  {
    id: 'AC-1002',
    registration: 'VT-SWB',
    model: 'Airbus A320',
    capacity: 168,
    economySeats: 140,
    businessSeats: 20,
    firstClassSeats: 8,
    year: 2020,
    lastMaintenance: '2023-11-01',
    nextMaintenance: '2024-01-10',
    status: 'Active',
    totalFlights: 198,
    totalHours: 1100
  },
  {
    id: 'AC-2001',
    registration: 'VT-SWC',
    model: 'Boeing 787-9',
    capacity: 280,
    economySeats: 200,
    businessSeats: 30,
    firstClassSeats: 12,
    year: 2021,
    lastMaintenance: '2023-09-20',
    nextMaintenance: '2023-12-15',
    status: 'Maintenance',
    totalFlights: 150,
    totalHours: 950
  }
];

export const employees = [
  {
    id: 'EMP-1001',
    employeeId: 'SW1001',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@skywings.com',
    phone: '+91 9876543210',
    role: 'Pilot',
    department: 'Flight Operations',
    hireDate: '2021-05-15',
    status: 'Active',
    licenseNumber: 'IN-PL-123456',
    aircraftTypeRating: ['Boeing 737', 'Airbus A320'],
    totalFlightHours: 4500
  },
  {
    id: 'EMP-1002',
    employeeId: 'SW1002',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@skywings.com',
    phone: '+91 9876543211',
    role: 'Co-Pilot',
    department: 'Flight Operations',
    hireDate: '2022-02-10',
    status: 'Active',
    licenseNumber: 'IN-CP-234567',
    aircraftTypeRating: ['Airbus A320'],
    totalFlightHours: 1800
  },
  {
    id: 'EMP-2001',
    employeeId: 'SW2001',
    firstName: 'Anjali',
    lastName: 'Mehta',
    email: 'anjali.mehta@skywings.com',
    phone: '+91 9876543212',
    role: 'Senior Cabin Crew',
    department: 'Cabin Crew',
    hireDate: '2020-11-22',
    status: 'Active',
    languages: ['English', 'Hindi', 'French'],
    base: 'DEL',
    yearsOfService: 3
  },
  {
    id: 'EMP-2002',
    employeeId: 'SW2002',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@skywings.com',
    phone: '+91 9876543213',
    role: 'Cabin Crew',
    department: 'Cabin Crew',
    hireDate: '2023-01-15',
    status: 'On Leave',
    languages: ['English', 'Hindi', 'German'],
    base: 'BOM',
    yearsOfService: 1
  }
];

export const bookings = [
  {
    id: 'BKG-1001',
    bookingReference: 'SWBKG1001',
    flightId: 'SW-101',
    passengerName: 'Aarav Patel',
    passengerEmail: 'aarav.patel@example.com',
    passengerPhone: '+91 9876543201',
    bookingDate: '2023-11-10T14:30:00',
    travelDate: '2023-11-15',
    seatNumber: '12A',
    seatClass: 'Economy',
    status: 'Confirmed',
    fare: 4500,
    paymentStatus: 'Paid',
    specialMeal: 'Vegetarian',
    specialAssistance: 'Wheelchair'
  },
  {
    id: 'BKG-1002',
    bookingReference: 'SWBKG1002',
    flightId: 'SW-101',
    passengerName: 'Neha Gupta',
    passengerEmail: 'neha.gupta@example.com',
    passengerPhone: '+91 9876543202',
    bookingDate: '2023-11-11T10:15:00',
    travelDate: '2023-11-15',
    seatNumber: '3B',
    seatClass: 'Business',
    status: 'Confirmed',
    fare: 8500,
    paymentStatus: 'Paid',
    specialMeal: 'Non-Vegetarian',
    specialAssistance: 'None'
  },
  {
    id: 'BKG-1003',
    bookingReference: 'SWBKG1003',
    flightId: 'SW-205',
    passengerName: 'Rajesh Khanna',
    passengerEmail: 'rajesh.khanna@example.com',
    passengerPhone: '+91 9876543203',
    bookingDate: '2023-11-12T16:45:00',
    travelDate: '2023-11-15',
    seatNumber: '1A',
    seatClass: 'First Class',
    status: 'Confirmed',
    fare: 12000,
    paymentStatus: 'Paid',
    specialMeal: 'Vegan',
    specialAssistance: 'None',
    loungeAccess: true
  },
  {
    id: 'BKG-1004',
    bookingReference: 'SWBKG1004',
    flightId: 'SW-312',
    passengerName: 'Priya Singh',
    passengerEmail: 'priya.singh@example.com',
    passengerPhone: '+91 9876543204',
    bookingDate: '2023-11-13T09:20:00',
    travelDate: '2023-11-15',
    seatNumber: '8C',
    seatClass: 'Economy',
    status: 'Waitlisted',
    fare: 6800,
    paymentStatus: 'Pending',
    specialMeal: 'None',
    specialAssistance: 'None'
  },
  {
    id: 'BKG-1005',
    bookingReference: 'SWBKG1005',
    flightId: 'SW-312',
    passengerName: 'Vikram Joshi',
    passengerEmail: 'vikram.joshi@example.com',
    passengerPhone: '+91 9876543205',
    bookingDate: '2023-11-14T11:10:00',
    travelDate: '2023-11-15',
    seatNumber: '2B',
    seatClass: 'Business',
    status: 'Confirmed',
    fare: 9500,
    paymentStatus: 'Paid',
    specialMeal: 'Vegetarian',
    specialAssistance: 'None',
    loungeAccess: true
  }
];

export const maintenanceLogs = [
  {
    id: 'MT-1001',
    aircraftId: 'AC-1001',
    registration: 'VT-SWA',
    maintenanceType: 'Routine Check',
    description: 'Scheduled maintenance check',
    startDate: '2023-10-10',
    endDate: '2023-10-11',
    status: 'Completed',
    technician: 'Sanjay Verma',
    cost: 125000,
    notes: 'All systems checked and functioning normally. Replaced two tires.'
  },
  {
    id: 'MT-1002',
    aircraftId: 'AC-1002',
    registration: 'VT-SWB',
    maintenanceType: 'A-Check',
    description: 'Scheduled A-Check maintenance',
    startDate: '2023-10-28',
    endDate: '2023-10-30',
    status: 'Completed',
    technician: 'Ramesh Kumar',
    cost: 185000,
    notes: 'Completed A-Check. Replaced engine oil and filters.'
  },
  {
    id: 'MT-1003',
    aircraftId: 'AC-2001',
    registration: 'VT-SWC',
    maintenanceType: 'C-Check',
    description: 'Major C-Check maintenance',
    startDate: '2023-11-05',
    endDate: '2023-11-12',
    status: 'In Progress',
    technician: 'Amit Sharma',
    estimatedCost: 1250000,
    notes: 'Major inspection in progress. Expected completion on schedule.'
  },
  {
    id: 'MT-1004',
    aircraftId: 'AC-1001',
    registration: 'VT-SWA',
    maintenanceType: 'Unscheduled',
    description: 'Hydraulic system check',
    startDate: '2023-09-15',
    endDate: '2023-09-16',
    status: 'Completed',
    technician: 'Rahul Mehta',
    cost: 75000,
    notes: 'Fixed minor hydraulic leak in landing gear system.'
  },
  {
    id: 'MT-1005',
    aircraftId: 'AC-1002',
    registration: 'VT-SWB',
    maintenanceType: 'Engine Inspection',
    description: 'Engine performance check',
    startDate: '2023-08-20',
    endDate: '2023-08-21',
    status: 'Completed',
    technician: 'Vikram Singh',
    cost: 95000,
    notes: 'Engine performance within normal parameters. Replaced two fuel nozzles.'
  }
];

export const flightSchedule = [
  {
    id: 'FS-1001',
    flightNumber: 'SW101',
    origin: 'DEL',
    destination: 'BOM',
    departureTime: '08:00',
    arrivalTime: '10:15',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    aircraft: 'Boeing 737-800',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  },
  {
    id: 'FS-1002',
    flightNumber: 'SW102',
    origin: 'BOM',
    destination: 'DEL',
    departureTime: '11:00',
    arrivalTime: '13:15',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    aircraft: 'Boeing 737-800',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  },
  {
    id: 'FS-2001',
    flightNumber: 'SW201',
    origin: 'DEL',
    destination: 'BLR',
    departureTime: '14:00',
    arrivalTime: '16:45',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    aircraft: 'Airbus A320',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  },
  {
    id: 'FS-2002',
    flightNumber: 'SW202',
    origin: 'BLR',
    destination: 'DEL',
    departureTime: '17:45',
    arrivalTime: '20:30',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    aircraft: 'Airbus A320',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  },
  {
    id: 'FS-3001',
    flightNumber: 'SW301',
    origin: 'BOM',
    destination: 'BLR',
    departureTime: '09:30',
    arrivalTime: '11:15',
    days: ['Tuesday', 'Thursday', 'Saturday'],
    aircraft: 'Boeing 737-800',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  },
  {
    id: 'FS-3002',
    flightNumber: 'SW302',
    origin: 'BLR',
    destination: 'BOM',
    departureTime: '12:00',
    arrivalTime: '13:45',
    days: ['Tuesday', 'Thursday', 'Saturday'],
    aircraft: 'Boeing 737-800',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  }
];

export const reports = {
  monthlyPerformance: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    flights: [120, 115, 130, 125, 140, 135, 150, 145, 140, 155, 150, 160],
    passengers: [12000, 11500, 13000, 12500, 14000, 13500, 15000, 14500, 14000, 15500, 15000, 16000],
    revenue: [4500000, 4300000, 4800000, 4600000, 5200000, 5000000, 5500000, 5300000, 5100000, 5600000, 5400000, 5800000],
    loadFactor: [75, 72, 78, 76, 80, 79, 82, 81, 80, 83, 82, 84]
  },
  aircraftUtilization: [
    { aircraft: 'Boeing 737-800', utilization: 82, flights: 85, hours: 220 },
    { aircraft: 'Airbus A320', utilization: 78, flights: 75, hours: 195 },
    { aircraft: 'Boeing 787-9', utilization: 75, flights: 60, hours: 180 }
  ],
  routePerformance: [
    { route: 'DEL-BOM', passengers: 12500, loadFactor: 85, revenue: 5250000 },
    { route: 'BOM-DEL', passengers: 12000, loadFactor: 83, revenue: 5100000 },
    { route: 'DEL-BLR', passengers: 9800, loadFactor: 80, revenue: 4500000 },
    { route: 'BLR-DEL', passengers: 9500, loadFactor: 79, loadFactor: 78, revenue: 4300000 },
    { route: 'BOM-BLR', passengers: 8500, loadFactor: 75, revenue: 3800000 },
    { route: 'BLR-BOM', passengers: 8200, loadFactor: 74, revenue: 3650000 }
  ],
  onTimePerformance: {
    onTime: 85,
    delayed: 12,
    cancelled: 3
  },
  customerSatisfaction: {
    excellent: 65,
    good: 25,
    average: 7,
    poor: 2,
    terrible: 1
  }
};

export const notifications = [
  {
    id: 'N-1001',
    type: 'maintenance',
    title: 'Aircraft Maintenance Due',
    message: 'Scheduled maintenance for VT-SWC (Boeing 787-9) is due in 3 days.',
    timestamp: '2023-11-14T09:30:00',
    read: false,
    priority: 'high'
  },
  {
    id: 'N-1002',
    type: 'flight',
    title: 'Flight Delay',
    message: 'Flight SW312 (BLR-DEL) has been delayed by 45 minutes due to weather conditions.',
    timestamp: '2023-11-14T08:15:00',
    read: false,
    priority: 'medium'
  },
  {
    id: 'N-1003',
    type: 'crew',
    title: 'Crew Assignment',
    message: 'You have been assigned as the captain for flight SW101 (DEL-BOM) on 2023-11-15.',
    timestamp: '2023-11-13T16:45:00',
    read: true,
    priority: 'normal'
  },
  {
    id: 'N-1004',
    type: 'system',
    title: 'System Update',
    message: 'Scheduled system maintenance will occur on 2023-11-20 from 02:00 to 04:00 IST.',
    timestamp: '2023-11-13T10:20:00',
    read: true,
    priority: 'low'
  },
  {
    id: 'N-1005',
    type: 'alert',
    title: 'Weather Alert',
    message: 'Heavy fog expected in Delhi on 2023-11-16. Please plan accordingly.',
    timestamp: '2023-11-12T14:30:00',
    read: true,
    priority: 'high'
  }
];

export const settings = {
  general: {
    airlineName: 'SkyWings Airlines',
    iataCode: 'SW',
    icaoCode: 'SWA',
    contactEmail: 'contact@skywings.com',
    contactPhone: '+91 11 12345678',
    website: 'https://skywings.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'INR'
  },
  booking: {
    minCheckinTime: 2, // hours before departure
    maxCheckinTime: 45, // minutes before departure
    maxBaggageAllowance: 15, // kg
    maxHandLuggage: 7, // kg
    cancellationWindow: 24, // hours
    refundProcessingTime: 7 // days
  },
  notifications: {
    email: true,
    sms: true,
    push: true,
    flightUpdates: true,
    maintenanceAlerts: true,
    systemNotifications: true,
    marketing: false
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    failedLoginAttempts: 5,
    ipWhitelist: [],
    auditLogRetention: 365 // days
  }
};
