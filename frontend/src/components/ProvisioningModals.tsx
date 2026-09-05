import { useState } from 'react';
import * as provisioningApi from '../api/provisioningApi';

export function ProvisioningModals({ onComplete }: { onComplete: () => void }) {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (activeModal === 'facility') await provisioningApi.createFacility(formData);
            if (activeModal === 'ward') await provisioningApi.createWard(formData);
            if (activeModal === 'bed') await provisioningApi.createBed({ ...formData, ward_id: parseInt(formData.ward_id) });
            if (activeModal === 'user') await provisioningApi.createUser({ ...formData, role_id: parseInt(formData.role_id) });
            if (activeModal === 'equipment') await provisioningApi.createEquipment({ ...formData, facility_id: parseInt(formData.facility_id) });
            if (activeModal === 'incident') await provisioningApi.createIncident({ ...formData, facility_id: parseInt(formData.facility_id) });
            
            setActiveModal(null);
            setFormData({});
            onComplete();
        } catch (err: any) {
            setError(err.message || 'An error occurred during provisioning.');
        } finally {
            setLoading(false);
        }
    };

    const modals = [
        { id: 'facility', label: 'Add Facility', fields: ['name', 'code'] },
        { id: 'ward', label: 'Add Ward', fields: ['name'] },
        { id: 'bed', label: 'Add Bed', fields: ['name', 'ward_id', 'state'] },
        { id: 'user', label: 'Add User', fields: ['username', 'email', 'password', 'role_id'] },
        { id: 'equipment', label: 'Add Equipment', fields: ['name', 'facility_id'] },
        { id: 'incident', label: 'Add Incident', fields: ['type', 'priority', 'description', 'facility_id'] },
    ];

    return (
        <div className="mb-6 flex flex-wrap gap-4">
            {modals.map((m) => (
                <button 
                    key={m.id}
                    onClick={() => { setActiveModal(m.id); setFormData({}); setError(null); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                    {m.label}
                </button>
            ))}

            {activeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-full">
                        <h2 className="text-xl font-bold mb-4 capitalize">Create {activeModal}</h2>
                        {error && <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            {modals.find(m => m.id === activeModal)?.fields.map(field => (
                                <div key={field} className="mb-4">
                                    <label className="block text-sm font-medium capitalize mb-1">{field.replace('_', ' ')}</label>
                                    <input 
                                        type={field === 'password' ? 'password' : 'text'}
                                        name={field}
                                        required
                                        onChange={handleChange}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
