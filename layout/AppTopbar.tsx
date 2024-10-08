/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import userIsOnline from '@/app/api/logic';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleLogout = async () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <span>Fortune cookies</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div>
                    {userIsOnline() ? (
                        <div>
                            <button type="button" onClick={handleLogout} className="layout-topbar-button">
                                <i className="pi pi-sign-out"></i>
                                <span>Logout</span>
                            </button>
                            <Link href="/profile">
                                <button type="button" className="p-link layout-topbar-button">
                                    <i className="pi pi-user"></i>
                                    <span>Profile</span>
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link href="/auth/login">
                                <button type="button" className="p-link layout-topbar-button">
                                    <i className="pi pi-user"></i>
                                    <span>Profile</span>
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
