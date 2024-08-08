import { Demo } from '@/types';
import { FORTUNEURL, FORTUNERANDOMURL } from '@/app/api/urls';

export const FortuneService = {
    async getFortunes(page) {
        try {
            const response = await fetch(`${FORTUNEURL}?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch fortunes');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching fortunes:', error);
            throw error;
        }
    },
    async addFortune(fortune: Demo.Fortune) {
        try {
            const response = await fetch(`${FORTUNEURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(fortune)
            });

            if (!response.ok) {
                throw new Error('Failed to add fortune');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding fortunes:', error);
            throw error;
        }
    },
    async deleteFortune(id: number) {
        try {
            const response = await fetch(`${FORTUNEURL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete fortune');
            }
        } catch (error) {
            console.error('Error deleting fortunes:', error);
            throw error;
        }
    },
    async editFortune(fortune: Demo.Fortune) {
        try {
            const response = await fetch(`${FORTUNEURL}/${fortune.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(fortune)
            });
            if (!response.ok) {
                throw new Error('Failed to edit fortune');
            } else {
                const success = true;
                return success;
            }
        } catch (error) {
            console.error('Error editing fortunes:', error);
            throw error;
        }
    },
    async getFortune() {
        try {
            const response = await fetch(`${FORTUNERANDOMURL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Failed to get fortune');
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error getting fortunes:', error);
            throw error;
        }
    }
};
