import { useEffect, useState } from 'react';
import API from '../services/api';

export default function MyApplications() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        console.log('Making request to /applications/my...');
        const res = await API.get('/applications/my');
        console.log('Success:', res.data);
        setApps(res.data);
      } catch (err: any) {
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        if (err.response?.status === 401) {
          alert('Please log in again');
          // Redirect to login page
        } else if (err.response?.status === 404) {
          alert('Company not found. Please complete your company profile.');
        } else {
          alert(`Error: ${err.response?.data?.error || 'Failed to fetch applications'}`);
        }
      }
    };

    fetch();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tenders You've Applied To</h1>

      {apps.length === 0 ? (
        <p>You haven't applied to any tenders yet.</p>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-xl font-semibold">{app.title}</h2>
              <p className="text-gray-600">{app.description}</p>
              <p><strong>Budget:</strong> ₹{app.budget}</p>
              <p><strong>Deadline:</strong> {app.deadline}</p>
              <hr className="my-2" />
              <p><strong>Your Proposal:</strong></p>
              <p className="italic text-gray-700">{app.proposal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}