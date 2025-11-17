import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  Bell,
  Globe,
  Shield,
  CreditCard,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'security' | 'notifications' | 'billing'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    planUpdates: true,
    quoteUpdates: true,
    productAlerts: false,
    weeklyReports: true,
  });

  const handleSaveProfile = () => {
    updateUser(profileData);
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }
    toast.success('Password changed successfully!');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <Card className="lg:col-span-1 h-fit">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                  <p className="text-sm text-gray-600">Update your personal information and profile details</p>
                </div>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                    <div>
                      <Button size="sm" variant="outline">Change Avatar</Button>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      icon={<User className="w-5 h-5" />}
                      value={profileData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      icon={<User className="w-5 h-5" />}
                      value={profileData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    icon={<Mail className="w-5 h-5" />}
                    value={profileData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, email: e.target.value })}
                  />

                  <Input
                    label="Phone Number"
                    icon={<Phone className="w-5 h-5" />}
                    value={profileData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />

                  <Input
                    label="Company"
                    icon={<Building2 className="w-5 h-5" />}
                    value={profileData.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, company: e.target.value })}
                  />

                  {/* Role Badge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <Badge variant="info">{user?.role}</Badge>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveProfile} icon={<Save className="w-4 h-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Settings</h2>
                  <p className="text-sm text-gray-600">Manage your account preferences and settings</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Account Status</h3>
                        <p className="text-sm text-gray-600">Your account is active and in good standing</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Language</h3>
                        <p className="text-sm text-gray-600">English (US)</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Globe className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Time Zone</h3>
                        <p className="text-sm text-gray-600">UTC-05:00 Eastern Time</p>
                      </div>
                      <Button size="sm" variant="outline">Change</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <Button variant="danger" size="sm">Delete Account</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-sm text-gray-600">Manage your password and security preferences</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Password Requirements</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Includes at least one number</li>
                      <li>• Has at least one special character</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleChangePassword} icon={<Lock className="w-4 h-4" />}>
                      Update Password
                    </Button>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Notification Preferences</h2>
                  <p className="text-sm text-gray-600">Choose how you want to be notified</p>
                </div>

                <div className="space-y-6">
                  <NotificationToggle
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={notificationSettings.emailNotifications}
                    onChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />

                  <NotificationToggle
                    label="Push Notifications"
                    description="Receive push notifications in your browser"
                    checked={notificationSettings.pushNotifications}
                    onChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                  />

                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-4">Activity Notifications</h3>

                    <NotificationToggle
                      label="Plan Updates"
                      description="Get notified when your plans are processed"
                      checked={notificationSettings.planUpdates}
                      onChange={(checked) => setNotificationSettings({ ...notificationSettings, planUpdates: checked })}
                    />

                    <NotificationToggle
                      label="Quote Updates"
                      description="Receive updates on quote status changes"
                      checked={notificationSettings.quoteUpdates}
                      onChange={(checked) => setNotificationSettings({ ...notificationSettings, quoteUpdates: checked })}
                    />

                    <NotificationToggle
                      label="Product Alerts"
                      description="Be informed about new products and stock updates"
                      checked={notificationSettings.productAlerts}
                      onChange={(checked) => setNotificationSettings({ ...notificationSettings, productAlerts: checked })}
                    />

                    <NotificationToggle
                      label="Weekly Reports"
                      description="Receive weekly summary of your activity"
                      checked={notificationSettings.weeklyReports}
                      onChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyReports: checked })}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">Reset to Default</Button>
                    <Button onClick={handleSaveNotifications} icon={<Save className="w-4 h-4" />}>
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing & Subscription</h2>
                  <p className="text-sm text-gray-600">Manage your subscription and payment methods</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Professional Plan</h3>
                        <p className="text-sm text-gray-600">Billed monthly</p>
                      </div>
                      <Badge variant="info">Active</Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-gray-900">$49</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">Change Plan</Button>
                      <Button variant="outline" size="sm">Cancel Subscription</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
                    <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600">Expires 12/2025</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Billing History</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Professional Plan</p>
                            <p className="text-sm text-gray-600">Nov {i}, 2025</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">$49.00</span>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
