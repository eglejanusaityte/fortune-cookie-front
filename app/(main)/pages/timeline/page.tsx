/* eslint-disable @next/next/no-img-element */
'use client';

import React, {useEffect, useState} from 'react';

import Comment from "../comments/page";
import {getUsernameFromToken} from '@/app/api/logic';

const DIFF_API_URL = 'http://localhost:8082';

const TimelineDemo = () => {
    const [cookies, setCookies] = useState([]);

    useEffect(() => {
        const fetchCookies = async () => {
            try {
                const response = await fetch(`${DIFF_API_URL}/api/v1/fortune-cookies`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const answer = await response.json();
                setCookies(answer);
            } catch (error) {
                console.error('Error getting cookies', error);
                throw error;
            }
        };
        fetchCookies();
    }, []);

    const hasUserLiked = (likes) => {
        const username = getUsernameFromToken();
        if(likes.some(like => like.email === username)){
            return true;
        }
        return false;
    };

    return (
        <div>
            <div className="grid">
                {cookies.map((cookie, index) => (
                    <div key={index}>
                        <Comment likes={cookie.likes.length} liked={hasUserLiked(cookie.likes)} commentId={cookie.id}/>
                    </div>
                ))}
                
            </div>
        </div>
    );
};

export default TimelineDemo;
