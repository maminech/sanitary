import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getPlans } from '../services/planService';
import { getProducts } from '../services/productService';
import { getQuotes } from '../services/quoteService';
import {
  FileText,
  Package,
  Receipt,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Loader, Card, Badge } from '../components/ui';
import toast from 'react-hot-toast';

interface DashboardStats {
  plans: { total: number; processing: number; completed: number };
  products: { total: number; lowStock: number };
  quotes: { total: number; pending: number; approved: number; revenue: number };
  recentActivity: Array<{
    id: string;
    type: 'plan' | 'quote' | 'product';
    title: string;
    time: string;
    status?: string;
  }>;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    plans: { total: 0, processing: 0, completed: 0 },
    products: { total: 0, lowStock: 0 },
    quotes: { total: 0, pending: 0, approved: 0, revenue: 0 },
    recentActivity: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [plans, products, quotes] = await Promise.all([
        getPlans().catch(() => []),
        getProducts().catch(() => []),
        getQuotes().catch(() => []),
      ]);

      // Calculate stats
      const planStats = {
        total: plans.length,
        processing: plans.filter((p: any) => p.status === 'PROCESSING').length,
        completed: plans.filter((p: any) => p.status === 'COMPLETED').length,
      };

      const productStats = {
        total: products.length,
        lowStock: products.filter((p: any) => p.stock <= p.minStock).length,
      };

      const quoteStats = {
        total: quotes.length,
        pending: quotes.filter((q: any) => q.status === 'PENDING').length,
        approved: quotes.filter((q: any) => q.status === 'APPROVED').length,
        revenue: quotes
          .filter((q: any) => q.status === 'APPROVED')
          .reduce((sum: number, q: any) => sum + q.totalAmount, 0),
      };

      // Recent activity
      const recentActivity = [
        ...plans.slice(0, 3).map((p: any) => ({
          id: p._id,
          type: 'plan' as const,
          title: p.name,
          time: new Date(p.createdAt).toLocaleDateString(),
          status: p.status,
        })),
        ...quotes.slice(0, 3).map((q: any) => ({
          id: q._id,
          type: 'quote' as const,
          title: q.title,
          time: new Date(q.createdAt).toLocaleDateString(),
          status: q.status,
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      setStats({
        plans: planStats,
        products: productStats,
        quotes: quoteStats,
        recentActivity,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header with Gradient */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="w-10 h-10" />
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-blue-100 text-lg">
                Here's your project overview for today
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Your Role</p>
              <Badge variant="info" size="md">
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Plans"
            value={stats.plans.total}
            subtitle={`${stats.plans.processing} processing`}
            icon={FileText}
            color="blue"
            trend="+12%"
            link="/plans"
          />
          <MetricCard
            title="Products"
            value={stats.products.total}
            subtitle={`${stats.products.lowStock} low stock`}
            icon={Package}
            color="green"
            trend="+5%"
            link="/products"
          />
          <MetricCard
            title="Quotes"
            value={stats.quotes.total}
            subtitle={`${stats.quotes.pending} pending`}
            icon={Receipt}
            color="purple"
            link="/quotes"
          />
          <MetricCard
            title="Revenue"
            value={`€${(stats.quotes.revenue / 1000).toFixed(1)}k`}
            subtitle={`${stats.quotes.approved} approved`}
            icon={TrendingUp}
            color="emerald"
            trend="+18%"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionCard
                to="/plans"
                icon={Upload}
                title="Upload Plan"
                description="Add new 2D/3D plans"
                color="blue"
              />
              <ActionCard
                to="/products"
                icon={Package}
                title="Browse Catalog"
                description="Explore products"
                color="green"
              />
              <ActionCard
                to="/quotes"
                icon={Plus}
                title="Create Quote"
                description="New quotation"
                color="purple"
              />
            </div>
          </Card>

          {/* Status Overview */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Status Overview</h2>
            <div className="space-y-4">
              <StatusItem
                icon={<Clock className="w-5 h-5 text-yellow-600" />}
                label="Processing"
                value={stats.plans.processing}
                color="yellow"
              />
              <StatusItem
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                label="Completed"
                value={stats.plans.completed}
                color="green"
              />
              <StatusItem
                icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
                label="Pending Quotes"
                value={stats.quotes.pending}
                color="orange"
              />
              <StatusItem
                icon={<Package className="w-5 h-5 text-red-600" />}
                label="Low Stock Items"
                value={stats.products.lowStock}
                color="red"
              />
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <Link to="/plans" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              View All <Eye className="w-4 h-4" />
            </Link>
          </div>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          )}
        </Card>
      </div>
    </div>
  );
}

// Component: Metric Card
function MetricCard({ title, value, subtitle, icon: Icon, color, trend, link }: any) {
  const colors: Record<string, { bg: string; text: string; light: string }> = {
    blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
    green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', light: 'bg-green-50' },
    purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
    emerald: { bg: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
  };

  return (
    <Link to={link}>
      <Card hover className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color].bg} opacity-10 rounded-full -mr-16 -mt-16`} />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors[color].light}`}>
              <Icon className={`w-6 h-6 ${colors[color].text}`} />
            </div>
            {trend && (
              <Badge variant="success" size="sm">
                {trend}
              </Badge>
            )}
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Component: Action Card
function ActionCard({ to, icon: Icon, title, description, color }: any) {
  const colors: Record<string, string> = {
    blue: 'group-hover:border-blue-500 group-hover:bg-blue-50',
    green: 'group-hover:border-green-500 group-hover:bg-green-50',
    purple: 'group-hover:border-purple-500 group-hover:bg-purple-50',
  };

  const iconColors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <Link to={to} className="group">
      <div className={`p-6 border-2 border-dashed border-gray-300 rounded-xl transition-all ${colors[color]}`}>
        <Icon className={`w-8 h-8 ${iconColors[color]} mb-3`} />
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

// Component: Status Item
function StatusItem({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${colors[color]}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  );
}

// Component: Activity Item
function ActivityItem({ activity }: any) {
  const icons: Record<string, any> = {
    plan: FileText,
    quote: Receipt,
    product: Package,
  };

  const Icon = icons[activity.type];

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
      </div>
      {activity.status && (
        <Badge variant={activity.status === 'COMPLETED' ? 'success' : 'warning'}>
          {activity.status}
        </Badge>
      )}
    </div>
  );
}
