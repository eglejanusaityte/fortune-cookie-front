'use client';
import React, { useEffect, useState } from 'react';
import { sendMessage, getMessages, subscribeToMessages, likeCookie, removeLikeCookie } from './comment-service';
import { getUsernameFromToken } from '@/app/api/logic';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

// TO-DO: MOVE TO COMPONENT PLACE RATHER THAN A PAGE
const Comment = ({ likes, liked, commentId }) => {
    const [messages, setMessages] = useState([]);
    const [favorite, setFavorite] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comments, setComments] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sender, setSender] = useState('');
    // for later reply feature... maybe
    const [receiver, setReceiver] = useState('Everyone');
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        setSender(getUsernameFromToken());
    }, [commentId]);

    useEffect(() => {
        setFavorite(liked);
        setLikesCount(likes);
        let cleanup;

        if (comments) {
            const fetchMessages = async () => {
                try {
                    const data = await getMessages(commentId);
                    setMessages(data);
                } catch (error) {
                    console.error('Error fetching messages', error);
                }
            };
            fetchMessages();

            const unsubscribeFunc = subscribeToMessages(commentId, (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            setUnsubscribe(() => unsubscribeFunc);
            cleanup = unsubscribeFunc;
        } else {
            setMessages([]);

            if (unsubscribe) {
                unsubscribe();
                setUnsubscribe(null);
            }
        }

        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [comments, commentId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && sender.trim() && receiver.trim()) {
            const message = {
                message: newMessage,
                sender,
                receiver,
                commentId,
                createdAt: new Date().toISOString()
            };
            try {
                await sendMessage(message);
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message', error);
            }
        }
    };

    const toggleFavorite = () => {
        setFavorite(!favorite);
        if (!favorite) {
            likeCookie(commentId);
            setLikesCount(likesCount + 1);
        } else {
            removeLikeCookie(commentId);
            setLikesCount(likesCount - 1);
        }
    };

    const toggleComments = () => {
        setComments(!comments);
    };

    return (
        <div className="Cookie-footer">
            <Button icon={favorite ? 'pi pi-heart-fill' : 'pi pi-heart'} className={favorite ? 'p-button-rounded p-button-text p-button-danger' : 'p-button-rounded p-button-text p-button-help'} aria-label="Favorite" onClick={toggleFavorite} />
            <Button icon={comments ? 'pi pi-comments' : 'pi pi-comments'} rounded severity="help" text aria-label="Comment" onClick={toggleComments} />
            <p style={{ marginLeft: '1rem' }}>
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
            </p>
            {comments && (
                <>
                    <h5>Comments</h5>
                    <hr />
                    <div className="comments" style={{ height: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.sender}:</strong> {message.message}
                            </div>
                        ))}
                    </div>
                    <br />
                    <div style={{ textAlign: 'center' }}>
                        <InputText style={{ width: '40rem' }} type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Leave a comment..." className="flex-grow mr-2" />
                        <Button icon="pi pi-comment" severity="help" aria-label="Comment" onClick={handleSendMessage} className="p-button" />
                    </div>
                </>
            )}
        </div>
    );
};

export default Comment;
