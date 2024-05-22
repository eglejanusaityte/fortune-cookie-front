import { FORTUNECOOKIEURL, FORTUNECOOKIEPERSONALURL } from '@/app/api/urls';

export const CookieService = {
    async getAllCookies() {
        try {
            const response = await fetch(`${FORTUNECOOKIEURL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cookies');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cookies:', error);
            throw error;
        }
    },
    async getPersonalCookies() {
        try {
            const response = await fetch(`${FORTUNECOOKIEPERSONALURL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cookies');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cookies:', error);
            throw error;
        }
    }
};
