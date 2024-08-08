import { FORTUNECOOKIEURL, FORTUNECOOKIEPERSONALURL, MADLIBURL } from '@/app/api/urls';

export const CookieService = {
    async getAllCookies(page) {
        try {
            const response = await fetch(`${FORTUNECOOKIEURL}?page=${page}`, {
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
    async getPersonalCookies(page) {
        try {
            const response = await fetch(`${FORTUNECOOKIEPERSONALURL}?page=${page}`, {
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
    async createPersonalCookies(array: any) {
        try {
            const response = await fetch(`${MADLIBURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(array)
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
