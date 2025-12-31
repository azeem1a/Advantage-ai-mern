import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ads';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkHealth = async () => {
    try {
        const response = await axios.get('http://localhost:5000/'); // Root check
        return response.data;
    } catch (e) {
        return 'Server down';
    }
}

export const generateAd = async (data) => {
    try {
        const response = await apiClient.post('/generate', data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Ad generation failed');
        } else {
            throw new Error('Network error. Ensure backend is running.');
        }
    }
};

export const getHistory = async () => {
    try {
        const response = await apiClient.get('/history');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch history');
    }
};

export const deleteCampaign = async (id) => {
    try {
        const response = await apiClient.delete(`/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Failed to delete campaign');
    }
};

export const downloadCampaign = async (id) => {
    try {
        const response = await apiClient.get(`/download/${id}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Failed to download campaign image');
    }
};

export const remixCampaign = async (id) => {
    try {
        const response = await apiClient.post(`/remix/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Failed to remix campaign');
    }
};

export default apiClient;
