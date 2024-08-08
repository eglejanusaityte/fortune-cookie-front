import { Demo } from '@/types';
import { USERURL } from '@/app/api/urls';

export const UserService = {
    async getUsers(page) {
        try {
            const response = await fetch(`${USERURL}?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    async deleteUser(id: number) {
        try {
            const response = await fetch(`${USERURL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting users:', error);
            throw error;
        }
    },
    async editUser(user: Demo.User) {
        try {
            const response = await fetch(`${USERURL}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                throw new Error('Failed to edit user');
            } else {
                const success = true;
                return success;
            }
        } catch (error) {
            console.error('Error editing users:', error);
            throw error;
        }
    },
    async getUser(username: string) {
        try {
            const response = await fetch(`${USERURL}/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Failed to get user');
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }
};
