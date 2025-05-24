import axios from 'axios';

const API_URL = 'http://localhost:5099/api/Trip';

// Configuration de l'intercepteur pour ajouter le token JWT à chaque requête
const authInterceptor = config => {
    const token = localStorage.getItem('auth_token'); // Utiliser la même clé
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

axios.interceptors.request.use(authInterceptor);

// Créer un nouveau voyage
export const createTrip = async (tripData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, tripData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Récupérer les voyages à venir
export const getUpcomingTrips = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Récupérer un voyage par son ID
export const getTripById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Supprimer un voyage
export const deleteTrip = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Mettre à jour un voyage
export const updateTrip = async (id, tripData) => {
    try {
        const response = await axios.post(`${API_URL}/${id}`, tripData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Rejoindre un voyage
export const joinTrip = async (tripId) => {
    try {
        const response = await axios.put(`${API_URL}/${tripId}/join`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
            });
        return response.data;
    } catch (error) {
        console.error('Error joinTrip:', error.response?.data);
        throw error.response?.data || error.message;
    }
};

// Quitter un voyage
export const leaveTrip = async (tripId) => {
    try {
        const response = await axios.put(`${API_URL}/${tripId}/leave`);
        return response.data;
    } catch (error) {
        console.error('Error leaveTrip:', error.response?.data);
        throw error.response?.data || error.message;
    }
};

// Définir un nouveau propriétaire
export const setTripOwner = async (id, newOwner) => {
    try {
        const response = await axios.post(`${API_URL}/addOwner/${id}?ownerId=${encodeURIComponent(newOwner)}`, {}, {
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};