import { useEffect, useState } from 'react';
import API from '../services/api';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', description: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [tenders, setTenders] = useState<any[]>([]);
  const [newTender, setNewTender] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: 0
  });
  const [editingTender, setEditingTender] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: 0
  });
  const [viewingApplications, setViewingApplications] = useState<null | number>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await API.get('/company');
        setCompany(res.data);
        setForm({
          name: res.data.name || '',
          industry: res.data.industry || '',
          description: res.data.description || ''
        });
      } catch (err) {
        alert('Not logged in or company not created');
        router.push('/login');
      }
    };
    fetchCompany();
  }, []);

  const fetchTenders = async () => {
    try {
      const res = await API.get('/tenders/my');
      setTenders(res.data);
    } catch (err) {
      console.error('Failed to fetch tenders');
    }
  };

  const fetchApplications = async (tenderId: number) => {
    try {
      const res = await API.get(`/applications/${tenderId}`);
      setApplications(res.data);
      setViewingApplications(tenderId);
    } catch (err) {
      alert('Failed to load applications');
    }
  };

  const handleDeleteTender = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tender?')) return;
    try {
      await API.delete(`/tenders/${id}`);
      alert('Tender deleted');
      fetchTenders();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put('/company', form);
      alert('Company info updated');
      setEditMode(false);
      location.reload();
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return alert('No file selected');
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      await API.post('/company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Logo updated');
      location.reload();
    } catch (err) {
      alert('Logo upload failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-700">Company Dashboard</h1>

      {company ? (
        <>
          <div className="flex flex-col items-center">
            <img
              src={company.logo_url || 'https://via.placeholder.com/100'}
              alt="Logo"
              className="w-24 h-24 rounded shadow mb-2"
            />
            <input type="file" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            <button
              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700"
              onClick={handleLogoUpload}
            >
              Upload New Logo
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-2">
            {editMode ? (
              <>
                <input
                  className="input-style"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Company Name"
                />
                <input
                  className="input-style"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  placeholder="Industry"
                />
                <textarea
                  className="input-style"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                ></textarea>
                <div className="flex gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                  <button
                    className="text-sm text-gray-500 underline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <p><strong>Name:</strong> {company.name}</p>
                <p><strong>Industry:</strong> {company.industry}</p>
                <p><strong>Description:</strong> {company.description}</p>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded hover:bg-yellow-600"
                  onClick={() => setEditMode(true)}
                >
                  Edit Info
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow mt-8">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Tenders</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await API.post('/tenders', newTender);
                  alert('Tender posted!');
                  setNewTender({ title: '', description: '', deadline: '', budget: 0 });
                  fetchTenders();
                } catch (err) {
                  alert('Failed to post tender');
                }
              }}
              className="space-y-4"
            >
              <input
                className="input-style"
                placeholder="Title"
                value={newTender.title}
                onChange={(e) => setNewTender({ ...newTender, title: e.target.value })}
              />
              <textarea
                className="input-style"
                placeholder="Description"
                value={newTender.description}
                onChange={(e) => setNewTender({ ...newTender, description: e.target.value })}
              />
              <input
                type="date"
                className="input-style"
                value={newTender.deadline}
                onChange={(e) => setNewTender({ ...newTender, deadline: e.target.value })}
              />
              <input
                type="number"
                className="input-style"
                placeholder="Budget"
                value={newTender.budget}
                onChange={(e) => setNewTender({ ...newTender, budget: Number(e.target.value) })}
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
                Create Tender
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {tenders.length > 0 ? (
                tenders.map((tender) => (
                  <div key={tender.id} className="border p-4 rounded shadow">
                    <h3 className="text-lg font-bold text-blue-800">{tender.title}</h3>
                    <p className="text-gray-700">{tender.description}</p>
                    <p className="text-sm">Deadline: {tender.deadline}</p>
                    <p className="text-sm">Budget: ₹{tender.budget}</p>
                    <div className="flex gap-4 mt-2">
                      <button onClick={() => {
                        setEditingTender(tender);
                        setEditForm({
                          title: tender.title,
                          description: tender.description,
                          deadline: tender.deadline.split('T')[0],
                          budget: tender.budget
                        });
                      }} className="text-blue-600 underline">Edit</button>
                      <button onClick={() => handleDeleteTender(tender.id)} className="text-red-600 underline">Delete</button>
                      <button onClick={() => fetchApplications(tender.id)} className="text-green-600 underline">View Applications</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tenders yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading company info...</p>
      )}

      {/* Edit Tender Modal */}
      {editingTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full space-y-3">
            <h3 className="text-xl font-semibold mb-2">Edit Tender</h3>
            <input
              className="input-style"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="input-style"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Description"
            />
            <input
              type="date"
              className="input-style"
              value={editForm.deadline}
              onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
            />
            <input
              type="number"
              className="input-style"
              value={editForm.budget}
              onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
              placeholder="Budget"
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    await API.put(`/tenders/${editingTender.id}`, editForm);
                    alert('Tender updated');
                    setEditingTender(null);
                    fetchTenders();
                  } catch (err) {
                    alert('Update failed');
                  }
                }}
              >
                Save
              </button>
              <button
                className="text-sm underline text-gray-600"
                onClick={() => setEditingTender(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Applications Modal */}
      {viewingApplications !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold">Applications for Tender #{viewingApplications}</h3>
            {applications.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
              <ul className="space-y-2">
                {applications.map((app) => (
                  <li key={app.id} className="border p-3 rounded bg-gray-50">
                    <p className="font-semibold">{app.company_name}</p>
                    <p className="text-sm">{app.proposal}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setViewingApplications(null)}
                className="text-sm underline text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}