// pages/companies/index.tsx
import { useEffect, useState } from 'react';
import API from '../../services/api';
import Link from 'next/link';

export default function CompanySearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/company/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Search Companies</h1>
      <div className="flex gap-4 mb-6">
        <input
          className="border p-2 flex-grow rounded"
          placeholder="Search by name, industry, or product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-400">No results yet.</p>
      ) : (
        <div className="space-y-4">
          {results.map((company) => (
            <div key={company.id} className="p-4 border rounded shadow bg-white">
              <div className="flex items-center gap-4">
                <img
                  src={company.logo_url || 'https://via.placeholder.com/60'}
                  alt="Company Logo"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
                  <p className="text-sm text-gray-600">{company.industry}</p>
                </div>
                <Link
                  href={`/companies/${company.id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
