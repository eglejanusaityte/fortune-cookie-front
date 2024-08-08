import { Demo } from '@/types';
import { WORDURL } from '@/app/api/urls';

export const WordService = {
    async getWords(page) {
        try {
            const response = await fetch(`${WORDURL}?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch words');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching words:', error);
            throw error;
        }
    },
    async addWord(word: Demo.Word) {
        try {
            const response = await fetch(`${WORDURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(word)
            });

            if (!response.ok) {
                throw new Error('Failed to add word');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding words:', error);
            throw error;
        }
    },
    async deleteWord(id: number) {
        try {
            const response = await fetch(`${WORDURL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete word');
            }
        } catch (error) {
            console.error('Error deleting words:', error);
            throw error;
        }
    },
    async editWord(word: Demo.Word) {
        try {
            const response = await fetch(`${WORDURL}/${word.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(word)
            });
            if (!response.ok) {
                throw new Error('Failed to edit word');
            } else {
                const success = true;
                return success;
            }
        } catch (error) {
            console.error('Error editing words:', error);
            throw error;
        }
    }
};
