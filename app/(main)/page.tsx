/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { CookieService } from '@/demo/service/CookieService';
import { FORTUNECOOKIEURL } from '../api/urls';
import userIsOnline, { getUsernameFromToken } from '@/app/api/logic';
import Cookie from '@/demo/components/Cookie';
import Comment from './pages/comments/page';

const Dashboard = () => {
    const [cookies, setCookies] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const [popOut, setPopOut] = useState(false);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const rowsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCookies = await CookieService.getPersonalCookies(currentPage);
                setCookies(fetchedCookies.content);
                setTotalRecords(fetchedCookies.totalElements);
                const firstCookieDate = fetchedCookies.length > 0 ? new Date(fetchedCookies[0].date) : null;
                const today = new Date();
                const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                for (let i = 0; i < fetchedCookies.length; i++) {
                    if (new Date(fetchedCookies[i].date).toDateString() === todayDate.toDateString()) {
                        if (fetchedCookies[i].personal === false) {
                            setIsVisible(false);
                            break;
                        }
                    }
                }
                if (firstCookieDate && firstCookieDate.toDateString() === todayDate.toDateString() && !fetchedCookies[0].personal) {
                    setIsVisible(false);
                }
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        };

        if (userIsOnline()) {
            fetchData();
        }
    }, [currentPage]);

    const onPageChange = (event) => {
        if (event.page > 0) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
            const firstCookieDate = cookies.length > 0 ? new Date(cookies[0].date) : null;
            const today = new Date();
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            for (let i = 0; i < cookies.length; i++) {
                if (new Date(cookies[i].date).toDateString() === todayDate.toDateString()) {
                    if (cookies[i].personal === false) {
                        setIsVisible(false);
                        break;
                    }
                }
            }
            if (firstCookieDate && firstCookieDate.toDateString() === todayDate.toDateString() && !cookies[0].personal) {
                setIsVisible(false);
            }
        }
        setCurrentPage(event.page);
    };

    const handleNewFortuneCookie = async () => {
        try {
            setPopOut(true);
            setTimeout(async () => {
                const response = await fetch(`${FORTUNECOOKIEURL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    const data = await response.json();
                    setCookies((prevCookies) => [data, ...prevCookies]);
                }
            }, 500);
        } catch (error) {
            // TO-DO: replace with actual error handling and output
            console.error('Error during fortune receiving:', error);
        }
    };

    const handleLandingPage = async () => {
        setPopOut(true);
    };

    const handleAnimationEnd = () => {
        setIsVisible(false);
    };

    const hasUserLiked = (likes) => {
        const username = getUsernameFromToken();
        if (likes != null && likes.some((like) => like === username)) {
            return true;
        }
        return false;
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-12">
                <div className="card mb-0">
                    {userIsOnline() ? (
                        <>
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Total amount of cookies: {totalRecords}</span>
                                    <div className="text-900 font-medium text-xl">Your fortune cookies</div>
                                </div>
                            </div>
                            <div>
                                <div style={{ textAlign: 'center' }}>
                                    {isVisible && (
                                        <img
                                            className={`${popOut ? 'pop-out' : 'shake-on-hover'}`}
                                            src="/demo/images/access/cookie.png"
                                            alt="Fortune cookie"
                                            style={{ width: '25%', height: 'auto' }}
                                            onClick={handleNewFortuneCookie}
                                            onAnimationEnd={handleAnimationEnd}
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                {cookies.map((cookie, index) => (
                                    <div key={index}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Cookie sentence={cookie.fortuneCookieSentence} date={cookie.date} badgeValue={cookie.personal ? 'Created' : 'Generated'} badgeColor={cookie.personal ? 'info' : 'warning'} />
                                        </div>
                                        <Comment likes={cookie.likes != null ? cookie.likes.length : 0} liked={hasUserLiked(cookie.likes)} commentId={cookie.id} />
                                    </div>
                                ))}
                            </div>
                            <Paginator first={currentPage * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} onPageChange={onPageChange} />
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            {isVisible ? (
                                <div>
                                    <h2>Click to see your future!</h2>
                                    <img
                                        className={`${popOut ? 'pop-out' : 'shake-on-hover'}`}
                                        src="/demo/images/access/cookie.png"
                                        alt="Fortune cookie"
                                        style={{ width: '25%', height: 'auto' }}
                                        onClick={handleLandingPage}
                                        onAnimationEnd={handleAnimationEnd}
                                    />
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <div style={{ position: 'absolute', top: '37%', left: '55%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
                                            Sign up to learn your future! <br></br>
                                            <Button onClick={() => router.push('/auth/register')} label="Join" icon="pi pi-user" iconPos="right"></Button>
                                        </div>
                                        <img src="/demo/images/access/cookie-broken.png" alt="Broken fortune cookie" style={{ width: '100%', height: 'auto', marginRight: '10rem' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
