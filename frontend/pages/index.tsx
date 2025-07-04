// pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to the B2B Tender Platform</h1>
      <p className="text-gray-600 mb-6">Post, apply, and manage tenders with ease.</p>
      <div className="space-x-4">
        <Link href="/tenders">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Explore Tenders</button>
        </Link>
        <Link href="/register">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Register</button>
        </Link>
      </div>
    </div>
  );
}
