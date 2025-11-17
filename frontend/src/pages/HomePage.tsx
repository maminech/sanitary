import { Link } from 'react-router-dom';
import {
  Droplets,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Building2,
  Package,
  Receipt,
  Users,
  BarChart,
  Globe,
} from 'lucide-react';
import { Button } from '../components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sanitary Platform</h1>
                <p className="text-xs text-gray-500">Professional Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Sanitary Projects
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload 2D/3D plans, detect products with AI, and generate professional
                quotations in seconds. The complete solution for architects, suppliers, and
                contractors.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="relative animate-slide-in-right">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-blue-600 opacity-50" />
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">99% Accuracy</p>
                    <p className="text-xs text-gray-500">AI Detection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your workflow from plan analysis to quotation delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building2 className="w-8 h-8" />}
              title="Smart Plan Analysis"
              description="Upload 2D/3D architectural plans and let our AI automatically detect and catalog sanitary products"
              color="blue"
            />
            <FeatureCard
              icon={<Package className="w-8 h-8" />}
              title="Product Catalog"
              description="Access thousands of sanitary products with real-time pricing, specifications, and availability"
              color="green"
            />
            <FeatureCard
              icon={<Receipt className="w-8 h-8" />}
              title="Instant Quotations"
              description="Generate professional, detailed quotations in seconds with automated calculations and pricing"
              color="purple"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Process plans and generate quotes 10x faster than traditional manual methods"
              color="yellow"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Reliable"
              description="Enterprise-grade security with data encryption and automatic backups"
              color="red"
            />
            <FeatureCard
              icon={<BarChart className="w-8 h-8" />}
              title="Analytics & Insights"
              description="Track project metrics, quote conversions, and business performance in real-time"
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard value="10,000+" label="Projects Completed" />
            <StatCard value="500+" label="Products Catalog" />
            <StatCard value="99%" label="Detection Accuracy" />
            <StatCard value="5min" label="Average Quote Time" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Sanitary Platform?
              </h2>
              <div className="space-y-6">
                <BenefitItem
                  icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
                  title="Increase Revenue"
                  description="Generate more quotes faster, close deals quicker, and grow your business by 3x"
                />
                <BenefitItem
                  icon={<Users className="w-6 h-6 text-green-600" />}
                  title="Better Collaboration"
                  description="Seamless communication between architects, suppliers, and clients in one platform"
                />
                <BenefitItem
                  icon={<Globe className="w-6 h-6 text-purple-600" />}
                  title="Work Anywhere"
                  description="Cloud-based platform accessible from any device, anywhere in the world"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-12 flex items-center justify-center">
              <Droplets className="w-32 h-32 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals already using Sanitary Platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-6 h-6" />
                <span className="font-bold">Sanitary Platform</span>
              </div>
              <p className="text-gray-400 text-sm">
                The complete solution for sanitary product planning and quotations
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Sanitary Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Feature Card
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
      <div className={`inline-flex p-3 rounded-lg ${colors[color]} mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Component: Stat Card
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-5xl font-bold mb-2">{value}</p>
      <p className="text-blue-100">{label}</p>
    </div>
  );
}

// Component: Benefit Item
function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
