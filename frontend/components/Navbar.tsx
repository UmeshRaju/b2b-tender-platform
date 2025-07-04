import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold">B2B Tender Platform</Link>

      <div className="space-x-4 text-sm flex items-center">
        <Link href="/tenders" className="hover:underline">Tenders</Link>
        <Link href="/companies" className="hover:underline">Companies</Link>

        {isLoggedIn ? (
          <>
            <span className="hidden sm:inline">{user?.email}</span>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <button onClick={logout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
