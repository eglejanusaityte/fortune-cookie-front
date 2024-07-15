const API_URL = 'http://localhost:8080';
const DIFF_API_URL = 'http://localhost:8082';

export const sendMessage = async (comment) => {
    try {
        const response = await fetch(`${API_URL}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message', error);
        throw error;
    }
};

export const getMessages = async (commentId) => {
    try {
        const response = await fetch(`${API_URL}/comment/id/${commentId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting messages', error);
        throw error;
    }
};

export const subscribeToMessages = (commentId, onMessageReceived) => {
    const eventSource = new EventSource(`${API_URL}/comment/id/${commentId}`);
    eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        onMessageReceived(newMessage);
    };
    eventSource.onerror = (error) => {
        console.error('Error in EventSource', error);
        eventSource.close();
    };
    return () => {
        eventSource.close();
    };
};

// move to a new service
export const likeCookie = async (cookieId) => {
    try {
    const response = await fetch(`${DIFF_API_URL}/api/v1/fortune-cookies/${cookieId}/like`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    } catch (error) {
        console.error('Error sending message', error);
        throw error;
    }
};

export const removeLikeCookie = async (cookieId) => {
    try {
        const response = await fetch(`${DIFF_API_URL}/api/v1/fortune-cookies/${cookieId}/remove`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error sending message', error);
        throw error;
    }
};
