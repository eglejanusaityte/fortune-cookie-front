'use client';
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Paginator } from 'primereact/paginator';
import { CookieService } from '@/demo/service/CookieService';
import userIsOnline, { getUsernameFromToken } from '@/app/api/logic';
import Cookie from '@/demo/components/Cookie';
import Comment from '../pages/comments/page';

const FortuneCookiePage = () => {
    const [cookies, setCookies] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const rowsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCookies = await CookieService.getAllCookies(currentPage);
                setTotalRecords(fetchedCookies.totalElements);
                setCookies(fetchedCookies.content);
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        };
        if (userIsOnline()) {
            fetchData();
            setLoading(true);
        } else {
            router.push('/');
        }
    }, [currentPage]);

    const hasUserLiked = (cookie) => {
        const username = getUsernameFromToken();
        if (cookie.likes != null && cookie.likes.some((like) => like === username)) {
            return true;
        }
        return false;
    };

    const onPageChange = (event) => {
        setCurrentPage(event.page);
    };

    return (
        <div className="grid">
            {isLoading && (
                <div className="col-12 lg:col-12">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-900 font-medium text-xl">Today's fortunes</div>
                            </div>
                        </div>
                        <div>
                            {cookies.map((cookie, index) => (
                                <div key={index}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Cookie sentence={cookie.fortuneCookieSentence} date={'@' + cookie.username} badgeValue={cookie.personal ? 'Created' : 'Generated'} badgeColor={cookie.personal ? 'info' : 'warning'} />
                                    </div>
                                    <Comment likes={cookie.likes != null ? cookie.likes.length : 0} liked={hasUserLiked(cookie)} commentId={cookie.id} />
                                </div>
                            ))}
                        </div>
                        <Paginator first={currentPage * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} onPageChange={onPageChange} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FortuneCookiePage;
