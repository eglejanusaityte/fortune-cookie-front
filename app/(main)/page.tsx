/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { CookieService } from '@/demo/service/CookieService';
import { FORTUNECOOKIEURL } from '../api/urls';

const lineData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [cookies, setCookies] = useState([]);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCookies = await CookieService.getPersonalCookies();
                setCookies(fetchedCookies);
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const handleNewFortuneCookie = async () => {
        try {
            const firstCookieDate = cookies.length > 0 ? new Date(cookies[0].date) : null;

            // Get today's date
            const today = new Date();
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            // If the first cookie's date is today's date, throw an error
            if (firstCookieDate && firstCookieDate.toDateString() === todayDate.toDateString()) {
                throw new Error('Cannot post a new fortune cookie today as one already exists.');
            }
            const response = await fetch(`${FORTUNECOOKIEURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
        } catch (error) {
            // TO-DO: replace with actual error handling and output
            console.error('Error during fortune receiving:', error);
        }
    };
    return (
        <div className="grid">
            <div className="col-12 lg:col-12">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total amount of cookies: {cookies.length}</span>
                            <div className="text-900 font-medium text-xl">Your fortune cookies</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-plus text-purple-500 text-xl" onClick={handleNewFortuneCookie} />
                        </div>
                    </div>
                    <div>
                        {cookies.map((cookie, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <div style={{ position: 'absolute', top: '35%', left: '55%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>{cookie.fortuneCookieSentence}</div>
                                    <img src="/demo/images/access/cookie.png" alt="Fortune cookie" style={{ width: '90%', height: 'auto' }} />
                                </div>
                                <div>{cookie.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
