'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminLoginMutation } from '@/redux/api/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminUser } from '@/redux/slices/AdminUser';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { BRAND } from '@/utils/brandConstants';
import { toast } from 'sonner';
import { accessKey } from '@/utils/constants';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.adminUser);
  const token = window.localStorage.getItem(accessKey);

  useEffect(() => {
    if (token && user?.isAdmin) {
      router.replace('/admin');
    }
  }, [token, user, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin({ email, password }).unwrap();
      if (res?.data?.token && res?.data?.user) {
        dispatch(setAdminUser({ user: res.data.user, token: res.data.token }));
      }
      router.push('/admin');
    } catch (err) {
      const message = err?.data?.message || 'Invalid credentials';
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white inline-flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            {BRAND.name}
          </Link>
          <p className="text-gray-300 mt-2">Admin Console</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin sign in</h1>
            <p className="text-gray-600">Use your admin credentials to continue</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-12 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Not an admin?{' '}
              <Link href="/auth/login" className="text-gray-900 font-medium hover:underline">
                Go to customer login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>Protected area. Authorized users only.</p>
        </div>
      </div>
    </main>
  );
}


