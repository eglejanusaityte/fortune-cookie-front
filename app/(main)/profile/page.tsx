/* eslint-disable @next/next/no-sync-scripts */
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Demo } from '@/types';
import userIsOnline, { getUsernameFromToken } from '@/app/api/logic';
import { UserService } from '@/demo/service/UserService';

const Profile = () => {
    const [editing, setEditing] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);

    let emptyUser: Demo.User = {
        id: 0,
        email: '',
        username: '',
        password: '',
        role: ''
    };
    const [original, setOriginalUser] = useState<Demo.User>(emptyUser);
    const [user, setUser] = useState<Demo.User>(emptyUser);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (!userIsOnline()) {
            router.push('/');
        } else {
            UserService.getUser(getUsernameFromToken()).then((data) => {
                setUser(data as any);
                setOriginalUser(data as any);
            });
            setLoading(true);
        }
    }, []);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    {editing ? (
                        <Button label="Edit" icon="pi pi-pencil" severity="success" onClick={() => onClickEdit()} />
                    ) : (
                        <>
                            <Button label="Save" icon="pi pi-check" className=" mr-2" severity="success" onClick={() => onClickSave()} />
                            <Button label="Cancel" icon="pi pi-times" severity="danger" onClick={() => onClickCancel()} />
                        </>
                    )}
                </div>
            </React.Fragment>
        );
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, data: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${data}`] = val;
        setUser(_user);
    };

    const onClickCancel = () => {
        setUser(original);
        setEditing(true);
    };

    const onClickEdit = () => {
        onInputChange('', 'password');
        setEditing(false);
    };

    const onClickSave = () => {
        setEditing(false);
        UserService.editUser(user).then((success) => {
            if (success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Updated',
                    life: 3000
                });
            }
        });
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const deleteUser = () => {
        UserService.deleteUser(user.id);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Deleted',
            life: 3000
        });
        router.push('/');
        localStorage.removeItem('token');
    };

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );

    return (
        <>
            {isLoading && (
                <div className="grid">
                    <div className="col-12">
                        <div className="card docs">
                            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                            <h2>Profile</h2>
                            <br />
                            <div className="field">
                                <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                    Username
                                </label>
                                <InputText disabled={editing} value={user.username} onChange={(e) => onInputChange(e, 'username')} id="username" type="text" placeholder="Username" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            </div>

                            <div className="field">
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText disabled={editing} value={user.email} onChange={(e) => onInputChange(e, 'email')} id="email" type="text" placeholder="Email" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            </div>
                            <div className="field">
                                <label htmlFor="password" className="block text-900 text-xl font-medium mb-2">
                                    Password
                                </label>
                                <Password disabled={editing} value={user.password} onChange={(e) => onInputChange(e, 'password')} id="password" type="text" placeholder="Password" className="w-full md:w-30rem mb-5" toggleMask={!editing} />
                            </div>
                            <Button label="Delete user" link severity="danger" onClick={() => setDeleteUserDialog(true)}></Button>
                            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {user && (
                                        <span>
                                            Are you sure you want to delete <b>{user.username}</b>?
                                        </span>
                                    )}
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
