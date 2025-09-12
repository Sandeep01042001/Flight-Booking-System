import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, MapPin, Calendar, CreditCard, Lock, Bell, Globe, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent } from '@/utils/analytics';

// Form validation schemas
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date of birth',
  }),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  flightUpdates: z.boolean().default(true),
  specialOffers: z.boolean().default(true),
  newsletter: z.boolean().default(true),
});

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => userService.getProfile(user?.id),
    enabled: !!user?.id,
  });

  // Initialize forms
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'prefer-not-to-say',
      address: '',
      city: '',
      country: 'India',
      postalCode: '',
      bio: '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      flightUpdates: true,
      specialOffers: true,
      newsletter: true,
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? formatDateForInput(profile.dateOfBirth) : '',
        gender: profile.gender || 'prefer-not-to-say',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || 'India',
        postalCode: profile.postalCode || '',
        bio: profile.bio || '',
      });

      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }

      if (profile.notificationPreferences) {
        notificationForm.reset(profile.notificationPreferences);
      }
    }
  }, [profile]);

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      
      // Append profile data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // Append avatar file if selected
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      return userService.updateProfile(user.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile', user.id]);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
      trackEvent('profile_updated');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data) => userService.updatePassword(user.id, data),
    onSuccess: () => {
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      passwordForm.reset();
      trackEvent('password_updated');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update notification preferences mutation
  const updateNotificationPrefsMutation = useMutation({
    mutationFn: (data) => userService.updateNotificationPreferences(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile', user.id]);
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.',
      });
      trackEvent('notification_preferences_updated');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  // Handle password form submission
  const onPasswordSubmit = (data) => {
    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // Handle notification preferences form submission
  const onNotificationSubmit = (data) => {
    updateNotificationPrefsMutation.mutate(data);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      trackEvent('user_logged_out');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete account
  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userService.deleteAccount(user.id);
        await logout();
        navigate('/');
        toast({
          title: 'Account deleted',
          description: 'Your account has been successfully deleted.',
        });
        trackEvent('account_deleted');
      } catch (error) {
        console.error('Delete account error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete account. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-24 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage src={avatarPreview} alt={`${profile?.firstName} ${profile?.lastName}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-semibold">
                      {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-16 pb-4 px-4 text-center">
              <h2 className="text-xl font-semibold">{profile?.firstName} {profile?.lastName}</h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              {profile?.isEmailVerified ? (
                <Badge variant="outline" className="mt-2 text-green-600 border-green-200 bg-green-50">
                  Verified
                </Badge>
              ) : (
                <Button variant="link" className="text-sm text-blue-600 h-auto p-0 mt-2">
                  Verify Email
                </Button>
              )}
            </div>
            
            <div className="border-t">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
                orientation="vertical"
              >
                <TabsList className="flex flex-col h-auto p-0 w-full">
                  <TabsTrigger 
                    value="profile" 
                    className="w-full justify-start px-6 py-3 rounded-none border-b"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="w-full justify-start px-6 py-3 rounded-none border-b"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="w-full justify-start px-6 py-3 rounded-none border-b"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bookings" 
                    className="w-full justify-start px-6 py-3 rounded-none border-b"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    My Bookings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences" 
                    className="w-full justify-start px-6 py-3 rounded-none border-b"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Account Status */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">ACCOUNT STATUS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium">
                  {new Date(profile?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Bookings</span>
                <span className="font-medium">{profile?.totalBookings || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tier</span>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {profile?.tier || 'Standard'}
                </Badge>
              </div>
              
              <Separator className="my-2" />
              
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                size="sm"
                onClick={deleteAccount}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          profileForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={profileForm.handleSubmit(onProfileSubmit)}
                        disabled={updateProfileMutation.isLoading}
                      >
                        {updateProfileMutation.isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : 'Save Changes'}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Manage your personal information and how it appears on your profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John" 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Doe" 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="email" 
                                  placeholder="john@example.com" 
                                  {...field} 
                                  disabled={!isEditing}
                                  className={!isEditing ? 'pr-10' : ''}
                                />
                                {!isEditing && profile?.isEmailVerified && (
                                  <CheckCircle className="h-5 w-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+91 9876543210" 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                disabled={!isEditing}
                                max={new Date().toISOString().split('T')[0]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 Main St" 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Mumbai" 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="400001" 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us a bit about yourself..."
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your public profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your current password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your new password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your new password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <Button 
                          type="submit"
                          disabled={updatePasswordMutation.isLoading}
                        >
                          {updatePasswordMutation.isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : 'Change Password'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
                
                <Separator className="my-8" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <Button variant="outline">
                        {profile?.isTwoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">
                      <strong>Why enable two-factor authentication?</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Protects your account from unauthorized access</li>
                      <li>Requires a verification code in addition to your password</li>
                      <li>Recommended for all users, especially those with sensitive data</li>
                    </ul>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
                  <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h4 className="font-medium text-red-800">Delete Account</h4>
                        <p className="text-sm text-red-700">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={deleteAccount}
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you receive notifications from us.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-6">
                      <div>
                            <h3 className="text-sm font-medium mb-4">Email Notifications</h3>
                            <div className="space-y-4">
                              <FormField
                                control={notificationForm.control}
                                name="emailNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Email Notifications
                                      </FormLabel>
                                      <FormDescription>
                                        Receive notifications via email
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="flightUpdates"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Flight Updates
                                      </FormLabel>
                                      <FormDescription>
                                        Get updates about your flight status
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={!notificationForm.watch('emailNotifications')}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="specialOffers"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Special Offers
                                      </FormLabel>
                                      <FormDescription>
                                        Receive exclusive deals and promotions
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={!notificationForm.watch('emailNotifications')}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="newsletter"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Newsletter
                                      </FormLabel>
                                      <FormDescription>
                                        Receive our monthly newsletter
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={!notificationForm.watch('emailNotifications')}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-4">Push Notifications</h3>
                            <div className="space-y-4">
                              <FormField
                                control={notificationForm.control}
                                name="pushNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Push Notifications
                                      </FormLabel>
                                      <FormDescription>
                                        Receive notifications on your device
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="smsNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        SMS Notifications
                                      </FormLabel>
                                      <FormDescription>
                                        Receive important updates via SMS
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit"
                            disabled={updateNotificationPrefsMutation.isLoading}
                          >
                            {updateNotificationPrefsMutation.isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : 'Save Preferences'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>
                      View and manage your flight bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile?.recentBookings?.length > 0 ? (
                      <div className="space-y-4">
                        {profile.recentBookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{booking.flightNumber}</h3>
                                <p className="text-sm text-gray-500">
                                  {booking.origin} to {booking.destination}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{new Date(booking.departureDate).toLocaleDateString()}</span>
                                  <span className="mx-2">•</span>
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{booking.departureTime}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={booking.status === 'confirmed' ? 'default' : 
                                          booking.status === 'cancelled' ? 'destructive' : 'outline'}
                                >
                                  {booking.status}
                                </Badge>
                                <div className="mt-2 text-sm font-medium">
                                  ₹{booking.totalAmount.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/booking/${booking.id}`}>View Details</Link>
                              </Button>
                              {booking.status === 'confirmed' && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/check-in/${booking.id}`}>Check-in</Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-center mt-6">
                          <Button variant="outline">View All Bookings</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Your upcoming flights will appear here.
                        </p>
                        <Button className="mt-4" onClick={() => navigate('/flights')}>
                          Book a Flight
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your experience on our platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                            <h3 className="text-sm font-medium mb-4">Language & Region</h3>
                            <div className="space-y-4">
                              <FormItem className="space-y-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                  <SelectTrigger className="w-full md:w-1/2">
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="hi">हिंदी</SelectItem>
                                    <SelectItem value="mr">मराठी</SelectItem>
                                    <SelectItem value="ta">தமிழ்</SelectItem>
                                    <SelectItem value="te">తెలుగు</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                              
                              <FormItem className="space-y-2">
                                <Label>Date Format</Label>
                                <Select defaultValue="dd/MM/yyyy">
                                  <SelectTrigger className="w-full md:w-1/2">
                                    <SelectValue placeholder="Select date format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                              
                              <FormItem className="space-y-2">
                                <Label>Time Format</Label>
                                <Select defaultValue="12">
                                  <SelectTrigger className="w-full md:w-1/2">
                                    <SelectValue placeholder="Select time format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="12">12-hour (2:30 PM)</SelectItem>
                                    <SelectItem value="24">24-hour (14:30)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                              
                              <FormItem className="space-y-2">
                                <Label>Currency</Label>
                                <Select defaultValue="INR">
                                  <SelectTrigger className="w-full md:w-1/2">
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                                    <SelectItem value="EUR">Euro (€)</SelectItem>
                                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                                    <SelectItem value="AED">UAE Dirham (د.إ)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-4">Accessibility</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">High Contrast Mode</h4>
                                  <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
                                </div>
                                <Switch />
                              </div>
                              
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Larger Text</h4>
                                  <p className="text-sm text-gray-500">Increase text size for better readability</p>
                                </div>
                                <Switch />
                              </div>
                              
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Reduced Motion</h4>
                                  <p className="text-sm text-gray-500">Reduce animations and transitions</p>
                                </div>
                                <Switch />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-4">Privacy</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Show my profile in search results</h4>
                                  <p className="text-sm text-gray-500">Allow others to find your profile in search</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Show my recent activity</h4>
                                  <p className="text-sm text-gray-500">Show your recent bookings and activities</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Personalized recommendations</h4>
                                  <p className="text-sm text-gray-500">Get personalized flight and destination recommendations</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Button>Save Preferences</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          );
        };
        
        export default Profile;
