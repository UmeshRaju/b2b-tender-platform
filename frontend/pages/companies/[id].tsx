// pages/companies/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function CompanyProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCompany = async () => {
      try {
        const res = await API.get(`/company/${id}`);
        setCompany(res.data);
      } catch (err) {
        alert('Company not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading profile...</p>;

  if (!company) return <p className="p-6 text-center text-red-600">Company not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={company.logo_url || 'https://via.placeholder.com/100'}
          alt="Company Logo"
          className="w-24 h-24 rounded object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-blue-700">{company.name}</h1>
          <p className="text-gray-600">{company.industry}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold">About</h2>
        <p className="text-gray-700 mt-2 whitespace-pre-line">{company.description}</p>
      </div>
    </div>
  );
}
