import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { login } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { Alert } from '../../components/ui';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await login(data);
      
      console.log('Login response:', response);
      
      // Set auth state
      setAuth(response.user, response.accessToken, response.refreshToken);
      
      // Wait longer for Zustand persist to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify auth state was set
      const authStorage = localStorage.getItem('auth-storage');
      console.log('Auth storage after login:', authStorage);
      console.log('Tokens set:', {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      });
      
      toast.success(`Welcome back, ${response.user.firstName}! 🎉`);
      
      // Force navigation with window.location to ensure state is loaded
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'architect' | 'supplier' | 'client') => {
    const credentials = {
      architect: { email: 'architect@example.com', password: 'Password123!' },
      supplier: { email: 'supplier1@example.com', password: 'Password123!' },
      client: { email: 'client@example.com', password: 'Password123!' },
    };

    const form = document.querySelector('form') as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
    
    emailInput.value = credentials[role].email;
    passwordInput.value = credentials[role].password;
    
    // Trigger React's onChange
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full animate-fade-in">
      {/* Header with Gradient */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to continue to your dashboard</p>
      </div>

      {/* Demo Credentials */}
      {showDemo && (
        <Alert
          type="info"
          title="Demo Accounts"
          message="Try quick login with demo credentials"
          onClose={() => setShowDemo(false)}
        />
      )}

      {showDemo && (
        <div className="mb-6 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-3">Quick Demo Login:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('architect')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Architect
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('supplier')}
              className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Supplier
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('client')}
              className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Client
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              {...register('email')}
              type="email"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-100 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="font-medium">⚠</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              {...register('password')}
              type="password"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-100 ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="font-medium">⚠</span> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">New to Sanitary Platform?</span>
        </div>
      </div>

      {/* Sign Up Link */}
      <Link
        to="/register"
        className="block w-full text-center py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        Create an Account
      </Link>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-6">
        By signing in, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Terms
        </a>{' '}
        and{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
