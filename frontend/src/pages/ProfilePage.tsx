import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Edit,
  FileText,
  Package,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Plans', value: '12', icon: FileText, color: 'blue' },
    { label: 'Active Quotes', value: '8', icon: Receipt, color: 'green' },
    { label: 'Products Ordered', value: '45', icon: Package, color: 'purple' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'indigo' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <Badge variant="info" size="md">{user?.role}</Badge>

              <div className="mt-6 space-y-4">
                <Button
                  variant="primary"
                  className="w-full"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3 text-left">
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user?.email || 'Not set'} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user?.phone || 'Not set'} />
                <InfoRow icon={<Building2 className="w-4 h-4" />} label="Company" value={user?.company || 'Not set'} />
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value="New York, USA" />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Joined" value="January 2025" />
              </div>
            </div>
          </Card>

          {/* Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                const colors: Record<string, string> = {
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                  purple: 'bg-purple-100 text-purple-600',
                  indigo: 'bg-indigo-100 text-indigo-600',
                };
                return (
                  <Card key={stat.label}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${colors[stat.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* About */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional {user?.role?.toLowerCase()} with extensive experience in sanitary product
                planning and quotations. Dedicated to delivering high-quality results and maintaining
                excellent client relationships.
              </p>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <ActivityItem
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                  title="Uploaded new plan"
                  description="Bathroom Renovation Project"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon={<Receipt className="w-5 h-5 text-green-600" />}
                  title="Quote approved"
                  description="Quote #QT-2024-045"
                  time="5 hours ago"
                />
                <ActivityItem
                  icon={<Package className="w-5 h-5 text-purple-600" />}
                  title="Reviewed product"
                  description="Modern Wall-Mount Sink"
                  time="1 day ago"
                />
                <ActivityItem
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                  title="Plan processing completed"
                  description="Kitchen Design Plan"
                  time="2 days ago"
                />
              </div>
            </Card>

            {/* Skills/Expertise */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Sanitary Design</Badge>
                <Badge variant="info">Project Management</Badge>
                <Badge variant="info">Cost Estimation</Badge>
                <Badge variant="info">Product Selection</Badge>
                <Badge variant="info">CAD Software</Badge>
                <Badge variant="info">Client Relations</Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
