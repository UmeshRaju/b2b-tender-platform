// register.tsx
import { useState } from 'react';
import API from '../services/api';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ApiErrorResponse {
  error: string;
}

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/register', form);
      login(res.data.token);
      router.push('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      if (axiosErr?.response?.data?.error) {
        setError(axiosErr.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Register</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </div>
  );
}

