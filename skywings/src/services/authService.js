// Mock user database
const users = [
  {
    id: '1',
    email: 'admin@skywings.com',
    password: 'admin123', // In a real app, passwords should be hashed
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1234567890',
    address: '123 Admin St, Admin City',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'customer@example.com',
    password: 'customer123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    phone: '+1987654321',
    address: '456 Customer Ave, Customer City',
    miles: 12500,
    tier: 'gold',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    email: 'pilot@skywings.com',
    password: 'pilot123',
    firstName: 'John',
    lastName: 'Pilot',
    role: 'pilot',
    position: 'Senior Captain',
    department: 'Flight Operations',
    hireDate: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    email: 'flightattendant@skywings.com',
    password: 'fa123',
    firstName: 'Sarah',
    lastName: 'Crew',
    role: 'flight_attendant',
    position: 'Senior Flight Attendant',
    department: 'Cabin Crew',
    hireDate: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    email: 'airline@skywings.com',
    password: 'airline123',
    firstName: 'Airlines',
    lastName: 'Admin',
    role: 'airline',
    phone: '+919876543210',
    address: 'Terminal 3, IGI Airport, New Delhi',
    airline: {
      id: 'AL-1001',
      name: 'SkyWings Airlines',
      code: 'SW',
      iataCode: 'SW',
      icaoCode: 'SWA',
      type: 'Scheduled',
      hub: 'DEL',
      founded: 2020
    },
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    email: 'groundstaff@skywings.com',
    password: 'staff123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'employee',
    position: 'Ground Staff',
    department: 'Operations',
    hireDate: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate JWT token (simplified for demo)
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
  };
  
  // In a real app, sign with a secret key
  return btoa(JSON.stringify(payload));
};

// Verify token (simplified for demo)
const verifyToken = (token) => {
  if (!token) return null;
  
  try {
    // In a real app, verify the token signature
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.warn('Token has expired');
      return { valid: false, error: 'Token expired' };
    }
    
    return { valid: true, payload: decoded };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false, error: 'Invalid token' };
  }
};

// Authentication service
const authService = {
  // Login user
  login: async (email, password) => {
    await delay(500 + Math.random() * 500); // Simulate network delay
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user; // Remove password from user object
    
    // In a real app, you might want to store the token in an HTTP-only cookie
    localStorage.setItem('authToken', token);
    
    return {
      success: true,
      token,
      user: userWithoutPassword,
    };
  },
  
  // Register new user
  register: async (userData) => {
    await delay(800 + Math.random() * 700);
    
    // Check if user already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already in use');
    }
    
    // Validate email domain based on role
    if (userData.role === 'airline' && !userData.email.endsWith('@airline.com')) {
      throw new Error('Airline admin must use an @airline.com email');
    } else if (userData.role === 'employee' && !userData.email.endsWith('@skywings.com')) {
      throw new Error('Employee must use an @skywings.com email');
    }
    
    // Create base user object
    const baseUser = {
      id: `user_${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      role: userData.role || 'customer',
      address: userData.address,
      createdAt: new Date().toISOString(),
      miles: 0,
      tier: 'standard',
    };
    
    // Add role-specific data
    if (userData.role === 'airline' && userData.airlineDetails) {
      baseUser.airlineDetails = userData.airlineDetails;
      baseUser.airlineDetails.approved = false; // New airlines need approval
    } else if (userData.role === 'employee' && userData.employeeDetails) {
      baseUser.employeeDetails = userData.employeeDetails;
    }
    
    users.push(baseUser);
    
    // Log the user in after registration if not an airline admin (needs approval)
    let token = null;
    if (userData.role !== 'airline') {
      token = generateToken(baseUser);
      localStorage.setItem('authToken', token);
    }
    
    const { password, ...userWithoutPassword } = baseUser;
    
    return {
      success: true,
      token,
      user: userWithoutPassword,
      requiresApproval: userData.role === 'airline'
    };
  },
  
  // Get current user from token
  getCurrentUser: async () => {
    await delay(300 + Math.random() * 400);
    
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const { valid, payload, error } = verifyToken(token);
    
    if (!valid) {
      localStorage.removeItem('authToken');
      throw new Error(error || 'Invalid token');
    }
    
    const user = users.find(u => u.id === payload.userId);
    
    if (!user) {
      localStorage.removeItem('authToken');
      throw new Error('User not found');
    }
    
    const { password, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword,
    };
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    return { success: true };
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    await delay(1000);
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // In a real app, don't reveal if the email exists or not
      return { success: true, message: 'If an account exists with this email, you will receive a password reset link' };
    }
    
    // In a real app, send an email with a reset link
    const resetToken = `reset_${Math.random().toString(36).substr(2)}`;
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    
    return { 
      success: true, 
      message: 'Password reset link sent to your email',
      // In a real app, don't return the token to the client
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  },
  
  // Reset password
  resetPassword: async (token, newPassword) => {
    await delay(800);
    
    const user = users.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now());
    
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }
    
    // Update password and clear reset token
    user.password = newPassword;
    delete user.resetToken;
    delete user.resetTokenExpiry;
    
    return { success: true, message: 'Password has been reset successfully' };
  },
  
  // Update profile
  updateProfile: async (userId, updates) => {
    await delay(600 + Math.random() * 400);
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const { password, ...userWithoutPassword } = users[userIndex];
    
    return {
      success: true,
      user: userWithoutPassword,
    };
  },
  
  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    await delay(600 + Math.random() * 400);
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    
    return { success: true, message: 'Password changed successfully' };
  },
};

export default authService;
