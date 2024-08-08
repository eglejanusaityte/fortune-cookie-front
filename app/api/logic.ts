import { jwtDecode } from 'jwt-decode';

export default function userIsOnline() {
    if (localStorage.getItem('token') !== null) {
        return true;
    }
    return false;
}

export const getUsernameFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        return decodedToken.sub;
    } catch (error) {
        console.error('Error decoding token', error);
        return null;
    }
};

export const userIsAdmin = () => {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        return decodedToken.role === 'ADMIN';
    } catch (error) {
        console.error('Error decoding token', error);
        return false;
    }
};
