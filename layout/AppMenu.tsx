/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import userIsOnline, { userIsAdmin } from '@/app/api/logic';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: "All about life's fortune",
            items: [
                { label: 'Your cookies', icon: 'pi pi-fw pi-home', to: '/' },
                { label: "Today's cookies", icon: 'pi pi-fw pi-globe', to: '/fortune-cookies', visible: userIsOnline() }
            ],
            showWhenLoggedIn: false
        },
        {
            label: 'Create your own cookie',
            items: [{ label: 'Mad libs', icon: 'pi pi-fw pi-heart', to: '/pages/mad-libs' }],
            showWhenLoggedIn: true,
            visible: userIsOnline()
        },
        {
            label: 'Administrator',
            items: [
                { label: 'Fortunes', icon: 'pi pi-fw pi-database', to: '/pages/fortunes' },
                { label: 'Words', icon: 'pi pi-fw pi-database', to: '/pages/words' },
                { label: 'Users', icon: 'pi pi-fw pi-database', to: '/pages/users' }
            ],
            showWhenLoggedIn: true,
            visible: userIsAdmin()
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    if (!userIsOnline() && item.showWhenLoggedIn) {
                        return;
                    }
                    return !item?.seperator && <AppMenuitem item={item} root={true} index={i} key={item.label} />;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
