import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [proposalTextMap, setProposalTextMap] = useState<{ [key: number]: string }>({});
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [myCompanyId, setMyCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const res = await API.get('/company');
        setMyCompanyId(res.data.id);
      } catch {
        // not logged in
      }
    };

    const fetchTenders = async () => {
      try {
        const res = await API.get('/tenders');
        setTenders(res.data);
      } catch (err) {
        alert('Failed to load tenders');
      }
    };

    fetchCompanyId();
    fetchTenders();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Explore Tenders</h1>

      {tenders.length === 0 ? (
        <p className="text-gray-600">No tenders available.</p>
      ) : (
        <div className="space-y-6">
          {tenders.map((tender) => (
            <div key={tender.id} className="bg-white border rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{tender.title}</h3>
              <p className="text-gray-600 mb-1">{tender.description}</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Budget:</strong> ₹{tender.budget}</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Deadline:</strong> {tender.deadline}</p>
              <p className="text-sm text-gray-500">Posted by: {tender.company_name}</p>

              {myCompanyId && tender.company_id !== myCompanyId && !appliedIds.includes(tender.id) && (
                <div className="mt-4">
                  <textarea
                    className="w-full border rounded p-2 mb-2 focus:ring focus:border-blue-300"
                    rows={3}
                    placeholder="Your proposal..."
                    value={proposalTextMap[tender.id] || ''}
                    onChange={(e) =>
                      setProposalTextMap({ ...proposalTextMap, [tender.id]: e.target.value })
                    }
                  ></textarea>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={async () => {
                      const proposal = proposalTextMap[tender.id]?.trim();
                      if (!proposal) {
                        alert('Please enter a proposal');
                        return;
                      }

                      try {
                        await API.post(`/applications/${tender.id}`, { proposal });
                        alert('Applied successfully');
                        setAppliedIds([...appliedIds, tender.id]);
                        setProposalTextMap({ ...proposalTextMap, [tender.id]: '' });
                      } catch (err: any) {
                        console.error('Application error:', err);
                        alert(`Application failed: ${err.response?.data?.error || err.message}`);
                      }
                    }}
                  >
                    Apply to Tender
                  </button>
                </div>
              )}

              {appliedIds.includes(tender.id) && (
                <p className="text-green-600 text-sm mt-2">✅ You already applied to this tender</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
