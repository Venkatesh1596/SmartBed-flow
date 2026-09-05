const API_URL = 'http://localhost:8000/api/provisioning';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'API Error');
    }
    return res.json();
};

export const createFacility = async (data: { name: string; code: string }) => {
    const res = await fetch(`${API_URL}/facilities`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
};

export const createWard = async (data: { name: string }) => {
    const res = await fetch(`${API_URL}/wards`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
};

export const createBed = async (data: { name: string; ward_id: number; state: string }) => {
    const res = await fetch(`${API_URL}/beds`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
};

export const createUser = async (data: { username: string; email: string; password: string; role_id: number }) => {
    const res = await fetch(`${API_URL}/users`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
};

export const createEquipment = async (data: { name: string; facility_id: number }) => {
    const res = await fetch(`${API_URL}/equipment`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
};

export const createIncident = async (data: { type: string; priority: string; description: string; facility_id: number }) => {
    const res = await fetch(`${API_URL}/incidents`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
};

export const getMasterData = async () => {
    const res = await fetch(`${API_URL}/master-data`, { method: 'GET', headers: getHeaders() });
    return handleResponse(res);
};
