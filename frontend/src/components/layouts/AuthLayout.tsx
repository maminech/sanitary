import { Outlet } from 'react-router-dom';
import { Droplets, Building2, Package, Receipt } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Droplets className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sanitary Platform</h1>
              <p className="text-blue-200 text-sm">Professional Planning Solution</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Transform Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Architectural Projects
              </span>
            </h2>
            <p className="text-xl text-blue-100">
              AI-powered 2D/3D plan analysis, product detection, and intelligent quotation generation
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <FeatureItem
              icon={<Building2 className="w-6 h-6" />}
              title="Smart Plan Analysis"
              description="Upload 2D/3D plans and get instant AI-powered product detection"
            />
            <FeatureItem
              icon={<Package className="w-6 h-6" />}
              title="Comprehensive Catalog"
              description="Access thousands of sanitary products with real-time pricing"
            />
            <FeatureItem
              icon={<Receipt className="w-6 h-6" />}
              title="Instant Quotations"
              description="Generate professional quotes in seconds with automated calculations"
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
          <StatItem value="10k+" label="Projects" />
          <StatItem value="500+" label="Products" />
          <StatItem value="99%" label="Accuracy" />
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors">
      <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-blue-200 text-sm">{label}</p>
    </div>
  );
}
