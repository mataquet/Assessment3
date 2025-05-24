import axios from 'axios';

const API_URL = 'http://localhost:5099/api/User';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'username';

const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
    console.log(axios.defaults.headers.common['Authorization']);
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });

        const token = response.data.token;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, username);

        setAuthHeader(token);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthHeader(null);
};

export const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

const initAuth = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        setAuthHeader(token);
    }
};

export const getAuthUser = () => {
    const username = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    return {
        username,
        isAuthenticated: !!token
    };
};

initAuth();